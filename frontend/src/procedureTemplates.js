import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import './App.css';

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');

    const handleClearInput = () => setInputValue('');

    return (
        <div className="inline-flex items-center rounded-full text-2xl border-2 border-[#A30000] bg-[#F5F5DC] p-2 min-width relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#8E0000]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="search"
                placeholder="Search for procedure templates"
                className="bg-transparent border-none outline-none placeholder-[#A30000] text-[#A30000] pl-2"
                style={{ minWidth: '350px' }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
                <button
                    onClick={handleClearInput}
                    className="absolute right-4 text-[#A30000]" 
                    style={{ outline: 'none' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
}

const CreateTemplateButton = () => {
  return (
    <button className="flex items-center text-2xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#A30000] border-2 border-[#A30000] rounded-full hover:bg-[#ede9d4]">
      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#8E0000" className="bi bi-clipboard-plus mr-2" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
      </svg>
      Create Template
    </button>
  );
};

const ProcedureTable = () => {
    const data = React.useMemo(
      () => [
        {
            name: 'General Anesthesia',
            description: 'A state of controlled unconsciousness during which a patient is asleep and unaware of their surroundings.', 
            resources: 'Anesthesia Machine, Monitoring System, Propofol, Suction Device',
            roles: 'Anesthesiologist, Anesthesia Technician, Nurse Anesthetist',
            time: '45 minutes',
            notes: 'NPO (nothing by mouth) for 8 hours before the procedure.'
        },
        {
            name: 'MRI Scan',
            description: 'Imaging technique that uses magnetic fields and radio waves to produce detailed images of the body.',
            resources: 'MRI Machine, Contrast Agent, Patient Gown, Earplugs',
            roles: 'Radiologist, MRI Technologist',
            time: '30 minutes',
            notes: 'Remove all metal objects before the scan.'
        },
        {
            name: 'Physical Therapy',
            description: 'A treatment method aiming to alleviate pain and restore movement and function to patients affected by injury.',
            resources: 'Treatment Space, Therapeutic Equipment',
            roles: 'Physical Therapist, Physical Therapy Assistant',
            time: '55 minutes',
            notes: 'Wear comfortable clothing and footwear to facilitate movement during the session.'
        },
        {
            name: "Radiation Therapy",
            description: "A cancer treatment that uses high doses of radiation to kill cancer cells and shrink tumors in the body.",
            resources: "Linear Accelerator, CT Simulator, Radiation Therapy Machine, Shielding Material",
            roles: "Radiation Therapist, Dosimetrist, Medical Physicist, Radiation Oncology Nurse",
            time: "25 minutes",
            notes: "Patients may experience fatigue and skin changes in the treated area."
          },
          {
            name: "Ultrasound Imaging",
            description: "Diagnostic technique that uses high-frequency sound waves to produce images of the body.",
            resources: "Ultrasound Machine, Gel for Skin Contact",
            roles: "Sonographer, Radiologist, Ultrasound Technician",
            time: "45 minutes",
            notes: "Wear loose-fitting clothing and comfortable shoes for the procedure."
          },
          {
            name: "Vaccination",
            description: "The administration of a vaccine to help the immune system develop protection from a disease.",
            resources: "Vaccine, Syringes, Bandages, Vaccine Refrigeration Unit",
            roles: "Nurse, Medical Assistant",
            time: "10 minutes",
            notes: "Patients may experience mild side effects such as soreness at the injection site, fever, or fatigue."
          }
      ],
      []
    );
  
    const columns = React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'name',
          style: { backgroundColor: '#F5F5DC' },
        },
        {
          Header: 'Description',
          accessor: 'description',
        },
        {
          Header: 'Resources',
          accessor: 'resources',
          style: { backgroundColor: '#F5F5DC'},
        },
        {
          Header: 'Roles',
          accessor: 'roles',
        },
        {
          Header: 'Estimated Time',
          accessor: 'time',
          style: { backgroundColor: '#F5F5DC'},
        },
        {
          Header: 'Special Notes',
          accessor: 'notes',
        },
        {
          Header: 'Actions',
          Cell: () => (
            <div style={{ display: 'flex',  alignItems: 'center', justifyContent: 'center' }}>
            <button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', marginRight: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#8E0000" className="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
              </svg>
            </button>
            <button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#8E0000" className="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
              </svg>
            </button>
          </div>
        ),
          disableSortBy: true,
          style: { backgroundColor: '#F5F5DC'},
        },
      ],
      []
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      nextPage,
      previousPage,
      pageOptions,
      state: { pageIndex },
    } = useTable({ columns, data, initialState: { pageSize: 3 } }, useSortBy, usePagination);
  
    return (
        <>
        <div style={{ maxWidth: '95%', margin: 'auto', overflowX: 'auto', display: 'flex', justifyContent: 'center'}}>
            <table {...getTableProps()} style={{ width: '100%', height: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0 1px', fontSize: '1.5rem', textAlign: 'center'}}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        style={{ ...column.style, color: '#8E0000', borderBottom: '1px solid #A30000', padding: '10px', minWidth: column.minWidth }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          {column.render('Header')}
                          <span style={{marginLeft: '3px', textAlign: 'center'}}>
                            {column.isSorted ? (
                                column.isSortedDesc ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#8E0000" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                                </svg> : 
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#8E0000" className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                                </svg>
                            ) : ''}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            style={{ ...cell.column.style, borderBottom: '1px solid #A30000', padding: '10px', verticalAlign: 'middle'}}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="flex items-center justify-center text-2xl px-4 py-2 bg-[#F5F5DC] text-[#A30000] border-2 border-[#A30000] rounded-full hover:bg-[#ede9d4] mr-2"
            >
            Previous Page
            </button>
            <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="flex items-center justify-center text-2xl px-4 py-2 bg-[#F5F5DC] text-[#A30000] border-2 border-[#A30000] rounded-full hover:bg-[#ede9d4]"
            >
            Next Page
            </button>
          </div>
        </>
      );
    };

    const ProcedureTemplateManagement = () => {
        return (
          <div className="flex flex-col items-center space-y-4 relative">
            <h1 className="text-4xl text-[#A30000] text-center underline font-bold mt-5">Procedure Template Management</h1>
            <div className="absolute right-8">
              <CreateTemplateButton />
            </div>
            <SearchBar />
            <div><ProcedureTable /></div>
          </div>
        );
      };
    
export default ProcedureTemplateManagement;
