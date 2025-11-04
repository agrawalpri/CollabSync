import React, { Profiler, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  //handle sign up for submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Full Name is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    //signup api call
  };
  return (
    <AuthLayout>
      <div className="lg: w-[100%] h-full md:h-full mt-10 md:mt-0 flex flex-col justify-center ">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className=" text-xs text-slate-700 mt-[5px] mb-6">
          Enter your details to SignUp
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              type="text"
              placeholder="eg. John Doe"
            />
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
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Admin Invite Token"
              type="text"
              placeholder=" 6 digit token"
            />
          </div>
          {error && <p className="text-red-500 text-sm my-2">{error}</p>}
          <button className="btn-primary " type="submit">
            SignUp
          </button>
          <p className="text-[13px] text-slate-800 mt-3 ">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium underline">
              SignIn
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
