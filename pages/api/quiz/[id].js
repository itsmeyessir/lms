import { questions } from '../../../utils/data';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const questions = questions.find((q) => q.id === parseInt(id));
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } else if (req.method === 'DELETE') {
    questions = questions.filter((q) => q.id !== parseInt(id));
    res.status(204).end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
