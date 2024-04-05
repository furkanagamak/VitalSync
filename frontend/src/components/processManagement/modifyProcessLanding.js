import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { BsPencilFill } from "react-icons/bs";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineOpenInNew } from "react-icons/md";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";


const sections = [
    {
      name: "Preoperative",
      description: "Details about Preoperative section",
      procedures: ["General Anesthesia", "IV Access", "Laparoscopic Surgery", "Catheter Placement"]
    },
    {
      name: "Intraoperative",
      description: "Surgical procedure including anesthesia and monitoring.",
      procedures: ["Monitoring", "Incision", "Tissue Handling"]
    },
    {
      name: "Postoperative",
      description: "Details about Postoperative section",
      procedures: ["Pain Management", "Wound Care", "Physical Therapy"]
    }
  ];


function ProcedureDropdown(){

  const navigate = useNavigate();

  const handleAddNewProcedure = () => navigate("/processManagement/modifyProcess/modifyProcedure");

  const handleUseExistingTemplate = () => navigate("/processManagement/modifyProcess/addProcedure");

    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative mr-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white flex justify-between items-center rounded-t-2xl px-4 py-2 w-full mt-10 text-3xl"
      >
        Add Procedure
        <BsChevronDown className="text-white cursor-pointer" />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full z-10">
          <div className="bg-white rounded-b-xl shadow">
            <div onClick={handleAddNewProcedure} className="flex items-center justify-between px-4 py-2 border-b border-black text-2xl">
              Create from new template
              <button className="text-primary"><FiPlusCircle /></button>
            </div>
            <div className="flex items-center justify-between px-4 py-2 text-2xl">
              Create from existing template
              <button onClick={handleUseExistingTemplate} className="text-primary"><FiPlusCircle /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export function ModifyProcessLanding({ onModifyClick, onBack }) {
  const [openSections, setOpenSections] = useState(new Set());
  const [currentView, setCurrentView] = useState('modifyProcess'); // State to manage views

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/processManagement/modifyProcess/activeProcesses");
  };

  const handleSaveChanges = () => {
    navigate("/processManagement/modifyProcess/pendingStaffAssignments");
  };

  const handleReviewResourceAssignments = () => {
    navigate("/processManagement/modifyProcess/reviewResourceAssignments");
  };

  const handleReviewStaffAssignments = () => {
    navigate("/processManagement/modifyProcess/reviewStaffAssignments");
  };

  const handleModifyResourceAssignments = () => {
    navigate("/processManagement/modifyProcess/resourceAssignments");
  };

  const handleModifyStaffAssignments = () => {
    navigate("/processManagement/modifyProcess/staffAssignments");
  };


  const handleModifyProcedure = () => {
    navigate("/processManagement/modifyProcess/modifyProcedure");
  };

  const handleAddSection = () => {
    navigate("/processManagement/modifyProcess/addSection");
  };

  // Toggle section function
  const toggleSection = (sectionName) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionName)) {
      newOpenSections.delete(sectionName);
    } else {
      newOpenSections.add(sectionName);
    }
    setOpenSections(newOpenSections);
  };

  if (currentView === 'modifyProcess') {

  return (
    <div className="flex flex-col gap-6 py-14">     {/*Header*/}
    
        <div className="flex justify-between items-start text-4xl">
            {/* Left Section- Go Back button and Add Section */}
            <div className="flex flex-col gap-4 w-1/3">
                <button 
                    className="flex items-center justify-center bg-primary text-white rounded-full px-6 py-4 mb-12 mt-5 ml-12 text-3xl border-black border-2"
                    style={{ paddingLeft: '20px', maxWidth: '50%' }}
                    onClick={handleGoBack}
                >   
                    <FaArrowLeft className="mr-12" />Go Back
                </button>
                <div className="flex items-center ml-12">
                    <h1 className="text-black text-3.5xl font-bold">Add Section</h1>
                    <CiCirclePlus 
                      className="text-highlightGreen ml-2 mt-1 cursor-pointer" 
                      style={{ fontSize: '3.5rem' }} 
                      onClick={handleAddSection} 
                    />
                  </div>
            </div>

        {/* Middle Section- Process, Patient, ProcessID labels*/}
            <div className="w-1/3 mt-5 flex flex-col">
            <div className="flex items-center pl-15"><span className="text-primary underline font-bold mr-5 mb-2">Process:</span>   Radical Prostatectomy <BsPencilFill className="text-primary ml-3"/></div>
            <div className="flex items-center pl-15"><span className="text-primary underline font-bold mr-5 mb-2 ">Patient:</span>   May Mary <BsPencilFill className="text-primary ml-3"/></div>
            <div className="flex items-center pl-15"><span className="text-primary underline font-bold mr-5">Process ID:</span> 23585</div>
            </div>

        {/* Right Section- Description edit */}
            <div className="flex flex-col pl-20 w-1/3 mt-5">
            <div className="flex items-center">
                <p className="text-primary text-4xl underline font-bold mb-4">Description</p>
                <BsPencilFill className="ml-5 text-primary mb-4"/>
            </div>
            <textarea
                className="bg-white border-4 border-primary text-primary p-4 rounded text-2xl"
                style={{ height: '10rem', width: '85%' }}
                defaultValue="Surgical procedure to remove entire prostate gland and surrounding tissue. Typically used to treat early stage prostate cancer."
            />
            </div>
        </div>
        <div className="border-b border-gray-700 w-full mt-5"></div>


      {/* Sections- Title, dropdown, delete button */}  
      <div className="overflow-y-auto">
        {sections.map((section) => (
          <div key={section.name} className="border-b border-gray-300">
            <div className="flex justify-between items-center p-10">
              <p className="text-3xl font-bold">{section.name}</p>
              <div className="flex items-center">
                <button onClick={() => toggleSection(section.name)} className="flex items-center">
                  {openSections.has(section.name) ? <BsChevronUp className="text-4xl cursor-pointer" /> : <BsChevronDown className="text-4xl cursor-pointer" />}
                </button>
                <FaTrashAlt className="text-3xl ml-10 text-primary" />
              </div>
            </div>

            {openSections.has(section.name) && (
              <div className="p-4 flex">
                {/* Left Section Content */}
                <div className="w-1/5 ml-10 mr-8">
                  <div className="flex flex-col w-full mt-5">
                    <div className="flex items-center">
                      <p className="text-primary text-3xl font-bold mb-4 underline">Description</p>
                      <BsPencilFill className="ml-3 text-primary mb-4 text-2xl"/>
                    </div>
                    <textarea
                      className="bg-white border-4 border-primary text-primary p-4 rounded text-2xl"
                      style={{ height: '10rem', width: '85%' }}
                      defaultValue={section.description}
                    />
                  </div>
                  <div className="flex flex-col mt-4">
                    <button className="flex items-center bg-highlightGreen text-white rounded-full px-6 py-4 text-2xl mb-2 w-full mt-5"
                    onClick={handleReviewResourceAssignments} >
                      <MdOutlineOpenInNew className="text-white text-4xl ml-3 mr-10" />
                      Resource Assignments
                    </button>
                    <button className="flex items-center bg-highlightGreen text-white rounded-full px-4 py-4 text-2xl w-full mt-5 mb-10"
                     onClick={handleReviewStaffAssignments} >
                      <MdOutlineOpenInNew className="text-white text-3xl ml-3 mr-10" />
                      Staff Assignments
                    </button>
                  </div>
                </div>

                {/* Middle Section Content */}
                {section.procedures && (
                  <div className="mt-6 w-3/5 mr-20">
                    <p className="text-4xl font-bold mb-4 text-primary underline">Procedures</p>
                    {section.procedures.map((procedure, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between ${index < section.procedures.length - 1 ? "border-b border-black" : ""}`}>
                        <HiMiniArrowsUpDown className=" text-primary text-3xl" />
                        <span className="flex-1 text-2xl pl-2 font-bold py-4 mr-16">{procedure}</span>
                        <button className="text-highlightGreen underline text-xl mr-10" onClick={handleModifyResourceAssignments}>Resource Assignments</button>
                        <button className="text-highlightGreen underline text-xl mr-10" onClick={handleModifyStaffAssignments}>Staff Assignments</button>
                        <span className="flex items-center">
                          <button onClick={handleModifyProcedure} className ="text-primary text-2xl ml-2">Modify</button>
                          <MdOutlineOpenInNew className="text-primary ml-1 mr-6 text-3xl" />
                          <FaTrashAlt className="text-primary mx-2 text-3xl" />
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Right Section Content */}
                <div className="w-1/5 ml-auto">
                  <ProcedureDropdown />
                </div>
              </div>
            )}
          </div>
        ))}       
      </div>
      <div className="flex justify-evenly items-center mt-10 p-4 w-2/5 mx-auto">
      <button 
          className="bg-red-600 hover:bg-highlightRed text-white text-3xl py-3 px-5 rounded-full border-black border-2" 
          onClick={handleGoBack}>
            Delete Process
        </button>
        <button 
          className="bg-highlightGreen hover:bg-green-600 text-white text-3xl py-3 px-5 rounded-full border-black border-2" 
          onClick={handleSaveChanges}>
          Save Changes
    </button>
</div>
    </div>
  );}    
}