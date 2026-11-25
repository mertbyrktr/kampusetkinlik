import mongoose from 'mongoose';
import { Event } from '../models/event-model.js';
import { todayStart } from '../utils/date.js';

const editableFields = ['title', 'category', 'date', 'capacity', 'time', 'location', 'description'];

function notFound(res) {
  return res.status(404).json({ error: { message: 'Event not found' } });
}

function handleWriteError(error, res, next) {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { message: error.message } });
  }
  next(error);
}

export async function getEvents(req, res, next) {
  try {
    const { category, search } = req.query;
    if (typeof search === 'object' || typeof category === 'object') return res.json([]);

    const filter = category ? { category } : {};
    if (search) {
      const literal = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: literal, $options: 'i' };
    }
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
}

export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    const event = mongoose.isValidObjectId(id) ? await Event.findById(id) : null;
    if (!event) return notFound(res);
    res.json(event);
  } catch (error) {
    next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const { title, category, date, capacity, time, location, description } = req.body ?? {};
    const event = await Event.create({
      title, category, date, capacity: capacity ?? undefined,
      time: time ?? undefined, location: location ?? undefined, description: description ?? undefined,
    });
    res.status(201).json(event);
  } catch (error) {
    handleWriteError(error, res, next);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);
    const fields = Object.keys(req.body ?? {});
    if (fields.length === 0) return res.status(400).json({ error: { message: 'Body is empty' } });
    const invalid = fields.filter((field) => !editableFields.includes(field));
    if (invalid.length) {
      return res.status(400).json({ error: { message: invalid.join(', ') + ' cannot be changed' } });
    }
    const event = await Event.findByIdAndUpdate(id, { $set: req.body }, {
      returnDocument: 'after', runValidators: true,
    });
    if (!event) return notFound(res);
    res.json(event);
  } catch (error) {
    handleWriteError(error, res, next);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id) || !await Event.findByIdAndDelete(id)) return notFound(res);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function getUpcomingEvents(req, res, next) {
  try {
    const events = await Event.find({ date: { $gte: todayStart() } }).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
}
