import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const tableData = [
  ["John Smith", "Neurology", "Head of Department"],
  ["Johnson", "Neurology", "Head of Department"],
  ["Williams", "Pediatrics", "Attending Physician"],
  ["James Brown", "Orthopedics", "Senior Consultant"],
  ["Linda Garcia", "Dermatology", "Attending Physician"],
  ["Barbara Jones", "Emergency Medicine", "Resident"],
  ["Elizabeth Miller", "Obstetrics and Gynecology", "Head of Department"],
  ["Jennifer Davis", "Oncology", "Senior Consultant"],
  ["Maria Rodriguez", "Psychiatry", "Attending Physician"],
  ["Susan Wilson", "Endocrinology", "Resident"],
  ["Margaret Moore", "Gastroenterology", "Head of Department"],
  ["Dorothy Taylor", "Ophthalmology", "Senior Consultant"],
  ["Lisa Anderson", "Pulmonology", "Attending Physician"],
];

function Table({ rows,  onRowClick  }) {
  return (
    <table className="w-full">
      <thead>
        <tr style={{ backgroundColor: '#8E0000', color: 'white' }}>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Department</th>
          <th className="px-4 py-2">Position</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} onClick={() => onRowClick(row)} style={{ backgroundColor: index % 2 === 0 ? '#F5F5DC' : 'transparent' }}>
            <td className="px-4 py-2 h-12">{row[0]}</td>
            <td className="px-4 py-2 h-12">{row[1]}</td>
            <td className="px-4 py-2 h-12">{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const ROWS_PER_PAGE = 10;

function MyComponent() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  let filteredRows = tableData.filter(row =>
    (!filterValue || row[1].toLowerCase().includes(filterValue.toLowerCase()) || row[2].toLowerCase().includes(filterValue.toLowerCase())) &&
    (searchTerm === '' || row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);

  filteredRows = filteredRows.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE);

  const handleRowClick = (row) => {
    // Example logic: navigate to Profile if the row matches certain criteria
    // Adjust the condition as needed
    if (row[0] === "John Smith" && row[1] === "Neurology" && row[2] === "Head of Department") {
      navigate('/Profile'); 
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div style={{ width: '90%'}} className="w-full flex justify-end items-center">
        <select
          className="px-3 py-2 border rounded mr-2"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="">Select Category</option>
          <optgroup label="Department">
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
          </optgroup>
          <optgroup label="Position">
            <option value="Senior Consultant">Senior Consultant</option>
            <option value="Head of Department">Head of Department</option>
            <option value="Attending Physician">Attending Physician</option>
          </optgroup>
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div style={{ width: '90%', height: '80%' }} className="flex flex-col justify-start items-center">
        <div className="w-full overflow-auto">
          <Table rows={filteredRows} onRowClick={handleRowClick}/>
        </div>
        {totalPages > 1 && (
          <div className="flex mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-4 py-2 mx-1 ${index === currentPage ? 'bg-gray-300' : 'bg-white'} border rounded`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyComponent;
