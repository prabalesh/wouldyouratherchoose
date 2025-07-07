import VoteButton from "./VoteButton";
import type { Question } from "../../types";

interface Props {
  question: Question;
  showResult: boolean;
  voting: boolean;
  onVote: (id: string, option: "A" | "B") => void;
}

export default function QuestionCard({ question, showResult, voting, onVote }: Props) {
  const totalVotes = question.votesA + question.votesB;
  const percentA = totalVotes > 0 ? Math.round((question.votesA / totalVotes) * 100) : 0;
  const percentB = totalVotes > 0 ? Math.round((question.votesB / totalVotes) * 100) : 0;

  return (
    <>
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 text-center leading-tight break-words">
        {question.question}
      </h1>

      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 mx-auto max-h-[66vh] w-full max-w-[90vw]">
        <VoteButton
          label={question.optionA}
          percent={percentA}
          votes={question.votesA}
          disabled={showResult || voting}
          voting={voting}
          onClick={() => onVote(question.id, "A")}
          gradient="from-purple-600 to-purple-700"
        />
        <VoteButton
          label={question.optionB}
          percent={percentB}
          votes={question.votesB}
          disabled={showResult || voting}
          voting={voting}
          onClick={() => onVote(question.id, "B")}
          gradient="from-pink-600 to-pink-700"
        />
      </div>
    </>
  );
}
