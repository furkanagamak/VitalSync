import React, { useState, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const notify = () => toast.success("Section Added!");

const AddSectionButton = ({ onAddSection, sectionDetails }) => {
  return (
    <button
      onClick={() => onAddSection(sectionDetails)}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      title="Save Section and Add It to the Process Template"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="currentColor"
        class="bi bi-plus-circle mr-3"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
      </svg>
      Save Section
    </button>
  );
};

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    navigate(-1); //Note: needs further testing
  };

  return (
    <button
      onClick={handleGoBackClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      title="Go Back to Previous Page"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="currentColor"
        className="bi bi-arrow-left mr-2"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
        />
      </svg>
      Go Back
    </button>
  );
};

const SectionForm = ({ onAddProcedure, section, setSection }) => {
  const [procedureOptions, setProcedureOptions] = useState([]);
  const [currentProcedure, setCurrentProcedure] = useState(null); // New state for currently selected procedure

  useEffect(() => {
    const fetchProcedureTemplates = async () => {
      try {
        const response = await axios.get("/procedureTemplates");
        setProcedureOptions(response.data);
      } catch (error) {
        console.error("Error fetching procedure templates:", error);
        toast.error("Failed to load procedure templates");
      }
    };
    fetchProcedureTemplates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSection((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProcedureChange = (event, newValue) => {
    setCurrentProcedure(newValue);
  };

  const addProcedureToSection = () => {
    if (!currentProcedure) {
      toast.error("Please select a procedure to add.");
      return;
    }
    if (
      section.procedureTemplates.some(
        (proc) => proc._id === currentProcedure._id
      )
    ) {
      toast.error("This procedure has already been added.");
      return;
    }
    setSection((prevState) => ({
      ...prevState,
      procedureTemplates: [...prevState.procedureTemplates, currentProcedure],
    }));
    setCurrentProcedure(null);
  };

  const theme = createTheme({
    typography: {
      fontSize: 14,
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
          name="sectionName"
          value={section.sectionName || ""}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          id="name"
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={section.description || ""}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          id="description"
        />

        <Grid container spacing={3} alignItems="center">
          <Grid item xs>
            <Autocomplete
              key={section.procedureTemplates.length}
              id="procedure-name"
              options={procedureOptions}
              getOptionLabel={(option) => (option ? option.procedureName : "")}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={currentProcedure}
              onChange={handleProcedureChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Procedure Name"
                  placeholder="Search for procedure templates to add to this section"
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
              onClick={addProcedureToSection}
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
                fontSize: "1.1rem",
                textTransform: "none",
                marginRight: "120px",
              }}
              title="Add Procedure to the Section"
            >
              Add Procedure
            </Button>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

const SectionTable = ({ procedures, onMoveProcedure, onDeleteProcedure }) => {
  const data = React.useMemo(() => procedures, [procedures]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "procedureName",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Resources",
        accessor: "requiredResources",
        style: { backgroundColor: "#F5F5DC" },
        Cell: ({ value }) =>
          value ? (
            <div>
              {value.map((item, index) => (
                <span key={index}>
                  {item.resource.name}
                  {index < value.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          ) : (
            "No resources"
          ),
      },
      {
        Header: "Roles",
        accessor: "roles",
        Cell: ({ value }) =>
          value ? (
            <div>
              {value.map((role, index) => (
                <span key={index}>
                  {role.role.name.charAt(0).toUpperCase() +
                    role.role.name.slice(1)}
                  {index < value.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          ) : (
            "No roles"
          ),
      },
      {
        Header: "Estimated Time",
        accessor: "estimatedTime",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Special Notes",
        accessor: "specialNotes",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div
            className="flex-col lg:flex-row lg:mr-3"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => onMoveProcedure(row.index, "up")}
              className="moveUpProc "
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
              }}
              title="Move Up"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#8E0000"
                className="w-4 h-4 sm:w-8 sm:h-8"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
                />
              </svg>
            </button>
            <button
              onClick={() => onMoveProcedure(row.index, "down")}
              className="moveDownProc lg:mr-3"
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
              }}
              title="Move Down"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#8E0000"
                className="w-4 h-4 sm:w-8 sm:h-8"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
                />
              </svg>
            </button>
            <button
              onClick={() => onDeleteProcedure(row.index)}
              className="deleteProc"
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
              }}
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#8E0000"
                className="w-4 h-4 sm:w-8 sm:h-8"
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
    [onMoveProcedure, onDeleteProcedure]
  );

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({ columns, data });

  return (
    <>
      <div
        className="items-center"
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
            fontSize: "1.45rem",
            fontWeight: "bold",
          }}
        >
          Selected Procedures
        </h1>
        <div
          className="custom-scrollbar-table  w-full capitalize"
          style={{
            overflowX: "auto",
            maxHeight: "28vh",
            paddingRight: "20px",
            minHeight: "28vh",
          }}
        >
          <table
            className="table-auto lg:table-fixed"
            {...getTableProps()}
            style={{
              overflowX: "auto",
              width: "100%",
              height: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 1px",
              fontSize: "1.1rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      className="text-sm lg:text-lg py-1 px-2"
                      {...column.getHeaderProps()}
                      style={{
                        ...column.style,
                        color: "#8E0000",
                        borderBottom: "1px solid #8E0000",
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
                          className="text-sm lg:text-lg"
                          {...cell.getCellProps()}
                          style={{
                            ...cell.column.style,
                            borderBottom: "1px solid #8E0000",
                            verticalAlign: "middle",
                            whiteSpace: "normal",
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

const AddSectionForm = () => {
  //const [procedures, setProcedures] = useState([]);
  const [section, setSection] = useState({
    _id: Date.now(),
    sectionName: "",
    description: "",
    procedureTemplates: [],
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSection((prev) => ({ ...prev, [name]: value }));
  };

  const addProcedure = (procedure) => {
    setSection((prev) => ({
      ...prev,
      procedureTemplates: [...prev.procedureTemplates, procedure],
    }));
  };

  const deleteProcedure = (index) => {
    setSection((prev) => ({
      ...prev,
      procedureTemplates: prev.procedureTemplates.filter((_, i) => i !== index),
    }));
  };

  const onAddSection = () => {
    if (!section.sectionName) {
      toast.error("Section name is required.");
      return;
    }
    if (!section.description) {
      toast.error("A description is required.");
      return;
    }
    if (section.procedureTemplates.length === 0) {
      toast.error("At least one procedure is required.");
      return;
    }

    navigate(location.state.url, { state: { newSection: section } });
    setSection({
      _id: "",
      sectionName: "",
      description: "",
      procedureTemplates: [],
    }); // Clear state
    //notify();
  };

  const moveProcedure = (index, direction) => {
    setSection((prev) => {
      let newProcedures = [...prev.procedureTemplates];
      if (
        (direction === "up" && index > 0) ||
        (direction === "down" && index < newProcedures.length - 1)
      ) {
        const positionChange = direction === "up" ? -1 : 1;
        [newProcedures[index], newProcedures[index + positionChange]] = [
          newProcedures[index + positionChange],
          newProcedures[index],
        ];
      }
      return { ...prev, procedureTemplates: newProcedures };
    });
  };

  return (
    <div>
      <div className="relative mt-6 mb-8 flex flex-col lg:flex-row items-center justify-center">
        <h1 className="text-4xl leading-10 text-center underline text-red-800">
          Add New Section
        </h1>
        <div className="flex flex-row mt-4 lg:mt-0 lg:flex-row lg:absolute lg:inset-y-0 lg:left-0 lg:right-0 justify-between w-full px-4">
          <div>
            <GoBackButton />
          </div>
          <div>
            <AddSectionButton
              onAddSection={onAddSection}
              sectionDetails={section}
            />
          </div>
        </div>
      </div>
      <SectionForm
        onAddProcedure={addProcedure}
        section={section}
        setSection={setSection}
      />
      <SectionTable
        procedures={section.procedureTemplates}
        onMoveProcedure={moveProcedure}
        onDeleteProcedure={deleteProcedure}
      />
    </div>
  );
};

export default AddSectionForm;
