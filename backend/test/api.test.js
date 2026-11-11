import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import app from '../src/app.js';

let server;
let base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

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

test('initial list has exactly six original events with the required fields', async () => {
  const { status, body } = await request('/events');
  assert.equal(status, 200);
  assert.deepEqual(body.map((event) => event.id), Array.from({ length: 6 }, (_, i) => `event-${i + 1}`));
  for (const event of body) {
    assert.deepEqual(Object.keys(event).sort(), ['id', 'title', 'category', 'capacity', 'date', 'time', 'location', 'description'].sort());
    assert.equal(typeof event.capacity, 'number');
    assert.ok(event.title && event.location && event.description);
  }
});

test('detail resolves event-2 and missing ID uses the 404 error envelope', async () => {
  const detail = await request('/events/event-2');
  assert.equal(detail.status, 200);
  assert.equal(detail.body.id, 'event-2');
  assert.equal(detail.body.title, 'Sensörlerle Akıllı Saksı Atölyesi');
  assert.deepEqual(await request('/events/yok'), { status: 404, body: { error: { message: 'Event not found' } } });
});

test('category query filters events', async () => {
  const result = await request('/events?category=' + encodeURIComponent('Atölye'));
  assert.equal(result.status, 200);
  assert.equal(result.body.length, 2);
  assert.ok(result.body.every((event) => event.category === 'Atölye'));
  assert.deepEqual((await request('/events?category=unknown')).body, []);
});

test('POST creates retrievable seventh event and ignores client IDs', async () => {
  const payload = { id: 'event-2', title: 'Git Atölyesi', category: 'Atölye', date: '2026-12-01', capacity: 30, time: '14:00', location: 'Bilgisayar Laboratuvarı 1', description: 'Git ve GitHub ile ilk adımlar.' };
  const created = await request('/events', payload);
  assert.equal(created.status, 201);
  assert.match(created.body.id, /^event-/);
  assert.notEqual(created.body.id, payload.id);
  assert.deepEqual(created.body, { ...payload, id: created.body.id });
  assert.deepEqual((await request('/events/' + created.body.id)).body, created.body);
  assert.equal((await request('/events')).body.length, 7);
});

test('missing, empty and wrongly typed required fields return 400 without insertion', async () => {
  const count = (await request('/events')).body.length;
  for (const payload of [{ title: 'Eksik' }, {}, { title: ' ', category: 'Atölye', date: '2026-12-01' }, { title: 123, category: 'Atölye', date: '2026-12-01' }]) {
    assert.deepEqual(await request('/events', payload), { status: 400, body: { error: { message: 'title, category and date are required' } } });
  }
  assert.equal((await request('/events')).body.length, count);
});

test('optional fields default correctly and rapid creation never duplicates IDs', async () => {
  const results = await Promise.all(Array.from({ length: 10 }, () => request('/events', { title: 'Yeni', category: 'Seminer', date: '2026-12-01' })));
  assert.equal(new Set(results.map((result) => result.body.id)).size, 10);
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
