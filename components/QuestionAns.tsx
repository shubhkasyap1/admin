"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import CreateQuestion from "./CreateQuestion";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import clsx from "clsx";

type QnA = {
  _id: string;
  question: string;
  answer: string;
};

const shimmer =
  "animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700";

const QnALoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="border border-gray-700 rounded-lg overflow-hidden bg-[#0f172a] transition-all"
      >
        <div className="p-4">
          <div className={clsx("h-5 w-3/4 mb-2 rounded", shimmer)}></div>
          <div className={clsx("h-4 w-full mb-1 rounded", shimmer)}></div>
          <div className={clsx("h-4 w-5/6 mb-3 rounded", shimmer)}></div>
          <div className="flex gap-4">
            <div className={clsx("h-8 w-20 rounded", shimmer)}></div>
            <div className={clsx("h-8 w-20 rounded", shimmer)}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const QuestionAns = () => {
  const [qnas, setQnas] = useState<QnA[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<QnA | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [updatedData, setUpdatedData] = useState<QnA | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQnA = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/qna`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.info)) {
        setQnas(data.info);
      } else {
        setQnas([]);
        toast.error(data.message || "Failed to load FAQs");
      }
    } catch (error: any) {
      setQnas([]);
      toast.error(error?.message || "Error fetching FAQs");
    } finally {
      setLoading(false);
    }
  };

  const performDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/qna/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Question deleted successfully!");
        fetchQnA();
      } else {
        toast.error(data.message || "Failed to delete question.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error deleting question.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const performUpdate = async () => {
    if (!updatedData) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/qna/${updatedData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: updatedData.question,
          answer: updatedData.answer,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Question updated successfully!");
        fetchQnA();
      } else {
        toast.error(data.message || "Failed to update question.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error updating question.");
    } finally {
      setConfirmUpdate(false);
      setUpdatedData(null);
      setEditItem(null);
      setShowModal(false);
    }
  };

  const toggleIndex = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const handleEdit = (item: QnA) => {
    setEditItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    fetchQnA();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Total Questions: {qnas.length}
        </h2>
        <button
          onClick={() => {
            setEditItem(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Create Question
        </button>
      </div>

      {/* QnA List or Loader */}
      {loading ? (
        <QnALoader />
      ) : qnas.length > 0 ? (
        qnas.map((item, index) => (
          <div
            key={item._id}
            className={`border border-gray-700 rounded-lg mb-4 overflow-hidden transition-all ${
              activeIndex === index ? "bg-[#111827]" : "bg-[#0f172a]"
            }`}
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex justify-between items-center p-4 text-left text-lg font-medium hover:bg-gray-800"
            >
              {item.question}
              {activeIndex === index ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {activeIndex === index && (
              <div className="px-4 pb-4 text-gray-300 space-y-4">
                <p>{item.answer}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(item._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                  >
                    <Trash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">No questions found.</p>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e293b] rounded-lg shadow-lg w-full max-w-xl p-8">
            <CreateQuestion
              defaultData={editItem}
              onSuccess={(data) => {
                if (editItem) {
                  setUpdatedData(data);
                  setConfirmUpdate(true);
                } else {
                  toast.success("Question created successfully!");
                  fetchQnA();
                  setShowModal(false);
                }
              }}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {/* ConfirmDialog for Delete */}
      {confirmDeleteId && (
        <ConfirmDialog
          open={true}
          title="Delete this question?"
          description="This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onConfirm={() => performDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      {/* ConfirmDialog for Update */}
      {confirmUpdate && updatedData && (
        <ConfirmDialog
          open={true}
          title="Confirm update?"
          description="Are you sure you want to update this question?"
          confirmText="Yes, Update"
          cancelText="Cancel"
          onConfirm={performUpdate}
          onCancel={() => {
            toast.info("Update cancelled.");
            setConfirmUpdate(false);
            setUpdatedData(null);
          }}
        />
      )}
    </div>
  );
};

export default QuestionAns;
