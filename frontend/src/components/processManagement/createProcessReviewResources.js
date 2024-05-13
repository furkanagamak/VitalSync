import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import axios from 'axios';

function NavButtons({ onBack, onProceed }) {
  return (
    <div className="flex justify-between items-center mb-5">
      <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
        <FaArrowLeft className="mr-2" />
        Go Back
      </button>
      <h1 className="text-primary text-4xl font-bold">Review Resource Assignments</h1>
      <button className="hover:bg-green-600 flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl" onClick={onProceed}>
                Proceed
            </button>
    </div>
  );
}

export function CreateReviewResourceAssignments({ onBack, onProceed }) {
  const { fetchedSections } = useProcessCreation(); 
  const [openSections, setOpenSections] = useState(new Set(fetchedSections.map(section => section.sectionName)));
  const [resourceDetails, setResourceDetails] = useState({});
  const navigate = useNavigate();



  useEffect(() => {
    console.log(fetchedSections);
    if(fetchedSections.length < 1){
      navigate("/processManagement/newProcess/processTemplates", { replace: true });
    }
    const fetchResourceDetails = async () => {
      // Extract IDs from resources
      const resourceIds = new Set(
        fetchedSections.flatMap(section =>
          section.procedureTemplates.flatMap(procedure =>
            procedure.requiredResources.map(resource => {
              console.log('Assigned resource ID:', resource.resourceInstance);
              return resource.resourceInstance;
            })
          )
        )
      );
  
      console.log('Resource IDs:', resourceIds); // Check what IDs are being gathered
  
      // Fetch details for each ID
      const resourcePromises = Array.from(resourceIds).map(id => axios.get(`/resources/${id}`));
      const resourceResults = await Promise.all(resourcePromises);
      const resourceMap = resourceResults.reduce((acc, current) => {
        if (current.data.uniqueIdentifier) { // Assuming resource has an id field
          acc[current.data.uniqueIdentifier] = current.data; // Storing details by resource ID
        } else {
          console.log('Missing resourceId in response:', current.data); // Check if some responses don't include id
        }
        return acc;
      }, {});

      console.log('Resource Map:', resourceMap); // Final map of IDs to resource details
      setResourceDetails(resourceMap);
    };
  
    fetchResourceDetails();
  }, [fetchedSections, openSections]);

  const toggleSection = (sectionName) => {
    const updatedSections = new Set(openSections);
    if (updatedSections.has(sectionName)) {
      updatedSections.delete(sectionName);
    } else {
      updatedSections.add(sectionName);
    }
    setOpenSections(updatedSections);
    console.log(fetchedSections);
  };

  const handleGoBack = () => {
    navigate("/processManagement/newProcess/pendingResourceAssignments");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/preview", { state: { from: '/processManagement/newProcess/reviewResourceAssignments' } });
  };

  const getResourceDetailsByInstance = (resourceInstance) => {
    // Iterate through resourceDetails to find matching entry
    for (const resourceId in resourceDetails) {
      if (resourceDetails[resourceId]._id === resourceInstance) {
        return resourceDetails[resourceId];
      }
    }
    // If no match found, return null or handle appropriately
    return null;
  };

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Confirm the following resource assignments for procedures in all sections:
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
                  <div key={idx} className={`py-2 ${idx < section.procedureTemplates.length - 1 ? 'border-b' : ''} border-primary`}>
                    <span className='font-bold text-3xl'>{procedure.procedureName}</span>
                    {procedure.requiredResources.map((resource, resourceIdx) => (
                      <div key={resourceIdx} className="flex justify-between my-2">
                        <span className="text-2xl ml-10">{resource.name}:</span>
                        <span className="text-primary text-2xl font-bold mr-8">
                        {/*resource.resourceInstance && resourceDetails[resource.resourceInstance] ? `${resourceDetails[resource.resourceInstance].uniqueIdentifier}` : 'Not Assigned'*/}
                        {`${getResourceDetailsByInstance(resource.resourceInstance)?.uniqueIdentifier || 'Not Assigned'}`}

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

export default CreateReviewResourceAssignments;
