interface Props {
  message: string;
}

export default function ErrorScreen({ message }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg font-medium">{message}</p>
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
