import { randomUUID } from 'node:crypto';
import { events } from '../data/events.js';

export function getEvents(req, res) {
  const { category } = req.query;
  res.json(category ? events.filter((event) => event.category === category) : events);
}

export function getEventById(req, res) {
  const event = events.find((item) => item.id === req.params.id);
  if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
  res.json(event);
}

export function createEvent(req, res) {
  const { title, category, date, capacity, time, location, description } = req.body ?? {};
  const required = [title, category, date];
  if (required.some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: { message: 'title, category and date are required' } });
  }
  const numericCapacity = Number(capacity);
  const newEvent = {
    id: `event-${randomUUID()}`,
    title, category, date,
    capacity: Number.isFinite(numericCapacity) ? numericCapacity : 0,
    time: time ?? '', location: location ?? '', description: description ?? '',
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
}
