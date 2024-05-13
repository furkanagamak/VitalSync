import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';

const notify = () => toast.success("Process successfully created! Assigned staff have been notified.");

const ProcessDetailsPreview = () => {
  const navigate = useNavigate();
  const { fetchedSections, processTemplate, patientInformation, createProcessInstance } = useProcessCreation(); 
  const [userData, setUserData] = useState({});
  const [resourceData, setResourceData] = useState({});
  const location = useLocation(); 


  useEffect(() => {
    console.log(fetchedSections);
    console.log(processTemplate);
    console.log(patientInformation);

    if (!location.state || location.state.from !== '/processManagement/newProcess/reviewResourceAssignments') {
      navigate("/processManagement/newProcess/processTemplates", { replace: true });
    }

    const fetchUserData = async () => {
      const userIds = fetchedSections.flatMap(section =>
        section.procedureTemplates.flatMap(template =>
          template.roles.map(role => role.account)
        )
      );
      const userRequests = userIds.map(id => axios.get(`/user/${id}`));
      const users = await Promise.all(userRequests);
      const userMap = users.reduce((acc, response) => {
        acc[response.data.userId] = response.data;
        return acc;
      }, {});
      setUserData(userMap);
    };

    const fetchResourceData = async () => {
      const resourceIds = fetchedSections.flatMap(section =>
        section.procedureTemplates.flatMap(template =>
          template.requiredResources.map(resource => resource.resourceInstance)
        )
      );
      const resourceRequests = resourceIds.map(id => axios.get(`/resources/${id}`));
      const resources = await Promise.all(resourceRequests);
      const resourceMap = resources.reduce((acc, response) => {
        acc[response.data._id] = response.data;
        return acc;
      }, {});
      setResourceData(resourceMap);
      console.log(resourceMap);
    };

    fetchUserData();
    fetchResourceData();
  }, [fetchedSections, location, navigate]);

  const calculateTotalProcedures = (sections) => {
    return sections.reduce((total, section) => total + section.procedureTemplates.length, 0);
  };
  
  const handleGoBack = () => {
    navigate('/processManagement/newProcess/reviewResourceAssignments');
  };

  const handleConfirm = async () => {
    try {
      await createProcessInstance(); 
      navigate("/processManagement/");  
    } catch (error) {
      console.error("Error creating process instance:", error);
    }
  };

  return (
    <div className="w-11/12 mx-auto mt-10">
      <section className="flex justify-between text-primary text-3xl my-4">
        <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={handleGoBack}>
        <FaArrowLeft className="mr-2" />
        Go Back
      </button>
        <h1 className="font-semibold text-4xl underline">Process Preview</h1>
        <button onClick={handleConfirm} className=" px-12 flex items-center justify-center bg-highlightGreen text-white rounded-3xl py-5 text-3xl hover:bg-green-600">
          Confirm
        </button>

      </section>
      <section className="bg-secondary rounded-2xl p-8 space-y-8">
        <section className="flex flex-col justify-between space-y-4 md:flex-row">
          <section className="text-primary text-2xl space-y-6 w-1/2">
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">Process:</h1>
              <p>{processTemplate.processName}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">Patient:</h1>
              <p>{`${patientInformation.firstName} ${patientInformation.lastName}`}</p>
            </div>
            <div className="flex space-x-2">
              <h1 className="underline underline-offset-4">Total Procedures:</h1>
              <p>{calculateTotalProcedures(fetchedSections)}</p>
            </div>
          </section>
        </section>
        <section className="space-y-4">
          <h1 className="text-2xl text-primary underline underline-offset-4">Procedures:</h1>
          <section className="space-y-12">
            {fetchedSections.map(section => (
              <Section key={section._id} section={section} userData={userData} resourceData={resourceData} />
            ))}
          </section>
        </section>
      </section>
    </div>
  );
};

const Section = ({ section, userData, resourceData }) => {
  return (
    <section className="space-y-4">
      <div className="bg-white rounded-full p-4 flex justify-between items-center space-x-4">
        <div className="flex flex-col ml-4">
          <h1 className="text-2xl capitalize">{section.sectionName}</h1>
          <p className="text-gray-500">{section.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {section.procedureTemplates.map(procedure => (
          <Procedure key={procedure._id} procedure={procedure} userData={userData} resourceData={resourceData} />
        ))}
      </div>
    </section>
  );
};

const Procedure = ({ procedure, userData }) => {
  // Function to classify resources based on their type
  const classifyResources = (resources) => {
    const equipment = [];
    const spaces = [];
    resources.forEach(resource => {
      const type = resource.type.toLowerCase();
      if (type.includes('equip') || type.includes('equipment')) {
        equipment.push(resource.name);
      } else if (type.includes('space') || type.includes('spaces')) {
        spaces.push(resource.name);
      }
    });
    return { equipment, spaces };
  };

  const { equipment, spaces } = classifyResources(procedure.requiredResources);

  return (
    <div className="bg-primary rounded-3xl text-white flex flex-col md:flex-row text-xl">
      <section className="border-b-2 md:border-r-2 md:border-b-2 p-8 space-y-2 md:w-1/2">
        <div className="flex space-x-2">
          <h1 className="underline underline-offset-4">Name:</h1>
          <p>{procedure.procedureName}</p>
        </div>
        <div>
          <h1 className="underline underline-offset-4">Description:</h1>
          <p>{procedure.description}</p>
        </div>
        <div>
          <h1 className="underline underline-offset-4">Special Instructions:</h1>
          <p>{procedure.specialNotes}</p>
        </div>
      </section>
      <section className="flex flex-col md:grid grid-cols-3 md:w-1/2">
        <section className="col-start-1 col-end-2 p-4 border-b-2 md:border-r-2 md:border-b-0 flex flex-col items-center space-y-2">
          <h1 className="underline">People Involved:</h1>
          <ul className="list-disc">
            {procedure.roles.map(role => (
              <li key={role._id}>{userData[role.account] ? `${userData[role.account].firstName} ${userData[role.account].lastName}` : 'Loading...'}</li>
            ))}
          </ul>
        </section>
        <section className="col-start-2 col-end-3 p-4 border-b-2 md:border-r-2 md:border-b-0 flex flex-col items-center space-y-2">
          <h1 className="underline">Equipment Used:</h1>
          <ul className="list-disc">
            {equipment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="col-start-3 col-end-4 p-4 flex flex-col items-center space-y-2">
          <h1 className="underline">Space Used:</h1>
          <ul className="list-disc">
            {spaces.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
};

export default ProcessDetailsPreview;
