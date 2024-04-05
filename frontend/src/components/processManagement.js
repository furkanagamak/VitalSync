import React from "react";
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from "@mui/material/styles";
import { ActiveProcessesList } from "./activeProcessesList";
import { ModifyProcessLanding } from "./modifyProcessLanding";
import  ProcessTable  from "./processTable";
import PatientForm from "./patientForm";

const StyledTab = styled(Tab)(({ theme }) => ({
    color: "white",
    "&.Mui-selected": {
      color: "white",
    },
    "&.MuiTab-root": {
      fontSize: "1.3rem",
      minWidth: 160, 
      width: 'auto', 
    },
  }));
  

export function ProcessManagementContainer() {
    const [tabValue, setTabValue] = useState(0);
    const [viewStack, setViewStack] = useState(['list']);
    const [newViewStack, setNewViewStack] = useState(['list']);


    const currentView = viewStack[viewStack.length - 1]; // Current view is the last item in the stack
    const currentNewView = newViewStack[newViewStack.length - 1]; // Current view is the last item in the stack



    const handleModifyClick = (processId) => {
        setViewStack([...viewStack, 'modify']);
    };

    const handleBack = () => {
        // Pop the current view from the stack to go back
        const newStack = [...viewStack];
        newStack.pop();
        setViewStack(newStack);
    };

    const nextPage = (processId) => {
        setViewStack([...viewStack, 'patient']);
    };

    const nextCreatePage = (processId) => {
        setNewViewStack([...newViewStack, 'patient']);
    };

    const handleNewBack = () => {
        // Pop the current view from the stack to go back
        const newStack = [...viewStack];
        newStack.pop();
        setViewStack(newStack);
    };

    
    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="flex flex-col items-center w-full lg:m-0">
                <div className="w-full max-w-xl">
                    <Tabs
                        variant="fullWidth"
                        className="bg-primary rounded-t-2xl p-3 " 
                        value={tabValue}
                        centered 
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "white",
                                height: "4px",
                            },
                        }}
                        onChange={(event, newValue) => {
                            setTabValue(newValue);
                        }}
                        sx={{
                            '.MuiTabs-flexContainer': {
                                justifyContent: 'center',
                            },
                            '.MuiTab-root': {
                                textTransform: 'none',
                            },
                            
                        }}
                    >
                        <StyledTab label="Active Processes" />
                        <StyledTab label="Start New Process" />
                    </Tabs>
                </div>
                
                <div className="w-full lg:w-11/12 bg-secondary rounded-b-lg min-h-[82vh] border-t-8 border-primary rounded-2xl">
                {tabValue === 0 && currentView === 'list' && <ActiveProcessesList onModifyClick={handleModifyClick} />}
                {tabValue === 0 && currentView === 'modify' && <ModifyProcessLanding onBack={handleBack} />}
                {tabValue === 1 && currentView === 'list' && <ProcessTable nextCreatePage={nextCreatePage} />}
                {tabValue === 1 && currentView === 'patient' && <PatientForm nextPage={nextPage}/>}

            </div>
            </div>
        </div>
    );
}