import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadimage";

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle sign up submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName) return setError("Full Name is required");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Password is required");
    if (password.length < 8) return setError("Password must be at least 8 characters long");

    let profileImageUrl = "";

    try {
      // Upload image if selected
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        console.log("Upload response:", imageUploadRes);
        profileImageUrl =
          imageUploadRes?.imageUrl || imageUploadRes?.url || "";
      }

      // Register user
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      console.log("Signup response:", response.data);

      const { token, role } = response.data || {};

      if (token) {
        localStorage.setItem("token", token);
        updateUser?.(response.data); // safe call
        navigate(role === "admin" ? "/admin/dashboard" : "/users/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      
      if (err.response) {
        // Server responded with error status
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server error: ${err.response.status}. Please try again.`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Cannot connect to server. Please check if the backend is running.");
      } else if (err.code === "ECONNABORTED") {
        // Request timeout
        setError("Request timeout. Please try again.");
      } else {
        // Something else happened
        setError(err.message || "Something went wrong. Please try again.");
      }
    }
  };

  console.log("Rendering signup page...");

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-full md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your details to Sign Up
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
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              type="text"
              placeholder="6 digit token"
            />
          </div>

          {error && <p className="text-red-500 text-sm my-2">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 mt-4 w-full hover:bg-blue-700"
          >
            Sign Up
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
