const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8050";

export async function getQuestions() {
  const res = await fetch(`${API_BASE_URL}/questions`);
  return res.json();
}

export async function voteQuestion(questionId: string, option: "A" | "B") {
  await fetch(`${API_BASE_URL}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, option }),
  });
}

export async function submitQuestion(question: {
  question: string;
  optionA: string;
  optionB: string;
}) {
  await fetch(`${API_BASE_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(question),
  });
}