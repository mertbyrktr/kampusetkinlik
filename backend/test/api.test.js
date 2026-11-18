import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { seedEvents } from '../src/data/seed-events.js';
import { Event } from '../src/models/event-model.js';

let server;
let base;
before(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017', {
    // Atlas shared clusters limit database names to 38 bytes.
    dbName: `kampus_api_test_${randomBytes(8).toString('hex')}`,
    serverSelectionTimeoutMS: 5000,
  });
  await Event.insertMany(seedEvents);
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  try {
    if (server?.listening) await new Promise((resolve) => server.close(resolve));
    if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
  } finally {
    await mongoose.disconnect();
  }
});

async function request(path, body) {
  const response = await fetch(base + path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  assert.match(response.headers.get('content-type'), /application\/json/);
  return { status: response.status, body: await response.json() };
}

test('health includes correct student and current ISO time', async () => {
  const { status, body } = await request('/health');
  assert.equal(status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.student, '2321032070');
  assert.equal(new Date(body.time).toISOString(), body.time);
  assert.ok(Math.abs(Date.now() - Date.parse(body.time)) < 5000);
});

test('initial list has six original MongoDB documents sorted by date', async () => {
  const { status, body } = await request('/events');
  assert.equal(status, 200);
  assert.equal(body.length, 6);
  body.forEach(({ _id, createdAt, updatedAt, __v, ...event }, index) => {
    assert.match(_id, /^[a-f0-9]{24}$/);
    assert.equal(new Date(createdAt).toISOString(), createdAt);
    assert.equal(new Date(updatedAt).toISOString(), updatedAt);
    assert.deepEqual(event, seedEvents[index]);
  });
});

test('detail resolves a real ObjectId and rejects missing and invalid IDs', async () => {
  const { body: events } = await request('/events');
  const event = events[1];
  const detail = await request('/events/' + event._id);
  assert.equal(detail.status, 200);
  assert.deepEqual(detail.body, event);
  for (const id of ['yok', 'event-2', new mongoose.Types.ObjectId()]) {
    assert.deepEqual(await request('/events/' + id), { status: 404, body: { error: { message: 'Event not found' } } });
  }
});

test('category query filters events', async () => {
  const result = await request('/events?category=' + encodeURIComponent('Atölye'));
  assert.equal(result.status, 200);
  assert.equal(result.body.length, 2);
  assert.ok(result.body.every((event) => event.category === 'Atölye'));
  assert.deepEqual((await request('/events?category=unknown')).body, []);
});

test('POST creates a retrievable event, trims text and generates its own metadata', async () => {
  const payload = { title: 'Git Atölyesi', category: 'Atölye', date: '2026-11-19', capacity: 30, time: '14:00', location: 'Bilgisayar Laboratuvarı 1', description: 'Git ve GitHub ile ilk adımlar.' };
  const clientId = new mongoose.Types.ObjectId().toString();
  const created = await request('/events', { ...payload, _id: clientId, title: ' Git Atölyesi ', createdAt: '2000-01-01' });
  assert.equal(created.status, 201);
  const { _id, createdAt, updatedAt, __v, ...event } = created.body;
  assert.match(_id, /^[a-f0-9]{24}$/);
  assert.notEqual(_id, clientId);
  assert.notEqual(createdAt, '2000-01-01T00:00:00.000Z');
  assert.equal(new Date(createdAt).toISOString(), createdAt);
  assert.equal(updatedAt, createdAt);
  assert.deepEqual(event, payload);
  assert.deepEqual((await request('/events/' + _id)).body, created.body);
  const { body: events } = await request('/events');
  assert.equal(events.length, 7);
  assert.equal(events[0]._id, _id);
});

test('schema errors return 400 without insertion and health remains available', async () => {
  const count = (await request('/events')).body.length;
  const valid = { title: 'Etkinlik', category: 'Atölye', date: '2026-12-01' };
  const invalidPayloads = [
    { title: 'Eksik' }, {}, [valid, valid], { ...valid, title: ' ' }, { ...valid, title: 123 },
    { ...valid, title: 'X' }, { ...valid, title: 'a'.repeat(101) }, { ...valid, category: 'Parti' },
    { ...valid, capacity: -1 }, { ...valid, description: 'a'.repeat(501) },
  ];
  for (const payload of invalidPayloads) {
    const { status, body } = await request('/events', payload);
    assert.equal(status, 400);
    assert.match(body.error.message, /Event validation failed/);
  }
  assert.equal((await request('/events')).body.length, count);
  assert.equal((await request('/health')).status, 200);
});

test('optional fields default correctly and rapid creation never duplicates IDs', async () => {
  const results = await Promise.all(Array.from({ length: 10 }, () => request('/events', { title: 'Yeni', category: 'Seminer', date: '2026-12-01' })));
  assert.equal(new Set(results.map((result) => result.body._id)).size, 10);
  for (const { status, body } of results) {
    assert.equal(status, 201);
    assert.equal(body.capacity, 0);
    for (const key of ['time', 'location', 'description']) assert.equal(body[key], '');
  }
});

test('unknown routes and malformed JSON keep consistent JSON errors', async () => {
  assert.deepEqual(await request('/missing'), { status: 404, body: { error: { message: 'Route not found' } } });
  const response = await fetch(base + '/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: { message: 'Invalid JSON body' } });
  const empty = await fetch(base + '/events', { method: 'POST' });
  assert.equal(empty.status, 400);
});

test('CORS permits frontend requests and preflight', async () => {
  const response = await fetch(base + '/health', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  const preflight = await fetch(base + '/events', { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' } });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get('access-control-allow-methods'), /POST/);
});
