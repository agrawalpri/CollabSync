import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  //handle login for submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    //login api call
  };
  return (
    <AuthLayout>
      <div className=" lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className=" text-xs text-slate-700 mt-[5px] mb-6">
          Enter your details to Login
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            type="email"
            placeholder="john@example.com"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            type="password"
            placeholder="Min 8 characters"
          />
          {error && <p className="text-red-500 text-sm my-2">{error}</p>}
          <button className="btn-primary " type="submit">
            LogIn
          </button>
          <p className="text-[13px] text-slate-800 mt-3 ">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium underline">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
