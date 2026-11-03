import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/userContext";
import toast from "react-hot-toast";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      login(response.data);
      toast.success("Welcome back! 👋");
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
      {/* Heading */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-white">
          Welcome Back! 👋
        </h3>
        <p className="text-sm text-[#8b8b9e] mt-1">
          Please enter your credentials to log in.
        </p>
      </div>

      <form onSubmit={handleLogin} noValidate className="space-y-1">
        {/* Email */}
        <div>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
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

        {/* Password */}
        <div>
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
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

        {/* API error */}
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
          {loading ? "Logging in…" : "Login"}
        </button>

        <p className="text-[13px] text-[#8b8b9e] text-center pt-4">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#d4a853] hover:underline cursor-pointer"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
