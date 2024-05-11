import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

function MyComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState("enterEmail");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6 && !password.includes(email);
  };

  const startTimer = (duration) => {
    setCountdown(duration);
    setTimerActive(true);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setCanResend(true);
          setTimerActive(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = () => {
    if (!email) {
      toast.error("Please enter your email address.");
    } else if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
    } else {
      axios
        .post("/forgotPassword", { email })
        .then((response) => {
          setCurrentStep("verifyCode");
          setErrorMessage("");
          setCanResend(false);
          startTimer(120);
        })
        .catch((error) => {
          toast.error(error.response.data.message || "Error sending email.");
        });
    }
  };

  const handleCodeSubmit = () => {
    if (!otpCode) {
      toast.error("Please enter your OTP code.");
    } else {
      axios
        .post("/verifyOtp", { email, otp: otpCode })
        .then((response) => {
          setCurrentStep("resetPassword");
          setErrorMessage("");
        })
        .catch((error) => {
          toast.error(
            error.response.data.message || "Invalid or expired OTP code."
          );
        });
    }
  };

  const handlePasswordSubmit = () => {
    if (!isValidPassword(newPassword)) {
      toast.error(
        "New password must be at least 6 characters and not contain your email."
      );
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
    } else {
      axios
        .post("/resetPassword", { email, newPassword })
        .then((response) => {
          setCurrentStep("complete");
          setErrorMessage("");
        })
        .catch((error) => {
          toast.error(
            error.response.data.message || "Error resetting password."
          );
        });
    }
  };

  const handleResendCode = () => {
    axios
      .post("/forgotPassword", { email })
      .then((response) => {
        setOtpCode(""); // Clear previous code if any
        setCanResend(false); // Disable the button again
        setTimeout(() => setCanResend(true), 180000); // Reset the timer
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Error resending code.");
      });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "enterEmail":
        return (
          <>
            <label htmlFor="emailInput" className="mt-5 text-center block">
              Enter Email:
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shrink-0 mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px] w-full p-2"
            />
            <button
              className={`justify-center items-center px-16 py-2.5 mt-4 text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 max-md:px-5
              ${
                isValidEmail(email)
                  ? "opacity-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleEmailSubmit}
              disabled={!isValidEmail(email)}
            >
              Submit
            </button>
            <div className="mt-5 mb-1.5 text-xs text-center">
              Contact System Admin:
              <br />
              (123) 456-7890
              <br />
              vitalsync2024@gmail.com
            </div>
          </>
        );
      case "verifyCode":
        return (
          <>
            <label htmlFor="textInput" className="mt-5 text-center block">
              A code has been sent to your email. Please enter the code below,
              the code is valid for 15 minutes.
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="shrink-0 mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px] w-full p-2"
            />
            <button
              className={`justify-center items-center px-16 py-2.5 mt-4 text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 max-md:px-5
              ${otpCode ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
              onClick={handleCodeSubmit}
              disabled={!otpCode}
            >
              Submit
            </button>
            {timerActive && (
              <div className="mt-2 text-xs text-center">
                You can resend the code in {Math.floor(countdown / 60)}:
                {("0" + (countdown % 60)).slice(-2)}
              </div>
            )}
            {!timerActive && canResend && (
              <button
                className="justify-center items-center px-16 py-2.5 mt-4 text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 border-solid max-md:px-5"
                onClick={() => {
                  handleResendCode();
                  startTimer(120);
                }}
                disabled={!canResend}
              >
                Resend Code
              </button>
            )}
            <div className="mt-5 mb-1.5 text-xs text-center">
              Contact System Admin:
              <br />
              (123) 456-7890
              <br />
              vitalsync2024@gmail.com
            </div>
          </>
        );
      case "resetPassword":
        return (
          <>
            <label htmlFor="textInput" className="mt-5 text-center block">
              Please enter your new password below. Password must be at least 6
              characters and not contain your email.
            </label>
            <label
              htmlFor="newPassword"
              className="mt-1.5 text-left max-md:ml-2.5"
            >
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shrink-0 mt-1 w-full bg-white rounded-lg border border-solid border-stone-500 h-[30px] p-2"
            />
            <label
              htmlFor="confirmPassword"
              className="mt-1.5 text-left max-md:ml-2.5"
            >
              Confirm New Password:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shrink-0 mt-1 w-full bg-white rounded-lg border border-solid border-stone-500 h-[30px] p-2"
            />
            <button
              type="submit"
              className={`justify-center items-center px-16 py-2.5 mt-4 text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 max-md:px-5
              ${
                newPassword && confirmPassword
                  ? "opacity-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handlePasswordSubmit}
              disabled={!newPassword || !confirmPassword}
            >
              Submit
            </button>
            <div className="mt-5 mb-1.5 text-xs text-center">
              Contact System Admin:
              <br />
              (123) 456-7890
              <br />
              vitalsync2024@gmail.com
            </div>
          </>
        );
      case "complete":
        return (
          <>
            <div>
              Password has been successfully changed. Please log in with your
              new password.
            </div>
            <button
              className="justify-center items-center px-16 py-2 mt-3 mb-20 text-center text-white bg-red-800 rounded-lg border border-red-800 border-solid max-md:px-5 max-md:mb-10"
              onClick={() => navigate("/")}
            >
              Return to Login Page
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center px-16 pt-12 pb-20 text-base text-black bg-red-800 max-md:px-5 min-h-screen">
      <div className="flex flex-col px-8 pt-8 pb-20 max-w-full bg-white shadow-sm w-[411px] max-md:px-5">
        <div className="text-2xl text-center">Forgot Password</div>
        {errorMessage && (
          <div className="text-red-600 mt-2 text-center">{errorMessage}</div>
        )}
        {renderStepContent()}
      </div>
    </div>
  );
}

export default MyComponent;
