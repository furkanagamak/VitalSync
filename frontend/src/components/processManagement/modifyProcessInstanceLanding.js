import React, { useState, useEffect, useCallback } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { BsPencilFill } from "react-icons/bs";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineOpenInNew } from "react-icons/md";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ProcessDeleteModal from "./processDeleteModal";
import { useProcessModificationContext } from '../../providers/ProcessModificationProvider';
import CreateStaffAssignments from './modifyProcessAssignStaff';
import ReviewStaffAssignments from './modifyProcessReviewStaff'
import ReviewResourceAssignments from './modifyProcessReviewResources'
import { ClipLoader } from "react-spinners";
import axios from 'axios';
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import {IconButton} from "@mui/material";
import { FaCheck } from 'react-icons/fa';





function ProcedureDropdown(){

  const navigate = useNavigate();

  const handleAddNewProcedure = () => navigate("/processManagement/modifyProcess/modifyProcedure");

  const handleUseExistingTemplate = () => navigate("/processManagement/modifyProcess/addProcedure");

    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative mr-5">
      <button
      title="Open Section"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white flex justify-between items-center rounded-t-2xl px-4 py-2 w-full mt-10 text-3xl"
      >
        Add Procedure
        <BsChevronDown title="Open Section" className="text-white cursor-pointer" />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full z-10">
          <div className="bg-white rounded-b-xl shadow">
            <div onClick={handleAddNewProcedure} className="flex items-center justify-between px-4 py-2 border-b border-black text-2xl">
              Create from new template
              <button className="text-primary"><FiPlusCircle /></button>
            </div>
            <div className="flex items-center justify-between px-4 py-2 text-2xl">
              Create from existing template
              <button onClick={handleUseExistingTemplate} className="text-primary"><FiPlusCircle /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




export function ModifyProcessLanding() {

  const { processID } = useParams();
  const { processInstance, fetchProcessInstance, isLoading, error, updateProcessDescription
  , updateProcessName, editedPatient, saveAllChanges,
  updateSectionDescription, updateSectionName,getStaffAssignments,staffAssignments,
deletedProcedures, markProcedureAsDeleted } = useProcessModificationContext();

    

    useEffect(() => {
      if (!processInstance && processID) { // Only fetch if processInstance is not already set
          fetchProcessInstance(processID);
      }

    }, [processInstance, fetchProcessInstance]);


  const [currentView, setCurrentView] = useState('modifyProcess'); // State to manage views
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [description, setDescription] = useState('');
  const [editDescriptionMode, setEditDescriptionMode] = useState(false);

  const [processName, setProcessName] = useState('');
  const [editNameMode, setEditNameMode] = useState(false);



  const [openSections, setOpenSections] = useState(new Set(processInstance?.sectionInstances?.map(section => section.name) || []));
  const [sectionInstances, setSectionInstances] = useState(processInstance?.sectionInstances || []);

  const [sectionDescriptions, setSectionDescriptions] = useState({});
  const [sectionNames, setSectionNames] = useState({});

  const[procedureResourceAssignmentsView, setProcedureResourceAssignmentsView] = useState('');
  const[procedureStaffAssignmentsView, setProcedureStaffAssignmentsView] = useState('');

  const[sectionReviewStaff, setSectionReviewStaff] = useState('');
  const[sectionReviewResources, setSectionReviewResources] = useState('');



  useEffect(() => {
    if (processInstance) {
      setDescription(processInstance.description);
      setProcessName(processInstance.processName);
      setOpenSections(new Set(processInstance.sectionInstances?.map(section => section.name)));
      setSectionInstances(processInstance.sectionInstances || []);
    }
  }, [processInstance]);

  useEffect(() => {
    if (sectionInstances) {
      const sectionDescs = sectionInstances.reduce((acc, section) => {
        acc[section.name] = { editMode: false, description: section.description };
        return acc;
      }, {});
      setSectionDescriptions(sectionDescs);

      const sectionNamesNew = sectionInstances.reduce((acc, section) => {
        acc[section._id] = { editing: false, name: section.name };
        return acc;
      }, {});
      setSectionNames(sectionNamesNew);
    }
  }, [sectionInstances]);
  
    const handleDelete = async () => {
      setShowDeleteModal(false);
      try {
        const response = await axios.delete(`/processInstances/${processID}`);
        console.log('Process instance deleted successfully:', response.data);
        toast.success("Process instance successfully deleted. Affected staff have been notified.")
      } catch (error) {
        console.error('Failed to delete the process instance:', error.response ? error.response.data : error.message);
        toast.error("Failed to delete process instance, please try again.")
      }
      navigate("/processManagement/modifyProcess/activeProcesses")
    };
  
    const handleCancel = () => {
      setShowDeleteModal(false);
    };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/processManagement/modifyProcess/activeProcesses");
  };

  const handleSaveChanges = async () => {
    await saveAllChanges();  
   navigate("/processManagement/modifyProcess/activeProcesses");
};





  const handleReviewStaffAssignments = (section) => {
    console.log(section);
      setSectionReviewStaff([section]); 
  
  };

  const handleReviewStaffAssignmentsBack = () => {
    setSectionReviewStaff('');
  }

  const handleReviewResourcesAssignments = (section) => {
    console.log(section);
      setSectionReviewResources([section]); 
  
  };

  const handleReviewResourcesAssignmentsBack = () => {
    setSectionReviewResources('');
  }




  const handleModifyResourceAssignments = (procedure) => {
    setProcedureResourceAssignmentsView(procedure);
  };

  const handleModifyStaffAssignments = (procedure) => {
    setProcedureResourceAssignmentsView(procedure);
  };
  const handleCloseModifyStaffAssignments = () => {
    setProcedureResourceAssignmentsView('');
    console.log(staffAssignments);
  }

/*
  const handleModifyProcedure = () => {
    navigate("/processManagement/modifyProcess/modifyProcedure");
  };

  const handleAddSection = () => {
    navigate("/processManagement/modifyProcess/addSection");
  };*/

  // Toggle section function
  const toggleSection = (sectionName) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionName)) {
      newOpenSections.delete(sectionName);
    } else {
      newOpenSections.add(sectionName);
    }
    setOpenSections(newOpenSections);
  };



  const handleProcessDescriptionEditClick = () => {
    setEditDescriptionMode(true);
  };

  const handleProcessDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProcessDescriptionSave = () => {
    updateProcessDescription(description);
    setEditDescriptionMode(false);
  };

  const handleProcessNameEditClick = () => {
    setEditNameMode(true);
  };

  const handleProcessNameChange = (event) => {
    setProcessName(event.target.value);
  };

  const handleProcessNameSave = () => {
    updateProcessName(processName);
    setEditNameMode(false);
  };

  const handlePatientEditClick = () => {
    navigate("/processManagement/modifyProcess/patientForm", { state: { from: '/processManagement/modifyProcess/landing' } });
  };



  const handleSectionDescEditClick = (sectionName) => {
    setSectionDescriptions(prev => ({
      ...prev,
      [sectionName]: { ...prev[sectionName], editMode: true }
    }));
  };
  
  const handleSectionDescChange = (event, sectionName) => {
    const newDesc = event.target.value;
    setSectionDescriptions(prev => ({
      ...prev,
      [sectionName]: { ...prev[sectionName], description: newDesc }
    }));
  };
  
  const handleSaveSectionDesc = (sectionName) => {
    const newDescription = sectionDescriptions[sectionName].description;
    updateSectionDescription(sectionName, newDescription); 
    setSectionDescriptions(prev => ({
      ...prev,
      [sectionName]: { ...prev[sectionName], editMode: false }
    }));
  };


  const handleSectionEditClick = (sectionId) => {
    setSectionNames(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], editing: true }
    }));
  };
  
  const handleSectionNameChange = (event, sectionId) => {
    const newName = event.target.value;
    setSectionNames(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], name: newName }
    }));
  };
  
  const handleSectionNameSave = (sectionId) => {
    const newName = sectionNames[sectionId].name;
    updateSectionName(sectionId, newName); 
    setSectionNames(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], editing: false }
    }));
  };


  if (!processInstance) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }

  else if (procedureResourceAssignmentsView) {
    return  < CreateStaffAssignments  onClose={handleCloseModifyStaffAssignments} modifyProcedure={procedureResourceAssignmentsView}/> ;
  }

  else if (sectionReviewStaff.length>0) {
    console.log(sectionReviewStaff);
    return  < ReviewStaffAssignments  onBack={handleReviewStaffAssignmentsBack} sections={sectionReviewStaff}/> ;
  
  }
  else if (sectionReviewResources.length>0) {
    console.log(sectionReviewResources);
    return  < ReviewResourceAssignments  onBack={handleReviewResourcesAssignmentsBack} sections={sectionReviewResources}/> ;
  
  }

  else if (currentView === 'modifyProcess') {

  return (
  <>{showDeleteModal && (
    <ProcessDeleteModal
    processName={processInstance ? processName : 'Loading process name...'}
    patientName={editedPatient ? editedPatient.fullName : 'Loading patient data...'}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  )}
    <div className="flex flex-col gap-6 py-14">     {/*Header*/}
    
        <div className="flex justify-between items-start text-4xl">
            {/* Left Section- Go Back button and Add Section */}
            <div className="flex flex-col gap-4 w-1/4">
                <button 
                    className="w-3/5 ml-10 bg-primary text-white rounded-full px-5 py-5 text-3xl flex items-center drop-shadow-2xl"
                    onClick={handleGoBack}
                    title="Go Back"
                >   
                    <FaArrowLeft className="mr-3" /><span className="mx-auto">Go Back</span>
                </button>
                {/*<div className="flex items-center ml-12">
                    <h1 className="text-black text-3.5xl font-bold">Add Section</h1>
                    <CiCirclePlus 
                      className="text-highlightGreen ml-2 mt-1 cursor-pointer" 
                      style={{ fontSize: '3.5rem' }} 
                    />
</div>*/}
            </div>

        {/* Middle Section- Process, Patient, ProcessID labels*/}
            <div className="w-1/2 mt-5 flex flex-col">
            <span className="flex items-center pl-15">
            <span className="text-primary underline font-bold mr-5 mb-4">Process:</span>
            {editNameMode ? (
              // Text field and Save button when in edit mode
              <>
                <input
                  type="text"
                  id="editProcessNameField"

                  value={processName}
                  onChange={handleProcessNameChange} 
                  className="text-primary mr-3 px-2 py-1 rounded w-3/5"
                />
                <button
                                  id="editProcessNameSave"
                  title="Save Process Name"
                  className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
                  onClick={handleProcessNameSave}
                >
                  Save
                </button>
              </>
            ) : (
              // Display mode with the process name and pencil icon
              <>
                <span className="text-primary font-bold mr-3 mb-3">{processName}</span>
                <button
                  id="editProcessName"
                  className="text-primary mb-2"
                  onClick={handleProcessNameEditClick}
                  title="Edit Process Name"

                >
                  <BsPencilFill className="text-2xl"/>
                </button>
              </>
            )}
          </span>

            <span className="flex items-center pl-15"><span className="text-primary underline font-bold mr-5 ">Patient:</span>   {editedPatient ? editedPatient.fullName : 'Loading patient data...'} <BsPencilFill  title="Edit Patient Info" onClick={handlePatientEditClick} className=" text-2xl text-primary ml-3"/></span>
            <div className="flex items-center pl-15 mt-3"><span className="text-primary underline font-bold mr-5">Process ID:</span>  {processInstance.processID} </div>
            </div>

        {/* Right Section- Description edit */}
            <div className="flex flex-col pl-20 w-2/5 mt-5 ml-5">
            <div className="flex items-center">
            {editDescriptionMode ? (
          <button onClick={handleProcessDescriptionSave}                   title="Save Process Description"
          className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark mb-2">
            Save
          </button>
        ) : ( 
          <span className="flex items-center mb-3"> Description 
          <BsPencilFill onClick={handleProcessDescriptionEditClick} title="Edit Process Description" className="text-2xl ml-4 text-primary cursor-pointer" /></span>
        )}
            </div>
            <textarea
                className="bg-white border-4 border-primary text-primary p-4 rounded text-2xl"
                style={{ height: '10rem', width: '85%' }}
                value={description}
                onChange={handleProcessDescriptionChange}
                readOnly={!editDescriptionMode}
            />
            </div>
        </div>
        <div className="border-b border-gray-700 w-full mt-5"></div>


      {/* Sections- Title, dropdown, delete button */}  
      <div className="overflow-y-auto">
        {sectionInstances.map((section) => (
          <div key={section._id} className="border-b border-gray-300">
              <div className="flex justify-between items-center p-10">
                            
              {sectionNames[section._id]?.editing ? (
        <>
        <span>
          <input
            type="text"
            value={sectionNames[section._id]?.name}
            onChange={(e) => handleSectionNameChange(e, section._id)}
            className="text-3xl font-bold px-2 py-1 rounded w-3/5"
          />
          <button
            onClick={() => handleSectionNameSave(section._id)}
            title="Save Section Name"
            className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark mx-5"
          >
            Save
          </button>
          </span>
        </>
      ) : (
        <>
          <span className="text-4xl font-bold">{sectionNames[section._id]?.name}
          <button
            onClick={() => handleSectionEditClick(section._id)}
            className="text-primary ml-4"
            title="Edit Section Name"
          >
            <BsPencilFill className="text-3xl"/>
          </button></span>
          
        </>
      )}
                              
              <div className="flex items-center">
                <button id="openSection" onClick={() => toggleSection(section.name)} className="flex items-center" >
                  {openSections.has(section.name) ? <BsChevronUp title="Close Section" className="text-4xl cursor-pointer" /> : <BsChevronDown title="Open Section" className="text-4xl cursor-pointer" />}
                </button>
                {/*<FaTrashAlt className="text-3xl ml-10 text-primary" />*/}
              </div>
            </div>

            {openSections.has(section.name) && (
              <div className="p-4 flex">
                {/* Left Section Content */}
                <div className="w-1/4 ml-10 mr-8">
                  <div className="flex flex-col w-full mt-5">
                    <div className="flex items-center mb-4">
                              <p className="text-primary text-3xl font-bold  underline">Description</p>
                          <BsPencilFill className="ml-3 text-primary text-xl" title="Edit Section Description" onClick={() => handleSectionDescEditClick(section.name)} />
                        </div>
                        <textarea
                          className="bg-white border-4 border-primary text-primary p-4 rounded text-2xl"
                          style={{ height: '10rem', width: '85%' }}
                          value={sectionDescriptions[section.name]?.description}
                          onChange={(e) => handleSectionDescChange(e, section.name)}
                          readOnly={!sectionDescriptions[section.name]?.editMode}
                        />
                        {sectionDescriptions[section.name]?.editMode && (
                          <button onClick={() => handleSaveSectionDesc(section.name)} title="Save Section Description" className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark mt-2">
                            Save
                          </button>
                        )}
                    </div>
                  
                  
                  </div>
                {/* Middle Section Content */}
                {section.procedureInstances && (
    <div className="mt-6 w-3/5 mr-20">
        <p className="text-4xl font-bold mb-4 text-primary underline">Procedures</p>
        {section.procedureInstances.map((procedure, index) => {
            const isDeleted = deletedProcedures.some(deletedSection => 
                deletedSection._id === section._id && 
                deletedSection.procedureInstances.some(proc => proc._id === procedure._id && proc.deleted)
            );
            const isCompleted = deletedProcedures.some(deletedSection => 
                deletedSection._id === section._id && 
                deletedSection.procedureInstances.some(proc => proc._id === procedure._id && proc.completed)
            );
            const isInProgress = processInstance.currentProcedure && procedure._id === processInstance.currentProcedure._id;
            console.log(procedure._id);
            console.log(processInstance.currentProcedure._id);

            return (
                <div 
                    key={index} 
                    className={`flex items-center justify-between border-b-2 border-black ${isDeleted || isCompleted ? 'opacity-30' : ''}`}
                >
                    <div className="flex-1 flex items-center">
                        <span className="text-3xl pl-2 font-bold py-4 mr-10">
                            {procedure.procedureName}
                            {isInProgress && <span className="ml-2 text-highlightGreen text-xl">(In Progress)</span>}
                        </span>
                    </div>
                    {isCompleted ? (
                        <FaCheck className="text-green-500 text-3xl" />
                    ) : (
                        <IconButton
                            onClick={() => markProcedureAsDeleted(section._id, procedure._id)}
                            color="error"
                            title="Mark/Unmark for Deletion"
                        >
                            {isDeleted ? (
                                <RestoreFromTrashIcon />
                            ) : (
                                <DeleteIcon />
                            )}
                        </IconButton>
                    )}
                </div>
            );
        })}
    </div>
)}


                {/* Right Section Content */}
                <div className="w-1/4  mr-10">
                <div className="flex flex-col mt-4">

                <button 
      className="hover:bg-green-600 ml-10 bg-highlightGreen text-white rounded-full px-7 py-2 text-lg flex justify-between items-center mb-5 drop-shadow-xl"
      onClick={() => handleReviewResourcesAssignments(staffAssignments.sections.find(staffSection => staffSection._id === section._id))}
    >
      <span className="text-center flex-auto">
        View Resource Assignments
      </span>
      <MdOutlineOpenInNew className="ml-1 text-xl" />
    </button>
    <button 
      className="hover:bg-green-600 ml-10 bg-highlightGreen text-white rounded-full px-7 py-2 text-lg flex justify-between items-center drop-shadow-xl"
      onClick={() => handleReviewStaffAssignments(staffAssignments.sections.find(staffSection => staffSection._id === section._id))}
    >
      <span className="text-center flex-auto">
        View Staff Assignments
      </span>
      <MdOutlineOpenInNew className="ml-1 text-xl" />
    </button>
                  </div>
                  {/*<ProcedureDropdown />*/}
                </div>
              </div>
            )}
          </div>
        ))}       
      </div>
      <div className="flex justify-evenly items-center mt-10 p-4 w-2/5 mx-auto">
      <button 
          className="hover:bg-red-600 flex items-center justify-center bg-highlightRed text-white rounded-3xl px-7 py-5 text-3xl drop-shadow-2xl" 
          onClick={() => setShowDeleteModal(true)}> 
          Delete Process
      </button>
        <button 
          className="flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl hover:bg-green-600 drop-shadow-2xl" 
          onClick={handleSaveChanges}>
          Save Changes
    </button>
    </div>
    </div>
    </>
  );}    

}