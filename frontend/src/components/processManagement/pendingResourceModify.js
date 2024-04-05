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
              { resourceType: 'Surgical Instrument Set', assignedResourceID: 'SI-139' },
            ],
          },
          {
            title: 'IV Access',
            requiredResources: [
              { resourceType: 'IV Stand', assignedResourceID: 'IV-027' },
            ],
          },
          {
            title: 'Radical Prostatectomy',
            requiredResources: [
              { resourceType: 'Operating Room', assignedResourceID: 'OR-001' },
              { resourceType: 'Patient Monitor', assignedResourceID: 'PI-012' },
              { resourceType: 'Surgical Robot', assignedResourceID: 'SR-056' },
            ],
          },
          {
            title: 'Pain Management',
            requiredResources: [
              { resourceType: 'Medication Pump', assignedResourceID: 'MP-032' },
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
              { resourceType: 'Suture Kit', assignedResourceID: 'SK-081' },
            ],
          },
          {
            title: 'Recovery',
            requiredResources: [
              { resourceType: 'Recovery Bed', assignedResourceID: 'RB-019' },
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

export function PendingResourceModify() {
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
    navigate("/processManagement/modifyProcess/pendingStaffAssignments");
  };

  const handleProceed = () => {
    navigate("/processManagement/");
  };

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Confirm the status of resource assignments for procedures in all sections:
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
          const isFullyAssigned = procedure.requiredResources.every(resource => resource.assignedResourceID);

          const borderClass = idx < section.procedures.length - 1 ? "border-b border-black" : "";

          return (
            <div key={idx} className={`flex justify-between items-center py-2 ${borderClass}`}>
              <span className="text-2xl">{procedure.title}</span>
              <span className={`${isFullyAssigned ? 'text-green-500' : 'text-highlightRed underline'} text-2xl font-bold flex items-center`}>
                {isFullyAssigned ? <FaCheck className="mr-2" /> : <MdOutlineOpenInNew className="mr-2" />}
                {isFullyAssigned ? 'Assigned' : 'Assignments Required'}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
))}
      </div>
    </div>
  );
}

export default PendingResourceModify;