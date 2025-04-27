import { useState, useEffect } from "react";
import "./Quiz.css";
import { handleApiError } from "../utils/AxiosUtil";
import { endpoints } from "../utils/endpoints";
import Dialog from "../common-components/Dialog/Dialog";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalTime, setTotalTime] = useState(600);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const req = {
          userId: 5,
        };
        const response = await endpoints.quiz.getQuiz(req);
        if (isMounted && response.status === 200) {
          setQuestionsData(response.data.responseData.questionsList);
          setTimerStarted(true); // Start timer only after successful API response
          setUserData(response.data.responseData);
        }
      } catch (error) {
        if (isMounted) {
          setError(handleApiError(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!timerStarted || isLoading) return;

    const timer = setInterval(() => {
      if (totalTime > 0) {
        setTotalTime((prev) => prev - 1);
      } else {
        clearInterval(timer);
        setShowDialog(true); // Show dialog on time expiry
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime, isLoading, timerStarted]);

  const handleNext = () => {
    if (currentQuestion < questionsData.length - 1) {
      if (
        selectedAnswer &&
        !userAnswers.some(
          (answer) =>
            answer.questionId === questionsData[currentQuestion].questionId
        )
      ) {
        setAnsweredQuestions([...answeredQuestions, currentQuestion]);
        setUserAnswers([
          ...userAnswers,
          {
            questionId: questionsData[currentQuestion].questionId,
            selectedOptionId: selectedAnswer.optionId,
          },
        ]);
      }
      setSelectedAnswer(null);
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevAnswer = userAnswers.find(
        (answer) =>
          answer.questionId === questionsData[currentQuestion - 1].questionId
      );
      if (prevAnswer) {
        const prevOption = questionsData[currentQuestion - 1].options.find(
          (opt) => opt.optionId === prevAnswer.selectedOptionId
        );
        setSelectedAnswer(prevOption);
      } else {
        setSelectedAnswer(null);
      }
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questionsData.length - 1) {
      setSkippedQuestions([...skippedQuestions, currentQuestion]);
      setSelectedAnswer(null);
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setShowDialog(true); // Show confirmation dialog
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    if (
      selectedAnswer &&
      !userAnswers.some(
        (answer) =>
          answer.questionId === questionsData[currentQuestion]?.questionId
      )
    ) {
      setUserAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          questionId: questionsData[currentQuestion].questionId,
          selectedOptionId: selectedAnswer.optionId,
        },
      ]);
    }

    const completeAnswersList = questionsData.map((question) => {
      const existingAnswer = userAnswers.find(
        (answer) => answer.questionId === question.questionId
      );
      return {
        questionId: question.questionId,
        selectedOptionId: existingAnswer
          ? existingAnswer.selectedOptionId
          : selectedAnswer?.questionId === question.questionId
            ? selectedAnswer.optionId
            : null,
      };
    });

    try {
      const payload = {
        userId: userData?.userId,
        testId: userData?.testId,
        questionsList: completeAnswersList,
      };

      const response = await endpoints.quiz.submitQuiz(payload);
      if (response.status === 200) {
        // Set session storage to indicate test submission
        sessionStorage.setItem("testSubmitted", "true");
        navigate("/results", { state: { result: response.data.responseData, userData: userData } });
        setShowDialog(false);
      } else {
        throw new Error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.log("Error in submitting the test", error);
      alert("Failed to submit the test. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubmit = () => {
    setShowDialog(false);
  };

  const handleOptionClick = (option) => {
    setSelectedAnswer(option);

    const existingAnswerIndex = userAnswers.findIndex(
      (answer) =>
        answer.questionId === questionsData[currentQuestion].questionId
    );

    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = {
        questionId: questionsData[currentQuestion].questionId,
        selectedOptionId: option.optionId,
      };
      setUserAnswers(updatedAnswers);
    } else {
      setUserAnswers([
        ...userAnswers,
        {
          questionId: questionsData[currentQuestion].questionId,
          selectedOptionId: option.optionId,
        },
      ]);
    }
  };

  const isQuestionAnswered = (questionIndex) => {
    return userAnswers.some(
      (answer) => answer.questionId === questionsData[questionIndex]?.questionId
    );
  };

  const getCurrentSelectedOption = () => {
    const currentAnswer = userAnswers.find(
      (answer) =>
        answer.questionId === questionsData[currentQuestion]?.questionId
    );
    if (currentAnswer) {
      return questionsData[currentQuestion].options.find(
        (opt) => opt.optionId === currentAnswer.selectedOptionId
      );
    }
    return selectedAnswer;
  };

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        {questionsData.map((_, index) => (
          <div
            key={index}
            className={`step ${currentQuestion === index
              ? "current"
              : isQuestionAnswered(index)
                ? "attempted"
                : skippedQuestions.includes(index)
                  ? "skipped"
                  : ""
              }`}
            onClick={() => setCurrentQuestion(index)}
          />
        ))}
      </div>

      <div className="quiz-content">
        <div className="quiz-question">
          {questionsData[currentQuestion]?.question || "Loading..."}
        </div>

        <div className="options-container">
          {questionsData[currentQuestion]?.options?.map((option) => (
            <button
              key={option.optionId}
              onClick={() => handleOptionClick(option)}
              className={`option ${getCurrentSelectedOption()?.optionId === option.optionId
                ? "selected"
                : ""
                }`}
              disabled={totalTime === 0}
            >
              {option.option}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-footer">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0 || totalTime === 0}
          className="button previous"
        >
          Previous
        </button>

        <div className="timer">
          {`${Math.floor(totalTime / 60)
            .toString()
            .padStart(2, "0")}:${(totalTime % 60).toString().padStart(2, "0")}`}
        </div>

        <div className="button-group">
          {currentQuestion === questionsData.length - 1 ? (
            <button onClick={handleSubmit} className="button submit">
              Submit
            </button>
          ) : (
            <>
              <button
                onClick={handleNext}
                className="button next"
                disabled={
                  (!selectedAnswer && !isQuestionAnswered(currentQuestion)) ||
                  totalTime === 0 ||
                  isLoading
                }
              >
                Next
              </button>
              <button
                onClick={handleSkip}
                className="button skip"
                disabled={totalTime === 0 || isLoading}
              >
                Skip
              </button>
            </>
          )}
        </div>
      </div>

      {showDialog && (
        <Dialog
          message={
            totalTime === 0
              ? "Time's up! Submitting your test..."
              : "Are you sure you want to submit?"
          }
          onConfirm={confirmSubmit}
          onCancel={totalTime === 0 ? null : cancelSubmit}
        />
      )}
    </div>
  );
};

export default Quiz;
