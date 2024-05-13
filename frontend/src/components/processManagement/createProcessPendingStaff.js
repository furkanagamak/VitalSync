import React, { useState, useEffect, useMemo  } from "react";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaArrowLeft, FaCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useProcessCreation } from '../../providers/ProcessCreationProvider';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import moment from 'moment'; 
import { ClipLoader } from "react-spinners";





export function RoleDropdownContent({ role, eligibleStaff, assignStaff, assignedStaff  }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleAssign = (staff) => {
    assignStaff(role.uniqueId, staff);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStaff = eligibleStaff.filter(staff =>
    `${staff.firstName.toLowerCase()} ${staff.lastName.toLowerCase()}`.includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="flex mx-10 mb-5">
      <div className="flex flex-col w-2/5 text-3xl mt-5">
        <p>Currently Assigned:</p>
        <p className="text-primary mb-2">{assignedStaff ? `${assignedStaff.firstName} ${assignedStaff.lastName}` : "Not assigned"}</p>
      </div>
      <div className="w-3/5 ml-5">
        <p className="text-highlightGreen text-2xl mb-3 mt-5">Available Qualified Staff:</p>
        <input
          type="text"
          placeholder="Search by Name or Position..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-3 px-2 py-1 border-gray-400 border-2 rounded w-2/5"
        />
        {filteredStaff.length > 0 ? (
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
                {filteredStaff.map((staff, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid black' }}>
                    <td className="py-2 text-2xl">{staff.firstName} {staff.lastName}</td>
                    <td className="text-2xl">{staff.position}</td>
                    <td>
                      <button 
                        className="mb-1 text-xl bg-green-500 hover:bg-green-700 text-white rounded-full px-3 py-1"
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
        ) : (
          <p className="text-xl text-red-500">No other qualified staff available at this time.</p>

        )}
      </div>
    </div>
  );
}

export function CreateStaffAssignments({ sectionId, procedureId, procedureName, roles, onClose, onProceed,
  startTime, endTime}) {
  const [openRoles, setOpenRoles] = useState(new Set());
  const [eligibleStaff, setEligibleStaff] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [assignedStaff, setAssignedStaff] = useState({});
  const { assignStaffToRole } = useProcessCreation();

    console.log(sectionId, procedureId, procedureName, roles, startTime, endTime);

    /*
    Example params
    
    1714672621859 '6633c1336cb7a3ffe11298e0' 'ProcedureName'
    [
    {
        "_id": "6633c1336cb7a3ffe11298ce",
        "name": "Name",
        "description": "Description",
        "uniqueIdentifier": "UniqueIdentifier",
        "__v": 0,
        "uniqueId": "6633c1336cb7a3ffe11298ce-zlbl",
        "account": null
    }
]
'2024-05-03T02:57:00.000Z'*/

useEffect(() => {
  const allRoleIds = new Set(roles.map(role => role.uniqueId));
  setOpenRoles(allRoleIds);
}, [roles]);

  useEffect(() => {
    if (!roles.length) return;
    const fetchEligibleStaff = async () => {
      const procedureDate = moment(startTime);
      const dayOfWeek = procedureDate.format('dddd');
      
      const roleIds = roles.map(role => role._id);
try {
  const responses = await Promise.all(roleIds.map(id => axios.get(`/users/accountsByRole/${id}`)));
  const initialStaff = responses.reduce((acc, res, index) => {
    acc[roles[index].uniqueId] = res.data.filter(staff => {
      if (staff.isTerminated) return false;
      const assignedInProcedure = Object.values(assignedStaff).some(assigned => assigned._id === staff._id);
      if (assignedInProcedure) return false;

      const userUsualHours = staff.usualHours.find(uh => uh.day === dayOfWeek);
      if (!userUsualHours) return false;

      const workStart = moment(`${procedureDate.format('YYYY-MM-DD')}T${userUsualHours.start}`);
      let workEnd = moment(`${procedureDate.format('YYYY-MM-DD')}T${userUsualHours.end}`);

      if (userUsualHours.end === "23:59") {
        workEnd = workEnd.add(20, 'minutes');
      }

      if (workEnd.isBefore(workStart)) {
        workEnd = workEnd.add(1, 'days');
      }

      const procStart = moment(startTime);
      let procEnd = moment(endTime);
      if (procEnd.isBefore(procStart)) {
        procEnd = procEnd.add(1, 'days');
      }

      const gracePeriod = moment.duration(20, 'minutes');
      if (!workStart.isBefore(procStart) || !workEnd.clone().add(gracePeriod).isAfter(procEnd)) {
        //console.log("Work hours didn't cover", staff.firstName, workStart.format(), procStart.format(), workEnd.format(), procEnd.format());
        return false;
      }

      return !staff.unavailableTimes.some(unavailable => {
        const unavailableStart = moment(unavailable.start);
        const unavailableEnd = moment(unavailable.end);
        return procStart.isBefore(unavailableEnd) && procEnd.isAfter(unavailableStart);
      });
    });
    return acc;
  }, {});
  setEligibleStaff(initialStaff);
} catch (error) {
  console.error("Failed to fetch staff:", error);
}
      setIsLoading(false);
    };
    fetchEligibleStaff();
  }, [roles, startTime, endTime]);


  const assignStaff = (roleId, staff) => {
    const previouslyAssignedStaff = assignedStaff[roleId];

    // Update assigned staff
    setAssignedStaff(prev => ({ ...prev, [roleId]: staff }));

    // Remove newly assigned staff from all eligible lists
    const updatedStaff = Object.keys(eligibleStaff).reduce((acc, key) => {
        acc[key] = eligibleStaff[key].filter(s => s._id !== staff._id);
        return acc;
    }, {});
    setEligibleStaff(updatedStaff);

    // If there was previously assigned staff, add them back to the eligible lists where appropriate
    if (previouslyAssignedStaff) {
        const updatedEligibleStaff = { ...updatedStaff };
        roles.forEach(role => {
            if (!updatedEligibleStaff[role.uniqueId].find(s => s._id === previouslyAssignedStaff._id)) {
                updatedEligibleStaff[role.uniqueId].push(previouslyAssignedStaff);
            }
        });
        setEligibleStaff(updatedEligibleStaff);
    }
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }

const autoAssignStaff = () => {
    let updatedEligibleStaff = { ...eligibleStaff };
    let updatedAssignedStaff = { ...assignedStaff };

    roles.forEach(role => {
        const roleEligibleStaff = updatedEligibleStaff[role.uniqueId];
        const availableStaff = roleEligibleStaff.filter(staff => !updatedAssignedStaff[role.uniqueId]);

        if (availableStaff.length > 0 && !updatedAssignedStaff[role.uniqueId]) {
            updatedAssignedStaff[role.uniqueId] = availableStaff[0];
            // Remove the assigned staff from all eligible lists to prevent reassignment
            Object.keys(updatedEligibleStaff).forEach(key => {
                updatedEligibleStaff[key] = updatedEligibleStaff[key].filter(staff => staff._id !== availableStaff[0]._id);
            });
        }
    });

    // Update state after all assignments are processed
    setAssignedStaff(updatedAssignedStaff);
    setEligibleStaff(updatedEligibleStaff);
};

const startDate = new Date(startTime);
const endDate = new Date(endTime);

// Define options for displaying date and time
const options = {
  day: '2-digit',      
  month: '2-digit',    
  year: 'numeric',    
  hour: '2-digit',     
  minute: '2-digit',   
  hour12: false     
};

const formattedStartTime = startDate.toLocaleString('en-US', options);
const formattedEndTime = endDate.toLocaleString('en-US', options);


  return (
    <div className="bg-secondary min-h-screen">
     <div className="flex justify-between items-center p-5">
        <button
          className="ml-5 bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center"
          style={{ maxWidth: '30%' }}
          onClick={onClose}
        >
          <FaArrowLeft className="mr-3" />
          Go Back
        </button>
        <button className="bg-blue-500 text-white text-xl py-2 px-4 rounded-full" onClick={autoAssignStaff}>
          Auto-Assign All
        </button>
        <button

          className="hover:bg-green-600 mr-10 mt-5 bg-highlightGreen text-white text-2xl py-4 px-16 rounded-3xl"
          style={{ maxWidth: '30%' }}
          onClick={handleSave}
        >
          Save
        </button>
        
      </div>

      <div className="container mx-auto p-8">
        <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold mb-5 ">{procedureName}<span className="text-primary" > - Complete Staff Assignments</span></h2>
          <div className="flex flex-col text-lg my-2 text-primary font-bold">
          <span>Start Time: {formattedStartTime}</span>
          <span>End Time: {formattedEndTime}</span>
          </div>
        </div>
        <p className="mt-1 text-highlightRed text-lg">Please note that auto-assigning may result in incomplete assignments based on staff eligible roles and availability at scheduled time. </p>

        <div>
          {roles.map((role) => (
            <div key={role.uniqueId} className="py-10 border-b border-primary">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold flex items-center">
                  <span>{capitalizeFirstLetter(role.name)}</span>
                  {assignedStaff[role.uniqueId] ? (
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

function NavButtons({ onBack, onProceed, allAssigned }) {

    return (
        <div className="flex justify-between items-center mb-5">
            <button className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center" onClick={onBack}>
                <FaArrowLeft className="mr-2" />
                Go Back
            </button>
            <h1 className="text-primary text-4xl font-bold">Pending Staff Assignments</h1>
            <button className="hover:bg-green-600 flex items-center justify-center bg-highlightGreen text-white rounded-3xl px-7 py-5 text-3xl" onClick={onProceed}>
                Proceed
            </button>
        </div>
    );
}

export function PendingNewStaff() {
  const { fetchedSections, patientInformation } = useProcessCreation(); 
  const [openSections, setOpenSections] = useState(() => new Set(fetchedSections.map(section => section.name)));
  const navigate = useNavigate();
  const [viewAlternateComponent, setViewAlternateComponent] = useState(false);  //change name
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);  // Add state to track selected section ID
  const [assignmentCompletion, setAssignmentCompletion] = useState({});

  useEffect(() => {
    if (!(patientInformation.firstName)) {
      navigate("/processManagement/newProcess/processTemplates", { replace: true });    }

    setOpenSections(new Set(fetchedSections.map(section => section.sectionName)));
  }, [fetchedSections]);


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
    navigate(-1);
  };

  const handleProceed = () => {
    if(!checkIfAllProceduresAssigned()){
      toast.error("Please complete assignments in all procedures before proceeding.");
      return;
    }
    navigate("/processManagement/newProcess/reviewStaffAssignments");
  };

  const handleClick = (procedure, sectionId) => {  // Pass sectionId as an additional parameter
    setSelectedProcedure(procedure);
    setSelectedSectionId(sectionId);  // Set the selected section ID
    setViewAlternateComponent(true);
  };

  useEffect(() => {

    const newAssignmentCompletion = {};
    fetchedSections.forEach(section => {
      section.procedureTemplates.forEach(procedure => {
        // Combine section ID and procedure ID to create a unique key
        const uniqueKey = `${section._id}-${procedure._id}`;
        newAssignmentCompletion[uniqueKey] = procedure.roles.every(role => role.account);
      });
    });
    setAssignmentCompletion(newAssignmentCompletion);
  }, [fetchedSections]);

  const isFullyAssigned = (procedureId, sectionId) => {
    const uniqueKey = `${sectionId}-${procedureId}`;
    return assignmentCompletion[uniqueKey] || false;
  };

  const handleClose = () => {
    setViewAlternateComponent(false);
    setSelectedProcedure(null);
  };

  if (viewAlternateComponent) {
    return <CreateStaffAssignments 
    sectionId={selectedSectionId} procedureId={selectedProcedure._id} 
    procedureName={selectedProcedure.procedureName} roles={selectedProcedure.roles}  
    onClose={handleClose} onProceed={handleClose} 
    startTime={selectedProcedure.startTime} endTime={selectedProcedure.endTime}/>;
  }

  const checkIfAllProceduresAssigned = () => {
    return !fetchedSections.some(section => 
      section.procedureTemplates.some(procedure => 
        !isFullyAssigned(procedure._id, section._id)  
      )
    );
  };

  const allProceduresAssigned = checkIfAllProceduresAssigned();

  return (
    <div className="container mx-auto p-8">
      <NavButtons onBack={handleGoBack} onProceed={handleProceed} allAssigned={allProceduresAssigned}/>
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
    <div className={`flex items-center text-2xl font-bold ${isFullyAssigned(procedure._id, section._id) ? 'text-green-500' : 'text-highlightRed underline'}`}>
                  <button
                  title="Assign Staff"
                    className="flex items-center text-current p-0 border-none bg-transparent"
                    onClick={() => handleClick(procedure, section._id)}  // Pass the current section ID
                  >
                    <div>
                    {isFullyAssigned(procedure._id, section._id) ? (
                    <div className="flex items-center text-green-500">
                      <FaCheck className="mr-2" /> Assigned
                    </div>
                  ) : (
                    <div className="flex items-center text-highlightRed">
                      <MdOutlineOpenInNew className="mr-2" /> Assignments Required
                    </div>
                  )}
                </div>
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