import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { LuBedDouble } from "react-icons/lu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import toast from "react-hot-toast";

const ResourceEdit = ({ navToViewResource, resource, changeResourceById }) => {
  const resourceType = resource.type ? resource.type.toLowerCase() : "roles";
  const [formData, setFormData] = useState({
    name: resource.name,
    location: resource.location ? resource.location : "",
    description: resource.description,
    uniqueIdentifier: resource.uniqueIdentifier,
  });
  const typeIsRole = resourceType === "roles";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      return toast.error("Please insert a name!");
    } else if (resourceType !== "roles" && !formData.location) {
      return toast.error("Please insert a location for a non-role resource");
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/resources`,
        {
          method: "PUT",
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
      changeResourceById(formData.uniqueIdentifier, formData);
      navToViewResource();
    } catch (error) {
      toast.error("An error occured while trying to submit your form");
      console.error("Error submitting form:", error.message);
    }
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
      <div className="py-8 px-4">
        <section className="flex justify-center items-center relative py-4">
          <button
            onClick={navToViewResource}
            className="absolute left-4"
            id="navBackToViewResourceBtn"
          >
            <FaArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-primary text-3xl font-semibold">Edit Resource</h1>
        </section>
        <form
          className="mx-auto max-w-lg bg-[#f5f5dc] py-4 px-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex">
            <div className="w-1/2">
              <TextField
                label={`${typeIsRole ? "" : "*"}Name`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputLabelProps={{ style: { color: "#8E0000" } }}
                inputProps={{ style: { color: "#8E0000" } }}
                className="shadow rounded w-full py-2 px-3"
                disabled={typeIsRole}
                id="editResourceNameElem"
              />
            </div>
            <div className="ml-8 w-1/2">
              <label className="block text-[#8e0000] text-lg font-bold mb-2 text-center">
                Type
              </label>
              <div className="flex items-center justify-center text-primary">
                {resourceType === "equipments" && (
                  <MdOutlineMedicalServices className="w-6 h-6" />
                )}
                {resourceType === "personnel" && (
                  <IoPersonOutline className="w-6 h-6" />
                )}
                {resourceType === "spaces" && (
                  <LuBedDouble className="w-6 h-6" />
                )}
                <p className="ml-4 lg">
                  {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            {!typeIsRole && (
              <TextField
                label={`Location`}
                name="location"
                value={formData.location}
                onChange={handleChange}
                InputLabelProps={{ style: { color: "#8E0000" } }}
                inputProps={{ style: { color: "#8E0000" } }}
                className="shadow rounded w-full py-2 px-3"
                disabled={typeIsRole}
                id="editResourceLocationElem"
              />
            )}
          </div>
          <div className="mb-4">
            <TextField
              multiline
              rows={4}
              label={`${typeIsRole ? "" : "*"}Description`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#8E0000" } }}
              inputProps={{ style: { color: "#8E0000" } }}
              className="shadow rounded w-full py-2 px-3"
              id="editResourceDescripElem"
            />
          </div>
          <div className="mt-6 flex">
            <button
              type="submit"
              className="bg-highlightGreen text-white py-2 px-4 rounded-md ml-auto"
              id="editResourceSubmitBtn"
              title="Save Changes and Submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default ResourceEdit;
