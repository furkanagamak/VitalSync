import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useProcessModificationContext } from '../../providers/ProcessModificationProvider';
import axios from 'axios';

function NavButtons({ onBack}) {
  return (
    <div className="flex justify-between items-center mb-5">
      <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
        <FaArrowLeft className="mr-2" />
        Go Back
      </button>
      <h1 className="text-primary text-3xl font-bold">Review Resource Assignments</h1>
    </div>
  );
}

export function ReviewResourceAssignments({ sections, onBack}) {
  const [openSections, setOpenSections] = useState(new Set(sections.map(section => section._id)));
  const navigate = useNavigate();

  const toggleSection = (sectionId) => {
    const updatedSections = new Set(openSections);
    if (updatedSections.has(sectionId)) {
      updatedSections.delete(sectionId);
    } else {
      updatedSections.add(sectionId);
    }
    setOpenSections(updatedSections);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="container mx-auto p-8">
            <NavButtons onBack={onBack}/>
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Review resource assignments for this section:
        </p>
        {sections.map((section) => (
          <div key={section._id} className="mt-4">
            <button
              className="flex justify-between items-center w-full bg-primary text-white py-2 px-4 rounded-md text-2xl"
              onClick={() => toggleSection(section._id)}
            >
              {section.name}
              {openSections.has(section._id) ? <BsChevronUp /> : <BsChevronDown />}
            </button>
            {openSections.has(section._id) && (
              <div className="bg-white mt-2 p-4 rounded-md">
                {section.procedureInstances.map((procedure) => (
                  <div key={procedure._id} className="py-2 border-b border-primary">
                    <span className='font-bold text-3xl'>{procedure.procedureName}</span>
                    {procedure.assignedResources.map((resource) => (
                      <div key={resource._id} className="flex justify-between my-2">
                        <span className="text-2xl ml-10">{capitalizeFirstLetter(resource.name)}:</span>
                        <span className="text-primary text-2xl font-bold mr-8">
                          {resource.uniqueIdentifier}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewResourceAssignments;
