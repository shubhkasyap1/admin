"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  onSuccess: () => void;
  onClose: () => void;
  defaultData?: {
    _id: string;
    question: string;
    answer: string;
  } | null;
};

const CreateQuestion = ({ onSuccess, onClose, defaultData }: Props) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const isEdit = Boolean(defaultData);

  useEffect(() => {
    if (defaultData) {
      setQuestion(defaultData.question);
      setAnswer(defaultData.answer);
    }
  }, [defaultData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    const url = isEdit
      ? `http://localhost:8000/api/v1/questions/${defaultData?._id}`
      : "http://localhost:8000/api/v1/questions";

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        toast.error(data.message || "Operation failed.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <h2 className="text-xl font-semibold mb-2">
        {isEdit ? "✏️ Edit Question" : "➕ Create New Question"}
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">Question</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Answer</label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateQuestion;
