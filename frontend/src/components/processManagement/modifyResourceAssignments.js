import React, {useState, useEffect } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { BiSolidDownArrow } from "react-icons/bi";
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const resources = [
    { 
      name: "Operating Room",
      resourcesAvailable: [
        { ID: 'OR-037' },
        { ID: 'OR-015' },
        { ID: 'OR-122' },
        { ID: 'OR-098' },
        { ID: 'OR-076' },
        { ID: 'OR-045' },
        { ID: 'OR-063' }
      ],
      assigned: "OR-001"

    },
    { 
      name: "Surgical Instrument Set",
      resourcesAvailable: [
        { ID: 'SI-047' },
        { ID: 'SI-058' },
        { ID: 'SI-069' },
        { ID: 'SI-102' },
        { ID: 'SI-113' }
      ],
      assigned: "SI-139"

    },
    { 
      name: "Patient Monitor",
      resourcesAvailable: [
        { ID: 'PI-021' },
        { ID: 'PI-034' },
        { ID: 'PI-045' },
        { ID: 'PI-056' },
        { ID: 'PI-078' }
      ],
      assigned: "PI-012"

    },
    { 
      name: "Anesthesia Station",
      resourcesAvailable: [
        { ID: 'AS-005' },
        { ID: 'AS-016' },
        { ID: 'AS-027' },
        { ID: 'AS-038' },
        { ID: 'AS-049' }
      ],
      assigned: "AS-009"

    },
    { 
      name: "Medication Cart",
      resourcesAvailable: [
        { ID: 'MC-011' },
        { ID: 'MC-022' },
        { ID: 'MC-033' },
        { ID: 'MC-044' },
        { ID: 'MC-055' }
      ],
      assigned: "MC-001"
    },
  ];

export function ResourceDropdownContent({ resource }) {
  
  return (
    <div className="flex mx-10 mb-5">
      <div className="w-1/3 text-3xl mt-20 mr-32">
        <p>Currently Assigned:</p>
        <p className="text-primary">{resource.assigned}</p>
      </div>
      <div className="w-2/5 ml-5">
        <p className="text-highlightGreen text-3xl mb-3 mt-5">Available Resources:</p>
        <div className="border-gray-400 border-2 rounded-lg p-3 overflow-y-auto" style={{ maxHeight: '15rem' }}> {/* 3 rows approximately 3rem each */}
          <table className="w-full text-left">
            <thead className="border-b border-primary">
              <tr>
                <th className="text-primary">ID <BiSolidDownArrow /></th>
                <th className="text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
            {resource.resourcesAvailable && resource.resourcesAvailable.map((res, index) => (
                <tr key={index} className={`border-b border-black ${index === resource.resourcesAvailable.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-2 text-2xl">{res.ID}</td>
                  <td>
                    <button className="bg-highlightGreen hover:bg-green-700 text-white border-black border-2 rounded-full px-3 py-1">
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


export function ModifyResourceAssignments() {
  const [openResources, setOpenResources] = useState(new Set());
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/processManagement/modifyProcess/landing");
  };

  const handleProceed = () => {
    navigate("/processManagement/modifyProcess/reviewResourceAssignments");
  };

  useEffect(() => {
    const allResources = new Set(resources.map(resource => resource.name));
    setOpenResources(allResources);
  }, []);

  const toggleResource = (resource) => {
    const newOpenResources = new Set(openResources);
    if (newOpenResources.has(resource)) {
      newOpenResources.delete(resource);
    } else {
      newOpenResources.add(resource);
    }
    setOpenResources(newOpenResources);
  };

  return (
    <div className="bg-secondary min-h-screen">
      <div className="flex justify-between items-center p-5">
        <button
          className="ml-5 hover:bg-red-900 border-black border-2 flex items-center justify-center bg-primary text-white rounded-full px-5 py-2 text-xl shadow"
          style={{ maxWidth: '30%' }}
          onClick={handleGoBack}
        >
          <FaArrowLeft className="mr-3" />
          Go Back
        </button>

        <button
          className="mr-10 mt-5 hover:bg-green-700 border-black border-2 flex items-center justify-center bg-highlightGreen text-white rounded-full px-10 py-5 text-4xl"
          style={{ maxWidth: '30%' }}
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>

      <div className="container mx-auto p-8">
        <div className="pb-4 mb-4 border-b-2 border-black">
          <h2 className="text-4xl font-bold">{"Radial Prostatectomy"}<span className="text-primary" > - Modify Resource Assignments</span></h2>
        </div>

        <div>
          {resources.map((resource) => (
            <div key={resource.name} className="py-10 border-b border-primary">
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold">{resource.name}</p>
                <button onClick={() => toggleResource(resource.name)} className="flex items-center">
                  {openResources.has(resource.name) ? <BsChevronUp className='text-4xl' /> : <BsChevronDown className='text-4xl' />}
                </button>
              </div>

              {openResources.has(resource.name) && (
                <div className=" mx-auto mt-14 mb-5 p-4 bg-white rounded-2xl shadow w-3/5">
                 <ResourceDropdownContent resource={resource}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModifyResourceAssignments;