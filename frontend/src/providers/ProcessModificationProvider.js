import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const ProcessModificationContext = createContext();

export const ProcessModificationProvider = ({ children }) => {
    const [processInstance, setProcessInstance] = useState(null);
    const [editedPatient, setEditedPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [staffAssignments, setStaffAssignments] = useState({}); 
    const [error, setError] = useState(null);
    const location = useLocation();


    const fetchProcessInstance = useCallback(async (processID) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/processInstance/${processID}`);
            setProcessInstance(response.data);
            setEditedPatient(response.data.patient); 
            console.log(response);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            console.error('Failed to fetch process instance:', err);
        }
    }, []);

    const updateProcessDescription = useCallback((description) => {
        setProcessInstance(prev => ({
            ...prev,
            description: description
        }));
    }, []);

    const updateProcessName = useCallback((name) => {
        console.log(name);
        setProcessInstance(prev => ({
            ...prev,
            processName: name
        }));
    }, []);

    const updateProcessPatient = useCallback((patient) => {
        setEditedPatient(patient);
    }, []);

    const updateStaffAssignments = useCallback((procedureId, roleId, staffId) => {
        setStaffAssignments(prev => ({
            ...prev,
            [procedureId]: {
                ...prev[procedureId],
                [roleId]: staffId
            }
        }));
    }, []);

    const getStaffAssignments = useCallback((procedureId) => {
        return staffAssignments[procedureId] || {};
    }, [staffAssignments]);

    /*

    const saveAllChanges = useCallback(() => {
        console.log("Saving all changes to backend or main state.");
    }, [staffAssignments, processInstance, editedPatient]);

    */


    const updateSectionDescription = useCallback((sectionName, newDescription) => {
        setProcessInstance(prev => {
            const updatedSections = prev.sectionInstances.map(section => {
                if (section.name === sectionName) {
                    return { ...section, description: newDescription };
                }
                return section;
            });
    
            return { ...prev, sectionInstances: updatedSections };
        });
    }, []);

    const updateSectionName = useCallback((sectionId, newName) => {
        setProcessInstance(prev => {
            const updatedSections = prev.sectionInstances.map(section => {
                if (section._id === sectionId) {
                    return { ...section, name: newName };
                }
                return section;
            });
    
            return { ...prev, sectionInstances: updatedSections };
        });
    }, []);




    // Persist process state in sessionStorage here
    useEffect(() => {
        console.log(processInstance);
        const serializedState = JSON.stringify({ processInstance, editedPatient });
        sessionStorage.setItem('modProcessState', serializedState);
    }, [processInstance, editedPatient]);

    // Restore state from sessionStorage on component mount here
    useEffect(() => {
        const storedData = sessionStorage.getItem('modProcessState');
        console.log("RESTORING");
        if (storedData) {
            const { processInstance, editedPatient } = JSON.parse(storedData);
            setProcessInstance(processInstance);
            setEditedPatient(editedPatient);
             }
    }, [location.pathname]);

    useEffect(() => {
        const storedData = sessionStorage.getItem('modProcessState');
        console.log("RESTORING");
        if (storedData) {
            const { processInstance, editedPatient } = JSON.parse(storedData);
            setProcessInstance(processInstance);
            setEditedPatient(editedPatient);
             }
    }, []);

    


    return (
        <ProcessModificationContext.Provider value={{
            processInstance,
            editedPatient,
            isLoading,
            error,
            fetchProcessInstance,
            updateProcessDescription,
            updateProcessName,
            updateProcessPatient,
            updateSectionDescription,
            updateSectionName,
            updateStaffAssignments,
            getStaffAssignments,
        }}>
            {children}
        </ProcessModificationContext.Provider>
    );
};

export const useProcessModificationContext = () => useContext(ProcessModificationContext);