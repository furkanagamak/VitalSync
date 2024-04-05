import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

function Checkbox({ label }) {
  return (
    <div className="flex items-center gap-2 mt-5 text-base">
      <input
        type="checkbox"
        id={`${label.toLowerCase()}Checkbox`}
        className="shrink-0 bg-white border border-solid border-stone-500 h-[15px] w-[15px]"
      />
      <label htmlFor={`${label.toLowerCase()}Checkbox`} className="flex justify-start">
        {label}
      </label>
    </div>
  );
}

function SignInButton({ label, onClick }) {
  return (
    <button className="justify-center items-center px-16 py-4 mt-4 text-xl text-white bg-red-800 rounded-3xl border border-red-800 border-solid max-md:px-5"
    onClick={onClick}>
      {label}
    </button>
  );
}

function ForgotPasswordLink({ label, to }) {
  return (
    <Link to={to} className="self-center mt-3.5 mb-5 text-base text-blue-700 underline">
      {label}
    </Link>
  );
}

function MyComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSignIn = () => {
    if (email === 'johnsmith@sbu.com' && password === 'sbu1234') {
      navigate('/Roster');
    } else {
      setError('Incorrect ID or password.');
    }
  };

  return (
    <div className="flex justify-center items-center px-16 py-20 text-center text-black bg-red-800 border border-black border-solid max-md:px-5" style={{minHeight: '100vh'}}>
      <div className="flex flex-col px-8 pt-4 pb-20 mt-12 max-w-full bg-white shadow-sm w-[411px] max-md:px-5 max-md:mt-10">
        <div className="flex gap-5 items-start text-lg whitespace-nowrap max-md:pr-5">
          <img
            loading="lazy"
            src="/LoginLogo.png"
            alt=""
            className="shrink-0 mx-auto max-w-full aspect-[0.91] w-[147px]"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <label htmlFor="emailInput" className="self-start max-md:mt-10">
            E-mail:
          </label>
        <input
          type="email"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSignIn() }} 
          className="shrink-0 mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px]"
        />
        <label htmlFor="passwordInput" className="self-start max-md:mt-10">
        Password:
        </label>
        <input
          type="password"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSignIn() }} 
          className="shrink-0 mt-1 bg-white rounded-lg border border-solid border-stone-500 h-[30px]"
        />
        <Checkbox label="Remember account" />
        <SignInButton label="Sign in" onClick={handleSignIn}/>
        <ForgotPasswordLink label="Forgot Password" to="/recoveryPage"/>
      </div>
    </div>
  );
}

export default MyComponent;
