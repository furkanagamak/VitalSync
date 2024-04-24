import React, { createContext, useState, useContext } from 'react';

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
  
    return (
      <ProcessCreationContext.Provider value={{ processTemplate, updateProcessTemplate, addSection, updateSection, patientInformation, setPatientInformation}}>
        {children}
      </ProcessCreationContext.Provider>
    );
  };

  
