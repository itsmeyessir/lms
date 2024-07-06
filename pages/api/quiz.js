import { quizQuestions } from '../../utils/data';

let questions = [...quizQuestions]; // Copy the initial questions to allow modification

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(questions);
  } else if (req.method === 'POST') {
    const newQuestion = req.body;
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
