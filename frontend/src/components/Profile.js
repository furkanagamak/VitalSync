import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function ImageUploader({ onClose, setImgUrl }) {
  const fileTypes = ["PNG", "JPEG", "GIF", "JPG"];
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      setFileName("");
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user/profilePicture`,
          {
            method: "PUT",
            body: formData,
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setImgUrl(data.url);
          toast.success(data.message);
          onClose();
        } else {
          console.error("Image upload failed:", response.statusText);
          toast.error(await response.text());
        }
      } catch (error) {
        // Handle fetch error
        console.error("Error occurred while uploading image:", error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative mx-auto p-5 border w-96 shadow-lg rounded-md"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#F5F5DC", border: "2px solid #8E0000" }}
      >
        <h2 className="text-base leading-6 text-center text-black">
          Choose Image to Upload
        </h2>
        <p className="mt-2 text-sm leading-5 text-center text-black">
          Supported image formats: {fileTypes.join(", ")}
        </p>
        <div className="flex items-center gap-2 self-stretch mt-1.5 text-xs text-center text-black">
          <label className="justify-center px-2 py-1.5 rounded-sm border border-black border-solid bg-zinc-300 cursor-pointer">
            Choose File
            <input
              type="file"
              accept=".png, .jpeg, .gif, .jpg"
              onChange={handleFileSelection}
              style={{ display: "none" }}
            />
          </label>
          {fileName && (
            <span className="text-sm text-neutral-700">{fileName}</span>
          )}
        </div>
        <div className="flex gap-5 mt-3.5 justify-center">
          <button
            className="flex-1 cursor-pointer border border-solid border-neutral-600 text-neutral-600 text-center py-1.5 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 cursor-pointer bg-red-800 text-white text-center py-1.5 rounded-lg"
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountTerminationConfirmation() {
  const navigate = useNavigate();

  const handleReturnToRoster = () => {
    navigate("/roster");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-2xl font-bold mb-4">Account has been Terminated</p>
        <button
          onClick={handleReturnToRoster}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Return to Roster Page
        </button>
      </div>
    </div>
  );
}

function PasswordResetConfirmation({ onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[364px] bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
        <p className="text-base leading-6 text-center text-black px-16 py-6">
          The Password has been reset
          <br />
          The temporary password is:
          <br />
          <span className="font-bold">B6wcCW53</span>
          <br />A confirmation Email has been sent
        </p>
        <button
          type="button"
          onClick={onClose}
          className="justify-center items-center self-center px-5 py-1.5 mt-1 mb-4 text-xs bg-white rounded-lg border border-solid border-neutral-600 text-neutral-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function ConfirmResetPasswordModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[364px] bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
        <div className="text-base leading-6 text-center text-black px-16 py-6">
          Are You Sure You Want to Reset The Password?
        </div>
        <div className="flex gap-5 mt-7 text-sm font-medium justify-center px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 justify-center px-5 py-3.5 bg-white rounded-lg border border-solid border-neutral-600 text-neutral-600"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 justify-center px-5 py-3.5 bg-red-800 rounded-lg text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountTerminationModal({ onClose, onTerminate }) {
  const [name, setName] = useState("");

  const handleNameChange = (e) => setName(e.target.value);

  const handleSubmit = () => {
    if (name.toLowerCase() === "john smith") {
      onTerminate(true);
    } else {
      onTerminate(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[436px]">
        <div className="flex flex-col items-center px-7 pt-3.5 pb-7 w-full bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
          <div className="self-stretch text-base leading-6 text-center text-black">
            Are you sure you want to terminate this account? If yes, write the
            person's name of the account to be terminated.
          </div>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="shrink-0 mt-8 bg-white border border-black border-solid h-[25px] w-[241px]"
          />
          <div className="flex gap-5 mt-4 text-sm font-medium whitespace-nowrap">
            <button
              onClick={onClose}
              className="flex-1 justify-center px-5 py-3 bg-white rounded-lg border border-solid border-neutral-600 text-neutral-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 justify-center px-5 py-3 bg-red-800 rounded-lg text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileImage({ imgUrl, setImgUrl }) {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="flex flex-col self-stretch my-auto text-sm font-medium text-neutral-600 max-md:mt-10">
      <img
        loading="lazy"
        alt=""
        src={imgUrl}
        className="w-full aspect-[0.93]"
      />
      <div
        className="justify-center self-center p-1 mt-3.5 rounded-lg border border-solid bg-zinc-300 border-neutral-600 cursor-pointer"
        onClick={() => setShowUploader(true)}
      >
        Change Profile Image
      </div>
      {showUploader && (
        <ImageUploader
          onClose={() => setShowUploader(false)}
          setImgUrl={setImgUrl}
        />
      )}
    </div>
  );
}

function ContactInfo() {
  const [editMode, setEditMode] = useState(false);
  const [cellNo, setCellNo] = useState("(123)-456-7890");
  const [officeNo, setOfficeNo] = useState("(123)-456-7890");
  const [email, setEmail] = useState("Smith.john@sbu.com");
  const [office, setOffice] = useState("West Wing/307B");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showPasswordResetConfirmation, setShowPasswordResetConfirmation] =
    useState(false);

  const handleSaveChanges = () => setEditMode(false);

  const handleResetPasswordClick = () => setShowResetPasswordModal(true);

  const handleResetPasswordConfirm = () => {
    setShowResetPasswordModal(false);
    setShowPasswordResetConfirmation(true);
  };

  return (
    <div className="flex flex-col mt-1.5 text-3xl text-black max-md:mt-10">
      <h2 className="text-4xl text-left text-red-800">Contact Information</h2>
      {editMode ? (
        <>
          <input
            type="text"
            value={cellNo}
            onChange={(e) => setCellNo(e.target.value)}
            className="mt-6 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="text"
            value={officeNo}
            onChange={(e) => setOfficeNo(e.target.value)}
            className="mt-3 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2.5 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="text"
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            className="mt-2 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </>
      ) : (
        <>
          <p className="mt-6 text-left">
            <span className="text-red-800">Cell No</span>: {cellNo}
          </p>
          <p className="mt-3 text-left">
            <span className="text-red-800">Office No</span>: {officeNo}
          </p>
          <p className="mt-2.5 text-left">
            <span className="text-red-800">Email</span>: {email}
          </p>
          <p className="mt-2 text-left">
            <span className="text-red-800">Office</span>: {office}
          </p>
        </>
      )}
      <div className="flex gap-5 justify-between items-start mt-24 text-sm font-medium text-neutral-600 max-md:pr-5 max-md:mt-10">
        <button
          onClick={() => setEditMode(!editMode)}
          className="justify-center px-1.5 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600"
        >
          {editMode ? "Save Changes" : "Change Contact Info"}
        </button>
        <button
          onClick={handleResetPasswordClick}
          className="justify-center px-2 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600"
        >
          Reset Password
        </button>
      </div>
      {showResetPasswordModal && (
        <ConfirmResetPasswordModal
          onClose={() => setShowResetPasswordModal(false)}
          onConfirm={handleResetPasswordConfirm}
        />
      )}
      {showPasswordResetConfirmation && (
        <PasswordResetConfirmation
          onClose={() => setShowPasswordResetConfirmation(false)}
        />
      )}
    </div>
  );
}

function ProfileDetails() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("John Smith");
  const [designation, setDesignation] = useState("MD");
  const [specialty, setSpecialty] = useState("Neurologist");
  const [department, setDepartment] = useState("Neurology Department");
  const [departmentHead, setDepartmentHead] = useState(
    "Head of the Neurology Department"
  );

  return (
    <div className="flex flex-col grow gap-4 border-r border-black max-md:flex-wrap max-md:mt-10">
      <div className="flex flex-col grow shrink-0 self-start basis-0 w-full max-md:max-w-full">
        {editMode ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2 text-5xl text-red-800 max-md:text-4xl text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="mb-2 text-3xl text-black text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="mb-2 text-3xl text-left text-black max-md:max-w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mb-2 text-3xl text-left text-black max-md:max-w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              value={departmentHead}
              onChange={(e) => setDepartmentHead(e.target.value)}
              className="mb-2 text-3xl text-left text-black max-md:max-w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </>
        ) : (
          <>
            <h1 className="mb-2 text-5xl text-red-800 max-md:text-4xl text-left">
              {name}
            </h1>
            <p className="mb-2 text-3xl text-black text-left">{designation}</p>
            <p className="mb-2 text-3xl text-left text-black max-md:max-w-full">
              {specialty}
            </p>
            <p className="mb-2 text-3xl text-left text-black max-md:max-w-full">
              {department}
            </p>
            <p className="mb-2 text-3xl text-left text-black max-md:max-w-full">
              {departmentHead}
            </p>
          </>
        )}
      </div>
      <button
        onClick={() => setEditMode(!editMode)}
        className="px-5 py-1 text-sm font-medium text-neutral-600 bg-zinc-300 border border-solid border-neutral-600 rounded-lg self-start mt-auto"
      >
        {editMode ? "Save Changes" : "Edit Profile"}
      </button>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="flex flex-col ml-5 w-[76%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-6 max-md:max-w-full">
        <div
          className="px-8 py-7 max-md:px-5 max-md:max-w-full"
          style={{ backgroundColor: "#F5F5DC" }}
        >
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <ProfileDetails />
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleCalendar({ onScheduleChange }) {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="text-3xl font-bold text-center">February 2024</div>
        <img
          loading="lazy"
          src="/dateicon.png"
          className="shrink-0 self-stretch w-8 aspect-[0.91]"
          alt="Relevant alt text describing the image"
        />
        <button
          onClick={onScheduleChange}
          className="justify-center px-1.5 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600"
        >
          Change Schedule
        </button>
      </div>
      <img
        src="/Calandar.png"
        className="grow w-full aspect-[1.64] max-md:mt-10 max-md:max-w-full"
        alt="Schedule"
      />
    </div>
  );
}

function ScheduleImage() {
  return (
    <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex items-center justify-center">
        {" "}
        <div className="text-3xl font-bold">March 2024</div>
      </div>
      <img
        src="/Calandar.png"
        className="grow w-full aspect-[1.64] max-md:mt-10 max-md:max-w-full"
        alt="Schedule"
      />
    </div>
  );
}

function ChangeAvailability({ onRevertToProfile }) {
  function DateSelector({ label }) {
    return (
      <div className="flex flex-col justify-center">
        <div className="justify-center px-2.5 py-1 bg-white border border-black border-solid">
          {label}
        </div>
      </div>
    );
  }

  function TimeRange() {
    return (
      <div className="flex gap-2 mt-2 whitespace-nowrap">
        <div className="shrink-0 bg-white border border-black border-solid h-[17px] w-[79px]" />
        <div className="my-auto">~</div>
        <div className="shrink-0 bg-white border border-black border-solid h-[17px] w-[79px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-8 pt-20 pb-8 bg-white max-md:px-5">
      <section className="flex flex-col px-8 pt-7 pb-2.5 mt-6 bg-lime-50 max-md:px-5 max-md:max-w-full">
        <header className="flex justify-between items-center max-w-full text-red-800">
          <h1 className="text-4xl">Change Availability</h1>
          <h2 className="text-4xl">Notes</h2>
        </header>
        <div className="flex gap-5 justify-between items-start mt-1.5 text-sm font-medium text-black">
          <div className="flex flex-col mt-4 text-xs text-center">
            <h3 className="text-xl">Select Date</h3>
            <div className="flex gap-2 mt-3 whitespace-nowrap">
              <DateSelector label="mmddyyyy" />
              <div className="my-auto">~</div>
              <DateSelector label="mmddyyyy" />
            </div>
            <h3 className="mt-7 text-xl">Select Status</h3>
            <div className="flex gap-0 mt-3">
              <div className="flex flex-col justify-center">
                <div className="justify-center px-1.5 py-1 bg-white border border-black border-solid">
                  Work Hours
                </div>
              </div>
              <div className="flex flex-col justify-center whitespace-nowrap">
                <div className="justify-center px-0.5 py-1 bg-white border border-black border-solid">
                  ▼
                </div>
              </div>
            </div>
            <TimeRange />
          </div>
          <div className="flex flex-col mt-7">
            <p>To select one day, leave second field empty</p>
            <p className="mt-1.5">Work hours are in 24hr format</p>
          </div>
          <div className="flex-1"></div>
          <button
            className="justify-center self-end px-5 py-1 mt-48 text-white whitespace-nowrap bg-red-800 rounded-lg border border-solid border-neutral-600"
            onClick={onRevertToProfile}
          >
            Submit
          </button>
        </div>
      </section>
      <section className="flex flex-col pt-5 pb-10 mt-10 border border-black border-solid">
        <div className="flex flex-col px-8 font-medium">
          <h2 className="text-4xl text-red-800">Preview</h2>
          <div className="flex gap-5 self-center mt-9 text-3xl text-black">
            <div className="flex-auto">February 2024</div>
            <div className="flex-auto">March 2024</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MyComponent() {
  const navigate = useNavigate();

  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const [terminationConfirmed, setTerminationConfirmed] = useState(false);
  const [incorrectName, setIncorrectName] = useState(false);
  const [view, setView] = useState("profile"); // 'profile' or 'changeAvailability'
  const [imgUrl, setImgUrl] = useState("/profilepic.png");
  const { id } = useParams();

  useEffect(() => {
    const fetchUserImg = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URI}/user/profilePicture/url/${id}`
        );

        const txt = await res.text();
        if (res.ok) {
          setImgUrl(txt);
        } else {
          console.log("server responded with error text ", txt);
        }
      } catch (e) {
        console.log("fetch profile image fail");
      }
    };

    fetchUserImg();
  }, [imgUrl, id]);

  // Handles the transition to the account termination confirmation modal
  const handleTerminateAccount = () => setShowTerminationModal(true);
  const handleCloseTerminationModal = () => setShowTerminationModal(false);

  // Handles the transition to the change availability view
  const handleScheduleChange = () => setView("changeAvailability");

  // Handles reverting back to the profile view from change availability view
  const handleRevertToProfile = () => setView("profile");

  // Handles the confirmation of account termination
  const handleTerminationConfirmation = (isConfirmed) => {
    setShowTerminationModal(false);
    if (isConfirmed) {
      setTerminationConfirmed(true);
    } else {
      setIncorrectName(true);
      setTimeout(() => setIncorrectName(false), 3000);
    }
  };

  // Handles returning to the roster view upon account termination
  const handleReturnToRoster = () => {
    setTerminationConfirmed(false);
  };

  // Renders the account termination confirmation view
  if (terminationConfirmed) {
    return <AccountTerminationConfirmation onReturn={handleReturnToRoster} />;
  }

  // Renders the change availability view
  if (view === "changeAvailability") {
    return <ChangeAvailability onRevertToProfile={handleRevertToProfile} />;
  }

  // Default view rendering (profile view)
  return (
    <div className="flex flex-col items-center pt-10 pr-5 pb-8 pl-14 bg-white max-md:pl-5">
      <button
        onClick={handleTerminateAccount}
        className="justify-center self-end px-3 py-1 text-sm font-medium text-white bg-red-800 rounded-lg border border-solid border-neutral-600"
      >
        Terminate Account
      </button>
      <div className="self-stretch mt-2 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[24%] max-md:ml-0 max-md:w-full">
            <ProfileImage imgUrl={imgUrl} setImgUrl={setImgUrl} />
          </div>
          <ProfileSection />
        </div>
      </div>
      <div className="mt-4 w-full max-w-[1286px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <ScheduleCalendar onScheduleChange={handleScheduleChange} />
          <ScheduleImage />
        </div>
        {incorrectName && <p className="text-red-500">Incorrect name</p>}
        {showTerminationModal && (
          <AccountTerminationModal
            onClose={handleCloseTerminationModal}
            onTerminate={handleTerminationConfirmation}
          />
        )}
      </div>
    </div>
  );
}
export default MyComponent;
