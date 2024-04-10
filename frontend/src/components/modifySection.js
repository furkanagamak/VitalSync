import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTable, useSortBy, usePagination } from "react-table";
import Autocomplete from "@mui/material/Autocomplete";
import "./TemplateStyles.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const notify = () => toast.success("Section Modified!");

const ModifySectionButton = () => {
  const navigate = useNavigate();

  const handleModifySectionClick = () => {
    navigate("/ModifyProcessTemplateForm");
    notify();
  };

  return (
    <button
      onClick={handleModifySectionClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="#8E0000"
        className="bi bi-pencil mr-2"
        viewBox="0 0 16 16"
      >
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
      </svg>
      Modify Section
    </button>
  );
};

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    navigate("/ModifyProcessTemplateForm");
  };

  return (
    <button
      onClick={handleGoBackClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="currentColor"
        class="bi bi-arrow-left mr-2"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
        />
      </svg>
      Go Back
    </button>
  );
};

const SectionForm = () => {
  const [section, setSection] = useState({
    name: "Intraoperative",
    description: "Procedures administered during the surgery.",
    procedureName: "",
  });

  const [procedureOptions, setProcedureOptions] = useState([
    "General Anesthesia",
    "MRI Scan",
    "Physical Therapy",
  ]);

  const theme = createTheme({
    typography: {
      fontSize: 12,
      button: {
        textTransform: "none",
      },
    },
    palette: {
      primary: {
        main: "#8E0000",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E0000",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E0000",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8E0000",
            },
            backgroundColor: "white",
          },
          input: {
            "&.MuiOutlinedInput-inputMultiline": {
              backgroundColor: "white",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          iconOutlined: {
            color: "#8E0000",
          },
          select: {
            color: "#8E0000",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#8E0000",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "#8E0000",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            color: "#8E0000",
          },
        },
      },
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSection({ ...section, [name]: value });
  };

  const handleProcedureChange = (event, newValue) => {
    setSection({ ...section, procedureName: newValue });
  };

  const createTemplate = () => {
    console.log({ section });
  };

  const navigate = useNavigate();

  const handleCreateProcedureTemplateClick = () => {
    navigate("/CreateProcedureTemplateForm");
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          maxWidth: "90%",
          margin: "auto",
          backgroundColor: "#F5F5DC",
          border: "2px solid #8E0000",
          borderRadius: "5px",
          padding: "20px",
          marginTop: "10px",
          marginBottom: "30px",
        }}
      >
        <Typography
          variant="h5"
          style={{ color: "#8E0000", marginBottom: "5px", fontWeight: "bold" }}
        >
          Section Details
        </Typography>
        <TextField
          fullWidth
          label="Section Name"
          name="name"
          value={section.name}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={section.description}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
        />

        <Grid container spacing={3} alignItems="center">
          <Grid item xs>
            <Autocomplete
              id="procedure-name"
              value={section.procedureName}
              onChange={handleProcedureChange}
              onInputChange={(event, newInputValue) => {
                setProcedureOptions([
                  "General Anesthesia",
                  "MRI Scan",
                  "Physical Therapy",
                ]);
              }}
              options={procedureOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Procedure Name"
                  placeholder="Search for procedure templates to add to the section."
                  margin="normal"
                  fullWidth
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    style: { color: "#8E0000" },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    style: { color: "#8E0000" },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={
                <AddCircleOutlineIcon
                  style={{ color: "#8E0000", fontSize: "1.5rem" }}
                />
              }
              style={{
                color: "#8E0000",
                backgroundColor: "white",
                borderColor: "#8E0000",
                minWidth: "100px",
                fontSize: "0.9rem",
                textTransform: "none",
                marginRight: "120px",
              }}
            >
              Add Procedure
            </Button>
            <Button
              onClick={handleCreateProcedureTemplateClick}
              variant="outlined"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  class="bi bi-clipboard-plus"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"
                  />
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                </svg>
              }
              style={{
                color: "#8E0000",
                backgroundColor: "white",
                borderColor: "#8E0000",
                minWidth: "100px",
                fontSize: "0.9rem",
                textTransform: "none",
              }}
            >
              Create New Procedure Template
            </Button>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

const SectionTable = () => {
  const data = React.useMemo(
    () => [
      {
        name: "General Anesthesia",
        description:
          "A state of controlled unconsciousness during which a patient is asleep.",
        resources:
          "Anesthesia Machine, Monitoring System, Propofol, Suction Device",
        roles: "Anesthesiologist, Anesthesia Technician, Nurse Anesthetist",
        time: "45 minutes",
        notes: "NPO (nothing by mouth) for 8 hours before the procedure.",
      },
      {
        name: "Appendix Removal",
        description:
          "A surgical procedure to remove the appendix when it is inflamed or infected.",
        resources: "Scalpel, Forceps, Suture Kit, Laparoscope",
        roles: "Surgeon, Surgical Assistant, Scrub Nurse, Circulating Nurse",
        time: "60 minutes",
        notes: "Patient must be informed of the risks of the procedure.",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Resources",
        accessor: "resources",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Roles",
        accessor: "roles",
      },
      {
        Header: "Estimated Time",
        accessor: "time",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Special Notes",
        accessor: "notes",
      },
      {
        Header: "Actions",
        Cell: () => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#8E0000"
                class="bi bi-arrow-up"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
                />
              </svg>
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#8E0000"
                class="bi bi-arrow-down"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
                />
              </svg>
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#8E0000"
                className="bi bi-trash3"
                viewBox="0 0 16 16"
              >
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({ columns, data });

  return (
    <>
      <div
        style={{
          border: "2px solid #8E0000",
          borderRadius: "5px",
          maxWidth: "90%",
          margin: "auto",
          padding: "20px",
          paddingBottom: "10px",
          backgroundColor: "#F5F5DC",
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#8E0000",
            fontSize: "1.29rem",
            fontWeight: "bold",
          }}
        >
          Selected Procedures
        </h1>
        <div
          className="scrollbar1"
          style={{
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
            maxHeight: "28vh",
            paddingRight: "20px",
            minHeight: "28vh",
          }}
        >
          <table
            {...getTableProps()}
            style={{
              width: "100%",
              height: "100%",
              tableLayout: "fixed",
              borderCollapse: "separate",
              borderSpacing: "0 1px",
              fontSize: "0.9rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        ...column.style,
                        color: "#8E0000",
                        borderBottom: "1px solid #8E0000",
                        padding: "10px",
                        minWidth: column.minWidth,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {column.render("Header")}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            ...cell.column.style,
                            borderBottom: "1px solid #8E0000",
                            padding: "10px",
                            verticalAlign: "middle",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const ModifySectionForm = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginTop: "1.2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ position: "absolute", left: "2rem" }}>
          <GoBackButton />
        </div>
        <div style={{ position: "absolute", right: "2rem" }}>
          <ModifySectionButton />
        </div>
        <h1
          style={{
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
            textAlign: "center",
            textDecoration: "underline",
            color: "#8E0000",
          }}
        >
          Modify Section
        </h1>
      </div>
      <SectionForm />
      <SectionTable />
    </div>
  );
};

export default ModifySectionForm;