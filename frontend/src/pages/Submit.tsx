import { useState } from "react";
import { submitQuestion } from "../services/api";

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function Submit() {
  const [form, setForm] = useState({ question: "", optionA: "", optionB: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.question.trim()) {
      newErrors.question = "Question is required";
    }
    if (!form.optionA.trim()) {
      newErrors.optionA = "Option A is required";
    }
    if (!form.optionB.trim()) {
      newErrors.optionB = "Option B is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove toast after 4 seconds
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
      addToast('success', 'Question submitted successfully! 🎉');
      
      // Reset form
      setForm({ question: "", optionA: "", optionB: "" });
    } catch (error) {
      console.error("Error submitting question:", error);
      addToast('error', 'Failed to submit question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-xl shadow-lg backdrop-blur-sm border transform transition-all duration-300 ease-in-out animate-slide-in-right ${
              toast.type === 'success'
                ? 'bg-green-50/90 border-green-200 text-green-800'
                : 'bg-red-50/90 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create a Question
          </h1>
          <p className="text-lg text-gray-600">
            Submit your question and let the community decide
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Input */}
              <div className="group">
                <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Question
                </label>
                <div className="relative">
                  <textarea
                    id="question"
                    name="question"
                    value={form.question}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What would you like to ask the community?"
                    className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-0 ${
                      errors.question 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500 group-hover:border-gray-300'
                    }`}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
                </div>
                {errors.question && (
                  <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.question}</p>
                )}
              </div>

              {/* Options Container */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Option A */}
                <div className="group">
                  <label htmlFor="optionA" className="block text-sm font-semibold text-gray-700 mb-2">
                    Option A
                  </label>
                  <div className="relative">
                    <input
                      id="optionA"
                      name="optionA"
                      type="text"
                      value={form.optionA}
                      onChange={handleChange}
                      placeholder="First choice"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.optionA 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500 group-hover:border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
                  </div>
                  {errors.optionA && (
                    <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.optionA}</p>
                  )}
                </div>

                {/* Option B */}
                <div className="group">
                  <label htmlFor="optionB" className="block text-sm font-semibold text-gray-700 mb-2">
                    Option B
                  </label>
                  <div className="relative">
                    <input
                      id="optionB"
                      name="optionB"
                      type="text"
                      value={form.optionB}
                      onChange={handleChange}
                      placeholder="Second choice"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.optionB 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500 group-hover:border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
                  </div>
                  {errors.optionB && (
                    <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.optionB}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

        {/* Tips Section */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Tips for great questions</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">•</span>
              Keep your question clear and engaging
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Make sure both options are equally appealing
            </li>
            <li className="flex items-start">
              <span className="text-cyan-500 mr-2">•</span>
              Avoid controversial or sensitive topics
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}