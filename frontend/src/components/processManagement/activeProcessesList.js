import React from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaSearch } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
      primary: {
        main: '#8e0000',
      },
      secondary: {
        main: '#f5f5dc',
      },
    },
  });

const exampleProcesses = [
    {
        patient: 'Daniel Kim',
        processType: 'Chest Examination',
        processId: '28356',
        currentProcedure: 'Chest X-Ray',
        nextProcedure: 'Pulmonary Function Test'
    },
    {
        patient: 'May Mary',
        processType: 'radial Prostatectomy',
        processId: '23585',
        currentProcedure: 'Consultation',
        nextProcedure: 'Pelvic Ultrasound'
      },
      {
        patient: 'John Doe',
        processType: 'Awake Brain Surgery',
        processId: '28354',
        currentProcedure: 'Initial Consultation',
        nextProcedure: 'MRI Brain Scan'
      },
      {
        patient: 'Jordan Davis',
        processType: 'Tibia Fracture Surgery',
        processId: '28353',
        currentProcedure: 'ORIF Surgery',
        nextProcedure: 'Postoperative Consultation'
      },
      {
        patient: 'Daniel Kim',
        processType: 'Chest Examination',
        processId: '28352',
        currentProcedure: 'Chest X-Ray',
        nextProcedure: 'Pulmonary Function Test'
      },
      {
        patient: 'Dan Watson',
        processType: 'Knee Replacement',
        processId: '28456',
        currentProcedure: 'Pre-surgical Assessment',
        nextProcedure: 'Surgical Procedure'
      },
      {
        patient: 'Oliver Smith',
        processType: 'Appendectomy',
        processId: '28457',
        currentProcedure: 'Appendix Removal',
        nextProcedure: 'Recovery'
      },
      {
        patient: 'Sophia Johnson',
        processType: 'Dental Implants',
        processId: '28458',
        currentProcedure: 'Implant Placement',
        nextProcedure: 'Check-up'
      },
      {
        patient: 'Liam Williams',
        processType: 'Heart Bypass Surgery',
        processId: '28459',
        currentProcedure: 'Coronary Artery Bypass Grafting',
        nextProcedure: 'Post-surgical Care'
      },
      {
        patient: 'Mia Brown',
        processType: 'Laser Eye Surgery',
        processId: '28460',
        currentProcedure: 'LASIK',
        nextProcedure: 'Follow-up Examination'
      },
      {
        patient: 'Noah Jones',
        processType: 'Hip Replacement',
        processId: '28461',
        currentProcedure: 'Joint Replacement',
        nextProcedure: 'Physical Therapy'
      },
      {
        patient: 'Isabella Garcia',
        processType: 'Skin Grafting',
        processId: '28462',
        currentProcedure: 'Graft Placement',
        nextProcedure: 'Healing and Observation'
      },
      {
        patient: 'Jacob Martinez',
        processType: 'Gallbladder Removal',
        processId: '28463',
        currentProcedure: 'Cholecystectomy',
        nextProcedure: 'Dietary Adjustment'
      },
      {
        patient: 'Emily Rodriguez',
        processType: 'Hernia Repair',
        processId: '28464',
        currentProcedure: 'Mesh Repair',
        nextProcedure: 'Recovery Monitoring'
      },
      {
        patient: 'Alexander Gonzalez',
        processType: 'Varicose Vein Treatment',
        processId: '28465',
        currentProcedure: 'Endovenous Laser Therapy',
        nextProcedure: 'Compression Therapy'
      },
      {
        patient: 'Charlotte Wilson',
        processType: 'Thyroidectomy',
        processId: '28466',
        currentProcedure: 'Thyroid Removal',
        nextProcedure: 'Hormone Level Monitoring'
      }
  ];

  function SearchBar() {
    return (
      <div className="flex justify-center items-center p-5 mb-5 mt-5">
        <div className="relative w-2/5">
          <input
            type="search"
            placeholder="Search by Process ID or Patient Name"
            className="w-full p-3.5 pl-5 pr-10 bg-beige-200 text-primary border-2 border-primary rounded-full text-lg leading-tight focus:outline-none"
          />
          <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-primary text-xl" />
        </div>
      </div>
    );
  }
  


  function ProcessCell({ process, onModifyClick }) {
    return (
      <div className="flex overflow-hidden bg-primary rounded-2xl p-7 mb-5 text-white text-2xl m-5">
        <div className="flex-[1.5] border-r border-white min-w-0 pr-4">
          <div className="space-y-1">
            <p className="truncate"><span className="underline">Patient:</span> {process.patient}</p>
            <p className="truncate"><span className="underline">Process:</span> {process.processType}</p>
            <p className="truncate"><span className="underline">Process ID:</span> {process.processId}</p>
          </div>
        </div>
        <div className="flex-[2] border-r border-white min-w-0 px-4">
          <div className="space-y-1">
            <p className="truncate"><span className="underline">Current Procedure:</span> {process.currentProcedure}</p>
            <p className="truncate"><span className="underline">Next Procedure:</span> {process.nextProcedure}</p>
          </div>
        </div>
        <div className="flex-[1] pl-4 flex justify-end items-start min-w-0">
          <div className="flex flex-col space-y-2">
            <button className="bg-green-500 hover:bg-green-600 rounded-full px-10 py-1 text-center">View</button>
            <button className="bg-red-500 hover:bg-red-600 rounded-full px-4 py-1 text-center" onClick={onModifyClick}>Modify</button>
          </div>
        </div>
      </div>
    );
  }
  

  
  export function ActiveProcessesList() {
    const [page, setPage] = useState(1);
    const navigate = useNavigate(); 


    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleModifyClick = (processId) => {
      navigate(`/processManagement/modifyProcess/landing`);
    };

    const indexOfLastItem = page * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentItems = exampleProcesses.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div>
        <SearchBar />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 py-5">
          {currentItems.map((process, index) => (
            <ProcessCell key={index} process={process} onModifyClick={() => handleModifyClick(process.processId)} />
          ))}
        </div>
        <Stack spacing={2} alignItems="center" className="py-5">
          <Pagination 
            color="primary"
            size="large"
            count={Math.ceil(exampleProcesses.length / 8)} 
            page={page} 
            onChange={handleChange} 
            showFirstButton 
            showLastButton 
            sx={{
              ".MuiPaginationItem-root": {
                color: '8e0000', // Assuming this is your primary color in Tailwind
              },
              ".Mui-selected": {
                backgroundColor: '#8e0000',
                color: '#white',
                '&:hover': {
                  backgroundColor: '#8e0000', // A darker shade for hover state
                },
              },
              ".MuiPaginationItem-ellipsis": {
                color: '#8e0000', // Adjust if needed
              }
            }}/>
        </Stack>
      </div>
    );
  }