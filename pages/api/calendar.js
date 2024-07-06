import { calendarEvents } from '../../utils/data';

let events = [...calendarEvents]; // Copy the initial events to allow modification

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(events);
  } else if (req.method === 'POST') {
    const newEvent = req.body;
    events.push(newEvent);
    res.status(201).json(newEvent);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    events = events.filter((event) => event.id !== parseInt(id));
    res.status(204).end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
