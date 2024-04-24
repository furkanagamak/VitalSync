import React, { useState, useEffect } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaCheck } from "react-icons/fa";
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';




const sections = [
    {
      name: 'Preoperative',
      procedures: [
        {
          title: 'General Anesthesia',
          assignedStaff: [
            { role: 'Anesthesiologist', name: 'Suzanne Cooper' },
          ]
        },
        {
          title: 'Patient Preparation',
          assignedStaff: [
            { role: 'Nurse', name: 'Christina Cooper' },
          ]
        },
      ]
    },
    {
      name: 'Intraoperative',
      procedures: [
        {
          title: 'Incision',
          assignedStaff: [
          ]
        },
        {
          title: 'IV Access',
          assignedStaff: [
          ]
        },
        {
          title: 'Radical Prostatectomy',
          assignedStaff: [
          ]
        },
        {
          title: 'Pain Management',
          assignedStaff: []
        },
      ]
    },
    {
      name: 'Postoperative',
      procedures: [
        {
          title: 'Suture',
          assignedStaff: []
        },
        {
          title: 'Recovery',
          assignedStaff: []
        },
      ]
    },
  ];

  function NavButtons({ onBack, onProceed }) {

    return (
        <div className="flex justify-between items-center mb-5">
            <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
            <h1 className="text-primary text-4xl font-bold">Pending Staff Assignments</h1>
            <button className="hover:bg-green-700 border-black border-2 flex items-center justify-center bg-highlightGreen text-white rounded-full px-7 py-5 text-4xl" onClick={onProceed}>
                Proceed
            </button>
        </div>
    );
}

export function PendingNewStaff() {
  const [openSections, setOpenSections] = useState(new Set(sections.map(section => section.name)));

  const toggleSection = (sectionName) => {
    const updatedSections = new Set(openSections);
    if (updatedSections.has(sectionName)) {
      updatedSections.delete(sectionName);
    } else {
      updatedSections.add(sectionName);
    }
    setOpenSections(updatedSections);
  };

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/processManagement/newProcess/patientForm");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/pendingResourceAssignments");
  };

  const handleClick = () => {
    navigate("/processManagement/newProcess/staffAssignments");
  };

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Assign necessary staff to all procedures:
        </p>
        {sections.map((section, index) => (
          <div key={index} className="mt-4">
            <button
              className="flex justify-between items-center w-full bg-primary text-white py-2 px-4 rounded-md text-2xl"
              onClick={() => toggleSection(section.name)}
            >
              {section.name}
              {openSections.has(section.name) ? <BsChevronUp /> : <BsChevronDown />}
            </button>
            {openSections.has(section.name) && (
              <div className="bg-white mt-2 p-4 rounded-md">
                {section.procedures.map((procedure, idx) => (
                  <div key={idx} className={`flex justify-between items-center py-2 ${idx < section.procedures.length - 1 ? 'border-b' : ''} border-black`}>
                    <span className='text-2xl'>{procedure.title}</span>
                    <div className={`flex items-center text-2xl font-bold ${procedure.assignedStaff.length > 0 ? 'text-green-500' : 'text-highlightRed underline'}`}>
                    <button
                        className="flex items-center text-current p-0 border-none bg-transparent"
                        onClick={handleClick} 
                      >
                        {procedure.assignedStaff.length > 0
                          ? (
                            <>
                              <FaCheck className="mr-2" />
                              Assigned
                            </>
                          )
                          : (
                            <>
                              <MdOutlineOpenInNew className="mr-2" />
                              Assignments Required
                            </>
                          )
                        }
                      </button>        
                </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      <div className="flex justify-center mt-6">
          <button
            className="bg-primary text-white rounded-full px-6 py-2 text-xl shadow hover:bg-primary-dark"
          >
            Auto-Assign All
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingNewStaff;