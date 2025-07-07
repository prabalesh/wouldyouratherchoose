interface Props {
  current: number;
  total: number;
}

export default function ProgressDots({ current, total }: Props) {
  return (
    <div className="flex flex-wrap gap-2 min-w-0 flex-1">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full flex-shrink-0 ${
            index === current
              ? "bg-purple-600"
              : index < current
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
