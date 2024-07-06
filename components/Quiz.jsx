import { useState, useEffect } from 'react';

const quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isquizFinished, setIsquizFinished] = useState(false);

  useEffect(() => {
    // Fetch questions from the API
    fetch('/api/quiz')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
    } else {
      setIsquizFinished(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <h1>quiz</h1>
        {isquizFinished ? (
          <div className="quiz-results">
            <h2>Your score: {score}/{questions.length}</h2>
          </div>
        ) : (
          currentQuestion && (
            <>
              <div className="question-section">
                <h3>{currentQuestion.question}</h3>
                <div className="answers">
                  {currentQuestion.answers.map((answer, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleAnswer(answer)}
                      disabled={userAnswer !== ''}>
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
              <div className="navigation">
                <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                <button onClick={nextQuestion} disabled={userAnswer === '' || isquizFinished}>Next</button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default quiz;
