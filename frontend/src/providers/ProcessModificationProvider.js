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
            const { data } = response;
    
            const sections = data.sectionInstances.map(section => ({
                ...section,
                procedureInstances: section.procedureInstances.map(proc => ({
                    ...proc,
                    rolesAssignedPeople: proc.rolesAssignedPeople.map(role => ({
                        ...role,
                        accounts: role.accounts,  
                        modified: false
                    }))
                }))
            }));
    
            setProcessInstance(data);
            setEditedPatient(data.patient);
            setStaffAssignments({ sections });

            console.log(sections);
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
        setProcessInstance(prev => ({
            ...prev,
            processName: name
        }));
    }, []);

    const updateProcessPatient = useCallback((patient) => {
        setEditedPatient(patient);
    }, []);

    const updateStaffAssignments = useCallback((sectionId, procedureId, roleId, newAccount) => {
        setStaffAssignments(prevState => {
            return {
                sections: prevState.sections.map(section => {
                    if (section._id === sectionId) {
                        const updatedProcedures = section.procedureInstances.map(proc => {
                            if (proc._id === procedureId) {
                                const updatedRoles = proc.rolesAssignedPeople.map(role => {
                                    if (role._id === roleId) {
                                        return { ...role, accounts: [newAccount], modified: true };
                                    }
                                    return role;
                                });
                                return { ...proc, rolesAssignedPeople: updatedRoles };
                            }
                            return proc;
                        });
                        return { ...section, procedureInstances: updatedProcedures };
                    }
                    return section;
                })
            };
        });
    }, []);


    const getStaffAssignments = useCallback((sectionId, procedureId, roleId) => {
        
        return staffAssignments;
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
        console.log(processInstance);
        console.log(editedPatient);
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

    useEffect(() => {
        const currentPath = location.pathname;
        if (!currentPath.includes("modifyProcess") || currentPath === "/processManagement/modifyProcess/activeProcesses") {
            sessionStorage.removeItem('modProcessState');
            setProcessInstance(null);
            setEditedPatient(null);
            setStaffAssignments({});
        }
    }, [location.pathname]);




    // Persist process state in sessionStorage here
    useEffect(() => {
        const serializedState = JSON.stringify({ processInstance, editedPatient });
        sessionStorage.setItem('modProcessState', serializedState);
    }, [processInstance, editedPatient]);

    // Restore state from sessionStorage on component mount here
    useEffect(() => {
        const storedData = sessionStorage.getItem('modProcessState');
        if (storedData) {
            const { processInstance, editedPatient } = JSON.parse(storedData);
            setProcessInstance(processInstance);
            setEditedPatient(editedPatient);
             }
    }, [location.pathname]);

    useEffect(() => {
        const storedData = sessionStorage.getItem('modProcessState');
        if (storedData) {
            const { processInstance, editedPatient } = JSON.parse(storedData);
            setProcessInstance(processInstance);
            setEditedPatient(editedPatient);

             }
    }, []);

    
    const saveAllChanges = useCallback(async () => {
        if (!processInstance || !editedPatient) {
            console.error("No process instance or patient data available to save.");
            return;
        }
    
        const updateData = {
            processName: processInstance.processName,
            description: processInstance.description,
            patient: {
                _id: editedPatient._id,
                ...editedPatient,
            },
            sections: processInstance.sectionInstances.map(section => ({
                _id: section._id,
                name: section.name,
                description: section.description,
            })),
        };
    
        try {
            const response = await axios.put(`/processInstances/${processInstance._id}`, updateData);
            console.log("Updated process instance:", response.data);
        } catch (error) {
            console.error("Failed to update process instance:", error);
        }
    }, [processInstance, editedPatient]);

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
            staffAssignments,
            saveAllChanges
        }}>
            {children}
        </ProcessModificationContext.Provider>
    );
};

export const useProcessModificationContext = () => useContext(ProcessModificationContext);