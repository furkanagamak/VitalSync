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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTable, useSortBy, usePagination } from "react-table";
import { TbLayoutGridAdd } from "react-icons/tb";
import "./TemplateStyles.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { useProcessCreation } from "../providers/ProcessCreationProvider";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const notify = () => toast.success("Process Template Modified!");

const ModifyTemplateButton = ({ onModify, instanceCreation }) => {
  const navigate = useNavigate();

  const handleModifyClick = async () => {
    await onModify();
  };

  const buttonText = instanceCreation ? "Use Template" : "Save Template";
  const buttonTitle = instanceCreation
    ? "Use This Process Template"
    : "Save Changes to Process Template";

  return (
    <button
      onClick={handleModifyClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      title={buttonTitle}
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
      {buttonText}
    </button>
  );
};

const GoBackButton = ({ instanceCreation }) => {
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    if (instanceCreation) {
      navigate("/processManagement/newProcess/processTemplates");
    } else {
      navigate("/ProcessTemplateManagement");
    }
  };

  return (
    <button
      onClick={handleGoBackClick}
      className="flex items-center text-xl justify-center px-4 py-2 bg-[#F5F5DC] text-[#8E0000] border-2 border-[#8E0000] rounded-full hover:bg-[#ede9d4]"
      title="Go Back to Process Template Management"
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

const ProcessForm = ({ process, setProcess, createTemplate }) => {
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
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProcess({ ...process, [name]: value });
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
          Process Template Details
        </Typography>
        <TextField
          fullWidth
          label="Process Name"
          name="name"
          value={process.name}
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
          value={process.description}
          onChange={handleInputChange}
          margin="normal"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          id="description"
        />
      </div>
    </ThemeProvider>
  );
};

/*const handleSaveState = () => {
  const stateToSave = { process, sections };
  sessionStorage.setItem('processTemplateState', JSON.stringify(stateToSave));
};*/

const SectionTable = ({
  sections,
  setSections,
  onSaveState,
  handleSessionUpdate,
  process,
}) => {
  const data = React.useMemo(() => sections, [sections]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const handleAddSection = () => {
    handleSessionUpdate(process, sections); // Save current state before navigating
    navigate("/AddSectionForm", {
      state: { isAddingNew: true, url: `/ModifyProcessTemplateForm/${id}` },
    });
  };

  const handleModifySection = (index) => {
    const sectionToModify = sections[index];
    handleSessionUpdate(process, sections); // Save current state before navigating
    navigate("/ModifySectionForm", {
      state: {
        section: sectionToModify,
        url: `/ModifyProcessTemplateForm/${id}`,
      },
    });
  };

  const updateSections = debounce((newSection) => {
    setSections((prevSections) => {
      const nameConflict = prevSections.some(
        (section) =>
          section.sectionName.toLowerCase() ===
            newSection.sectionName.toLowerCase() &&
          section._id !== newSection._id
      );

      if (nameConflict) {
        toast.error("A section with the same name already exists.");
        return prevSections;
      }

      const sectionIndex = prevSections.findIndex(
        (section) => section._id === newSection._id
      );
      if (sectionIndex !== -1) {
        const updatedSections = [...prevSections];
        updatedSections[sectionIndex] = newSection;
        handleSessionUpdate(process, updatedSections);
        toast.success("Section Modified!");
        return updatedSections;
      } else {
        const newSections = [...prevSections, newSection];
        handleSessionUpdate(process, newSections);
        toast.success("Section Added!");
        return newSections;
      }
    });
  }, 1); //1 second millisecond delay to avoid rapid re-update of section state on location change. Need to solve underlying issue

  useEffect(() => {
    if (location.state?.newSection && !location.state?.fromPatient) {
      updateSections(location.state.newSection);
    }
  }, [location.state?.newSection, location.state?.fromPatient]);

  const moveSection = (index, direction) => {
    setSections((currentSections) => {
      let newSections = [...currentSections];
      if (direction === "up" && index > 0) {
        [newSections[index], newSections[index - 1]] = [
          newSections[index - 1],
          newSections[index],
        ];
      } else if (direction === "down" && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [
          newSections[index + 1],
          newSections[index],
        ];
      }
      handleSessionUpdate(process, newSections); // Update session storage
      return newSections;
    });
  };

  const deleteSection = (index) => {
    setSections((currentSections) => {
      const newSections = currentSections.filter((_, i) => i !== index);
      handleSessionUpdate(process, newSections); // Update session storage
      return newSections;
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "sectionName",
        style: { backgroundColor: "#F5F5DC" },
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Procedures",
        accessor: "procedureTemplates",
        style: { backgroundColor: "#F5F5DC" },
        Cell: ({ value }) =>
          value && Array.isArray(value) ? (
            <div>
              {value.map((procedure, index) => (
                <span key={index}>
                  {procedure.procedureName}
                  {index < value.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          ) : (
            "No procedures listed"
          ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div
            className="flex-col lg:flex-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              className="lg:mr-3"
              onClick={() => moveSection(row.index, "up")}
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
              className="lg:mr-3"
              onClick={() => moveSection(row.index, "down")}
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
              className="lg:mr-3"
              onClick={() => handleModifySection(row.index)}
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
              }}
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#8E0000"
                className="bi bi-pencil"
                viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
              </svg>
            </button>
            <button
              onClick={() => deleteSection(row.index)}
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
    [sections]
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
          Selected Sections
        </h1>
        <div
          className="custom-scrollbar-table"
          style={{
            overflowX: "auto",
            maxHeight: "30vh",
            paddingRight: "20px",
            minHeight: "30vh",
          }}
        >
          <table
            className="table-auto lg:table-fixed"
            {...getTableProps()}
            style={{
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
                      className="text-base lg:text-lg"
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
                          className="text-sm lg:text-lg"
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "10px",
            marginRight: "35px",
          }}
        >
          <Button
            onClick={handleAddSection}
            variant="outlined"
            startIcon={<AddCircleOutlineIcon style={{ color: "#8E0000" }} />}
            style={{
              color: "#8E0000",
              backgroundColor: "white",
              borderColor: "#8E0000",
              minWidth: "100px",
              fontSize: "1.1rem",
              textTransform: "none",
            }}
            title="Add New Section to the Process Template"
          >
            Add Section
          </Button>
        </div>
      </div>
    </>
  );
};

const ModifyProcessTemplateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const [process, setProcess] = useState({
    name: "",
    description: "",
    sections: [],
  });
  const [sections, setSections] = useState([]);
  const [incomingUrl, setIncomingUrl] = useState("");

  const {
    updateProcessTemplate,
    currentlyModifyingTemplate,
    setCurrentlyModifyingTemplate,
  } = useProcessCreation();

  useEffect(() => {
    console.log(location.state);
    if (location.state && location.state.incomingUrl) {
      console.log(location.state.incomingUrl);

      setIncomingUrl(location.state.incomingUrl);
      setCurrentlyModifyingTemplate(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProcessTemplate = async () => {
      const savedState = JSON.parse(
        sessionStorage.getItem("processTemplateState")
      );
      if (savedState) {
        setProcess(savedState.process);
        setSections(savedState.sections);
      } else {
        try {
          const response = await axios.get(`/processTemplates/${id}`);
          setProcess({
            name: response.data.processName,
            description: response.data.description,
            sections: response.data.sectionTemplates,
          });
          setSections(response.data.sectionTemplates);
        } catch (error) {
          console.error("Error fetching process template:", error);
          toast.error("Failed to load process template");
        }
      }
    };
    fetchProcessTemplate();
  }, [id]);

  const updateSessionStorage = (newProcess, newSections) => {
    const stateToSave = { process: newProcess, sections: newSections };
    sessionStorage.setItem("processTemplateState", JSON.stringify(stateToSave));
  };

  const updateTemplate = async () => {
    if (!process.name) {
      toast.error("Process name is required.");
      return;
    }
    if (!process.description) {
      toast.error("A description is required.");
      return;
    }
    if (sections.length === 0) {
      toast.error("At least one section is required.");
      return;
    }

    const procData = {
      processName: process.name,
      description: process.description,
      sections: sections.map((section) => ({
        _id: section._id,
        sectionName: section.sectionName,
        description: section.description,
        procedureTemplates: section.procedureTemplates.map((p) => p._id || p),
      })),
    };

    if (currentlyModifyingTemplate) {
      updateProcessTemplate(procData);
      navigate("/processManagement/newProcess/patientForm", {
        state: { from: "/processManagement/newProcess" },
      });
    } else {
      console.log(procData);

      try {
        const response = await axios.put(`/processTemplates/${id}`, procData);
        toast.success("Process Template Updated Successfully!");
        navigate("/ProcessTemplateManagement");
        setProcess({ name: "", description: "", sections: "" });
        setSections([]);
        sessionStorage.removeItem("processTemplateState");
      } catch (error) {
        console.error("Error updating process template:", error);
        toast.error("Failed to update process template");
      }
    }
  };

  return (
    <div>
      <div className="relative mt-6 mb-8 flex flex-col lg:flex-row items-center justify-center">
        <h1 className="text-4xl leading-10 text-center underline text-red-800">
          Modify Process Template
        </h1>
        <div className="flex flex-row mt-4 lg:mt-0 lg:flex-row lg:absolute lg:inset-y-0 lg:left-0 lg:right-0 justify-between w-full px-4">
          <div>
            <GoBackButton instanceCreation={currentlyModifyingTemplate} />
          </div>
          <div>
            <ModifyTemplateButton
              onModify={updateTemplate}
              instanceCreation={currentlyModifyingTemplate}
            />
          </div>
        </div>
      </div>
      <ProcessForm process={process} setProcess={setProcess} />
      <SectionTable
        handleSessionUpdate={updateSessionStorage}
        sections={sections}
        setSections={setSections}
        process={process}
        setProcess={setProcess}
      />
    </div>
  );
};

export default ModifyProcessTemplateForm;
