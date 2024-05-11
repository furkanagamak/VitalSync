import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, templateName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-[#f5f5dc] p-8 rounded-md border-2 border-primary">
        <div className="text-center mb-4">
          <p className="text-xl font-semibold">
            Are you sure you want to delete:
          </p>
          <p className="text-lg">{templateName}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md hover:underline"
            title="Cancel Deletion"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-600"
            title="Confirm Deletion"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
