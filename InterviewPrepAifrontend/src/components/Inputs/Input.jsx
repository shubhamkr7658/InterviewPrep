import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({
  value,
  onChange,
  onchange,
  label,
  placeholder,
  type,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = onChange || onchange;

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-[#c0c0c0] mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#d4a853]/40 focus-within:border-[#d4a853]/40 transition-all duration-200">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-[#8b8b9e] outline-none min-w-0"
          value={value}
          onChange={(e) => handleChange(e)}
          required={required}
        />

        {type === "password" && (
          <button
            type="button"
            className="ml-2 text-[#8b8b9e] hover:text-[#d4a853] transition-colors duration-200 shrink-0"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
