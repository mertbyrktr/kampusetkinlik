import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { promisify } from 'node:util';
import mongoose from 'mongoose';
import { Event } from '../src/models/event-model.js';

test('seed is repeatable and a POST survives restarting the API', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'kampus-env-'));
  const uri = new URL(process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017');
  uri.pathname = `/kampus_server_test_${randomUUID()}`;
  const env = { ...process.env };
  delete env.PORT;
  delete env.MONGODB_URI;
  delete env.DOTENV_CONFIG_PATH;
  const serverPath = fileURLToPath(new URL('../src/server.js', import.meta.url));
  const seedPath = fileURLToPath(new URL('../src/seed.js', import.meta.url));
  const mongoosePath = import.meta.resolve('mongoose');
  const run = promisify(execFile);
  const script = `import app from ${JSON.stringify(new URL('../src/app.js', import.meta.url).href)};
    import mongoose from ${JSON.stringify(mongoosePath)};
    const listen = app.listen.bind(app);
    app.listen = (port, callback) => {
      if (String(port) !== '0') throw new Error('PORT was not loaded from .env');
      if (mongoose.connection.readyState !== 1) throw new Error('Database is not connected');
      const server = listen(port, '127.0.0.1', () => { console.log('TEST_PORT=' + server.address().port); callback(); });
      return server;
    };
    await import(${JSON.stringify(serverPath)});`;
  let child;
  async function start() {
    child = spawn(process.execPath, ['--input-type=module', '-e', script], { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] });
    const port = await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => reject(new Error('Server startup timed out: ' + output)), 5000);
      child.once('error', (error) => { clearTimeout(timeout); reject(error); });
      child.once('exit', (code) => { clearTimeout(timeout); reject(new Error('Server exited: ' + code + ' ' + output)); });
      child.stderr.on('data', (data) => { output += data; });
      child.stdout.on('data', (data) => {
        output += data;
        const match = output.match(/TEST_PORT=(\d+)/);
        if (match) { clearTimeout(timeout); resolve(match[1]); }
      });
    });
    return `http://127.0.0.1:${port}`;
  }
  async function stop() {
    if (child && child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
  }
  try {
    await writeFile(join(directory, '.env'), `PORT=0\nMONGODB_URI=${uri}\n`);
    await mongoose.connect(uri.toString(), { serverSelectionTimeoutMS: 5000 });
    for (let i = 0; i < 2; i += 1) {
      const { stdout } = await run(process.execPath, [seedPath], { cwd: directory, env, timeout: 10000 });
      assert.match(stdout, /6 etkinlik eklendi/);
      assert.equal(await Event.countDocuments(), 6);
    }
    let base = await start();
    assert.equal((await (await fetch(base + '/events')).json()).length, 6);
    const created = await fetch(base + '/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Kalıcı Etkinlik', category: 'Seminer', date: '2026-12-01' }) });
    assert.equal(created.status, 201);
    const event = await created.json();
    assert.equal(await Event.countDocuments(), 7);
    await stop();
    base = await start();
    assert.equal((await (await fetch(base + '/events')).json()).length, 7);
    const detail = await fetch(base + '/events/' + event._id);
    assert.equal(detail.status, 200);
    assert.deepEqual(await detail.json(), event);
  } finally {
    try {
      await stop();
      if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
    } finally {
      await mongoose.disconnect();
      await rm(directory, { recursive: true, force: true });
    }
  }
});
