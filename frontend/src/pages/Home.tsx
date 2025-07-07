import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getQuestions, voteQuestion } from "../services/api";
import type { Question } from "../types";
import LoadingScreen from "../components/QuestionFlow/LoadingScreen";
import ErrorScreen from "../components/QuestionFlow/ErrorScreen";
import FinishedScreen from "../components/QuestionFlow/FinishedScreen";
import ProgressDots from "../components/QuestionFlow/ProgressDots";
import QuestionCard from "../components/QuestionFlow/QuestionCard";

export default function Home() {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [allQuestionIds, setAllQuestionIds] = useState<Set<string>>(
        new Set()
    );
    const [voting, setVoting] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions();
            const newQuestions = data.filter(
                (q: Question) => !allQuestionIds.has(q.id)
            );
            if (newQuestions.length > 0) {
                const newIds = new Set(allQuestionIds);
                newQuestions.forEach((q: Question) => newIds.add(q.id));
                setAllQuestionIds(newIds);
                setQuestions(newQuestions);
                setCurrentIndex(0);
            } else {
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
            setVoting(true);
            await voteQuestion(id, option);

            const updatedQuestions = [...questions];
            const updatedQuestion = { ...updatedQuestions[currentIndex] };
            if (option === "A") {
                updatedQuestion.votesA++;
            } else {
                updatedQuestion.votesB++;
            }
            updatedQuestions[currentIndex] = updatedQuestion;

            setQuestions(updatedQuestions);
            setShowResult(true);
        } catch (err) {
            setError(
                err instanceof Response && err.status === 409
                    ? "You've already voted on this question."
                    : "Vote failed."
            );
        } finally {
            setVoting(false);
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
            setLoading(true);
            fetchQuestions();
        }
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;
    if (questions && questions.length === 0) return <FinishedScreen />;
    if (!questions || !questions[currentIndex]) return null;

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col">
            <div className="bg-white shadow-lg p-4 md:p-6 mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl">
                <div className="flex items-start justify-between mb-4 gap-4">
                    <ProgressDots
                        current={currentIndex}
                        total={questions.length}
                    />
                    <span className="text-sm text-gray-500 font-medium flex-shrink-0">
                        {currentIndex + 1} of {questions.length}
                    </span>
                </div>
                <QuestionCard
                    question={currentQuestion}
                    showResult={showResult}
                    voting={voting}
                    onVote={vote}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 md:p-6 flex justify-center"
            >
                <button
                    onClick={nextQuestion}
                    disabled={loading || !showResult || voting}
                    className="px-6 md:px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full text-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentIndex + 1 === questions.length
                        ? "Finish"
                        : "Next Question"}{" "}
                    →
                </button>
            </motion.div>
        </div>
    );
}
