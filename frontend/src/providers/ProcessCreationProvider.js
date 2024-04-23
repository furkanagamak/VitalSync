import React, { createContext, useState, useContext } from 'react';

const ProcessCreationContext  = createContext(null);

export const useProcessCreation  = () => useContext(ProcessCreationContext);


export const ProcessTemplateProvider = ({ children }) => {
    const [processTemplate, setProcessTemplate] = useState({
      processName: '',
      description: '',
      sections: []
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
      <ProcessCreationContext.Provider value={{ processTemplate, updateProcessTemplate, addSection, updateSection }}>
        {children}
      </ProcessCreationContext.Provider>
    );
  };

  
