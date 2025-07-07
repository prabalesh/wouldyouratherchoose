export interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}