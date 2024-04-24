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

    }, [patientInformation]);

    const fetchProcedureTemplate = async (procedureTemplateId) => {
      try {
          const response = await axios.get(`/procedureTemplates/${procedureTemplateId}`);
          console.log("Fetched procedure template ID:", procedureTemplateId);
          return response.data;
      } catch (err) {
          console.error("Error fetching procedure template:", err);
      }
  };

  const expandItemsByQuantity = (items, itemType) => {
      return items.reduce((acc, item) => {
          const expandedItems = Array(item.quantity).fill().map(() => ({
              ...item[itemType],
              ...(itemType === 'role' ? { account: null } : { resourceInstance: null })
          }));
          return [...acc, ...expandedItems];
      }, []);
  };

  const fetchAndSetProcedureTemplates = async () => {
      const updatedSections = await Promise.all(processTemplate.sections.map(async (section) => {
          const procedureTemplates = await Promise.all(section.procedureTemplates.map(async (templateId) => {
              const template = await fetchProcedureTemplate(templateId);
              const expandedResources = expandItemsByQuantity(template.requiredResources, 'resource');
              const expandedRoles = expandItemsByQuantity(template.roles, 'role');
              return { ...template, requiredResources: expandedResources, roles: expandedRoles };
          }));
          return { ...section, procedureTemplates };
      }));

      setFetchedSections(updatedSections);
  };

  useEffect(() => {
      if (processTemplate.sections.length > 0) {
          fetchAndSetProcedureTemplates();
      }
  }, [processTemplate.sections]);
  
    return (
      <ProcessCreationContext.Provider value={{ processTemplate, updateProcessTemplate, addSection, updateSection, 
      patientInformation, setPatientInformation, fetchedSections, startTime, setStartTime}}>
        {children}
      </ProcessCreationContext.Provider>
    );
  };

  
