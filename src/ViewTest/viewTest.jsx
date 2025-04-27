import { useEffect, useState } from "react";
import { handleApiError } from "../utils/AxiosUtil";
import { endpoints } from "../utils/endpoints";
import { useLocation } from "react-router-dom";
import "./viewTest.css";
const ViewTest = () => {
  const location = useLocation();
  const [, setError] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        const req = {
          userId: 5,
          testId: location.state.userData.testId,
        };
        const response = await endpoints.quiz.viewQuiz(req);
        if (response.status === 200) {
          setQuestionsData(response.data.responseData.questionsList);
        }
      } catch (error) {
        if (isMounted) {
          setError(handleApiError(error));
        }
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="options-container">
      {questionsData.map((question) => (
        <div key={question.questionId} className="question-container">
          <h3>{question.question}</h3>
          <ul>
            {question.options.map((option) => {
              const isSelected = option.optionId === question.selectedOptionId;
              const isCorrect = option.optionId === question.correctOptionId;

              let className = "";
              if (isSelected && isCorrect) {
                className = "correct";
              } else if (isSelected && !isCorrect) {
                className = "incorrect";
              } else if (!isSelected && isCorrect) {
                className = "correct";
              }

              return (
                <li
                  key={option.optionId}
                  className={`option-item ${className}`}
                >
                  {option.option}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ViewTest;
