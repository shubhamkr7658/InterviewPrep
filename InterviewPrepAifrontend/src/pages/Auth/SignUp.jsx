import { useState } from "react";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useUser } from "../../context/userContext";
import toast from "react-hot-toast";

const Signup = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      let profileImageUrl = null;
      if (profilePic) {
        profileImageUrl = await uploadImage(profilePic);
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      login(response.data);
      toast.success("Account created! Welcome 🚀");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message;
      setErrors({ api: msg || "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="w-full max-w-sm mx-auto px-6 py-8 sm:px-8">
      <div className="mb-5">
        <h3 className="text-xl sm:text-2xl font-semibold text-white">
          Create Account 🚀
        </h3>
        <p className="text-sm text-[#8b8b9e] mt-1">
          Join thousands of professionals preparing smarter.
        </p>
      </div>

      <form onSubmit={handleSignup} noValidate className="space-y-1">
        <div className="mb-2">
          <ProfilePhotoSelector
            image={profilePic}
            setImage={(file) => {
              setProfilePic(file);
              clearError("profilePic");
            }}
          />
        </div>

        <div>
          <Input
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            error={errors.fullName}
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs -mt-2 mb-2 flex items-center gap-1">
              <span>⚠</span> {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <Input
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            error={errors.email}
          />
          {errors.email && (
            <p className="text-red-400 text-xs -mt-2 mb-2 flex items-center gap-1">
              <span>⚠</span> {errors.email}
            </p>
          )}
        </div>

        <div>
          <Input
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
            error={errors.password}
          />
          {errors.password && (
            <p className="text-red-400 text-xs -mt-2 mb-2 flex items-center gap-1">
              <span>⚠</span> {errors.password}
            </p>
          )}
        </div>

        {errors.api && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
            <p className="text-red-400 text-xs font-medium flex items-center gap-1">
              <span>⚠</span> {errors.api}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-sm font-semibold text-black py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-300 cursor-pointer disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>

        <p className="text-[13px] text-[#8b8b9e] text-center pt-4">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#d4a853] hover:underline cursor-pointer"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
