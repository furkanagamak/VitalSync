//parent component of all process management functions to wrap them in container with tab switching functionality.

import React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../navbar";

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "white",
  "&.Mui-selected": {
    color: "white",
  },
  "&.MuiTab-root": {
    fontSize: "1.3rem",
    minWidth: 160,
    width: "auto",
  },
}));

export function ProcessManagementContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentCategory = location.pathname.split("/")[2];
  const basePath = location.pathname.split("/").slice(0, 3).join("/");
  const tabPaths = [
    "/processManagement/modifyProcess/activeProcesses",
    "/processManagement/newProcess/processTemplates",
  ];
  const currentTabIndex = tabPaths.findIndex((path) =>
    basePath.startsWith(path.split("/").slice(0, 3).join("/"))
  );

  const handleChange = (event, newValue) => {
    navigate(tabPaths[newValue], {state: {incomingUrl: "/processManagement"} });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex flex-col items-center w-full lg:m-0">
          <div className="w-full max-w-xl">
            <Tabs
              variant="fullWidth"
              className="bg-primary rounded-t-2xl p-3"
              value={currentTabIndex !== -1 ? currentTabIndex : 0}
              onChange={handleChange}
              centered
              TabIndicatorProps={{
                style: {
                  backgroundColor: "white",
                  height: "4px",
                },
              }}
              sx={{
                ".MuiTabs-flexContainer": {
                  justifyContent: "center",
                },
                ".MuiTab-root": {
                  textTransform: "none",
                },
              }}
            >
              <StyledTab label="Active Processes" value={0} />
              <StyledTab label="Start New Process" value={1} />
            </Tabs>
          </div>

          <div className="w-full lg:w-11/12 bg-secondary rounded-b-lg min-h-[82vh] border-t-8 border-primary rounded-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
