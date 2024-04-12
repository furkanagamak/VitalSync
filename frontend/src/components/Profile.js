import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../providers/authProvider.js";
import axios from "axios";
import { useReducer } from "react";
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; 
import { TextField, FormControl, Select, MenuItem, InputLabel, Button } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';


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

function PasswordResetConfirmation({ onClose, userId }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('/reset-password', {
        userId: userId,
        newPassword: newPassword
      });

      if (response.status === 200) {
        onClose();
        alert("Password has been successfully reset.");
      } else {
        setError("Failed to reset password.");
      }
    } catch (error) {
      setError("Error resetting password.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[364px] bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
        <div className="px-12 py-4 text-center text-black">
          <p className="text-sm leading-5">Enter your new password:</p>
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            className="mt-2 p-2 border rounded w-full"
            placeholder="New password"
            style={{ maxWidth: '200px', fontSize: '0.875rem' }}  // 14px
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mt-2 p-2 border rounded w-full"
            placeholder="Confirm new password"
            style={{ maxWidth: '200px', fontSize: '0.875rem' }}  // 14px
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex justify-evenly mt-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1 bg-red-800 text-white rounded-lg border border-solid border-neutral-600 text-xs"
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 bg-zinc-300 text-black rounded-lg border border-solid border-neutral-600 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmResetPasswordModal({ user,onClose, onConfirm }) {
  const [currentPassword, setCurrentPassword] = useState('');

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
      const response = await axios.post('/verify-password', {
        userId: user.userId,
        password: currentPassword
      });
  
      if (response.data.isPasswordCorrect) {
        onConfirm();
        toast.success("Password verified successfully!");
      } else {
        toast.error("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast.error("Failed to verify password. Please try again.");
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[364px] bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
        <div className="text-base leading-6 text-center text-black px-16 py-6">
          To reset the Password enter your current Password
        </div>
        <div className="flex flex-col gap-3 px-5 pb-5 mt-3">
          <input
            type="password"
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={handlePasswordChange}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            style={{ fontSize: '12px' }} 
          />
          <div className="flex gap-5 mt-2 text-sm font-medium justify-center">
            <button
              onClick={onClose}
              className="flex-1 justify-center px-5 py-3.5 bg-white rounded-lg border border-solid border-neutral-600 text-neutral-600"
            >
              No
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 justify-center px-5 py-3.5 bg-red-800 rounded-lg text-white"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountTerminationModal({ user, onClose, onTerminate, userId, fullName }) {
  console.log("UserId before request:", userId);
  console.log("UserId before request:", fullName);
  const [inputName, setInputName] = useState("");

  const handleNameChange = (e) => setInputName(e.target.value);

  const handleSubmit = async () => {
    if (inputName.trim().toLowerCase() === fullName.toLowerCase()) {
      try {
        
        const response = await axios.put(`/user/${userId}`, { isTerminated: true });
        if (response.status === 200) {
          toast.success('User account terminated successfully.');
          onTerminate(true);
        } else {
          toast.error('Failed to terminate account.');
          onTerminate(false);
        }
      } catch (error) {
        console.error('Error terminating account:', error);
        toast.error('Error terminating account: ' + error.message);
        onTerminate(false);
      }
    } else {
      toast.error('Name does not match.');
      onTerminate(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col justify-center max-w-[436px]">
        <div className="flex flex-col items-center px-7 pt-3.5 pb-7 w-full bg-lime-50 rounded-lg border border-red-800 border-solid shadow">
          <div className="self-stretch text-base leading-6 text-center text-black">
            Are you sure you want to terminate this account? If yes, write the full name of the person of the account to be terminated.
          </div>
          <input
            type="text"
            value={inputName}
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

function ContactInfo({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [cellNo, setCellNo] = useState('');
  const [officeNo, setOfficeNo] = useState('');
  const [email, setEmail] = useState('');
  const [office, setOffice] = useState('');
  const [errors, setErrors] = useState({});
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showPasswordResetConfirmation, setShowPasswordResetConfirmation] = useState(false);
  const { currentUser } = useAuth();


  useEffect(() => {
    if (user) {
      setCellNo(user.phoneNumber || '');
      setOfficeNo(user.officePhoneNumber || '');
      setEmail(user.email || '');
      setOffice(user.officeLocation || '');
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
      errorMessages.cellNo = 'Invalid phone number format. Required: XXX-XXX-XXXX';
    }
    if (!validatePhoneNumber(officeNo)) {
      errorMessages.officeNo = 'Invalid phone number format. Required: XXX-XXX-XXXX';
    }
    if (!validateEmail(email)) {
      errorMessages.email = 'Invalid email format.';
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
        officeLocation: office
      };
      const response = await axios.put(`/user/${user.userId}`, updateData);
      notify();
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      notifyErr();
    }
  };

  const handleInputChange = (setterFunction, value, validatorFunction) => {
    setterFunction(value);
    // Clear the corresponding error if the new value is valid
    if (validatorFunction(value)) {
      setErrors((prev) => ({ ...prev, [setterFunction.name]: undefined }));
    }
  };

  const handleResetPasswordClick = () => setShowResetPasswordModal(true);

  const handleResetPasswordConfirm = () => {
    setShowResetPasswordModal(false);
    setShowPasswordResetConfirmation(true);
  };

 
  console.log("profile is",user?.userId)

  return (
    <div className="flex flex-col mt-1.5 text-3xl text-black max-md:mt-10">
      <h2 className="text-4xl text-left text-red-800">Contact Information</h2>
      {editMode ? (
        <>
          <input
            type="text"
            value={cellNo}
            onChange={(e) => handleInputChange(setCellNo, e.target.value, validatePhoneNumber)}
            className="mt-6 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.cellNo && <div className="text-red-500 text-lg">{errors.cellNo}</div>}
          <input
            type="text"
            value={officeNo}
            onChange={(e) => handleInputChange(setOfficeNo, e.target.value, validatePhoneNumber)}
            className="mt-3 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.officeNo && <div className="text-red-500 text-lg">{errors.officeNo}</div>}
          <input
            type="email"
            value={email}
            onChange={(e) => handleInputChange(setEmail, e.target.value, validateEmail)}
            className="mt-2.5 text-left border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.email && <div className="text-red-500 text-lg" >{errors.email}</div>}
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
          onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
          className="justify-center px-1.5 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600"
        >
          {editMode ? "Save Changes" : "Edit Contact Info"}
        </button>
        {currentUser?.userId !== user?.userId && (
          

        <button
          onClick={handleResetPasswordClick}
          className="justify-center px-2 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600"
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
          onClose={() => setShowPasswordResetConfirmation(false)}
        />
      )}
    </div>
  );
}


function ProfileDetails({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [designation, setDesignation] = useState(user ? user.degree : '');
  const [specialty, setSpecialty] = useState(user ? user.position : '');
  const [department, setDepartment] = useState(user ? user.department : '');

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

    const [firstName, lastName] = name.split(' ');
    const updateData = {
      firstName,
      lastName,
      degree: designation,
      position: specialty,
      department
    };


    try {
      const response = await axios.put(`/user/${user.userId}`, updateData);
      notify();
      setEditMode(false); // Optionally reset edit mode
      console.log(response.data);
    } catch (error) {
      console.error('Failed to update profile:', error);
      notifyErr();
    }
  };

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
          </>
        )}
      </div>
      <button
        onClick={editMode ? handleSaveChanges : () => setEditMode(true)}
        className="px-5 py-1 text-sm font-medium text-neutral-600 bg-zinc-300 border border-solid border-neutral-600 rounded-lg self-start mt-auto"
      >
        {editMode ? "Save Changes" : "Edit Profile"}
      </button>
    </div>
  );
}

function ProfileSection({ user }) {
  return (
    <div className="flex flex-col ml-5 w-full max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-6 max-md:max-w-full">
        <div
          className="px-8 py-7 max-md:px-5 max-md:max-w-full"
          style={{ backgroundColor: "#F5F5DC" }}
        >
          <div className="flex flex-row gap-5 max-md:flex-col max-md:gap-0 w-full">
            <div className="flex-1 min-w-0">
              <ProfileDetails user={user}/>
            </div>
            <div className="flex-2 min-w-0 pr-10">
              <ContactInfo user={user}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const ScheduleCalendar = ({ user, onScheduleChange, preview }) => {
  
  const today = new Date();
  const threeYearsLater = new Date(today.getFullYear() + 3, today.getMonth(), today.getDate());

  const customStyles = {
    calendarContainer: {
      width: '100%',
      maxWidth: '1000px', 
      margin: '0 auto',
    },
    calendar: {

      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      color: '#333',
    },
    navigationButton: {
      backgroundColor: '#912424',
      color: 'white',
      borderRadius: '10px',
      padding: '5px',
      marginTop: "1vh"
    },
    monthYearHeader: {
      backgroundColor: '#8e0000',
      color: 'white',
      padding: '5px',
      width:"90%",
      margin: '0 auto',
      borderRadius: '10px',
      fontSize: "2.5em",
      marginTop: "1vh"
    },
    tile: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    dateText: {
      color: '#8e0000',
      fontWeight: 'bold',
      fontSize: "2em",
    }
  };

  // Updated to ensure date and time handling is accurate
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  };

  const getTimeOffsForDay = (date) => {
    const dateStr = date.toISOString().substring(0, 10);
    return user.unavailableTimes.filter(u => {
      const startDayStr = new Date(u.start).toISOString().substring(0, 10);
      const endDayStr = new Date(u.end).toISOString().substring(0, 10);
      return dateStr >= startDayStr && dateStr <= endDayStr;
    });
  };

  const getWorkingHoursForDay = (date, usualHours) => {
    
    if (!usualHours || usualHours.start === '0:00' && usualHours.end === '0:00') return ['Off'];  // Check for 'Off' hours
  
    const timeOffs = getTimeOffsForDay(date);
    let segments = [];
    let currentStart = parseTime(usualHours.start);
  
    timeOffs.sort((a, b) => new Date(a.start) - new Date(b.start)).forEach(timeOff => {
      const timeOffStart = parseTime(new Date(timeOff.start).toLocaleTimeString('it-IT'));
      const timeOffEnd = parseTime(new Date(timeOff.end).toLocaleTimeString('it-IT'));
      if (currentStart.hours < timeOffStart.hours || 
          (currentStart.hours === timeOffStart.hours && currentStart.minutes < timeOffStart.minutes)) {
        segments.push(`${currentStart.hours}:${currentStart.minutes.toString().padStart(2, '0')}-${timeOffStart.hours}:${timeOffStart.minutes.toString().padStart(2, '0')}`);
      }
      currentStart = timeOffEnd;
    });
  
    if (currentStart.hours < parseTime(usualHours.end).hours) {
      segments.push(`${currentStart.hours}:${currentStart.minutes.toString().padStart(2, '0')}-${parseTime(usualHours.end).hours}:${parseTime(usualHours.end).minutes.toString().padStart(2, '0')}`);
    }
  
    return segments.length ? segments : ['Off'];  // Display 'Off' if no segments are created
  };

  const getUsualHoursForDay = (day) => {
    // Calendar UI starts the week on Monday (0 = Monday, 6 = Sunday)
    const adjustedDay = (day + 6) % 7;  // Adjust so 0 = Sunday, 6 = Saturday if needed
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][adjustedDay];
    const hours = user.usualHours.find(uh => uh.day === weekday);
    return hours || { start: '0:00', end: '0:00' };  // Provide default 'Off' hours if no match is found
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div style={customStyles.calendarContainer}>
      
      {
        !preview && (
          <button
            onClick={onScheduleChange}
            className="mt-2 mb-5 justify-center px-1.5 py-1 rounded-lg border border-solid bg-zinc-300 border-neutral-600"
          >
            Edit Schedule
          </button>
        )
      }
      <Calendar
        minDate={today}
        maxDate={threeYearsLater}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const usualHours = getUsualHoursForDay(date.getDay());
            const workingHours = getWorkingHoursForDay(date, usualHours);
            return (
              <div style={customStyles.tile}>
                <span style={customStyles.dateText}>{date.getDate()}</span>
                <div className="text-md mt-4">
                  {workingHours.join(', ')}
                </div>
              </div>
            );
          }
        }}
        navigationLabel={({ label }) => (
          <div style={customStyles.monthYearHeader}>{label}</div>
        )}
        prevLabel={<div style={customStyles.navigationButton}>‹</div>}
        nextLabel={<div style={customStyles.navigationButton}>›</div>}
        style={customStyles.calendar}
      />
    </div>
  );
};

function ChangeAvailability({ user, onRevertToProfile , setUser}) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [status, setStatus] = useState('Work Hours');
  const [errors, setErrors] = useState({});
  const [weeklySchedule, setWeeklySchedule] = useState([...user.usualHours]);
  const [previewSchedule, setPreviewSchedule] = useState([...user.usualHours]);

  useEffect(() => {
    setPreviewSchedule([...weeklySchedule]);
  }, [weeklySchedule]);

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleWeekdayHoursChange = (day, hours) => {
    const updatedSchedule = weeklySchedule.map(schedule =>
      schedule.day === day ? { ...schedule, ...hours } : schedule
    );
    setWeeklySchedule(updatedSchedule);
  };

  // When the user wants to go back without saving
  const handleBackWithoutSaving = () => {
    setWeeklySchedule([...user.usualHours]);  // Reset any changes made
    onRevertToProfile();  // Switch back to the profile view
  };

  const handleSubmitTimeOff = async () => {
    if (!dateRange[0] || !dateRange[1] || !status) {
      setErrors({ msg: 'Please fill in all fields.' });
      return;
    }

    const updateData = {
      unavailableTimes: [...user.unavailableTimes, {
        start: dateRange[0],
        end: dateRange[1],
        reason: status
      }]
    };

    try {
      const response = await axios.put(`/user/${user.userId}`, updateData);
      if (response.status === 200) {
        toast.success('Availability updated successfully!');
        onRevertToProfile(); // Assuming this function re-fetches user data or redirects
      } else {
        toast.error('Failed to update availability.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user: ' + error.message);
    }
  };

  const handleSubmitWeeklySchedule = async () => {
    const updateData = {
      usualHours: weeklySchedule
    };
  
    try {
      const response = await axios.put(`/user/${user.userId}`, updateData);
      if (response.status === 200) {
        toast.success('Weekly schedule updated successfully!');
        setUser({ ...user, usualHours: weeklySchedule }); // Update user state
        onRevertToProfile();
      } else {
        toast.error('Failed to update weekly schedule.');
      }
    } catch (error) {
      console.error('Error updating weekly schedule:', error);
      toast.error('Error updating weekly schedule: ' + error.message);
    }
  };

  

  return (
    <div className="flex flex-col px-8 pt-20 pb-8 bg-white">
      <button onClick={handleBackWithoutSaving} className="mb-4 bg-primary p-2 rounded text-white text-xl w-1/6">
        Back to Profile
      </button>
      <section className="flex flex-col px-8 pt-7 pb-2.5 mt-6 bg-lime-50">
        <header className="flex justify-between items-center max-w-full text-red-800">
          <h1 className="text-4xl">Time-Off Request</h1>
        </header>
        <div className="flex flex-col mt-4">
          <DateRangePicker
            showOneCalendar
            appearance="default"
            placeholder="Select Date Range"
            format="yyyy-MM-dd HH:mm"
            value={dateRange}
            onChange={handleDateChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="On-Call">On-Call</MenuItem>
              <MenuItem value="Time-Off">Time-Off</MenuItem>
              <MenuItem value="Vacation">Vacation</MenuItem>
            </Select>
          </FormControl>
          {errors.msg && <div style={{ color: 'red' }}>{errors.msg}</div>}
          <button color="#8e0000" onClick={handleSubmitTimeOff}>
            Submit
          </button>
        </div>
      </section>
      <section className="flex flex-col px-8 pt-7 pb-2.5 mt-6 bg-lime-50">
        <header className="flex justify-between items-center max-w-full text-red-800">
          <h1 className="text-4xl">Weekly Schedule Update</h1>
        </header>
        <div className="flex flex-col mt-4">
          {weeklySchedule.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center">
              <p>{schedule.day}</p>
              <TextField
                label="Start Time"
                type="time"
                value={schedule.start}
                onChange={(e) => handleWeekdayHoursChange(schedule.day, { start: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Time"
                type="time"
                value={schedule.end}
                onChange={(e) => handleWeekdayHoursChange(schedule.day, { end: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          ))}
          <button color="#8e0000" onClick={handleSubmitWeeklySchedule}>
            Update Schedule
          </button>

          <ScheduleCalendar user={{...user, usualHours: previewSchedule}} onScheduleChange={() => {}} preview={true} />
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
  const [imgUrl, setImgUrl] = useState("/profileicon.png");
  const { id } = useParams();
  const [user, setUser] = useState(null); // State to hold the user data
  


  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(id);
        const response = await axios.get(`/user/${id}`);
        setUser(response.data);  // Set the user data in state
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchUserImg = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user/profilePicture/url/${id}`
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
    return <ChangeAvailability onRevertToProfile={handleRevertToProfile} user={user} setUser={setUser}/>;
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
          <ProfileSection user={user}/>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
      <div className="w-full my-5">
          <ScheduleCalendar user={user} onScheduleChange={handleScheduleChange} preview={false}/>
        </div>
        
        {
          showTerminationModal && user && (
            <AccountTerminationModal
              onClose={handleCloseTerminationModal}
              onTerminate={handleTerminationConfirmation}
              userId={id}
              fullName={`${user.firstName} ${user.lastName}`} // Safe access since we check if user exists
            />
          )
        }
      </div>
    </div>
  );
}
export default MyComponent;