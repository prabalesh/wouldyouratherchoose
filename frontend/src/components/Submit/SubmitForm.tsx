import React from "react";

interface Props {
  form: {
    question: string;
    optionA: string;
    optionB: string;
  };
  errors: { [key: string]: string };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubmitForm({ form, errors, isSubmitting, onChange, onSubmit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Question */}
          <div className="group">
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">Your Question</label>
            <textarea
              id="question"
              name="question"
              rows={4}
              value={form.question}
              onChange={onChange}
              placeholder="What would you like to ask the community?"
              className={`w-full px-4 py-3 border-2 rounded-xl resize-none focus:outline-none transition-all duration-200 ${
                errors.question ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500"
              }`}
            />
            {errors.question && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.question}</p>}
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {["optionA", "optionB"].map((opt, i) => (
              <div className="group" key={opt}>
                <label htmlFor={opt} className="block text-sm font-semibold text-gray-700 mb-2">
                  {`Option ${i === 0 ? "A" : "B"}`}
                </label>
                <input
                  id={opt}
                  name={opt}
                  type="text"
                  value={form[opt as keyof typeof form]}
                  onChange={onChange}
                  placeholder={i === 0 ? "First choice" : "Second choice"}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors[opt] ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500"
                  }`}
                />
                {errors[opt] && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors[opt]}</p>}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Question
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
