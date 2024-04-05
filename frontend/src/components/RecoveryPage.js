import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); 
  const [emailSent, setEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [newPassword, setNewPassword] = useState(false);
  const [codeConfirm, setcodeConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let timerId;
    if (emailSent && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [emailSent, timeLeft]);

  const handleSubmit = () => {
    if (!email) {
      setErrorMessage('Please enter your email address.'); 
    } else {
      setEmailSent(true);
      setErrorMessage(''); 
  };
}

  const handleCode = () => {
    setcodeConfirm(true);
  };

  const handlePassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
    } else {
      setErrorMessage('');
      console.log('Password change submitted');
    }
    setNewPassword(true);
  };

  if (newPassword ) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen px-16 pt-12 pb-20 text-base text-black bg-red-800 max-md:px-5">
        <div className="flex flex-col px-8 pt-6 pb-20 max-w-full bg-white shadow-sm w-[411px] max-md:px-5">
          <h1 className="text-2xl text-center">Forgot Password</h1>
          <div className="mt-3">
            Password has been successfully changed and a confirmation e-mail has
            been sent.
          </div>
          <button
            className="justify-center items-center px-16 py-2 mt-3 mb-20 text-center text-white bg-red-800 rounded-lg border border-red-800 border-solid max-md:px-5 max-md:mb-10"
            onClick={() => navigate('/')}
          >
            Return to Login Page
          </button>
        </div>
      </div>
    );
  } 
  
else if (codeConfirm) {
  return (
    <div className="flex flex-col items-center w-full min-h-screen px-16 pt-12 pb-20 text-base text-black bg-red-800 max-md:px-5">
      <section className="flex flex-col px-8 pt-6 pb-20 max-w-full bg-white shadow-sm w-[411px] max-md:px-5">
        <h1 className="ml-3 text-2xl text-center max-md:ml-2.5">Forgot Password</h1>
          <label htmlFor="newPassword" className="mt-1.5 text-left max-md:ml-2.5">
            New Password:
          </label>
          <input
            type="password"
            id="changePassword"
            className="shrink-0 self-stretch mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px]"
          />
          <label htmlFor="confirmPassword" className="mt-1.5 text-left max-md:ml-2.5">
            Confirm New Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="shrink-0 mt-1 w-full bg-white rounded-lg border border-solid border-stone-500 h-[30px]"
          />
          <button
            type="submit"
            className="justify-center items-center px-16 py-2.5 mt-3  text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 border-solid max-md:px-5"
            onClick={handlePassword}
          >
            Submit
          </button>
        <div className="flex gap-5 self-stretch mt-5">
        <div className="flex flex-col flex-1">
      <div className="underline">Password Requirements:</div>
      <div className="mt-3">
        Must be at least 6 letters <br />
        Cannot contain your email
      </div>
    </div>
    <div>
      Contact Admin: <br />
      Tel:(123)-456-7890 <br />
      E-mail:SysAdmin@sbu.com
    </div>
        </div>
      </section>
    </div>
  );
  }

  else if (emailSent) {
    return (
      <div className="flex flex-col items-center px-16 pt-12 pb-20 text-base text-black bg-red-800 max-md:px-5 min-h-screen">
        <div className="flex flex-col px-8 pt-8 pb-20 max-w-full bg-white shadow-sm w-[411px] max-md:px-5">
          <div className="text-2xl text-center">Forgot Password</div>
          <div>A code has been sent to your email. Please enter the code below, the code is valid for 3 minutes</div>
          <label htmlFor="codeInput" className="mt-5 text-center block">
            Time left: {timeLeft}
          </label>
          <input
            type="text"
            id="codeInput"
            className="shrink-0 mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px] w-full"
          />
          <button
            className="justify-center items-center px-16 py-2.5 mt-4 text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 border-solid max-md:px-5"
            onClick={handleCode}
          >
            Submit
          </button>
          <div className="mt-5 mb-1.5 text-xs">
            Contact Admin:
            <br />
            Tel:(123)-456-7890
            <br />
            E-mail:SysAdmin@sbu.com
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center px-16 pt-12 pb-20 text-base text-black bg-red-800 max-md:px-5 min-h-screen">
        <div className="flex flex-col px-8 pt-8 pb-20 max-w-full bg-white shadow-sm w-[411px] max-md:px-5">
          <div className="text-2xl text-center">Forgot Password</div>
          <label htmlFor="emailInput" className="mt-5 text-center block">
              Enter Email:
          </label>
          <input 
              type="email"
              id="emailInput"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="shrink-0 mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px] w-full" 
          />
          {errorMessage && <div className="text-red-600 mt-2">{errorMessage}</div>}
          <button
            className="justify-center items-center px-16 py-2.5 mt-4 text-center text-white whitespace-nowrap bg-red-800 rounded-lg border border-red-800 border-solid max-md:px-5"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <div className="mt-5 mb-1.5 text-xs">
            Contact Admin:
            <br />
            Tel:(123)-456-7890
            <br />
            E-mail:SysAdmin@sbu.com
          </div>
        </div>
      </div>
    );
  }
}

export default MyComponent;
