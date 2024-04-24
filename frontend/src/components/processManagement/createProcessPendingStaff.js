import React, { useState, useEffect } from "react";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaArrowLeft, FaCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';



export function RoleDropdownContent({ role }) {
  return (
    <div className="flex mx-10 ">
      <div className="flex flex-col w-2/5 text-3xl mt-5">
        <p>Currently Assigned:</p>
        <p className="text-primary mb-2">{role.assigned}</p>
        <button
          className="bg-primary text-white rounded-full px-5 py-3 text-xl shadow self-start border-black border-2 mt-16"
        >
          Auto-Assign
        </button>
      </div>
      <div className="w-3/5 ml-5">
        <p className="text-highlightGreen text-2xl mb-3 mt-5">Available Qualified Staff:</p>
        <div className="border-gray-400 border-2 rounded-lg p-3 overflow-y-auto" style={{ maxHeight: '12rem' }}>
          <table className="w-full text-left">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-primary text-2xl">Name {/*<BiSolidDownArrow />*/}</th>
                <th className="text-primary text-2xl">Title {/*<BiSolidDownArrow />*/}</th>
                <th className="text-primary text-2xl">ID {/*<BiSolidDownArrow />*/}</th>
                <th className="text-primary text-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {role.staff.map((staff, index) => (
                <tr key={index} className={`border-b border-black ${index === role.staff.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-2 text-2xl">{staff.Name}</td>
                  <td>{staff.Title}</td>
                  <td>{staff.ID}</td>
                  <td>
                    <button className="text-xl bg-green-500 hover:bg-green-700 text-white border-black border-2 rounded-full px-3 py-1">
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


export function CreateStaffAssignments({ procedureName, roles, onClose, onProceed }) {
  console.log(roles);
  console.log(procedureName);
  const [openRoles, setOpenRoles] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const allRoles = new Set(roles.map(role => role.name));
  }, []);

  const handleGoBack = () => {
    navigate("/processManagement/newProcess/pendingStaffAssignments");
  };

  const handleProceed = () => {
    navigate("/processManagement/newProcess/pendingStaffAssignments");
  };


  const toggleRole = (roleName) => {
    const newOpenRoles = new Set(openRoles);
    if (newOpenRoles.has(roleName)) {
      newOpenRoles.delete(roleName);
    } else {
      newOpenRoles.add(roleName);
    }
    setOpenRoles(newOpenRoles);
  };

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
          className="mr-10 mt-5 hover:bg-green-700 border-black border-2 flex items-center justify-center bg-highlightGreen text-white rounded-full px-10 py-5 text-4xl"
          style={{ maxWidth: '30%' }}
          onClick={onProceed}
        >
          Proceed
        </button>
      </div>

      <div className="container mx-auto p-8">
        <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold">{procedureName}<span className="text-primary" > - Complete Staff Assignments</span></h2>
        </div>

        <div>
          {roles.map((role) => (
            <div key={role.name} className="py-10 border-b border-primary">
              <div className="flex justify-between items-center">
              <div className="text-3xl font-bold flex items-center">
                  <span>{role.name}</span>
                  {role.assigned ? (
                    <FaCheck className="text-green-500 ml-4 text-4xl" />
                  ) : (
                    <FaRegCalendarTimes className="text-highlightRed ml-4 text-4xl" />
                  )}
                </div>
                <button onClick={() => toggleRole(role.name)} className="flex items-center">
                  {openRoles.has(role.name) ?  <BsChevronUp className='text-4xl' /> : <BsChevronDown className='text-4xl' />}
                </button>
              </div>

              {openRoles.has(role.name) && (
                <div className=" mx-auto mt-16 mb-8 p-2 bg-white rounded-2xl shadow w-4/5">
                 <RoleDropdownContent className="w-1/3" role={role}/>
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
  const { fetchedSections } = useProcessCreation(); // Using the fetched sections from context
  const [openSections, setOpenSections] = useState(new Set(fetchedSections.map(section => section.name)));
  const navigate = useNavigate();
  const [viewAlternateComponent, setViewAlternateComponent] = useState(false);  //change name
  const [selectedProcedure, setSelectedProcedure] = useState(null);


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

  const handleClick = (procedure) => {
    setSelectedProcedure(procedure);
    setViewAlternateComponent(true);  };

  const isFullyAssigned = (procedure) => {
    return procedure.roles.every(role => role.account !== null) &&
           procedure.requiredResources.every(resource => resource.resourceInstance !== null);
  };

  const handleClose = () => {
    setViewAlternateComponent(false);
    setSelectedProcedure(null);
  };

  if (viewAlternateComponent) {
    return <CreateStaffAssignments procedureName={selectedProcedure.procedureName} roles={selectedProcedure.roles}  onClose={handleClose} onProceed={handleClose}/>;
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
                        onClick={() => handleClick(procedure)}
                      >
                        {isFullyAssigned(procedure) ? (
                          <>
                            <FaCheck className="mr-2" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <MdOutlineOpenInNew className="mr-2" />
                            Assignments Required
                          </>
                        )}
                      </button>        
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <button
            className="bg-primary text-white rounded-full px-6 py-2 text-xl shadow hover:bg-primary-dark"
          >
            Auto-Assign All
          </button>
        </div>
      </div>
    </div>
  );
}


export default PendingNewStaff;