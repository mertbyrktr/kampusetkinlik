import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

// A separate cwd proves dotenv reads a file, without touching the developer's .env.
test('server reads PORT from .env and restarting restores six seed events', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'kampus-env-'));
  await writeFile(join(directory, '.env'), 'PORT=0\n');
  const env = { ...process.env };
  delete env.PORT;
  delete env.DOTENV_CONFIG_PATH;
  const serverPath = fileURLToPath(new URL('../src/server.js', import.meta.url));
  // PORT=0 asks the OS for an unused port; inspect the real address from the app.
  const script = `import app from ${JSON.stringify(new URL('../src/app.js', import.meta.url).href)};
    const listen = app.listen.bind(app);
    app.listen = (port, callback) => {
      if (String(port) !== '0') throw new Error('PORT was not loaded from .env');
      const server = listen(port, () => { console.log('TEST_PORT=' + server.address().port); callback(); });
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
    return `http://localhost:${port}`;
  }
  async function stop() {
    if (child && child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
  }
  try {
    let base = await start();
    assert.equal((await (await fetch(base + '/events')).json()).length, 6);
    const created = await fetch(base + '/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Geçici', category: 'Seminer', date: '2026-12-01' }) });
    assert.equal(created.status, 201);
    assert.equal((await (await fetch(base + '/events')).json()).length, 7);
    await stop();
    base = await start();
    assert.equal((await (await fetch(base + '/events')).json()).length, 6);
  } finally {
    await stop();
    await rm(directory, { recursive: true, force: true });
  }
});
