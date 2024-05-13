import React, { useState, useEffect, useMemo  } from "react";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaArrowLeft, FaCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import moment from 'moment'; 
import { ClipLoader } from "react-spinners";





export function ResourceDropdownContent({ requiredResource, eligibleResources, assignResources, assignedResource }) {
  const handleAssign = (resource) => {
    assignResources(requiredResource.uniqueId, resource);
  };
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredResources = eligibleResources.filter(resource =>
    resource.uniqueIdentifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //console.log(eligibleResources);

  return (
    <div className="flex mx-10 mb-5">
      <div className="flex flex-col w-2/5 text-3xl mt-5">
        <p>Currently Assigned:</p>
        <p className="text-primary mb-2">
          {assignedResource ? `${assignedResource.uniqueIdentifier} (${assignedResource.name})` : "Not assigned"}
        </p>
      </div>
      <div className="w-3/5 ml-5">
        <p className="text-highlightGreen text-2xl mb-3 mt-5">Available Resources:</p>
        <input
          type="text"
          placeholder="Search by Identifier..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-3 px-2 py-1 border-gray-400 border-2 rounded"
        />
        {filteredResources.length > 0 ? (
          <div className="border-gray-400 border-2 rounded-lg p-3 overflow-y-auto" style={{ maxHeight: '12rem' }}>
            <table className="w-full text-left">
              <thead className="border-b border-primary">
                <tr>
                  <th className="text-primary text-2xl">Identifier</th>
                  <th className="text-primary text-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((resource, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid black' }}>
                    <td className="py-2 text-2xl">{resource.uniqueIdentifier}</td>
                    <td>
                      <button 
                        className="mb-1 text-xl bg-green-500 hover:bg-green-700 mt-2 text-white rounded-full px-3 py-1"
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
        ) : (
          <p className="text-xl text-red-500">No other available resources at this time.</p>
        )}
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
  const { assignResourceToRequiredResource } = useProcessCreation();

  useEffect(() => {
    const allResourceIds = new Set(requiredResources.map(requiredResource => requiredResource.uniqueId));
    setOpenResources(allResourceIds);
  }, [requiredResources]);

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
    // Capture the previously assigned resource for this role if it exists
    const previouslyAssignedResource = assignedResources[resourceUniqueId];
  
    // Update the assigned resources with the new assignment
    setAssignedResources(prev => ({ ...prev, [resourceUniqueId]: resourceInstance }));
  
    // Remove the newly assigned resource from the eligible list across all roles
    const updatedResources = Object.keys(eligibleResources).reduce((acc, key) => {
      acc[key] = eligibleResources[key].filter(r => r._id !== resourceInstance._id);
      return acc;
    }, {});
  
    if (previouslyAssignedResource) {
      const updatedEligibleResources = { ...updatedResources };
      console.log("Debug: Starting to re-add previously assigned resource if not present.");
    
      requiredResources.forEach(resource => {
        // Debugging: Check if the resource already contains the previously assigned resource
        const isPreviouslyAssignedResourcePresent = updatedEligibleResources[resource.uniqueId].find(r => r._id === previouslyAssignedResource._id);
        console.log(`Debug: Checking if previously assigned resource (${previouslyAssignedResource._id}) is already in eligible list for resource (${resource.uniqueId}). Present: ${!!isPreviouslyAssignedResourcePresent}`);
    
        if (!isPreviouslyAssignedResourcePresent && (resource.name === previouslyAssignedResource.name)) {
          console.log(`Debug: Adding previously assigned resource (${previouslyAssignedResource._id}) back to eligible list for resource (${resource.uniqueId}). The resource is`, resource, previouslyAssignedResource);
          updatedEligibleResources[resource.uniqueId].push(previouslyAssignedResource);
        }
      });
    
      // Debugging: Output the final states of eligible resources after the update
      console.log("Debug: Final updated eligible resources state:", updatedEligibleResources);
      setEligibleResources(updatedEligibleResources);
    } else {
      console.log("Debug: No previously assigned resource to add back. Setting updated resources.");
      setEligibleResources(updatedResources);
    }
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
    let updatedEligibleResources = { ...eligibleResources };
    let updatedAssignedResources = { ...assignedResources };

    requiredResources.forEach(requiredResource => {
        const resourceEligibleInstances = updatedEligibleResources[requiredResource.uniqueId];
        const availableResources = resourceEligibleInstances.filter(resourceInstance => !updatedAssignedResources[requiredResource.uniqueId]);

        if (availableResources.length > 0 && !updatedAssignedResources[requiredResource.uniqueId]) {
            updatedAssignedResources[requiredResource.uniqueId] = availableResources[0];
            // Remove the assigned resource from all eligible lists to prevent reassignment
            Object.keys(updatedEligibleResources).forEach(key => {
                updatedEligibleResources[key] = updatedEligibleResources[key].filter(resource => resource._id !== availableResources[0]._id);
            });
        }
    });

    // Update state after all assignments are processed
    setAssignedResources(updatedAssignedResources);
    setEligibleResources(updatedEligibleResources);
};

const startDate = new Date(startTime);
const endDate = new Date(endTime);

// Define options for displaying date and time
const options = {
  day: '2-digit',      
  month: '2-digit',    
  year: 'numeric',    
  hour: '2-digit',     
  minute: '2-digit',   
  hour12: false     
};

const formattedStartTime = startDate.toLocaleString('en-US', options);
const formattedEndTime = endDate.toLocaleString('en-US', options);

if (isLoading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={150} color={"#8E0000"} />
    </div>
  );
}

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

          className="mr-5 mt-5 bg-highlightGreen text-white text-2xl py-4 px-16 rounded-3xl hover:bg-green-600"
          style={{ maxWidth: '30%' }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <div className="container mx-auto p-8">
      <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold mb-5 ">{procedureName}<span className="text-primary" > - Complete Resource Assignments</span></h2>
          <div className="flex flex-col text-lg my-2 text-primary font-bold">
          <span>Start Time: {formattedStartTime}</span>
          <span>End Time: {formattedEndTime}</span>
          </div>
        </div>
        <p className="mt-1 text-highlightRed text-lg">Please note that auto-assigning may result in incomplete assignments based on resource availability at scheduled time. </p>

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
            <button className="hover:bg-green-600 flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl" onClick={onProceed}>
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
    if(fetchedSections.length < 1){
      navigate("/processManagement/newProcess/processTemplates", { replace: true } );
    }
    const newAssignmentCompletion = {};
    fetchedSections.forEach(section => {
      section.procedureTemplates.forEach(procedure => {
        const key = `${section._id}-${procedure._id}`;
        newAssignmentCompletion[key] = procedure.requiredResources.every(resource => resource.resourceInstance);
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
    navigate("/processManagement/newProcess/reviewStaffAssignments");
  };

  const checkIfAllProceduresAssigned = () => {
    return !fetchedSections.some(section => 
      section.procedureTemplates.some(procedure => 
        !isFullyAssigned(procedure._id, section._id)  
      )
    );
  };

  const handleProceed = () => {
    if(!checkIfAllProceduresAssigned()){
      toast.error("Please complete assignments in all procedures before proceeding.");
      return;
    }
    navigate("/processManagement/newProcess/reviewResourceAssignments");
  };



  const handleClick = (procedure, sectionId) => {
    setSelectedProcedure(procedure);
    setSelectedSectionId(sectionId);
    setViewAlternateComponent(true);
  };

  const isFullyAssigned = (procedureId, sectionId) => {
    const key = `${sectionId}-${procedureId}`;
    return assignmentCompletion[key] || false;
  };

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
                    <div className={`flex items-center text-2xl font-bold ${isFullyAssigned(procedure._id, section._id) ? 'text-green-500' : 'text-highlightRed underline'}`}>
                      <button
                        className="flex items-center text-current p-0 border-none bg-transparent"
                        title="Assign Resources"
                        onClick={() => handleClick(procedure, section._id)}
                      >
                        {isFullyAssigned(procedure._id, section._id) ? (
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