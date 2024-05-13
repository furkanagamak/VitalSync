import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../providers/authProvider.js";
import axios from "axios";
import "rsuite/dist/rsuite-no-reset.min.css";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { FormControlLabel, Checkbox } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FaArrowLeft } from "react-icons/fa";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { IoPersonOutline } from "react-icons/io5";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const notify = () => toast.success("Profile successfully updated.");
const notifyErr = () => toast.error("There was an error updating the profile.");

function ImageUploader({ onClose, setImgUrl }) {
  const fileTypes = ["PNG", "JPEG", "GIF", "JPG"];
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams();
  const { user, triggerNavImgRefetch } = useAuth();
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
          triggerNavImgRefetch();
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
          <label
            title="Choose an Image to Upload"
            className="justify-center px-2 py-1.5 rounded-sm border border-black border-solid bg-zinc-300 cursor-pointer"
          >
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
            title="Cancel Image Upload"
          >
            Cancel
          </button>
          <button
            id="imageupload"
            className="flex-1 cursor-pointer bg-red-800 text-white text-center py-1.5 rounded-lg"
            onClick={handleSubmit}
            title="Upload Image"
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

function PasswordResetConfirmation({ onClose, userId, user }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  console.log("1" + user.userId);

  const isValidPassword = (Password) => {
    return Password.length >= 6 && !Password.includes(user.email);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isValidPassword(newPassword)) {
      toast.error("Please enter a valid password.");
      return;
    }

    try {
      const compareResponse = await axios.post("/compare-passwords", {
        userId: user.userId,
        newPassword: newPassword,
      });
      if (compareResponse.data.isSame) {
        toast.error(compareResponse.data.message);
        return;
        toast.success(compareResponse.data.message);
      }
    } catch (error) {
      toast.error(
        "Error comparing passwords: " +
          (error.response?.data?.message || "Unknown error")
      );
      return;
    }

    try {
      const response = await axios.post("/reset-password", {
        userId: user.userId,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        onClose();
        toast.success("Password has been successfully reset.");
      } else {
        toast("Failed to reset password.");
      }
    } catch (error) {
      setError("Error resetting password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[364px] bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
        <div className="px-12 py-4 text-center text-black">
          <p className="text-base leading-5">Enter your new password:</p>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            className="mt-2 p-2 border rounded"
            placeholder="New password"
            style={{ width: "100%", fontSize: "0.875rem" }}
          />
          <input
            id="ConfirmNewPassword"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mt-2 p-2 border rounded"
            placeholder="Confirm new password"
            style={{ width: "100%", fontSize: "0.875rem" }}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-zinc-300 text-black rounded-lg border border-solid border-neutral-600 text-base mb-3"
            title="Close Password Reset Modal"
          >
            Close
          </button>
          <button
            id="resetConfirm"
            type="button"
            onClick={handleSubmit}
            className="px-4 py-3 bg-red-800 text-white rounded-lg border border-solid border-neutral-600 text-base mb-3"
            title="Reset Password"
          >
            Reset Password
          </button>
        </div>
        <p className="text-base text-center mb-2 mx-4">
          The new password must be at least 6 characters long and must not
          include your email address.
        </p>
      </div>
    </div>
  );
}

function ConfirmResetPasswordModal({ user, onClose, onConfirm }) {
  const [currentPassword, setCurrentPassword] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleSubmit = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!user || !user.userId) {
      toast.error("User information is not available.");
      return;
    }

    try {
      const response = await axios.post("/verify-password", {
        userId: user.userId,
        password: currentPassword,
      });

      if (response.data.isPasswordCorrect) {
        onConfirm();
        toast.success("Password verified successfully!");
      } else {
        toast.error("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      toast.error("Failed to verify password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center ConfirmResetPasswordModal">
      <div className="flex flex-col justify-center max-w-[364px] bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
        <div className="text-base leading-6 text-center text-black px-16 py-6">
          To reset your password, please enter your current password.
        </div>
        <div className="flex flex-col gap-3 px-5 pb-5 mt-3">
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter Your Current Password"
            value={currentPassword}
            onChange={handlePasswordChange}
            onKeyPress={handleKeyPress}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ fontSize: "12px" }}
          />
          <div className="flex gap-5 mt-2 text-sm font-medium justify-center">
            <button
              onClick={onClose}
              className="flex-1 justify-center px-5 py-3.5 bg-white rounded-lg border border-solid border-neutral-600 text-neutral-600"
              title="Cancel Password Reset"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 justify-center px-5 py-3.5 bg-red-800 rounded-lg text-white"
              title="Confirm Your Password"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountTerminationModal({
  user,
  onClose,
  onTerminate,
  userId,
  fullName,
  email,
}) {
  console.log("UserId before request:", userId);
  console.log("UserId before request:", fullName);
  console.log("email:", email);
  const [inputEmail, setInputEmail] = useState("");

  const handleNameChange = (e) => setInputEmail(e.target.value);

  const handleSubmit = async () => {
    if (inputEmail.trim().toLowerCase() === email.toLowerCase()) {
      try {
        const response = await axios.put(`/user/${userId}`, {
          isTerminated: true,
        });
        if (response.status === 200) {
          toast.success("User account terminated successfully.");
          onTerminate(true);
        } else {
          toast.error("Failed to terminate account.");
          onTerminate(false);
        }
      } catch (error) {
        console.error("Error terminating account:", error);
        toast.error("Error terminating account: " + error.message);
        onTerminate(false);
      }
    } else {
      toast.error("email does not match.");
      onTerminate(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[436px]">
        <div className="flex flex-col items-center px-7 pt-3.5 pb-7 w-full bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
          <div className="self-stretch text-base leading-6 text-center text-black">
            Are you sure you want to terminate this account? If yes, write the
            email of the person of the account to be terminated.
          </div>
          <input
            id="terminateConfirm"
            type="text"
            value={inputEmail}
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

function ProfileImage({ authUser, id, imgUrl, setImgUrl }) {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="flex flex-col self-stretch my-auto text-sm font-medium text-neutral-600 max-md:mt-10">
      {/* <img loading="lazy" alt="" src={imgUrl} className="w-full aspect-[1]" /> */}
      <div className="h-[300px] w-[300px] overflow-hidden m-auto">
        {!imgUrl && <IoPersonOutline className="h-full w-full text-black" />}
        {imgUrl && (
          <img
            src={imgUrl}
            alt="Profile"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      {id && authUser && authUser.id === id && (
        <div
          className="justify-center self-center p-1 mt-3.5 rounded-lg border border-solid bg-primary text-white border-neutral-600 cursor-pointer"
          onClick={() => setShowUploader(true)}
          title="Change Your Profile Image"
        >
          Change Profile Image
        </div>
      )}
      {showUploader && (
        <ImageUploader
          onClose={() => setShowUploader(false)}
          setImgUrl={setImgUrl}
        />
      )}
    </div>
  );
}

function ContactInfo({ user, authUser, id }) {
  const [editMode, setEditMode] = useState(false);
  const [cellNo, setCellNo] = useState("");
  const [officeNo, setOfficeNo] = useState("");
  const [email, setEmail] = useState("");
  const [office, setOffice] = useState("");
  const [errors, setErrors] = useState({});
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showPasswordResetConfirmation, setShowPasswordResetConfirmation] =
    useState(false);
  const { currentUser } = useAuth();

  const formatPhoneNumber = (input) => {
    // Strip all non-digits and limit input to 10 digits
    const digits = input.replace(/\D/g, "").slice(0, 10);

    // Format the digits with dashes
    const match = digits.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?$/);
    if (!match) return "";

    // Construct the phone number string based on the captured groups
    const part1 = match[1];
    const part2 = match[2] ? `-${match[2]}` : "";
    const part3 = match[3] ? `-${match[3]}` : "";
    return `${part1}${part2}${part3}`;
  };

  useEffect(() => {
    if (user) {
      setCellNo(user.phoneNumber || "");
      setOfficeNo(user.officePhoneNumber || "");
      setEmail(user.email || "");
      setOffice(user.officeLocation || "");
    }
  }, [user]);

  const validatePhoneNumber = (number) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(number);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveChanges = async () => {
    let errorMessages = {};
    if (!validatePhoneNumber(cellNo)) {
      errorMessages.cellNo =
        "Invalid phone number format. Required: XXX-XXX-XXXX";
    }
    if (!validatePhoneNumber(officeNo)) {
      errorMessages.officeNo =
        "Invalid phone number format. Required: XXX-XXX-XXXX";
    }
    if (!validateEmail(email)) {
      errorMessages.email = "Invalid email format.";
    }

    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }

    try {
      const updateData = {
        phoneNumber: cellNo,
        officePhoneNumber: officeNo,
        email,
        officeLocation: office,
      };
      const response = await axios.put(`/user/${user.userId}`, updateData);
      notify();
      setEditMode(false);
      setErrors({}); // Clear any previous errors
    } catch (error) {
      console.error("Failed to update profile:", error);
      notifyErr();
    }
  };

  const handleInputChange = (setterFunction, value, validatorFunction) => {
    const formattedValue =
      setterFunction === setCellNo || setterFunction === setOfficeNo
        ? formatPhoneNumber(value)
        : value;

    setterFunction(formattedValue);
    // Clear the corresponding error if the new value is valid
    if (validatorFunction(formattedValue)) {
      setErrors((prev) => ({ ...prev, [setterFunction.name]: undefined }));
    }
  };

  const handleResetPasswordClick = () => setShowResetPasswordModal(true);

  const handleResetPasswordConfirm = () => {
    setShowResetPasswordModal(false);
    setShowPasswordResetConfirmation(true);
  };

  const isAdmin =
    authUser.accountType === "system admin" ||
    authUser.accountType === "hospital admin";

  console.log("profile is", user?.userId);

  return (
    <div className="flex flex-col mt-1.5 text-xl lg:text-3xl text-black max-md:mt-10">
      <h2 className="text-4xl text-left text-red-800">Contact Information</h2>
      {editMode ? (
        <>
          <input
            id="cellNo"
            type="text"
            value={cellNo}
            onChange={(e) =>
              handleInputChange(setCellNo, e.target.value, validatePhoneNumber)
            }
            className="mt-6 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.cellNo && (
            <div className="text-red-500 text-lg">{errors.cellNo}</div>
          )}
          <input
            id="officeNo"
            type="text"
            value={officeNo}
            onChange={(e) =>
              handleInputChange(
                setOfficeNo,
                e.target.value,
                validatePhoneNumber
              )
            }
            className="mt-3 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.officeNo && (
            <div className="text-red-500 text-lg">{errors.officeNo}</div>
          )}
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              handleInputChange(setEmail, e.target.value, validateEmail)
            }
            className="mt-2.5 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.email && (
            <div className="text-red-500 text-lg">{errors.email}</div>
          )}
          <input
            id="office"
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
        {id && authUser && (authUser.id === id || isAdmin) && (
          <button
            onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
            className="justify-center px-1.5 py-1 rounded-lg border border-solid bg-primary text-white border-neutral-600"
            title={
              editMode
                ? "Save Changes to Contact Information"
                : "Edit Contact Information"
            }
          >
            {editMode ? "Save Changes" : "Edit Contact Info"}
          </button>
        )}
        {id && authUser && authUser.id === id && (
          <button
            onClick={handleResetPasswordClick}
            className="justify-center px-2 py-1 rounded-lg border border-solid bg-primary text-white border-neutral-600"
            title="Reset Your Password"
          >
            Reset Password
          </button>
        )}
      </div>
      {showResetPasswordModal && (
        <ConfirmResetPasswordModal
          user={user}
          onClose={() => setShowResetPasswordModal(false)}
          onConfirm={handleResetPasswordConfirm}
        />
      )}
      {showPasswordResetConfirmation && (
        <PasswordResetConfirmation
          user={user}
          onClose={() => setShowPasswordResetConfirmation(false)}
        />
      )}
    </div>
  );
}

const EditRolesModal = ({ isOpen, onRequestClose, userId }) => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [initialSelectedRoles, setInitialSelectedRoles] = useState([]);

  // Fetch all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await axios.get("/roles");
        setAvailableRoles(result.data);
      } catch (error) {
        toast.error("Failed to fetch roles: " + error.message);
      }
    };
    fetchRoles();
  }, []);

  // Fetch user's current roles
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const result = await axios.get(`/users/${userId}/eligibleRoles`);
        setSelectedRoles(result.data.map((role) => role._id));
        setInitialSelectedRoles(result.data.map((role) => role._id));
      } catch (error) {
        toast.error("Failed to fetch user roles: " + error.message);
      }
    };
    if (userId) {
      fetchUserRoles();
    }
  }, [userId]);

  // Handle role selection changes
  const handleRoleChange = (roleId) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleClose = () => {
    setSelectedRoles(initialSelectedRoles); // Reset to initial state
    onRequestClose(); // Close the modal
  };

  // Save the updated roles
  const saveRoles = async () => {
    try {
      await axios.put(`/updateRoles/${userId}`, { roles: selectedRoles });
      toast.success("Roles successfully updated.");
      setInitialSelectedRoles(selectedRoles); // Update initial state
      onRequestClose(); // Close the modal
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data; // Extract the error message from the response
        toast.error("Failed to update roles: " + errorMessage);
      } else {
        toast.error("Failed to update roles: " + error.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-[#f5f5dc] p-8 rounded-md border-2 border-primary shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Edit Eligible Roles
        </h2>
        <div className="custom-scrollbar space-y-2 overflow-auto max-h-64">
          {availableRoles.map((role) => (
            <div key={role._id} className="flex items-center justify-start">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role._id)}
                onChange={() => handleRoleChange(role._id)}
                className="mr-2"
              />
              <label className="text-lg capitalize mr-3">{role.name}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md hover:underline text-black"
            title="Cancel Changes"
          >
            Cancel
          </button>
          <button
            onClick={saveRoles}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-600"
            title="Save Changes to Eligible Roles"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

function ProfileDetails({ user, authUser, id }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(
    user ? `${user.firstName} ${user.lastName}` : ""
  );
  const [designation, setDesignation] = useState(user ? user.degree : "");
  const [specialty, setSpecialty] = useState(user ? user.position : "");
  const [department, setDepartment] = useState(user ? user.department : "");
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);

  const isAdmin =
    authUser.accountType === "system admin" ||
    authUser.accountType === "hospital admin";

  useEffect(() => {
    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
      setDesignation(user.degree);
      setSpecialty(user.position);
      setDepartment(user.department);
    }
  }, [user]);

  const handleSaveChanges = async () => {
    console.log("Updating user with ID:", user.userId);

    const [firstName, lastName] = name.split(" ");
    const updateData = {
      firstName,
      lastName,
      degree: designation,
      position: specialty,
      department,
    };

    try {
      const response = await axios.put(`/user/${user.userId}`, updateData);
      notify();
      setEditMode(false); // Optionally reset edit mode
    } catch (error) {
      console.error("Failed to update profile:", error);
      notifyErr();
    }
  };

  return (
    <div className="flex flex-col grow gap-4 lg:border-r border-black max-md:flex-wrap max-md:mt-10">
      <div className="flex flex-col grow shrink-0 self-start basis-0 w-full max-md:max-w-full">
        {editMode ? (
          <>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2 text-5xl text-red-800 max-md:text-4xl text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              id="designation"
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="mb-2 text-3xl text-black text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              id="specialty"
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="mb-2 text-3xl text-left text-black max-md:max-w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mb-2 text-3xl text-left text-black max-md:max-w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </>
        ) : (
          <>
            <h1 className="mb-2 text-5xl text-red-800 max-md:text-4xl text-left">
              {name}
            </h1>
            <p className="mb-2 text-3xl text-black text-left">
              <span className="text-red-800">Degree: </span>
              {designation}
            </p>
            <p className="mb-2 text-3xl text-left text-black max-md:max-w-full">
              <span className="text-red-800">Position: </span>
              {specialty}
            </p>
            <p className="mb-2 text-3xl text-left text-black max-md:max-w-full">
              <span className="text-red-800">Department: </span>
              {department}
            </p>
          </>
        )}
      </div>
      {id && authUser && (authUser.id === id || isAdmin) && (
        <button
          onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
          className="px-5 py-1 text-sm font-medium bg-primary text-white border border-solid border-neutral-600 rounded-lg self-start mt-auto"
          title={
            editMode
              ? "Save Changes to Profile Information"
              : "Edit Profile Information"
          }
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      )}
      {id && authUser && (authUser.id === id || isAdmin) && (
        <button
          className="px-5 py-1 text-sm font-medium bg-primary text-white border border-solid border-neutral-600 rounded-lg self-start mt-auto"
          onClick={() => setIsRolesModalOpen(true)}
          title="Edit Eligible Roles"
        >
          Edit Eligible Roles
        </button>
      )}
      <EditRolesModal
        isOpen={isRolesModalOpen}
        onRequestClose={() => setIsRolesModalOpen(false)}
        userId={user?.userId}
      />
    </div>
  );
}

function ProfileSection({ user, authUser, id }) {
  return (
    <div className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-6 max-md:max-w-full">
        <div
          className="px-8 py-7 max-md:px-5 max-md:max-w-full"
          style={{ backgroundColor: "#F5F5DC" }}
        >
          <div className="flex flex-col xl:flex-row gap-5 w-full">
            <div className="flex-1">
              <ProfileDetails user={user} authUser={authUser} id={id} />
            </div>
            <div className="flex-2">
              <ContactInfo user={user} authUser={authUser} id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleCalendar({ user, onScheduleChange, preview, authUser, id }) {
  const today = new Date();
  const threeYearsLater = new Date(
    today.getFullYear() + 3,
    today.getMonth(),
    today.getDate()
  );

  const customStyles = {};

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  };

  const getTimeOffsForDay = (date) => {
    const dateStr = date.toISOString().substring(0, 10);
    return user.unavailableTimes.filter((u) => {
      const startDayStr = new Date(u.start).toISOString().substring(0, 10);
      const endDayStr = new Date(u.end).toISOString().substring(0, 10);
      return dateStr >= startDayStr && dateStr <= endDayStr;
    });
  };

  const getWorkingHoursForDay = (date, usualHours) => {
    if (
      !usualHours ||
      (usualHours.start === "0:00" && usualHours.end === "0:00")
    )
      return ["Off"]; // No working hours

    const dateStr = date.toISOString().substring(0, 10);
    const usualStart = parseTime(usualHours.start);
    const usualEnd = parseTime(usualHours.end);

    // Get time offs that affect the current day
    const timeOffs = getTimeOffsForDay(date);
    let segments = [];
    let currentStart = { ...usualStart };

    timeOffs
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .forEach((timeOff) => {
        const timeOffStartDate = new Date(timeOff.start);
        const timeOffEndDate = new Date(timeOff.end);
        let timeOffStart = parseTime(
          timeOffStartDate.toLocaleTimeString("it-IT")
        );
        let timeOffEnd = parseTime(timeOffEndDate.toLocaleTimeString("it-IT"));

        // Adjust for multi-day unavailability starting before or on the current day
        if (timeOffStartDate.toISOString().substring(0, 10) < dateStr) {
          timeOffStart = { ...timeOffStart, hours: 0, minutes: 0 };
        }
        // Adjust for multi-day unavailability ending on or after the current day
        if (timeOffEndDate.toISOString().substring(0, 10) > dateStr) {
          timeOffEnd = { ...timeOffEnd, hours: 23, minutes: 59 };
        }

        // Check if the time off is during working hours
        if (
          timeOffEnd.hours < usualStart.hours ||
          timeOffStart.hours > usualEnd.hours
        ) {
          // Time off is completely outside working hours, ignore
        } else {
          // Adjust start time if time off starts before working hours
          if (
            timeOffStart.hours < usualStart.hours ||
            (timeOffStart.hours === usualStart.hours &&
              timeOffStart.minutes < usualStart.minutes)
          ) {
            timeOffStart = { ...usualStart };
          }
          // Adjust end time if time off ends after working hours
          if (
            timeOffEnd.hours > usualEnd.hours ||
            (timeOffEnd.hours === usualEnd.hours &&
              timeOffEnd.minutes > usualEnd.minutes)
          ) {
            timeOffEnd = { ...usualEnd };
          }
          // Add working segment before the time off
          if (
            currentStart.hours < timeOffStart.hours ||
            (currentStart.hours === timeOffStart.hours &&
              currentStart.minutes < timeOffStart.minutes)
          ) {
            segments.push(
              `${currentStart.hours}:${currentStart.minutes
                .toString()
                .padStart(2, "0")} - ${
                timeOffStart.hours
              }:${timeOffStart.minutes.toString().padStart(2, "0")}`
            );
          }
          currentStart = timeOffEnd;
        }
      });

    // Add the remaining time after the last unavailability
    if (
      currentStart.hours < usualEnd.hours ||
      (currentStart.hours === usualEnd.hours &&
        currentStart.minutes < usualEnd.minutes)
    ) {
      segments.push(
        `${currentStart.hours}:${currentStart.minutes
          .toString()
          .padStart(2, "0")} - ${usualEnd.hours}:${usualEnd.minutes
          .toString()
          .padStart(2, "0")}`
      );
    }

    return segments.length ? segments : ["Off"];
  };

  const getUsualHoursForDay = (day) => {
    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weekday = weekdayNames[day]; // No need to adjust if array is aligned properly
    const hours = user.usualHours.find((uh) => uh.day === weekday);

    return hours || { start: "0:00", end: "0:00" }; // Provide default 'Off' hours if no match is found
  };

  if (!user) {
    return;
  }

  const isAdmin =
    authUser.accountType === "system admin" ||
    authUser.accountType === "hospital admin";

  return (
    <div>
      {!preview && id && authUser && (authUser.id === id || isAdmin) && (
        <button
          onClick={onScheduleChange}
          className="mt-2 mb-5 justify-center px-1.5 py-1 rounded-lg border border-solid bg-primary text-white border-neutral-600"
          title="Edit Schedule for Availability"
        >
          Edit Schedule
        </button>
      )}
      <div className="text-left md:text-center">
        <Calendar
          minDate={today}
          maxDate={threeYearsLater}
          tileContent={({ date, view }) => {
            if (view === "month") {
              const usualHours = getUsualHoursForDay(date.getDay());
              const workingHours = getWorkingHoursForDay(date, usualHours);
              return (
                <div style={customStyles.tile}>
                  <div className="text-md mt-4">{workingHours.join(", ")}</div>
                </div>
              );
            }
          }}
          navigationLabel={({ label }) => (
            <div style={customStyles.monthYearHeader}>{label}</div>
          )}
          prevLabel={
            <div
              className="xl:min-w-[300px]"
              style={customStyles.navigationButton}
            >
              ‹
            </div>
          }
          nextLabel={
            <div
              className="xl:min-w-[300px]"
              style={customStyles.navigationButton}
            >
              ›
            </div>
          }
        />
      </div>
    </div>
  );
}
function ChangeAvailability({
  user,
  onRevertToProfile,
  setUser,
  authUser,
  id,
}) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [weeklySchedule, setWeeklySchedule] = useState([...user.usualHours]);
  const [previewSchedule, setPreviewSchedule] = useState([...user.usualHours]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [markedForDeletion, setMarkedForDeletion] = useState([]);

  const handleStartTimeChange = (newValue) => {
    setStartTime(newValue);
    setEndTime(new Date(newValue.getTime() + 3600000));
  };

  const handleEndTimeChange = (newValue) => {
    setEndTime(newValue);
  };

  useEffect(() => {
    setPreviewSchedule([...weeklySchedule]);
  }, [weeklySchedule]);

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleWeekdayHoursChange = (day, field, value) => {
    const updatedSchedule = weeklySchedule.map((schedule) => {
      if (schedule.day === day) {
        const newSchedule = { ...schedule, [field]: value };
        // Ensure start time is not later than end time
        if (
          new Date(`1970-01-01T${newSchedule.start}`) >=
          new Date(`1970-01-01T${newSchedule.end}`)
        ) {
          setErrors((prev) => ({
            ...prev,
            [day]: "Start time must be earlier than end time",
          }));
        } else {
          delete errors[day]; // Clear errors if the times are valid
          setErrors({ ...errors });
          return newSchedule;
        }
      }
      return schedule;
    });
    setWeeklySchedule(updatedSchedule);
  };

  const handleToggleDayOff = (day) => {
    const updatedSchedule = weeklySchedule.map((schedule) =>
      schedule.day === day
        ? { ...schedule, start: "0:00", end: "0:00" }
        : schedule
    );
    setWeeklySchedule(updatedSchedule);
  };

  const handleBackWithoutSaving = () => {
    setWeeklySchedule([...user.usualHours]);
    onRevertToProfile();
  };

  const handleSubmitTimeOff = async () => {
    if (
      (!startTime || !endTime || !status.trim()) &&
      markedForDeletion.length === 0
    ) {
      toast.error("Please fill in all fields or mark items for deletion.", {
        id: "profileFailure",
      });
      return;
    }

    if (
      (startTime && endTime && !status.trim()) ||
      (status.trim() && (!startTime || !endTime))
    ) {
      setErrors({ msg: "Please complete all fields for new time off." });
      toast.error("Please complete all fields for new time off.");
      return;
    }

    let newUnavailableTime = null;
    try {
      newUnavailableTime =
        startTime && endTime && status.trim()
          ? {
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              reason: status,
            }
          : null;
    } catch (error) {
      console.error("Error with date values: ", error);
      toast.error(
        "Invalid date values provided. Please check the dates again."
      );
      return;
    }

    const updateData = {
      unavailableTimes: newUnavailableTime ? [newUnavailableTime] : [],
      deletedTimes: markedForDeletion,
    };

    try {
      const response = await axios.put(`/user/${user.userId}`, updateData);
      if (response.status === 200) {
        toast.success("Availability successfully updated.");
        setUser((prevState) => ({
          ...prevState,
          usualHours: weeklySchedule,
          unavailableTimes: [
            ...prevState.unavailableTimes.filter(
              (time) => !markedForDeletion.includes(time._id)
            ),
            ...(newUnavailableTime ? [newUnavailableTime] : []),
          ],
        }));
        onRevertToProfile();
      } else {
        toast.error("Failed to update availability.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        "Error updating user: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleToggleDeleteTimeOff = (timeOffId) => {
    if (markedForDeletion.includes(timeOffId)) {
      setMarkedForDeletion(markedForDeletion.filter((id) => id !== timeOffId));
    } else {
      setMarkedForDeletion([...markedForDeletion, timeOffId]);
    }
  };

  const handleSubmitWeeklySchedule = async () => {
    const updateData = {
      usualHours: weeklySchedule,
    };

    try {
      const response = await axios.put(`/user/${user.userId}`, updateData);
      if (response.status === 200) {
        toast.success("Weekly schedule updated successfully!");
        setUser({ ...user, usualHours: weeklySchedule });
        onRevertToProfile();
      } else {
        toast.error("Failed to update weekly schedule.");
      }
    } catch (error) {
      console.error("Error updating weekly schedule:", error);
      toast.error("Error updating weekly schedule: " + error.message);
    }
  };

  const validUnavailableTimes = user.unavailableTimes.filter(
    (timeOff) => timeOff.reason !== undefined
  );

  return (
    <div className="flex flex-col px-8 pt-10 pb-8 bg-white">
      <button
        onClick={handleBackWithoutSaving}
        className="bg-primary text-white rounded-full px-5 py-2 text-xl flex items-center xl:w-1/6"
      >
        <FaArrowLeft className="mr-2" />
        <span className="mx-auto">Back to Profile</span>
      </button>
      <section className="flex flex-col px-8 pt-7 pb-2.5 mt-6 bg-lime-50">
        <header className="flex justify-between items-center max-w-full text-red-800 mb-5">
          <h1 className="text-4xl">Time-Off Request</h1>
        </header>
        <div className="flex flex-col mt-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="flex ">
              <div className="mr-5">
                <DateTimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <DateTimePicker
                label="End Time"
                value={endTime}
                onChange={handleEndTimeChange}
                minDateTime={
                  startTime ? new Date(startTime.getTime() + 3600000) : null
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div className="bg-white my-5 xl:w-1/2">
              <TextField
                fullWidth
                label="Reason for Request"
                value={status}
                onChange={handleStatusChange}
                variant="outlined"
                multiline
                rows={3}
              />
            </div>
          </LocalizationProvider>
          <div className="flex-grow">
            <h2 className="text-2xl text-primary">Scheduled Time-Offs</h2>
            <p className="text-md mb-2">Click to mark/unmark for deletion:</p>
            <ul>
              {validUnavailableTimes.map((timeOff) => (
                <li
                  key={timeOff._id}
                  style={{
                    opacity: markedForDeletion.includes(timeOff._id) ? 0.3 : 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleToggleDeleteTimeOff(timeOff._id)}
                    color="error"
                  >
                    {markedForDeletion.includes(timeOff._id) ? (
                      <RestoreFromTrashIcon />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                  {`${new Date(timeOff.start).toLocaleString()} - ${new Date(
                    timeOff.end
                  ).toLocaleString()}`}
                  <span className="text-primary text-xl mx-2">| Reason:</span>
                  {`${timeOff.reason}`}
                </li>
              ))}
            </ul>

            {user.unavailableTimes.length === 0 && (
              <div className="text-2xl pb-4">
                <h2>No scheduled time-offs.</h2>
              </div>
            )}
          </div>
          {errors.msg && <div style={{ color: "red" }}>{errors.msg}</div>}
          <button
            className="my-5 bg-primary text-white px-5 py-2.5 text-lg rounded-full cursor-pointer w-2/5 mx-auto max-w-xs"
            onClick={handleSubmitTimeOff}
            title="Submit Time-Off Request"
          >
            Submit Changes
          </button>
        </div>
      </section>
      <section className="flex flex-col px-8 pt-7 pb-2.5 mt-6 bg-lime-50">
        <header className="flex flex-col  xl:flex-row justify-between items-center max-w-full text-red-800 mb-5">
          <h1 className="text-4xl">Weekly Schedule Update</h1>
          <p className="text-lg mt-2 xl:mt-0">
            Please ensure that the start time is before the end time.
          </p>
        </header>
        <div className="flex flex-col mt-4 space-y-6">
          {weeklySchedule.map((schedule, index) => (
            <div
              key={index}
              className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-center"
            >
              <div className="col-span-1 xl:col-span-1">
                <p className="text-2xl">{schedule.day}</p>
              </div>
              <div className="col-span-1">
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={schedule.start}
                  onChange={(e) =>
                    handleWeekdayHoursChange(
                      schedule.day,
                      "start",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="col-span-1 xl:col-span-1">
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={schedule.end}
                  onChange={(e) =>
                    handleWeekdayHoursChange(
                      schedule.day,
                      "end",
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="col-span-1 xl:col-span-1 flex justify-between xl:justify-start items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      className="ml-5 xl:ml-0"
                      checked={
                        schedule.start === "0:00" && schedule.end === "0:00"
                      }
                      onChange={() => handleToggleDayOff(schedule.day)}
                    />
                  }
                  label="Day Off"
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmitWeeklySchedule}
            className="bg-primary text-white px-5 py-2.5 text-lg rounded-full cursor-pointer w-2/5 mx-auto max-w-xs"
            title="Update Weekly Schedule"
          >
            Update Schedule
          </button>
          <div className="text-center mt-10">
            <h2 className="text-3xl text-primary mb-5">
              Preview Weekly Schedule
            </h2>
            <div className="mx-auto flex xl:justify-center">
              <ScheduleCalendar
                className="mt-10"
                user={{ ...user, usualHours: previewSchedule }}
                onScheduleChange={() => {}}
                preview={true}
                authUser={authUser}
                id={id}
              />
            </div>
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
  const [imgUrl, setImgUrl] = useState("/user.png");
  const { id } = useParams();
  const [user, setUser] = useState(null); // State to hold the user data
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/${id}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchUserProfilePicture = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user/profilePicture/url/${id}`
        );
        const txt = await res.text();
        if (res.ok && txt !== "") {
          return txt;
        }
      } catch (e) {
        console.log("fetch profile image fail");
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [userData, profileImgUrl] = await Promise.all([
          fetchUserData(),
          fetchUserProfilePicture(),
        ]);

        if (userData) setUser(userData);
        if (profileImgUrl) setImgUrl(profileImgUrl);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id, imgUrl]);

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
    return (
      <ChangeAvailability
        onRevertToProfile={handleRevertToProfile}
        user={user}
        setUser={setUser}
        authUser={authUser}
        id={id}
      />
    );
  }

  if (isLoading || !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#8E0000"} />
      </div>
    );
  }

  const isAdmin =
    authUser.accountType === "system admin" ||
    authUser.accountType === "hospital admin";

  // Default view rendering (profile view)
  return (
    <div className="flex flex-col lg:items-center pt-10 pr-5 pb-8 pl-14 bg-white max-md:pl-5">
      {id && authUser && authUser.id !== id && isAdmin && (
        <button
          onClick={handleTerminateAccount}
          className="justify-center self-end px-3 py-1 text-sm font-medium text-white bg-primary rounded-lg border border-solid border-neutral-600"
        >
          Terminate Account
        </button>
      )}
      <div className="self-stretch mt-2 max-md:max-w-full">
        <div className="flex gap-5 flex-col xl:flex-row max-md:gap-0">
          <div className="flex flex-col w-[24%] max-md:ml-0 max-md:w-full">
            <ProfileImage
              authUser={authUser}
              id={id}
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
            />
          </div>
          <ProfileSection user={user} authUser={authUser} id={id} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full my-5">
          <ScheduleCalendar
            user={user}
            onScheduleChange={handleScheduleChange}
            preview={false}
            authUser={authUser}
            id={id}
          />
        </div>

        {showTerminationModal && user && (
          <AccountTerminationModal
            onClose={handleCloseTerminationModal}
            onTerminate={handleTerminationConfirmation}
            userId={id}
            user={user}
            fullName={`${user.firstName} ${user.lastName}`} // Safe access since we check if user exists
            email={user.email}
          />
        )}
      </div>
    </div>
  );
}
export default MyComponent;
