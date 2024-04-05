import React from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';

function PatientInformationForm({ onBack, onProceed }) {
  // Form submission handler
  const handleSubmit = (event) => {
    event.preventDefault();
    onProceed();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-red-600"
        >
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>
        <h2 className="text-3xl font-bold text-red-600">Patient Information</h2>
        <div></div> {/* Placeholder for alignment */}
      </div>

      <div className="border-2 border-red-600 rounded p-4">
        <p className="text-sm italic text-gray-600 mb-4">All fields are required.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <input 
            className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            placeholder="Full Name" 
          />
          <input 
            className="border border-red-600 p-2" 
            placeholder="Address" 
          />
          <input 
            className="border border-red-600 p-2" 
            placeholder="City" 
          />
          <input 
            className="border border-red-600 p-2" 
            placeholder="MM-DD-YYYY" 
          />
          <select className="border border-red-600 p-2">
            {/* Sex options */}
          </select>
          <select className="border border-red-600 p-2 relative">
            {/* State options */}
            <FaCheck className="absolute right-2 top-2 pointer-events-none" />
          </select>
          <input 
            className="border border-red-600 p-2" 
            placeholder="ZIP" 
          />
          {/* Repeat for other fields */}
          <button 
            type="submit" 
            className="col-start-2 justify-self-end bg-green-500 hover:bg-green-700 text-white p-3 rounded-full"
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientInformationForm;