import React, { useState, useEffect, useMemo  } from "react";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaArrowLeft, FaCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import moment from 'moment'; 




export function ResourceDropdownContent({ requiredResource, eligibleResources, assignResources, assignedResource }) {
  const handleAssign = (resource) => {
    assignResources(requiredResource.uniqueId, resource);
  };

  console.log(eligibleResources);

  return (
    <div className="flex mx-10">
      <div className="flex flex-col w-2/5 text-3xl mt-5">
        <p>Currently Assigned:</p>
        <p className="text-primary mb-2">
          {assignedResource ? `${assignedResource.uniqueIdentifier} (${assignedResource.name})` : "Not assigned"}
        </p>
      </div>
      <div className="w-3/5 ml-5">
        <p className="text-highlightGreen text-2xl mb-3 mt-5">Available Resources:</p>
        <div className="border-gray-400 border-2 rounded-lg p-3 overflow-y-auto" style={{ maxHeight: '12rem' }}>
          <table className="w-full text-left">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-primary text-2xl">Identifier</th>
                <th className="text-primary text-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eligibleResources.map((resource, index) => (
                <tr key={index} style={{ borderBottom: '1px solid black' }}>
                <td className="py-2 text-2xl">{resource.uniqueIdentifier}</td>
                  <td>
                    <button 
                      className="text-xl bg-green-500 hover:bg-green-700 mt-2 text-white rounded-full px-3 py-1"
                      onClick={() => handleAssign(resource)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export function CreateResourcesAssignments({ sectionId, procedureId, procedureName, requiredResources, onClose, onProceed,
  startTime, endTime }) {
  const [openResources, setOpenResources] = useState(new Set());
  const [eligibleResources, setEligibleResources] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [assignedResources, setAssignedResources] = useState({});
  const { assignResourceToRequiredResource } = useProcessCreation(); // This function needs to be defined in your context provider

  useEffect(() => {
    const fetchEligibleResources = async () => {
      const resourceIds = requiredResources.map(resource => resource._id);
      try {
        // Fetch resource instances based on the resource name
        const responses = await Promise.all(requiredResources.map(resource =>
          axios.get(`/resources/byName/${resource.name}`)
        ));
        const initialResources = responses.reduce((acc, res, index) => {
          acc[requiredResources[index].uniqueId] = res.data.filter(resourceInstance => {
            // Check if resource is available during the required time
            const unavailableDuringProcedure = resourceInstance.unavailableTimes.some(time => {
              const start = moment(time.start);
              const end = moment(time.end);
              const procStart = moment(startTime);
              const procEnd = moment(endTime);
              return procStart.isBefore(end) && procEnd.isAfter(start);
            });
  
            return !unavailableDuringProcedure;
          });
          return acc;
        }, {});
        setEligibleResources(initialResources);
      } catch (error) {
        console.error("Failed to fetch eligible resources:", error);
      }
      setIsLoading(false);
    };
    fetchEligibleResources();
  }, [requiredResources, startTime, endTime]);

  const assignResource = (resourceUniqueId, resourceInstance) => {
    const updatedResources = {...eligibleResources};
    updatedResources[resourceUniqueId] = updatedResources[resourceUniqueId].filter(r => r._id !== resourceInstance._id);
    setEligibleResources(updatedResources);
    setAssignedResources(prev => ({ ...prev, [resourceUniqueId]: resourceInstance }));
  };

  const toggleResource = (uniqueId) => {
    setOpenResources(prev => {
        const newOpenResources = new Set(prev); 
        if (prev.has(uniqueId)) {
            newOpenResources.delete(uniqueId);
        } else {
            newOpenResources.add(uniqueId);
        }
        return newOpenResources;
    });
};

  const handleSave = () => {
    const allAssigned = requiredResources.every(resource => assignedResources[resource.uniqueId]);
    if (!allAssigned) {
      toast.error("Please assign resources to all required resources before saving.");
      return;
    }
  
    requiredResources.forEach(resource => {
      const resourceInstance = assignedResources[resource.uniqueId];
      if (resourceInstance) {
        assignResourceToRequiredResource(sectionId, procedureId, resource.uniqueId, resourceInstance._id);
      }
    });
  
    onProceed();
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const autoAssignResources = () => {
    requiredResources.forEach(requiredResource => {
      const resourceEligibleInstances = eligibleResources[requiredResource.uniqueId];
      if (resourceEligibleInstances && resourceEligibleInstances.length > 0 && !assignedResources[requiredResource.uniqueId]) {
        assignResource(requiredResource.uniqueId, resourceEligibleInstances[0]);  
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-secondary min-h-screen">
      <div className="flex justify-between items-center p-5">
        <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onClose}>
          <FaArrowLeft className="mr-3" /> Go Back
        </button>
        <button className="bg-blue-500 text-white text-xl py-2 px-4 rounded-full" onClick={autoAssignResources}>
          Auto-Assign All
        </button>
        <button

          className="mr-5 mt-5 bg-highlightGreen text-white text-2xl py-4 px-16 rounded-3xl"
          style={{ maxWidth: '30%' }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <div className="container mx-auto p-8">
        <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold">{procedureName} - Complete Resource Assignments</h2>
        </div>
        <div>
          {requiredResources.map((resource) => (
            <div key={resource.uniqueId} className="py-10 border-b border-primary">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold flex items-center">
                <span>{capitalizeFirstLetter(resource.name)}</span>
                  {assignedResources[resource.uniqueId] ? (
                    <FaCheck className="text-green-500 ml-4 text-4xl" />
                  ) : (
                    <FaRegCalendarTimes className="text-highlightRed ml-4 text-4xl" />
                  )}
                </div>
                <button onClick={() => toggleResource(resource.uniqueId)}>
                  {openResources.has(resource.uniqueId) ? <BsChevronUp className="text-4xl" /> : <BsChevronDown className="text-4xl" />}
                </button>
              </div>
              {openResources.has(resource.uniqueId) && (
                <div className="mx-auto mt-16 mb-8 p-2 bg-white rounded-2xl shadow w-4/5">
                  <ResourceDropdownContent
                    requiredResource={resource}
                    eligibleResources={eligibleResources[resource.uniqueId] || []}
                    assignResources={assignResource}
                    assignedResource={assignedResources[resource.uniqueId]}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavButtons({ onBack, onProceed }) {

    return (
        <div className="flex justify-between items-center mb-5">
            <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
            <h1 className="text-primary text-4xl font-bold">Pending Resource Assignments</h1>
            <button className="flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl" onClick={onProceed}>
                Proceed
            </button>
        </div>
    );
}

export function PendingNewResources() {
  const { fetchedSections } = useProcessCreation();
  const [openSections, setOpenSections] = useState(new Set(fetchedSections.map(section => section.sectionName)));
  const navigate = useNavigate();
  const [viewAlternateComponent, setViewAlternateComponent] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [assignmentCompletion, setAssignmentCompletion] = useState({});

  useEffect(() => {
    const newAssignmentCompletion = {};
    fetchedSections.forEach(section => {
      section.procedureTemplates.forEach(procedure => {
        newAssignmentCompletion[procedure._id] = procedure.requiredResources.every(resource => resource.resourceInstance);
      });
    });
    setAssignmentCompletion(newAssignmentCompletion);
  }, [fetchedSections]);

  const toggleSection = (sectionName) => {
    const updatedSections = new Set(openSections);
    updatedSections.has(sectionName) ? updatedSections.delete(sectionName) : updatedSections.add(sectionName);
    setOpenSections(updatedSections);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/reviewResourceAssignments");
  };

  const handleClick = (procedure, sectionId) => {
    setSelectedProcedure(procedure);
    setSelectedSectionId(sectionId);
    setViewAlternateComponent(true);
  };

  const isFullyAssigned = (procedureId) => assignmentCompletion[procedureId] || false;

  const handleClose = () => {
    setViewAlternateComponent(false);
    setSelectedProcedure(null);
  };

  if (viewAlternateComponent) {
    return <CreateResourcesAssignments 
      sectionId={selectedSectionId} 
      procedureId={selectedProcedure._id} 
      procedureName={selectedProcedure.procedureName} 
      requiredResources={selectedProcedure.requiredResources}  
      onClose={handleClose} 
      onProceed={handleClose} 
      startTime={selectedProcedure.startTime} 
      endTime={selectedProcedure.endTime} />;
  }

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Assign necessary resources to all procedures:
        </p>
        {fetchedSections.map((section, index) => (
          <div key={index} className="mt-4">
            <button
              className="flex justify-between items-center w-full bg-primary text-white py-2 px-4 rounded-md text-2xl"
              onClick={() => toggleSection(section.sectionName)}
            >
              {section.sectionName}
              {openSections.has(section.sectionName) ? <BsChevronUp /> : <BsChevronDown />}
            </button>
            {openSections.has(section.sectionName) && (
              <div className="bg-white mt-2 p-4 rounded-md">
                {section.procedureTemplates.map((procedure, idx) => (
                  <div key={idx} className={`flex justify-between items-center py-2 ${idx < section.procedureTemplates.length - 1 ? 'border-b' : ''} border-black`}>
                    <span className='text-2xl'>{procedure.procedureName}</span>
                    <div className={`flex items-center text-2xl font-bold ${isFullyAssigned(procedure._id) ? 'text-green-500' : 'text-highlightRed underline'}`}>
                      <button
                        className="flex items-center text-current p-0 border-none bg-transparent"
                        onClick={() => handleClick(procedure, section._id)}
                      >
                        {isFullyAssigned(procedure._id) ? (
                          <div className="flex items-center text-green-500">
                            <FaCheck className="mr-2" /> Assigned
                          </div>
                        ) : (
                          <div className="flex items-center text-highlightRed">
                            <MdOutlineOpenInNew className="mr-2" /> Assignments Required
                          </div>
                        )}
                      </button>
                    </div>
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
 

export default PendingNewResources;