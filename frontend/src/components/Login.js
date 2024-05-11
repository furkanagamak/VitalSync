import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";
import toast, { Toaster } from "react-hot-toast";

function SignInButton({ label, onClick, disabled }) {
  return (
    <button
      className={`justify-center items-center px-16 py-4 mt-4 text-xl text-white bg-red-800 rounded-3xl border border-red-800 border-solid max-md:px-5 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function ForgotPasswordLink({ label, to }) {
  return (
    <Link
      to={to}
      className="self-center mt-3.5 mb-5 text-base text-blue-700 underline"
      title="Forgot Password? Click here to reset it."
    >
      {label}
    </Link>
  );
}

function MyComponent() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const disableSignIn = !email || !password || !isValidEmail(email);

  const handleSignIn = async () => {
    let isValid = true;
    if (!email) {
      toast.error("Email is required.");
      isValid = false;
      return;
    } else if (!isValidEmail(email)) {
      toast.error("Please enter a valid email.");
      isValid = false;
      return;
    } else {
      setError("");
    }

    if (!password) {
      toast.error("Password is required.");
      isValid = false;
      return;
    } else {
      setError("");
    }

    if (isValid) {
      try {
        await login(email, password);
        navigate("/home");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to log in.");
      }
    }
  };

  return (
    <div
      className="flex justify-center items-center px-16 py-20 text-center text-black bg-red-800 border border-black border-solid max-md:px-5"
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col px-8 pt-4 pb-20 mt-12 max-w-full bg-white shadow-sm w-[411px] max-md:px-5 max-md:mt-10">
        <div className="flex gap-5 items-start text-lg whitespace-nowrap max-md:pr-5">
          <img
            loading="lazy"
            src="/LoginLogo.png"
            alt=""
            className="shrink-0 mx-auto max-w-full aspect-[0.91] w-[147px]"
          />
        </div>
        {<p className="text-red-500">{error}</p>}
        <label htmlFor="emailInput" className="self-start max-md:mt-10">
          E-mail:
        </label>
        <input
          type="email"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSignIn();
          }}
          className="shrink-0 mt-1 mb-2.5 bg-white rounded-lg border border-solid border-stone-500 h-[30px] p-2"
        />
        <label htmlFor="passwordInput" className="self-start">
          Password:
        </label>
        <input
          type="password"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSignIn();
          }}
          className="shrink-0 mt-1 mb-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px] p-2"
        />
        <SignInButton
          label="Sign in"
          onClick={handleSignIn}
          disabled={disableSignIn}
        />
        <ForgotPasswordLink label="Forgot Password" to="/recoveryPage" />
      </div>
    </div>
  );
}

export default MyComponent;
