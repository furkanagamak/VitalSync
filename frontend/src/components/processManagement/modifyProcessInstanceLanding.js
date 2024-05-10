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



const notify = () => toast.success("Process successfully deleted! Affected staff have been notified.");


const sections = [
    {
      name: "Preoperative",
      description: "Details about Preoperative section",
      procedures: ["General Anesthesia", "IV Access", "Laparoscopic Surgery", "Catheter Placement"]
    },
    {
      name: "Intraoperative",
      description: "Surgical procedure including anesthesia and monitoring.",
      procedures: ["Monitoring", "Incision", "Tissue Handling"]
    },
    {
      name: "Postoperative",
      description: "Details about Postoperative section",
      procedures: ["Pain Management", "Wound Care", "Physical Therapy"]
    }
  ];


function ProcedureDropdown(){

  const navigate = useNavigate();

  const handleAddNewProcedure = () => navigate("/processManagement/modifyProcess/modifyProcedure");

  const handleUseExistingTemplate = () => navigate("/processManagement/modifyProcess/addProcedure");

    const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative mr-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white flex justify-between items-center rounded-t-2xl px-4 py-2 w-full mt-10 text-3xl"
      >
        Add Procedure
        <BsChevronDown className="text-white cursor-pointer" />
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
  updateSectionDescription, updateSectionName,getStaffAssignments,staffAssignments } = useProcessModificationContext();

    

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
      setOpenSections(new Set(processInstance.sectionInstances?.slice(0, 1).map(section => section.name)));
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
  
    const handleDelete = () => {
      setShowDeleteModal(false);
      notify();
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
toast.success("Process successfully modified!"); 
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
                    className="w-2/5 ml-10 bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center"
                    onClick={handleGoBack}
                >   
                    <FaArrowLeft className="mr-3" />Go Back
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
                >
                  <BsPencilFill />
                </button>
              </>
            )}
          </span>

            <span className="flex items-center pl-15"><span className="text-primary underline font-bold mr-5 mb-4 ">Patient:</span>   {editedPatient ? editedPatient.fullName : 'Loading patient data...'} <BsPencilFill onClick={handlePatientEditClick} className="text-primary ml-3"/></span>
            <div className="flex items-center pl-15"><span className="text-primary underline font-bold mr-5">Process ID:</span>  {processInstance.processID} </div>
            </div>

        {/* Right Section- Description edit */}
            <div className="flex flex-col pl-20 w-2/5 mt-5">
            <div className="flex items-center">
            {editDescriptionMode ? (
          <button onClick={handleProcessDescriptionSave} className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark mb-2">
            Save
          </button>
        ) : ( 
          <span className="flex items-center mb-3"> Description 
          <BsPencilFill onClick={handleProcessDescriptionEditClick} className="ml-4 text-primary cursor-pointer" /></span>
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
          >
            <BsPencilFill />
          </button></span>
          
        </>
      )}
                              
              <div className="flex items-center">
                <button id="openSection" onClick={() => toggleSection(section.name)} className="flex items-center">
                  {openSections.has(section.name) ? <BsChevronUp className="text-4xl cursor-pointer" /> : <BsChevronDown className="text-4xl cursor-pointer" />}
                </button>
                {/*<FaTrashAlt className="text-3xl ml-10 text-primary" />*/}
              </div>
            </div>

            {openSections.has(section.name) && (
              <div className="p-4 flex">
                {/* Left Section Content */}
                <div className="w-1/4 ml-10 mr-8">
                  <div className="flex flex-col w-full mt-5">
                    <div className="flex items-center">
                              <p className="text-primary text-3xl font-bold mb-4 underline">Description</p>
                          <BsPencilFill className="ml-3 text-primary mb-4 text-2xl" onClick={() => handleSectionDescEditClick(section.name)} />
                        </div>
                        <textarea
                          className="bg-white border-4 border-primary text-primary p-4 rounded text-2xl"
                          style={{ height: '10rem', width: '85%' }}
                          value={sectionDescriptions[section.name]?.description}
                          onChange={(e) => handleSectionDescChange(e, section.name)}
                          readOnly={!sectionDescriptions[section.name]?.editMode}
                        />
                        {sectionDescriptions[section.name]?.editMode && (
                          <button onClick={() => handleSaveSectionDesc(section.name)} className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark mt-2">
                            Save
                          </button>
                        )}
                    </div>
                  
                  
                  </div>
                {/* Middle Section Content */}
                {section.procedureInstances && (
                  <div className="mt-6 w-3/5 mr-20">
                    <p className="text-4xl font-bold mb-4 text-primary underline">Procedures</p>
                    {section.procedureInstances.map((procedure, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between border-b-2 border-black}`}>
                        {/* REORDERING <HiMiniArrowsUpDown className=" text-primary text-3xl" />*/}
                        <span className="flex-1 text-3xl pl-2 font-bold py-4 mr-10">{procedure.procedureName}</span>
                       {/*MODIFY ASSIGNMENT BUTTONS <button className="flex items-center text-highlightGreen underline text-xl mr-10" onClick={() => handleModifyStaffAssignments(procedure)}>
                      <span>Staff Assignments</span>
                      <BsPencilFill className="ml-2" />
                    </button>                        

                    <button className="flex items-center text-highlightGreen underline text-xl mr-10" onClick={() => handleModifyResourceAssignments(procedure)}>
                      <span>Resource Assignments</span>
                      <BsPencilFill className="ml-2" />
                    </button>*/}
                        <span className="flex items-center">
                          {/*<button disable={true}  className ="text-primary text-2xl ml-2">Modify</button>
                          <MdOutlineOpenInNew className="text-primary ml-1 mr-6 text-3xl" />
                    <FaTrashAlt className="text-primary mx-2 text-3xl" />*/}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Right Section Content */}
                <div className="w-1/4  mr-10">
                <div className="flex flex-col mt-4">
                    <button className="flex justify-evenly bg-highlightGreen text-white rounded-full px-5 py-2 text-xl flex items-center  mt-5"
                    onClick={() => handleReviewResourcesAssignments(staffAssignments.sections.find(staffSection => staffSection._id === section._id))} >
                      <MdOutlineOpenInNew className="mr-2" />
                      <span className="mx-auto">
                      Review Resource Assignments </span>
                    </button>
                    <button 
  className="bg-highlightGreen text-white rounded-full px-5 py-2 text-xl flex items-center mt-5 mb-5 flex justify-evenly"
  onClick={() => handleReviewStaffAssignments(staffAssignments.sections.find(staffSection => staffSection._id === section._id))}
>
  <MdOutlineOpenInNew className="mr-2" />
  Review Staff Assignments
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
      {/*<button 
          className="flex items-center justify-center bg-highlightRed text-white rounded-3xl px-7 py-5 text-3xl" 
          onClick={() => setShowDeleteModal(true)}> 
          Delete Process
      </button>*/}
        <button 
          className="flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl" 
          onClick={handleSaveChanges}>
          Save Changes
    </button>
    </div>
    </div>
    </>
  );}    

}