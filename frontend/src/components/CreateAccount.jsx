import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
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

const CreateAccount = ({ navToAdminActions }) => {
  const [accCreatePage, setAccCreatePage] = useState("type");
  const [accType, setAccType] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    degree: "",
    department: "",
    position: "",
    eligibleRoles: "",
    phoneNumber: "",
    email: "",
    officePhoneNumber: "",
    officeLocation: "",
  });
  const navigate = useNavigate();
  const [rolesList, setRolesList] = useState([
    "physician",
    "nurse",
    "surgeon",
    "other",
  ]);

  // fetches all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/roles`);
        if (res.ok) {
          const data = await res.json();
          setRolesList(data.map((role) => role.name));
        } else {
          console.log("server sent back error", res);
        }
      } catch {
        console.log("Failed fetching roles");
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Check if the input is one of the phone number fields
    if (name === "phoneNumber" || name === "officePhoneNumber") {
      formattedValue = value.replace(/\D/g, "");

      formattedValue = formattedValue.substring(0, 10);
      formattedValue = formattedValue.replace(
        /(\d{3})(\d{1,3})?(\d{1,4})?/,
        (match, p1, p2, p3) => {
          if (p3) return `${p1}-${p2}-${p3}`;
          if (p2) return `${p1}-${p2}`;
          return p1;
        }
      );
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      { name: "First Name", value: formData.firstName },
      { name: "Last Name", value: formData.lastName },
      { name: "Degree", value: formData.degree },
      { name: "Department", value: formData.department },
      { name: "Position", value: formData.position },
      { name: "Eligible Roles", value: formData.eligibleRoles },
      { name: "Phone Number", value: formData.phoneNumber },
      { name: "Email", value: formData.email },
      { name: "Account Type", value: accType },
    ];

    // Check if all required fields have values
    const missingFields = requiredFields.filter(
      (field) => field.value.trim() === ""
    );

    if (missingFields.length === 0) {
      if (!isValidEmail(formData.email))
        return toast.error("Email is invalid!");

      if (!isValidPhoneNumber(formData.phoneNumber)) {
        toast.error("Phone number is invalid! Format should be XXX-XXX-XXXX.");
        return;
      }
      if (
        formData.officePhoneNumber &&
        !isValidPhoneNumber(formData.officePhoneNumber)
      ) {
        toast.error(
          "Office phone number is invalid! Format should be XXX-XXX-XXXX."
        );
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/createAccount`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              accountType: accType,
            }),
          }
        );

        if (response.ok) {
          toast.success(
            "Account created successfully! Credentials has been sent to the provided email!"
          );
          navigate("/adminActions");
        } else {
          toast.error(await response.text());
        }
      } catch (error) {
        console.error("Error creating account:", error.message);
        toast.error("Failed to create account. Please try again later.");
      }
    } else {
      // Display error message for empty required fields
      const missingFieldNames = missingFields
        .map((field) => field.name)
        .join(", ");
      toast.error(
        `Please fill in the following required fields: ${missingFieldNames}.`
      );
    }
  };

  const makeAccTypeSelection = (type) => {
    setAccType(type);
    setAccCreatePage("form1");
  };

  const navToTypeSelection = () => {
    setAccCreatePage("type");
  };

  const navToForm1 = () => {
    setAccCreatePage("form1");
  };

  const navToForm2 = () => {
    setAccCreatePage("form2");
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
      {accCreatePage === "type" && (
        <SelectAccType
          makeAccTypeSelection={makeAccTypeSelection}
          navToAdminActions={navToAdminActions}
        />
      )}
      {accCreatePage === "form1" && (
        <Form1
          formData={formData}
          accType={accType}
          handleChange={handleChange}
          navToTypeSelection={navToTypeSelection}
          navToForm2={navToForm2}
          rolesList={rolesList}
        />
      )}
      {accCreatePage === "form2" && (
        <Form2
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          navToForm1={navToForm1}
        />
      )}
      {accCreatePage === "credentials" && (
        <DisplayCredentials email={formData.email} password={`abcdef`} />
      )}
    </ThemeProvider>
  );
};

const SelectAccType = ({ navToAdminActions, makeAccTypeSelection }) => {
  const selectAdmin = () => {
    makeAccTypeSelection("hospital admin");
  };

  const selectStaff = () => {
    makeAccTypeSelection("staff");
  };

  return (
    <div>
      <section className="flex justify-center items-center relative py-4">
        {/*<Link
          to="/adminActions"
          onClick={navToAdminActions}
          className="absolute left-4"
          id="selectAccTypeBackBtn"
          title="Go Back to Admin Actions"
        >
          <FaArrowLeft className="h-6 w-6" />
          </Link>*/}
        <h1 className="text-primary text-3xl font-semibold">
          Create New Account
        </h1>
      </section>
      <section className="my-12 text-center">
        <h1 className="text-2xl text-primary">
          Which type of account would you like to create?
        </h1>
      </section>
      <section className="flex space-x-12 justify-center text-primary text-xl">
        <button
          id="selectStaffBtn"
          className="flex flex-col items-center bg-primary text-white py-2 px-4"
          onClick={selectStaff}
          title="Create a Staff Account"
        >
          Staff
        </button>
        <button
          id="selectAdminBtn"
          className="flex flex-col items-center bg-primary text-white py-2 px-4"
          onClick={selectAdmin}
          title="Create a Hospital Admin Account"
        >
          Admin
        </button>
      </section>
    </div>
  );
};

const Form1 = ({
  formData,
  accType,
  handleChange,
  navToTypeSelection,
  navToForm2,
  rolesList,
}) => {
  return (
    <div className="py-8 px-4 mx-auto">
      <section className="flex justify-center items-center relative py-4">
        <button
          onClick={navToTypeSelection}
          className="absolute left-4"
          id="form1BackBtn"
          title="Go Back to Account Type Selection"
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-col justify-center items-center text-primary">
          <h1 className="text-3xl font-semibold">Create New Account</h1>
          <p>All fields with * are required</p>
        </div>
      </section>
      <div className="mx-auto max-w-lg bg-[#f5f5dc] py-4 px-8 space-y-8">
        <div className="flex">
          <div className="w-3/4 mt-auto">
            <TextField
              multiline
              label="*First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              id="firstNameInp"
              InputLabelProps={{ style: { color: "#8E0000" } }}
              inputProps={{ style: { color: "#8E0000" } }}
              className="shadow rounded w-11/12"
            />
          </div>
          <div className="text-center w-1/4">
            <label className="block text-primary text-lg font-bold mb-2">
              Type
            </label>
            <div className="flex  justify-center items-center text-primary">
              <p className="capitalize">
                {accType.charAt(0).toUpperCase() + accType.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <TextField
          multiline
          label="*Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          id="lastNameInp"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full"
        />
        <FormControl fullWidth>
          <InputLabel id="degreeInputLabel" style={{ color: "#8E0000" }}>
            *Degree
          </InputLabel>
          <Select
            label="degree"
            value={formData.degree}
            name="degree"
            onChange={handleChange}
            style={{ color: "#8E0000" }}
            id="degreeInp"
          >
            <MenuItem value="">Select Degree</MenuItem>
            <MenuItem value="bachelors">Bachelors</MenuItem>
            <MenuItem value="masters">Masters</MenuItem>
            <MenuItem value="phd">PhD</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="*Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          id="departmentInp"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full"
        />
        <TextField
          label="*Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          id="positionInp"
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full"
        />
        <div className="flex">
          <FormControl className="w-3/4">
            <InputLabel id="roleInpLabel" style={{ color: "#8E0000" }}>
              *Eligible Roles
            </InputLabel>
            <Select
              label="*eligible roles"
              value={formData.eligibleRoles}
              name="eligibleRoles"
              onChange={handleChange}
              style={{ color: "#8E0000" }}
              id="eligibleRolesInp"
              className="capitalize"
            >
              <MenuItem value="">Select Role</MenuItem>
              {rolesList.map((role) => (
                <MenuItem className="capitalize" value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex justify-center items-center w-1/4">
            <button
              type="submit"
              className="bg-primary text-white rounded-md ml-auto h-fit py-2 px-4"
              onClick={navToForm2}
              id="nextBtn"
              title="Proceed to Next Step"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Form2 = ({ formData, handleChange, handleSubmit, navToForm1 }) => {
  return (
    <div className="py-8 px-4">
      <section className="flex justify-center items-center relative py-4">
        <button
          onClick={navToForm1}
          className="absolute left-4"
          id="form2BackBtn"
          title="Go Back to the Previous Step"
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-col justify-center items-center text-primary">
          <h1 className="text-3xl font-semibold">Create New Account</h1>
          <p>All fields with * are required</p>
        </div>
      </section>
      <form
        className="mx-auto max-w-lg bg-[#f5f5dc] pt-8 pb-4 px-8 space-y-8"
        onSubmit={handleSubmit}
      >
        <TextField
          label="*Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full py-2 px-3"
          id="phoneNumberInp"
        />
        <TextField
          label="*Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full py-2 px-3"
          id="emailInp"
        />
        <TextField
          label="Office Phone Number"
          name="officePhoneNumber"
          value={formData.officePhoneNumber}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full py-2 px-3"
          id="officePhoneNumberInp"
        />
        <TextField
          label="  Office Location"
          name="officeLocation"
          value={formData.officeLocation}
          onChange={handleChange}
          InputLabelProps={{ style: { color: "#8E0000" } }}
          inputProps={{ style: { color: "#8E0000" } }}
          className="shadow rounded w-full py-2 px-3"
          id="officeLocationInp"
        />
        <div className="mt-6 flex">
          <button
            type="submit"
            className="bg-highlightGreen text-white py-2 px-4 rounded-md ml-auto"
            id="submitBtn"
            title="Submit Form and Create Account"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const DisplayCredentials = ({ email, password }) => {
  return (
    <div className="mx-auto max-w-lg bg-[#f5f5dc] p-8 space-y-8">
      <section className="text-primary text-2xl space-y-4">
        <h1 className="text-center">
          You have successfully created your account!
        </h1>
        <h1>Here are your credentials:</h1>
      </section>
      <section className="text-lg">
        <div className="flex space-x-10">
          <h1 className="text-primary underline">Email: </h1>
          <p>example@123.com</p>
        </div>
        <div className="flex space-x-2">
          <h1 className="text-primary underline">Password: </h1>
          <p>{password}</p>
        </div>
      </section>
    </div>
  );
};

export default CreateAccount;
