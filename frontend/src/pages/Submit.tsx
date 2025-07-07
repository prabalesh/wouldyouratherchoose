import { useState } from "react";
import { submitQuestion } from "../services/api";
import ToastContainer from "../components/toast/ToastContainer";
import type { Toast } from "../types";

export default function Submit() {
  const [form, setForm] = useState({ question: "", optionA: "", optionB: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.question.trim()) newErrors.question = "Question is required";
    if (!form.optionA.trim()) newErrors.optionA = "Option A is required";
    if (!form.optionB.trim()) newErrors.optionB = "Option B is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await submitQuestion(form);
      addToast("success", "Question submitted successfully! 🎉");
      setForm({ question: "", optionA: "", optionB: "" });
    } catch (error) {
      console.error("Error submitting question:", error);
      addToast("error", "Failed to submit question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a Question</h1>
          <p className="text-lg text-gray-600">Submit your question and let the community decide</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div className="group">
                <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">Your Question</label>
                <div className="relative">
                  <textarea
                    id="question"
                    name="question"
                    value={form.question}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What would you like to ask the community?"
                    className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-0 ${
                      errors.question ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500 group-hover:border-gray-300"
                    }`}
                  />
                </div>
                {errors.question && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.question}</p>}
              </div>

              {/* Options */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="optionA" className="block text-sm font-semibold text-gray-700 mb-2">Option A</label>
                  <div className="relative">
                    <input
                      id="optionA"
                      name="optionA"
                      type="text"
                      value={form.optionA}
                      onChange={handleChange}
                      placeholder="First choice"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.optionA ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-purple-500 group-hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.optionA && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.optionA}</p>}
                </div>

                <div className="group">
                  <label htmlFor="optionB" className="block text-sm font-semibold text-gray-700 mb-2">Option B</label>
                  <div className="relative">
                    <input
                      id="optionB"
                      name="optionB"
                      type="text"
                      value={form.optionB}
                      onChange={handleChange}
                      placeholder="Second choice"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.optionB ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.optionB && <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.optionB}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
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

        {/* Tips */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Tips for great questions</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start"><span className="text-purple-500 mr-2">•</span>Keep your question clear and engaging</li>
            <li className="flex items-start"><span className="text-blue-500 mr-2">•</span>Make sure both options are equally appealing</li>
            <li className="flex items-start"><span className="text-cyan-500 mr-2">•</span>Avoid controversial or sensitive topics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
