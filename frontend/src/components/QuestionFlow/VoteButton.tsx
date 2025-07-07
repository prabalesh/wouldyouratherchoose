import { motion } from "framer-motion";

interface Props {
  label: string;
  percent: number;
  votes: number;
  disabled: boolean;
  voting: boolean;
  onClick: () => void;
  gradient: string;
}

export default function VoteButton({ label, percent, votes, disabled, voting, onClick, gradient }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={`flex-1 bg-gradient-to-br ${gradient} text-white text-lg md:text-xl lg:text-2xl flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed min-h-[120px] md:min-h-[200px]`}
    >
      {voting ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent mb-2" />
          <span className="text-sm opacity-90">Voting...</span>
        </div>
      ) : (
        <>
          <span className="font-semibold text-center mb-2 break-words hyphens-auto leading-tight">
            {label}
          </span>
          {percent !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-2"
            >
              <div className="text-2xl md:text-3xl font-bold">{percent}%</div>
              <div className="text-sm opacity-90">({votes} votes)</div>
            </motion.div>
          )}
        </>
      )}
    </motion.button>
  );
}
