import { events } from '../../../data/events';

export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'DELETE') {
    const eventIndex = events.findIndex((event) => event.id === parseInt(id));
    if (eventIndex !== -1) {
      events.splice(eventIndex, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
