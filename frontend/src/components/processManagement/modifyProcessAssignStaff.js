import React, { useState, useEffect, useMemo  } from "react";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaArrowLeft, FaCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { MdOutlineOpenInNew } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProcessModificationContext } from '../../providers/ProcessModificationProvider';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import moment from 'moment'; 




export function RoleDropdownContent({ role, eligibleStaff, assignStaff, assignedStaff }) {

  const handleAssign = (newStaff) => {
    console.log(newStaff);
    assignStaff(newStaff); 
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
                <tr key={index} style={{ borderBottom: '1px solid black' }}>
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

export function CreateStaffAssignments({ modifyProcedure, onClose }) {
    const { updateStaffAssignments, getStaffAssignments } = useProcessModificationContext();
  const [openRoles, setOpenRoles] = useState(new Set());
  const [eligibleStaff, setEligibleStaff] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [assignedStaff, setAssignedStaff] = useState({});

useEffect(() => {
  const rolesWithAssignments = modifyProcedure.rolesAssignedPeople.reduce((acc, roleAssigned) => {
      acc[roleAssigned.role._id] = roleAssigned.accounts;
      return acc;
  }, {});

  setAssignedStaff(rolesWithAssignments);
  fetchEligibleStaff(modifyProcedure.rolesAssignedPeople, modifyProcedure.timeStart, modifyProcedure.timeEnd);
}, [modifyProcedure]);


  const fetchEligibleStaff = async (roles, startTime, endTime) => {
    setIsLoading(true);
    const roleIds = roles.map(roleAssigned => roleAssigned.role._id);

    try {
        const responses = await Promise.all(roleIds.map(id => axios.get(`/users/accountsByRole/${id}`, {
            params: { startTime, endTime } 
        })));

        const procedureDate = moment(startTime);
        const dayOfWeek = procedureDate.format('dddd');

        const newEligibleStaff = roles.reduce((acc, roleAssigned, index) => {
            acc[roleAssigned.role._id] = responses[index].data.filter(staff => {
                if (staff.isTerminated) return false;
                
                // Exclude staff already assigned to any role in this procedure
                const assignedInProcedure = roleAssigned.accounts.some(account => account._id === staff._id);
                if (assignedInProcedure) return false;
      
                const userUsualHours = staff.usualHours.find(uh => uh.day === dayOfWeek);
                if (!userUsualHours) return false;
      
                // Convert usual work hours to datetime on the procedure date
                const workStart = moment(`${procedureDate.format('YYYY-MM-DD')}T${userUsualHours.start}`);
                const workEnd = moment(`${procedureDate.format('YYYY-MM-DD')}T${userUsualHours.end}`);
                if (workEnd.isBefore(workStart)) {
                    // Adjust for overnight shift ending on the next day
                    workEnd.add(1, 'days');
                }
      
                const procStart = moment(startTime);
                const procEnd = moment(endTime);
                if (procEnd.isBefore(procStart)) {
                    // Adjust for procedures ending on the next day
                    procEnd.add(1, 'days');
                }
      
                // Check if work hours fully encompass the procedure time
                if (!workStart.isBefore(procStart) || !workEnd.isAfter(procEnd)) {
                    console.log("Work hours didn't cover", staff.firstName, workStart.format(), procStart.format(), workEnd.format(), procEnd.format());
                    return false;
                }
      
                // Check for unavailable times overlapping with procedure time
                return !staff.unavailableTimes.some(unavailable => {
                    const unavailableStart = moment(unavailable.start);
                    const unavailableEnd = moment(unavailable.end);
                    return procStart.isBefore(unavailableEnd) && procEnd.isAfter(unavailableStart);
                });
            });
            return acc;
        }, {});

        setEligibleStaff(newEligibleStaff);
    } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to fetch staff: " + error.message);
    }
    setIsLoading(false);
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

const assignStaff = (newRoleId, newStaff, oldStaff) => {
  console.log("Assigning new staff, roleID:", newRoleId);
  console.log("Assigning new staff, newStaff:", newStaff);
  console.log("Assigning new staff, previous assignedStaff:", assignedStaff);

  const updatedEligibleStaff = Object.keys(eligibleStaff).reduce((acc, key) => {
    acc[key] = eligibleStaff[key].filter(s => s._id !== newStaff._id);

    if (oldStaff && oldStaff._id && key === newRoleId) {
      acc[key] = [...acc[key], oldStaff];
    }
    return acc;
  }, {});
  setEligibleStaff(updatedEligibleStaff);

  setAssignedStaff(prev => ({
    ...prev,
    [newRoleId]: [newStaff] 
  }));

  // updateStaffAssignments(modifyProcedure.procedureId, newRoleId, newStaff._id);
};

useEffect(() => {
  console.log("Updated Assigned Staff:", assignedStaff);
}, [assignedStaff]);

const handleSave = () => {


  const allAssigned = roles.every(role => assignedStaff[role._id]);
  console.log(roles);
  console.log(assignedStaff);
  if (!allAssigned) {
      toast.error("Please assign staff to all roles before saving.");
      return;
  }
  roles.forEach(role => {
      const staffId = assignedStaff[role._id]._id;
      updateStaffAssignments(modifyProcedure.procedureId, role._id, staffId);
  });

  onClose();
};

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const roles = modifyProcedure.rolesAssignedPeople;
  console.log("Roles", roles);


  if (isLoading) return <div>Loading...</div>;


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

        <button

          className="mr-10 mt-5 bg-highlightGreen text-white text-2xl py-4 px-16 rounded-3xl"
          style={{ maxWidth: '30%' }}
          onClick={handleSave}
        >
          Save
        </button>
        
      </div>

      <div className="container mx-auto p-8">
        <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold">{modifyProcedure.procedureName}<span className="text-primary" > - Modify Staff Assignments</span></h2>
        </div>

        <div>
          {roles.map(roleAssigned => {
        const role = roleAssigned.role;
        const uniqueId = role._id; 
        const isAssigned = assignedStaff[uniqueId] && assignedStaff[uniqueId].length > 0;

        return (
          <div key={uniqueId} className="py-10 border-b border-primary">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold flex items-center">
                <span>{capitalizeFirstLetter(role.name)}</span>
               
              </div>
              <button onClick={() => toggleRole(uniqueId)}>
                {openRoles.has(uniqueId) ? <BsChevronUp className='text-4xl' /> : <BsChevronDown className='text-4xl' />}
              </button>
            </div>
            {openRoles.has(uniqueId) && (
              <div className="mx-auto mt-16 mb-8 p-2 bg-white rounded-2xl shadow w-4/5">
                <RoleDropdownContent
                  role={role}
                  eligibleStaff={eligibleStaff[uniqueId] || []}
                  assignStaff={(newStaff) => assignStaff(uniqueId, newStaff, assignedStaff[uniqueId] ? assignedStaff[uniqueId][0] : null)}
                  assignedStaff={assignedStaff[uniqueId] && assignedStaff[uniqueId].length > 0 ? assignedStaff[uniqueId][0] : null}
                  />
              </div>
            )}
          </div>
        );
      })}
        </div>
      </div>
    </div>
  );
}


export default CreateStaffAssignments;