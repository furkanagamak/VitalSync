import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";


const ProcessModificationContext = createContext();

export const ProcessModificationProvider = ({ children }) => {
    const [processInstance, setProcessInstance] = useState(null);
    const [editedPatient, setEditedPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [staffAssignments, setStaffAssignments] = useState({}); 
    const [deletedProcedures, setDeletedProcedures] = useState([]);
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

            const initialDeletedProcedures = sections.map(section => ({
            _id: section._id,
            procedureInstances: section.procedureInstances.map(proc => ({
                _id: proc._id,
                deleted: false,
                completed: proc.rolesAssignedPeople.length === proc.peopleMarkAsCompleted.length 
            }))
        }));
    
            console.log(initialDeletedProcedures);
            setProcessInstance(data);
            setEditedPatient(data.patient);
            setStaffAssignments({ sections });
            setDeletedProcedures(initialDeletedProcedures);

            //console.log(data);
           // console.log(data.patient);
            //console.log({ sections });
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            console.error('Failed to fetch process instance:', err);
        }
    }, []);

    const markProcedureAsDeleted = useCallback((sectionId, procedureId) => {
        setDeletedProcedures(prev => prev.map(section => {
            if (section._id === sectionId) {
                return {
                    ...section,
                    procedureInstances: section.procedureInstances.map(proc => {
                        if (proc._id === procedureId) {
                            return { ...proc, deleted: !proc.deleted }; 
                        }
                        return proc;
                    })
                };
            }
            return section;
        }));
        console.log(deletedProcedures);
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
    
        // Extract IDs of deleted procedures from each section
        let deleteEntireProcess = true; // Initialize to true and check conditions
        const deletedProcedureIds = deletedProcedures.flatMap(section =>
            section.procedureInstances
                .filter(proc => proc.deleted)  // Only include procedures that are marked as deleted
                .map(proc => {
                    deleteEntireProcess = deleteEntireProcess && true; // Keep it true if all procedures are deleted
                    return proc._id;
                })
        );
    
        // Check if any procedure is not marked for deletion
        deletedProcedures.forEach(section => {
            section.procedureInstances.forEach(proc => {
                if (!proc.deleted) {
                    deleteEntireProcess = false;
                }
            });
        });
    
        console.log(deletedProcedureIds);
        console.log("Delete entire process:", deleteEntireProcess);
        
        if (deleteEntireProcess && deletedProcedureIds.length > 0) {
        try {
            const deleteResponse = await axios.delete(`/processInstances/${processInstance.processID}`);
            console.log("Deleted process instance:", deleteResponse.data);
            toast.success("Process instance deleted!");
        } catch (error) {
            console.error("Failed to delete process instance:", error);
            toast.error("Failed to delete process instance. Please try again");
        }
    } else {
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
            deletedProcedures: deletedProcedureIds 
        };

        try {
            const response = await axios.put(`/processInstances/${processInstance._id}`, updateData);
            console.log("Updated process instance:", response.data);
            toast.success("Process changes saved!");
        } catch (error) {
            console.error("Failed to update process instance:", error);
            toast.error("Failed to update process instance. Please try again");
        }
    }
}, [processInstance, editedPatient, deletedProcedures]);


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
            saveAllChanges,
            deletedProcedures,
            markProcedureAsDeleted,
        }}>
            {children}
        </ProcessModificationContext.Provider>
    );
};

export const useProcessModificationContext = () => useContext(ProcessModificationContext);