import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getQuestions, voteQuestion } from "../services/api";
import type { Question } from "../types";

export default function Home() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [allQuestionIds, setAllQuestionIds] = useState<Set<string>>(new Set());
  const [voting, setVoting] = useState(false); // New state for vote loading

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      if (data && data.length > 0) {
        // Filter out questions we've already seen
        const newQuestions = data.filter((q: Question) => !allQuestionIds.has(q.id));
        
        if (newQuestions.length > 0) {
          // Add new question IDs to our tracking set
          const newIds = new Set(allQuestionIds);
          newQuestions.forEach((q: Question) => newIds.add(q.id));
          setAllQuestionIds(newIds);
          
          setQuestions(newQuestions);
          setCurrentIndex(0);
        } else {
          // No new questions, we're truly done
          setQuestions([]);
        }
      } else {
        // Empty response, we're done
        setQuestions([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load questions:", err);
      setError("Failed to load questions");
      setLoading(false);
    }
  };

  const vote = async (id: string, option: "A" | "B") => {
    if (!questions || voting) return;

    try {
      setVoting(true); // Start vote loading
      await voteQuestion(id, option);

      const updatedQuestions = [...questions];
      const updatedQuestion = { ...updatedQuestions[currentIndex] };

      if (option === "A") {
        updatedQuestion.votesA += 1;
      } else {
        updatedQuestion.votesB += 1;
      }

      updatedQuestions[currentIndex] = updatedQuestion;
      setQuestions(updatedQuestions);
      setShowResult(true);
    } catch (err) {
      if ((err instanceof Response) && err.status === 409) {
        setError("You've already voted on this question.");
      } else {
        setError("Vote failed.");
      }
    } finally {
      setVoting(false); // End vote loading
    }
  };

  const nextQuestion = () => {
    if (!questions) return;
    const next = currentIndex + 1;
    if (next < questions.length) {
      setCurrentIndex(next);
      setShowResult(false);
      setError("");
    } else {
      // Reached end of current batch, try to fetch more
      setLoading(true);
      fetchQuestions();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-xl text-gray-700 font-medium mb-2">
            All done!
          </p>
          <p className="text-gray-500">
            You've answered everything! Come back later for more fun questions.
          </p>
        </div>
      </div>
    );
  }

  if (!questions || !questions[currentIndex]) return null;

  const q = questions[currentIndex];
  const totalVotes = q.votesA + q.votesB;
  const percentA = totalVotes > 0 ? Math.round((q.votesA / totalVotes) * 100) : 0;
  const percentB = totalVotes > 0 ? Math.round((q.votesB / totalVotes) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 md:p-6 mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex flex-wrap gap-2 min-w-0 flex-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  index === currentIndex
                    ? "bg-purple-600"
                    : index < currentIndex
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium flex-shrink-0">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 text-center leading-tight break-words">
          {q.question}
        </h1>
      </div>

      {/* Options - Vertical layout for mobile, horizontal for desktop */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 mx-auto max-h-[66vh] w-full max-w-[90vw]">
        <motion.button
          onClick={() => vote(q.id, "A")}
          className="flex-1 bg-gradient-to-br from-purple-600 to-purple-700 text-white text-lg md:text-xl lg:text-2xl flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed min-h-[120px] md:min-h-[200px]"
          whileTap={{ scale: 0.95 }}
          disabled={showResult || voting}
        >
          {voting ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent mb-2"></div>
              <span className="text-sm opacity-90">Voting...</span>
            </div>
          ) : (
            <>
              <span className="font-semibold text-center mb-2 break-words hyphens-auto leading-tight">
                {q.optionA}
              </span>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-2"
                >
                  <div className="text-2xl md:text-3xl font-bold">{percentA}%</div>
                  <div className="text-sm opacity-90">({q.votesA} votes)</div>
                </motion.div>
              )}
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => vote(q.id, "B")}
          className="flex-1 bg-gradient-to-br from-pink-600 to-pink-700 text-white text-lg md:text-xl lg:text-2xl flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed min-h-[120px] md:min-h-[200px]"
          whileTap={{ scale: 0.95 }}
          disabled={showResult || voting}
        >
          {voting ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent mb-2"></div>
              <span className="text-sm opacity-90">Voting...</span>
            </div>
          ) : (
            <>
              <span className="font-semibold text-center mb-2 break-words hyphens-auto leading-tight">
                {q.optionB}
              </span>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-2"
                >
                  <div className="text-2xl md:text-3xl font-bold">{percentB}%</div>
                  <div className="text-sm opacity-90">({q.votesB} votes)</div>
                </motion.div>
              )}
            </>
          )}
        </motion.button>
      </div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6 flex justify-center"
      >
        <button
          onClick={nextQuestion}
          disabled={loading || !showResult || voting}
          className="px-6 md:px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full text-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg disabled:hover:from-gray-800 disabled:hover:to-gray-900"
        >
          {loading ? "Loading..." : currentIndex + 1 === questions.length ? "Finish" : "Next Question"} →
        </button>
      </motion.div>
      
    </div>
  );
}