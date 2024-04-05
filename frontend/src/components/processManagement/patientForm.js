import React from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


function PatientInformationForm({ onBack, onProceed }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onProceed();
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/processManagement/newProcess/processTemplates");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/staffAssignments");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
      <button
          className=" hover:bg-red-900 border-black border-2 flex items-center justify-center bg-primary text-white rounded-full px-5 py-2 text-xl shadow"
          style={{ maxWidth: '30%' }}
          onClick={handleGoBack}
        >
          <FaArrowLeft className="mr-3" />
          Go Back
        </button>
        <h2 className="text-3xl font-bold text-red-600 mr-28">Patient Information</h2>
        <div></div> 
      </div>

      <div className="border-2 border-red-600 rounded p-4">
        <p className="text-sm italic text-gray-600 mb-4">All fields are required.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-xl">Full Name</label>
            <input 
              id="fullName"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">Address</label>
            <input 
              id="address"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">City</label>
            <input 
              id="city"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">State</label>
            <select className="border border-red-600 p-2 relative">
            {/* State options */}
            <FaCheck className="absolute right-2 top-2 pointer-events-none" />
          </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-2 text-xl">ZIP</label>
            <input 
              id="ZIP"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">Date of Birth</label>
            <input 
              id="city"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
              placeholder='MM-DD-YYYY'
            />
          </div>

          <div className="space-y-4 my-10">
              <div className="flex flex-col">
                <label className="mb-2 text-xl">Emergency Contact 1 Name</label>
                <input 
                  id="em1"
                  type="text"
                  className="border border-red-600 p-2" 
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-xl">Relation</label>
                <input 
                  id="em1r"
                  type="text"
                  className="border border-red-600 p-2" 
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-xl">Phone #</label>
                <input 
                  id="em1p"
                  type="text"
                  className="border border-red-600 p-2" 
                />
              </div>
            </div>

            <div className="space-y-4 my-10">
              <div className="flex flex-col">
                <label className="mb-2 text-xl">Emergency Contact 2 Name</label>
                <input 
                  id="em2"
                  type="text"
                  className="border border-red-600 p-2" 
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-xl">Relation</label>
                <input 
                  id="em2r"
                  type="text"
                  className="border border-red-600 p-2" 
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-xl">Phone #</label>
                <input 
                  id="em2p"
                  type="text"
                  className="border border-red-600 p-2" 
                />
              </div>
            </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">Insurance Carrier</label>
            <input 
              id="insuranceCarrier"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">Group #</label>
            <input 
              id="group"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">Policy #</label>
            <input 
              id="policy"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-xl">Known Conditions</label>
            <input 
              id="conditions"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-5 text-xl">Allergies</label>
            <input 
              id="allergies"
              type="text"
              className="col-span-2 md:col-span-1 border border-red-600 p-2" 
            />
          </div>

          <button 
            type="submit" 
            onClick = {handleProceed}
            className="border-black border-2 mt-10 mb-5 px-12 text-3xl col-span-2 md:col-span-2 justify-self-center bg-green-500 hover:bg-green-700 text-white p-3 rounded-full w-full md:w-auto"
          >
          Proceed
        </button>
        </form>
      </div>
    </div>
  );
}

export default PatientInformationForm;