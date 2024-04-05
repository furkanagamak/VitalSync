import React, { useState } from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const sections = [
    {
        name: 'Preoperative',
        procedures: [
          {
            title: 'General Anesthesia',
            requiredResources: [
              { resourceType: 'Anesthesia Machine', assignedResourceID: 'AS-009' },
            ],
          },
          {
            title: 'Patient Preparation',
            requiredResources: [
              { resourceType: 'Prep Kit', assignedResourceID: 'PK-014' },
            ],
          },
        ],
      },
      {
        name: 'Intraoperative',
        procedures: [
          {
            title: 'Incision',
            requiredResources: [
            ],
          },
          {
            title: 'IV Access',
            requiredResources: [
            ],
          },
          {
            title: 'Radical Prostatectomy',
            requiredResources: [
            ],
          },
          {
            title: 'Pain Management',
            requiredResources: [
            ],
          },
        ],
      },
      {
        name: 'Postoperative',
        procedures: [
          {
            title: 'Suture',
            requiredResources: [
            ],
          },
          {
            title: 'Recovery',
            requiredResources: [
            ],
          },
        ],
      },
    ];

function NavButtons({ onBack, onProceed }) {
    return (
        <div className="flex justify-between items-center mb-5">
            <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
            <h1 className="text-primary text-4xl font-bold">Pending Resource Assignments</h1>
            <button className="hover:bg-green-700 border-black border-2 flex items-center justify-center bg-highlightGreen text-white rounded-full px-7 py-5 text-4xl" onClick={onProceed}>
                Proceed
            </button>
        </div>
    );
}

export function PendingNewResources() {
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
    navigate("/processManagement/newProcess/pendingStaffAssignments");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/reviewStaffAssignments");
  };

  const handleClick = () => {
    navigate("/processManagement/newProcess/resourceAssignments");
  };

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
        Assign necessary resources to all procedures:
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
        {section.procedures.map((procedure, idx) => {
          const isFullyAssigned = (procedure.requiredResources.length > 0);

          const borderClass = idx < section.procedures.length - 1 ? "border-b border-black" : "";

          return (
            <div key={idx} className={`flex justify-between items-center py-2 ${borderClass}`}>
              <span className="text-2xl">{procedure.title}</span>
              <button
                onClick={handleClick}
                className={`text-2xl font-bold ${isFullyAssigned ? 'text-green-500' : 'text-highlightRed underline'} flex items-center focus:outline-none`}
              >
                {isFullyAssigned ? (
                  <>
                    <FaCheck className="mr-2" />
                    Assigned
                  </>
                ) : (
                  <>
                    <MdOutlineOpenInNew className="mr-2" />
                    Assignments Required
                  </>
                )}
              </button>
            </div>
          );
        })}
        <div className="flex justify-center mt-6">
          <button
            className="bg-primary text-white rounded-full px-6 py-2 text-xl shadow hover:bg-primary-dark"
          >
            Auto-Assign All
          </button>
        </div>
      </div>
    )}
  </div>
))}
      </div>
    </div>
  );
}

export default PendingNewResources;