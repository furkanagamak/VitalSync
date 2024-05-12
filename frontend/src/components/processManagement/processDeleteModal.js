import { IoIosWarning } from "react-icons/io";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ProcessDeleteModal = ({ processName, patientName, onDelete, onCancel }) => {
  const [inputName, setInputName] = useState("");

  const handleNameChange = (e) => setInputName(e.target.value);

  const handleSubmit = async () => {
    if (inputName.trim().toLowerCase() === patientName.trim().toLowerCase()) {
      onDelete();
    }else {
      toast.error("Name does not match.");
    }

    };
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-[#f5f5dc] p-8 rounded-md">
          <div className="text-center mb-4">
            <p className="text-xl font-semibold text-highlightRed px-2">
              Are you sure you want to delete:
            </p>
            <p className="text-xl text-primary">{processName}</p>
            <p className="text-xl text-primary">Patient: {patientName}</p>
          </div>
          <form onSubmit={(e) => {
        e.preventDefault(); 
        handleSubmit();
      }}>
        <div className="flex flex-col">
        <input
          type="text"
          placeholder="Enter patient's name to confirm"
          value={inputName}
          onChange={handleNameChange}
          className="px-2 mx-auto shrink-0 mt-8 bg-white border border-black border-solid h-[30px] w-[241px]"

        />
        <div className="flex justify-between mt-5">
        <button
              onClick={onCancel}
              className="mr-2 flex-1 justify-center px-3 py-2 bg-white rounded-lg border border-solid border-neutral-600 text-neutral-600"
            >
              Cancel
            </button>
            <button
               type="submit"
               className="ml-2 flex-1 justify-center px-3 py-2 bg-red-800 rounded-lg text-white"
               >
              Yes
            </button></div>
            </div>
      </form>
          <div className="flex justify-center space-x-4">
            
          </div>
        </div>

      </div>
    );
  };
  
  export default ProcessDeleteModal;
  