import React, {useState, useEffect } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { BiSolidDownArrow } from "react-icons/bi";
import { FaArrowLeft } from 'react-icons/fa';


// Mock data for roles - replace with actual data retrieval mechanism
const roles = [
  { 
    name: "Lead Surgeon",
    staff: [
      {
        Name: 'Tom Stanley',
        Title: 'Surgical Resident',
        ID: 'SR-017',
        Actions: 'Assign',
      },
      {
        Name: 'Anna Hart',
        Title: 'Surgical Resident',
        ID: 'SR-031',
        Actions: 'Assign',
      },
      {
        Name: 'Haley Snyder',
        Title: "Physician's Assistant",
        ID: 'PA-004',
        Actions: 'Assign',
      },
    ],
    assigned: "Olivia Hunt"
  },
  { 
    name: "Assistant Surgeon 1", 
    staff: [
      {
        Name: 'Lucas Granger',
        Title: 'Surgical Fellow',
        ID: 'SF-112',
        Actions: 'Assign',
      },
      {
        Name: 'Emily Dawson',
        Title: 'Surgical Fellow',
        ID: 'SF-108',
        Actions: 'Assign',
      },
    ],
    assigned: "Michael Reed"
  },
  { 
    name: "Assistant Surgeon 2", 
    staff: [
      {
        Name: 'Sarah Linn',
        Title: 'Surgical Fellow',
        ID: 'SF-119',
        Actions: 'Assign',
      },
    ],
    assigned: "Gregory House"
  },
  { 
    name: "Anesthesiologist", 
    staff: [
      {
        Name: 'Nina Patel',
        Title: 'Anesthesiology Resident',
        ID: 'AR-007',
        Actions: 'Assign',
      },
      {
        Name: 'Omar Shafiq',
        Title: 'Attending Anesthesiologist',
        ID: 'AA-045',
        Actions: 'Assign',
      },
    ],
    assigned: "Alex Karev"
  },
  { 
    name: "Operating Room Nurse", 
    staff: [
      {
        Name: 'Jessica Wong',
        Title: 'Registered Nurse',
        ID: 'RN-621',
        Actions: 'Assign',
      },
      {
        Name: 'Carlos Ramirez',
        Title: 'Registered Nurse',
        ID: 'RN-634',
        Actions: 'Assign',
      },
    ],
    assigned: "Meredith Grey"
  },
];

export function RoleDropdownContent({ role }) {
  return (
    <div className="flex mx-10 mb-5">
      <div className="w-1/3 text-3xl mt-20">
        <p>Currently Assigned:</p>
        <p className="text-primary">{role.assigned}</p>
      </div>
      <div className="w-3/4 lg:w-3/4 ml-5">
        <p className="text-highlightGreen text-2xl mb-3 mt-5">Available Qualified Staff:</p>
        <div className="border-gray-400 border-2 rounded-lg p-3 overflow-y-auto" style={{ maxHeight: '12rem' }}> {/* 3 rows approximately 3rem each */}
          <table className="w-full text-left">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-primary">Name <BiSolidDownArrow /></th>
                <th className="text-primary">Title <BiSolidDownArrow /></th>
                <th className="text-primary">ID <BiSolidDownArrow /></th>
                <th className="text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {role.staff.map((staff, index) => (
                <tr key={index} className={`border-b border-black ${index === role.staff.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-2">{staff.Name}</td>
                  <td>{staff.Title}</td>
                  <td>{staff.ID}</td>
                  <td>
                    <button className="bg-green-500 hover:bg-green-700 text-white border-black border-2 rounded-full px-3 py-1">
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


export function CreateStaffAssignments({ processName, onBack, onProceed }) {
  const [openRoles, setOpenRoles] = useState(new Set());

  useEffect(() => {
    const allRoles = new Set(roles.map(role => role.name));
    setOpenRoles(allRoles);
  }, []);

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
          onClick={onBack}
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
          <h2 className="text-4xl font-bold">{"Radial Prostatectomy"}<span className="text-primary" > - Modify Staff Assignments</span></h2>
        </div>

        <div>
          {roles.map((role) => (
            <div key={role.name} className="py-10 border-b border-primary">
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">{role.name}</p>
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

export default CreateStaffAssignments;