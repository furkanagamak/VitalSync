import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from "axios";

const ProcessCreationContext  = createContext(null);

export const useProcessCreation  = () => useContext(ProcessCreationContext);


export const ProcessCreationProvider = ({ children }) => {
    const [processTemplate, setProcessTemplate] = useState({
      processName: '',
      description: '',
      sections: []
    });

    const [patientInformation, setPatientInformation] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    dob: '',
    sex: '',
    phone: '',
    emergencyContact1Name: '',
    emergencyContact1Relation: '',
    emergencyContact1Phone: '',
    emergencyContact2Name: '',
    emergencyContact2Relation: '',
    emergencyContact2Phone: '',
    knownConditions: '',
    allergies: '',
    insuranceProvider: '',
    insuranceGroup: '',
    insurancePolicy: ''
    });

    const [fetchedSections, setFetchedSections] = useState([]);
    const [startTime, setStartTime] = useState('');

    const [currentlyModifyingTemplate, setCurrentlyModifyingTemplate] = useState(false)
    const [currentlyCreatingTemplate, setCurrentlyCreatingTemplate] = useState(false)

  
    const updateProcessTemplate = (data) => {
      setProcessTemplate(prev => ({
        ...prev,
        ...data
      }));
    };


    useEffect(() => {
      console.log(fetchedSections);

    }, [fetchedSections]);

    const fetchProcedureTemplate = async (procedureTemplateId) => {
      try {
          const response = await axios.get(`/procedureTemplates/${procedureTemplateId}`);
          return response.data;
      } catch (err) {
          console.error("Error fetching procedure template:", err);
          return null;
      }
  };

  const expandItemsByQuantity = (items, itemType) => {
    return items.reduce((acc, item, index) => {
      const expandedItems = Array(item.quantity).fill().map((_, idx) => ({
        ...item[itemType],
        uniqueId: `${item[itemType]._id}-${idx}`, 
        ...(itemType === 'role' ? { account: null } : { resourceInstance: null })
      }));
      return [...acc, ...expandedItems];
    }, []);
  };

  const fetchAndSetProcedureTemplates = async () => {
      if (!startTime) return;

      const parsedStartTime = new Date(startTime);
      let currentTime = new Date(parsedStartTime);

      const updatedSections = await Promise.all(processTemplate.sections.map(async (section) => {
          const procedureTemplates = await Promise.all(section.procedureTemplates.map(async (templateId) => {
              const template = await fetchProcedureTemplate(templateId);
              const expandedResources = expandItemsByQuantity(template.requiredResources, 'resource');
              const expandedRoles = expandItemsByQuantity(template.roles, 'role');

              const procedureStartTime = new Date(currentTime);
              currentTime.setMinutes(currentTime.getMinutes() + template.estimatedTime);
              const procedureEndTime = new Date(currentTime);

              return {
                  ...template,
                  requiredResources: expandedResources,
                  roles: expandedRoles,
                  startTime: procedureStartTime.toISOString(),
                  endTime: procedureEndTime.toISOString()
              };
          }));
          return { ...section, procedureTemplates };
      }));

      setFetchedSections(updatedSections);
      console.log(updatedSections);
  };

  useEffect(() => {
      if (processTemplate.sections.length > 0 && startTime) {
          fetchAndSetProcedureTemplates();
      }
  }, [processTemplate.sections, startTime]);


  const assignStaffToRole = (sectionId, procedureId, roleId, staffId) => {
    setFetchedSections(sections => sections.map(section => {
      if (section._id === sectionId) {
        return {
          ...section,
          procedureTemplates: section.procedureTemplates.map(procedure => {
            if (procedure._id === procedureId) {
              return {
                ...procedure,
                roles: procedure.roles.map(role => {
                  if (role.uniqueId === roleId) {
                    return { ...role, account: staffId };
                  }
                  return role;
                })
              };
            }
            return procedure;
          })
        };
      }
      return section;
    }));
  };

  const assignResourceToRequiredResource = (sectionId, procedureId, resourceId, resourceInstanceId) => {
    setFetchedSections(sections => sections.map(section => {
      if (section._id === sectionId) {
        return {
          ...section,
          procedureTemplates: section.procedureTemplates.map(procedure => {
            if (procedure._id === procedureId) {
              return {
                ...procedure,
                requiredResources: procedure.requiredResources.map(resource => {
                  if (resource.uniqueId === resourceId) {
                    return { ...resource, resourceInstance: resourceInstanceId };
                  }
                  return resource;
                })
              };
            }
            return procedure;
          })
        };
      }
      return section;
    }));
  };

  const createProcessInstance = async () => {
    const processDetails = {
      processTemplate: {
        processName: processTemplate.processName,
        description: processTemplate.description,
      },
      patientInformation,
      fetchedSections
    };
  
    try {
      const { data } = await axios.post('/processInstances', processDetails);
      console.log('Process instance created successfully:', data);
    } catch (error) {
      console.error('Failed to create process instance:', error);
    }
  }


  return (
    <ProcessCreationContext.Provider value={{
      assignStaffToRole,
      assignResourceToRequiredResource,  
      processTemplate,
      updateProcessTemplate,
      patientInformation,
      setPatientInformation,
      fetchedSections,
      startTime,
      setStartTime,
      currentlyModifyingTemplate, setCurrentlyModifyingTemplate,
   currentlyCreatingTemplate, setCurrentlyCreatingTemplate,
   createProcessInstance
    }}>
      {children}
    </ProcessCreationContext.Provider>
  );
}
  
