import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { LuBedDouble } from "react-icons/lu";

const ResourceCreate = ({ navToViewResource }) => {
  const [resourceCreatePage, setResourceCreatePage] = useState("type");
  const [resourceType, setResourceType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    uniqueIdentifier: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Add logic to submit form data to endpoint
  };

  const makeTypeSelection = (type) => {
    setResourceType(type);
    setResourceCreatePage("form");
  };

  const navToTypeSelection = () => {
    setResourceCreatePage("type");
  };

  return (
    <>
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
    </>
  );
};

const SelectType = ({ navToViewResource, makeTypeSelection }) => {
  const selectEquipment = () => {
    makeTypeSelection("equipments");
  };

  const selectPersonnel = () => {
    makeTypeSelection("personnel");
  };

  const selectSpace = () => {
    makeTypeSelection("spaces");
  };

  return (
    <div>
      <section className="flex justify-center items-center relative py-4">
        <button onClick={navToViewResource} className="absolute left-4">
          <FaArrowLeft className="h-6 w-6" />
        </button>
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
        >
          <MdOutlineMedicalServices className="w-8 h-8" />
          <p>Equipments</p>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={selectPersonnel}
        >
          <IoPersonOutline className="w-8 h-8" />
          <p>Personnel</p>
        </button>
        <button className="flex flex-col items-center" onClick={selectSpace}>
          <LuBedDouble className="w-8 h-8" />
          <p>Resources</p>
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
  return (
    <div className="py-8 px-4">
      <section className="flex justify-center items-center relative py-4">
        <button onClick={navToTypeSelection} className="absolute left-4">
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
        <div className="mb-4 flex">
          <div className="w-1/2">
            <label className="block text-primary text-lg font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow rounded w-full py-2 px-3"
            />
          </div>
          <div className="ml-8 w-1/2">
            <label className="block text-primary text-lg font-bold mb-2">
              Type
            </label>
            <div className="flex items-center text-primary">
              {resourceType === "equipments" && (
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
          <label className="block text-primary text-lg font-bold mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary text-lg font-bold mb-2">
            Unique Identifier (Optional)
          </label>
          <input
            type="text"
            name="uniqueIdentifier"
            value={formData.uniqueIdentifier}
            onChange={handleChange}
            className="shadow rounded w-full py-2 px-3"
          />
        </div>
        <div className="mt-6 flex">
          <button
            type="submit"
            className="bg-highlightGreen text-white py-2 px-4 rounded-md ml-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceCreate;
