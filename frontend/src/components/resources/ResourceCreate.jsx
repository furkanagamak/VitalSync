import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { LuBedDouble } from "react-icons/lu";
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResourceCreate = ({ navToViewResource }) => {
  const [resourceCreatePage, setResourceCreatePage] = useState("type");
  const [resourceType, setResourceType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      return toast.error("Please insert a name!");
    } else if (
      resourceType !== "roles" &&
      (!formData.location || !formData.description)
    ) {
      return toast.error("Please insert a location for a non-role resource");
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/resources`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, type: resourceType }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        return toast.error(text);
      }
      toast.success(text);
      navigate("/resources");
    } catch (error) {
      toast.error("An error occured while trying to submit your form");
      console.error("Error submitting form:", error.message);
    }
  };

  const makeTypeSelection = (type) => {
    setResourceType(type);
    if (type === "roles") setFormData({ ...formData, location: "" });
    setResourceCreatePage("form");
  };

  const navToTypeSelection = () => {
    setResourceCreatePage("type");
  };

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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {resourceCreatePage === "type" && (
        <SelectType
          navToViewResource={navToViewResource}
          makeTypeSelection={makeTypeSelection}
        />
      )}
      {resourceCreatePage === "form" && (
        <ResourceForm
          resourceType={resourceType}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          navToTypeSelection={navToTypeSelection}
        />
      )}
    </ThemeProvider>
  );
};

const SelectType = ({ navToViewResource, makeTypeSelection }) => {
  const selectEquipment = () => {
    makeTypeSelection("equipment");
  };

  const selectRole = () => {
    makeTypeSelection("roles");
  };

  const selectSpace = () => {
    makeTypeSelection("spaces");
  };

  return (
    <div>
      <section className="flex justify-center items-center relative py-4">
        <Link to="/resources" className="absolute left-4">
          <FaArrowLeft
            title="Go Back to Resource Management"
            className="h-6 w-6"
          />
        </Link>
        <h1 className="text-primary text-3xl font-semibold">
          Create New Resources
        </h1>
      </section>
      <section className="my-12 text-center">
        <h1 className="text-2xl text-primary">
          Which type of resource would you like to create?
        </h1>
      </section>
      <section className="flex space-x-12 justify-center text-primary text-xl">
        <button
          className="flex flex-col items-center"
          onClick={selectEquipment}
          id="selectEquipmentsBtn"
          title="Create a New Equipment Resource"
        >
          <MdOutlineMedicalServices className="w-8 h-8" />
          <p>Equipment</p>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={selectRole}
          id="selectRoleBtn"
          title="Create a New Role Resource"
        >
          <IoPersonOutline className="w-8 h-8" />
          <p>Role</p>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={selectSpace}
          id="selectSpacesBtn"
          title="Create a New Space Resource"
        >
          <LuBedDouble className="w-8 h-8" />
          <p>Spaces</p>
        </button>
      </section>
    </div>
  );
};

const ResourceForm = ({
  resourceType,
  formData,
  handleChange,
  handleSubmit,
  navToTypeSelection,
}) => {
  const typeIsRole = resourceType === "roles";
  return (
    <div className="py-8 px-4">
      <section className="flex justify-center items-center relative py-4">
        <button
          onClick={navToTypeSelection}
          className="absolute left-4"
          id="backToSeleResTypeBtn"
        >
          <FaArrowLeft
            title="Go Back to Resource Type Selection"
            className="h-6 w-6"
          />
        </button>
        <div className="flex flex-col justify-center items-center mb-3 text-primary ml-16 sm:ml-0">
          <h1 className="text-3xl font-semibold mb-3">Create New Resource</h1>
          <p className="text-sm">
            If you want to add a new instance of an existing resource,
          </p>
          <p className="text-sm">
            ensure the name field is the same as the existing resource name.
          </p>
        </div>
      </section>
      <form
        className="mx-auto max-w-lg bg-[#f5f5dc] py-4 px-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex">
          <div className="w-1/2">
            <TextField
              label="*Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              id="nameInp"
              InputLabelProps={{ style: { color: "#8E0000" } }}
              inputProps={{ style: { color: "#8E0000" } }}
              className="shadow rounded w-full py-2 px-3"
            />
          </div>
          <div className="ml-8 w-1/2">
            <label className="block text-primary text-lg font-bold mb-2 text-center">
              Type
            </label>
            <div className="flex items-center justify-center text-primary">
              {resourceType === "equipment" && (
                <MdOutlineMedicalServices className="w-6 h-6" />
              )}
              {resourceType === "personnel" && (
                <IoPersonOutline className="w-6 h-6" />
              )}
              {resourceType === "spaces" && <LuBedDouble className="w-6 h-6" />}
              <p className="ml-4 lg">
                {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <TextField
            label={`${typeIsRole ? "" : "*"}Location`}
            name="location"
            value={formData.location}
            onChange={handleChange}
            id="locationInp"
            InputLabelProps={{ style: { color: "#8E0000" } }}
            inputProps={{ style: { color: "#8E0000" } }}
            className="shadow rounded w-full py-2 px-3"
            disabled={typeIsRole}
          />
        </div>
        <div className="mb-4">
          <TextField
            multiline
            rows={4}
            label={`${typeIsRole ? "" : "*"}Description`}
            name="description"
            value={formData.description}
            onChange={handleChange}
            id="descriptionInp"
            InputLabelProps={{ style: { color: "#8E0000" } }}
            inputProps={{ style: { color: "#8E0000" } }}
            className="shadow rounded w-full py-2 px-3"
          />
        </div>
        <div className="mt-6 flex">
          <button
            type="submit"
            className="bg-highlightGreen text-white py-2 px-4 rounded-md ml-auto"
            id="submitBtn"
            title="Submit Form and Create Resource"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceCreate;
