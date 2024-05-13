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
      <h1 className="text-primary text-4xl font-bold">Review Staff Assignments</h1>
      <button className=" hover:bg-green-600 flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl" onClick={onProceed}>
                Proceed
            </button>
    </div>
  );
}

export function CreateReviewStaffAssignments({ onBack, onProceed }) {
  const { fetchedSections } = useProcessCreation(); 
  const [openSections, setOpenSections] = useState(new Set(fetchedSections.map(section => section.sectionName)));
  const [staffDetails, setStaffDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if(fetchedSections.length < 1){
      navigate("/processManagement/newProcess/processTemplates", { replace: true });
    }

    const fetchStaffDetails = async () => {
      // Extract IDs from roles
      const staffIds = new Set(fetchedSections.flatMap(
        section => section.procedureTemplates.flatMap(
          procedure => procedure.roles.map(role => {
            console.log('Role Account ID:', role.account); // This should log actual IDs, not undefined
            return role.account;
          })
        )
      ));
  
      console.log('Staff IDs:', staffIds); // Check what IDs are being gathered
  
      // Fetch details for each ID
      const staffPromises = Array.from(staffIds).map(id => axios.get(`/user/${id}`));
      const staffResults = await Promise.all(staffPromises);
      const staffMap = staffResults.reduce((acc, current) => {
        if (current.data.userId) {
          acc[current.data.userId] = current.data;
        } else {
          console.log('Missing userId in response:', current.data); // Check if some responses don't include userId
        }
        return acc;
      }, {});
  
      console.log('Staff Map:', staffMap); // Final map of IDs to staff details
      setStaffDetails(staffMap);
    };
  
    fetchStaffDetails();
  }, [fetchedSections]);

  const toggleSection = (sectionName) => {
    const updatedSections = new Set(openSections);
    if (updatedSections.has(sectionName)) {
      updatedSections.delete(sectionName);
    } else {
      updatedSections.add(sectionName);
    }
    setOpenSections(updatedSections);
  };

  const handleGoBack = () => {
    navigate("/processManagement/newProcess/pendingStaffAssignments");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/pendingResourceAssignments");
  };

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Confirm the following staff assignments for procedures in all sections:
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
                    {procedure.roles.map((role, roleIdx) => (
                      <div key={roleIdx} className="flex justify-between my-2">
                        <span className="text-2xl ml-10">{role.name}:</span>
                        <span className="text-primary text-2xl font-bold mr-8">
                          {role.account && staffDetails[role.account] ? `${staffDetails[role.account].firstName} ${staffDetails[role.account].lastName}` : 'Not Assigned'}
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

export default CreateReviewStaffAssignments;
