import React, { createContext, useContext, useState } from 'react';

const ProcessCreationContext = createContext();

export const useProcessCreation = () => useContext(ProcessCreationContext);

export const ProcessCreationProvider = ({ children }) => {
  const [processDetails, setProcessDetails] = useState({
    processName: '',
    description: '',
    sections: []
  });

  // Update process details
  const updateProcessDetails = (details) => {
    setProcessDetails(prev => ({ ...prev, ...details }));
  };

  // Add a new section to the process
  const addSection = (section) => {
    setProcessDetails(prev => ({
      ...prev,
      sections: [...prev.sections, { ...section, procedureInstances: [] }]
    }));
  };

  // Update an existing section
  const updateSection = (index, updates) => {
    setProcessDetails(prev => ({
      ...prev,
      sections: prev.sections.map((sec, idx) => idx === index ? { ...sec, ...updates } : sec)
    }));
  };

  // Delete a section
  const deleteSection = (index) => {
    setProcessDetails(prev => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== index)
    }));
  };

  // Add a procedure to a section
  const addProcedureToSection = (sectionIndex, procedure) => {
    setProcessDetails(prev => ({
      ...prev,
      sections: prev.sections.map((section, idx) => {
        if (idx === sectionIndex) {
          return { ...section, procedureInstances: [...section.procedureInstances, procedure] };
        }
        return section;
      })
    }));
  };

  // Context provider value
  const value = {
    processDetails,
    updateProcessDetails,
    addSection,
    updateSection,
    deleteSection,
    addProcedureToSection
  };

  return (
    <ProcessCreationContext.Provider value={value}>
      {children}
    </ProcessCreationContext.Provider>
  );
};