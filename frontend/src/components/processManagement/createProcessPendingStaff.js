import React, { useState, useEffect, useMemo  } from "react";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaArrowLeft, FaCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";



export function RoleDropdownContent({ role, eligibleStaff, assignStaff, assignedStaff  }) {

  const handleAssign = (staff) => {
    assignStaff(role.uniqueId, staff);
  };

  return (
    <div className="flex mx-10 ">
      <div className="flex flex-col w-2/5 text-3xl mt-5">
        <p>Currently Assigned:</p>
        <p className="text-primary mb-2">{assignedStaff ? `${assignedStaff.firstName} ${assignedStaff.lastName}` : "Not assigned"}</p>
      </div>
      <div className="w-3/5 ml-5">
        <p className="text-highlightGreen text-2xl mb-3 mt-5">Available Qualified Staff:</p>
        <div className="border-gray-400 border-2 rounded-lg p-3 overflow-y-auto" style={{ maxHeight: '12rem' }}>
          <table className="w-full text-left">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-primary text-2xl">Name</th>
                <th className="text-primary text-2xl">Title</th>
                <th className="text-primary text-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eligibleStaff.map((staff, index) => (
                <tr key={index}>
                  <td className="py-2 text-2xl">{staff.firstName} {staff.lastName}</td>
                  <td className="text-2xl">{staff.position}</td>
                  <td>
                    <button 
                      className="text-xl bg-green-500 hover:bg-green-700 text-white rounded-full px-3 py-1"
                      onClick={() => handleAssign(staff)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CreateStaffAssignments({ sectionId, procedureId, procedureName, roles, onClose, onProceed,
  assignedStaffGlobal, setAssignedStaffGlobal,}) {
  const [openRoles, setOpenRoles] = useState(new Set());
  const [eligibleStaff, setEligibleStaff] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [assignedStaff, setAssignedStaff] = useState({});
  const { assignStaffToRole } = useProcessCreation();



  useEffect(() => {
    if (!roles.length) return;
    const fetchEligibleStaff = async () => {
      const roleIds = roles.map(role => role._id);
      const responses = await Promise.all(roleIds.map(id => axios.get(`/users/accountsByRole/${id}`)));
      const initialStaff = responses.reduce((acc, res, index) => {
        acc[roles[index].uniqueId] = res.data.filter(staff => !assignedStaffGlobal.has(staff._id));
        return acc;
      }, {});
      setEligibleStaff(initialStaff);
      setIsLoading(false);
    };
    fetchEligibleStaff();
  }, [roles, assignedStaffGlobal]);

  const assignStaff = (roleId, staff) => {
    setAssignedStaffGlobal(prev => new Set([...prev, staff._id])); // Add to global assigned list

    const updatedStaff = Object.keys(eligibleStaff).reduce((acc, key) => {
      acc[key] = eligibleStaff[key].filter(s => s._id !== staff._id);
      return acc;
    }, {});
    setEligibleStaff(updatedStaff);
    setAssignedStaff(prev => ({ ...prev, [roleId]: staff }));
  };

  const toggleRole = (uniqueId) => {
    setOpenRoles(prevOpenRoles => {
      const newOpenRoles = new Set(prevOpenRoles);
      if (newOpenRoles.has(uniqueId)) {
        newOpenRoles.delete(uniqueId);
      } else {
        newOpenRoles.add(uniqueId);
      }
      return newOpenRoles;
    });
  };

  const handleSave = () => {
    const allAssigned = roles.every(role => assignedStaff[role.uniqueId]);   
    if (!allAssigned) {
      toast.error("Please assign staff to all roles before saving.");
      return;
    }
  
    // Update the context
    roles.forEach(role => {
      const staffId = assignedStaff[role.uniqueId]._id;
      assignStaffToRole(sectionId, procedureId, role.uniqueId, staffId);
    });
  
    onProceed();
  };

  if (isLoading) return <div>Loading...</div>;


  return (
    <div className="bg-secondary min-h-screen">
     <div className="flex justify-between items-center p-5">
        <button
          className="ml-5 hover:bg-red-900 border-black border-2 flex items-center justify-center bg-primary text-white rounded-full px-5 py-2 text-xl shadow"
          style={{ maxWidth: '30%' }}
          onClick={onClose}
        >
          <FaArrowLeft className="mr-3" />
          Go Back
        </button>

        <button
          className="mr-10 mt-5 hover:bg-green-700 border-black border-2 flex items-center justify-center bg-highlightGreen text-white rounded-full px-7 py-3 text-3xl"
          style={{ maxWidth: '30%' }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      <div className="container mx-auto p-8">
        <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold">{procedureName}<span className="text-primary" > - Complete Staff Assignments</span></h2>
        </div>

        <div>
          {roles.map((role) => (
            <div key={role.uniqueId} className="py-10 border-b border-primary">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold flex items-center">
                  <span>{role.name}</span>
                  {role.account ? (
                    <FaCheck className="text-green-500 ml-4 text-4xl" />
                  ) : (
                    <FaRegCalendarTimes className="text-highlightRed ml-4 text-4xl" />
                  )}
                </div>
                <button onClick={() => toggleRole(role.uniqueId)}>
                  {openRoles.has(role.uniqueId) ? <BsChevronUp className='text-4xl' /> : <BsChevronDown className='text-4xl' />}
                </button>
              </div>
              {openRoles.has(role.uniqueId) && (
                <div className="mx-auto mt-16 mb-8 p-2 bg-white rounded-2xl shadow w-4/5">
                  <RoleDropdownContent
                role={role}
                eligibleStaff={eligibleStaff[role.uniqueId] || []}
                assignStaff={assignStaff}
                assignedStaff={assignedStaff[role.uniqueId]}
              />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavButtons({ onBack, onProceed }) {

    return (
        <div className="flex justify-between items-center mb-5">
            <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
            <h1 className="text-primary text-4xl font-bold">Pending Staff Assignments</h1>
            <button className="hover:bg-green-700 border-black border-2 flex items-center justify-center bg-highlightGreen text-white rounded-full px-7 py-5 text-4xl" onClick={onProceed}>
                Proceed
            </button>
        </div>
    );
}

export function PendingNewStaff() {
  const { fetchedSections } = useProcessCreation(); 
  const [openSections, setOpenSections] = useState(new Set(fetchedSections.map(section => section.name)));
  const navigate = useNavigate();
  const [viewAlternateComponent, setViewAlternateComponent] = useState(false);  //change name
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);  // Add state to track selected section ID
  const [assignedStaffGlobal, setAssignedStaffGlobal] = useState(new Set()); // Store assigned staff IDs globally



  const toggleSection = (sectionName) => {
    const updatedSections = new Set(openSections);
    if (updatedSections.has(sectionName)) {
      updatedSections.delete(sectionName);
    } else {
      updatedSections.add(sectionName);
    }
    setOpenSections(updatedSections);
  };

  const handleGoBack = () => {
    navigate("/processManagement/newProcess/patientForm");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/pendingResourceAssignments");
  };

  const handleClick = (procedure, sectionId) => {  // Pass sectionId as an additional parameter
    setSelectedProcedure(procedure);
    setSelectedSectionId(sectionId);  // Set the selected section ID
    setViewAlternateComponent(true);
  };

  const isFullyAssigned = (procedure) => {
    return procedure.roles.every(role => role.account !== null) &&
           procedure.requiredResources.every(resource => resource.resourceInstance !== null);
  };

  const handleClose = () => {
    setViewAlternateComponent(false);
    setSelectedProcedure(null);
  };

  if (viewAlternateComponent) {
    return <CreateStaffAssignments 
    sectionId={selectedSectionId} procedureId={selectedProcedure._id} 
    procedureName={selectedProcedure.procedureName} roles={selectedProcedure.roles}  
    onClose={handleClose} onProceed={handleClose} assignedStaffGlobal={assignedStaffGlobal}
    setAssignedStaffGlobal={setAssignedStaffGlobal}/>;
  }

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} />
      <div className="bg-secondary border-red-600 border-2 rounded-md p-4">
        <p className="text-left text-lg italic mb-7">
          Assign necessary staff to all procedures:
        </p>
        {fetchedSections.map((section, index) => (
    <div key={index} className="mt-4">
        <button
          className="flex justify-between items-center w-full bg-primary text-white py-2 px-4 rounded-md text-2xl"
          onClick={() => toggleSection(section.sectionName)}
        >
          {section.sectionName}
          {openSections.has(section.sectionName) ? <BsChevronUp /> : <BsChevronDown />}
        </button>
        {openSections.has(section.sectionName) && (
          <div className="bg-white mt-2 p-4 rounded-md">
            {section.procedureTemplates.map((procedure, idx) => (
              <div key={idx} className={`flex justify-between items-center py-2 ${idx < section.procedureTemplates.length - 1 ? 'border-b' : ''} border-black`}>
                <span className='text-2xl'>{procedure.procedureName}</span>
                <div className={`flex items-center text-2xl font-bold ${isFullyAssigned(procedure) ? 'text-green-500' : 'text-highlightRed underline'}`}>
                  <button
                    className="flex items-center text-current p-0 border-none bg-transparent"
                    onClick={() => handleClick(procedure, section._id)}  // Pass the current section ID
                  >
                    {isFullyAssigned(procedure) ? "Assigned" : "Assignments Required"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
))}
        <div className="flex justify-center mt-6">
         {/* <button
            className="bg-primary text-white rounded-full px-6 py-2 text-xl shadow hover:bg-primary-dark"
          >
            Auto-Assign All
</button>*/}
        </div>
      </div>
    </div>
  );
}

export default PendingNewStaff;