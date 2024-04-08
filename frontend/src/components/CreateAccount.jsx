import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", { ...formData });
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

  return (
    <>
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
          handleSubmit={handleSubmit}
          navToTypeSelection={navToTypeSelection}
          navToForm2={navToForm2}
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
    </>
  );
};

const SelectAccType = ({ navToAdminActions, makeAccTypeSelection }) => {
  const selectAdmin = () => {
    makeAccTypeSelection("admin");
  };

  const selectStaff = () => {
    makeAccTypeSelection("staff");
  };

  return (
    <div>
      <section className="flex justify-center items-center relative py-4">
        <Link
          to="/adminActions"
          onClick={navToAdminActions}
          className="absolute left-4"
          id="selectAccTypeBackBtn"
        >
          <FaArrowLeft className="h-6 w-6" />
        </Link>
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
        >
          Staff
        </button>
        <button
          id="selectAdminBtn"
          className="flex flex-col items-center bg-primary text-white py-2 px-4"
          onClick={selectAdmin}
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
  handleSubmit,
  navToTypeSelection,
  navToForm2,
}) => {
  return (
    <div className="py-8 px-4">
      <section className="flex justify-center items-center relative py-4">
        <button
          onClick={navToTypeSelection}
          className="absolute left-4"
          id="form1BackBtn"
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-col justify-center items-center text-primary">
          <h1 className="text-3xl font-semibold">Create New Resource</h1>
          <p>All fields with * are required</p>
        </div>
      </section>
      <form
        className="mx-auto max-w-lg bg-[#f5f5dc] py-4 px-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex">
          <div className="w-3/4">
            <label className="block text-primary text-lg font-bold mb-2">
              *First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="shadow rounded w-full py-2 px-3"
              id="firstNameInp"
            />
          </div>
          <div className="pl-4 w-1/4">
            <label className="block text-primary text-lg font-bold mb-2">
              Type
            </label>
            <div className="flex items-center text-primary">
              <p className="">
                {accType.charAt(0).toUpperCase() + accType.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            *Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="lastNameInp"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            *Degree
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="degreeInp"
          >
            <option value="">Select Degree</option>
            <option value="bachelors">Bachelors</option>
            <option value="masters">Masters</option>
            <option value="phd">PhD</option>
            <option value="others">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            *Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="departmentInp"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            *Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="positionInp"
          />
        </div>
        <div className="flex">
          <div className="mb-4 w-3/4">
            <label className="block text-primary text-lg font-bold mb-2">
              *Eligible Roles
            </label>
            <select
              name="eligibleRoles"
              value={formData.eligibleRoles}
              onChange={handleChange}
              className="shadow rounded w-full py-2 px-3"
              id="eligibleRolesInp"
            >
              <option value="">Select Role</option>
              <option value="physician">Physician</option>
              <option value="nurse">Nurse</option>
              <option value="surgeon">Surgeon</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mt-6 flex justify-center items-center w-1/4">
            <button
              type="submit"
              className="bg-primary text-white rounded-md ml-auto h-fit py-2 px-4"
              onClick={navToForm2}
              id="nextBtn"
            >
              Next
            </button>
          </div>
        </div>
      </form>
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
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-primary text-3xl font-semibold">
          Create New Resource
        </h1>
      </section>
      <form
        className="mx-auto max-w-lg bg-[#f5f5dc] py-4 px-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            *Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="phoneNumberInp"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            *Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="emailInp"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            Office Phone Number
          </label>
          <input
            type="text"
            name="officePhoneNumber"
            value={formData.officePhoneNumber}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="officePhoneNumberInp"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            Office Location
          </label>
          <input
            type="text"
            name="officeLocation"
            value={formData.officeLocation}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
            id="officeLocationInp"
          />
        </div>
        <div className="mt-6 flex">
          <button
            type="submit"
            className="bg-highlightGreen text-white py-2 px-4 rounded-md ml-auto"
            id="submitBtn"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
