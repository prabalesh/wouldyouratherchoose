export default function FinishedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-xl text-gray-700 font-medium mb-2">All done!</p>
        <p className="text-gray-500">
          You've answered everything! Come back later for more fun questions.
        </p>
      </div>
    </div>
  );
}
