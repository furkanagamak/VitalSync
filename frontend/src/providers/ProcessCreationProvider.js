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
    const [eligibleStaffByRole, setEligibleStaffByRole] = useState({});


  
    const updateProcessTemplate = (data) => {
      setProcessTemplate(prev => ({
        ...prev,
        ...data
      }));
    };
  
    const addSection = (section) => {
      setProcessTemplate(prev => ({
        ...prev,
        sections: [...prev.sections, section]
      }));
    };
  
    const updateSection = (sectionId, sectionData) => {
      setProcessTemplate(prev => ({
        ...prev,
        sections: prev.sections.map(section => 
          section._id === sectionId ? { ...section, ...sectionData } : section
        )
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
  };

  const updateRoleAssignment = (uniqueRoleId, roleId, accountId) => {
    setFetchedSections(prevSections => {
      return prevSections.map(section => ({
        ...section,
        procedureTemplates: section.procedureTemplates.map(procedure => ({
          ...procedure,
          roles: procedure.roles.map(role => {
            if (role.uniqueId === uniqueRoleId) {
              return { ...role, account: accountId };
            }
            return role;
          })
        }))
      }));
    });
    removeAssignedStaffGlobally(roleId, accountId); // Remove assigned staff from global list
  };

  const removeAssignedStaffGlobally = (roleId, staffId) => {
    setEligibleStaffByRole(prev => ({
      ...prev,
      [roleId]: prev[roleId].filter(staff => staff._id !== staffId)
    }));
  }

  const fetchEligibleStaff = async () => {
    try {
        // This will aggregate all role IDs across all sections and templates into a unique set to prevent duplicate requests.
        let allRoleIds = new Set();
        fetchedSections.forEach(section => {
            section.procedureTemplates.forEach(template => {
                template.roles.forEach(role => {
                    allRoleIds.add(role._id);
                });
            });
        });

        // Convert Set to Array for mapping over it to fetch data
        allRoleIds = Array.from(allRoleIds);

        const responses = await Promise.all(
            allRoleIds.map(roleId => axios.get(`/users/accountsByRole/${roleId}`)
                .then(response => ({ roleId, data: response.data }))
                .catch(error => {
                    console.error(`Error fetching staff for role ${roleId}:`, error);
                    return { roleId, data: [] }; // Return empty data on error
                })
            )
        );

        // Create an object where keys are roleIds and values are staff data
        const staffByRole = {};
        responses.forEach(item => {
            staffByRole[item.roleId] = item.data;
        });

        setEligibleStaffByRole(staffByRole);
        console.log("Eligible staff by role:", staffByRole);
    } catch (error) {
        console.error('Error fetching eligible staff globally:', error);
    }
};

useEffect(() => {
  fetchEligibleStaff();
}, [fetchedSections]);

  useEffect(() => {
      if (processTemplate.sections.length > 0 && startTime) {
          fetchAndSetProcedureTemplates();
      }
  }, [processTemplate.sections, startTime]);


    return (
      <ProcessCreationContext.Provider value={{ eligibleStaffByRole, updateRoleAssignment , processTemplate, updateProcessTemplate, addSection, updateSection, 
      patientInformation, setPatientInformation, fetchedSections, startTime, setStartTime}}>
        {children}
      </ProcessCreationContext.Provider>
    );
  };

  
