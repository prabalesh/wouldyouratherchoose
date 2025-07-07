import { useState } from "react";
import { submitQuestion } from "../services/api";
import ToastContainer from "../components/Toast/ToastContainer";
import SubmitForm from "../components/Submit/SubmitForm";
import FormHeader from "../components/Submit/FormHeader";
import FormTips from "../components/Submit/FormTips";
import type { Toast } from "../types";

export default function SubmitPage() {
  const [form, setForm] = useState({ question: "", optionA: "", optionB: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.question.trim()) newErrors.question = "Question is required";
    if (!form.optionA.trim()) newErrors.optionA = "Option A is required";
    if (!form.optionB.trim()) newErrors.optionB = "Option B is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
      console.error(error);
      addToast("error", "Failed to submit question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-2xl mx-auto">
        <FormHeader />
        <SubmitForm
          form={form}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        <FormTips />
      </div>
    </div>
  );
}
