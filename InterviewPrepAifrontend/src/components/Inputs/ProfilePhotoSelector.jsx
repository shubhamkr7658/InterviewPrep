import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      if (setPreview) setPreview(url);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const displayUrl = preview || previewUrl;

  return (
    <div className="flex flex-col items-center gap-3 mb-5">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        className="hidden"
      />

      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#1e1e2e] border-2 border-dashed border-[#d4a853]/30 flex items-center justify-center">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profile photo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <LuUser className="text-[#d4a853]" size={36} />
          )}
        </div>

        <button
          type="button"
          onClick={displayUrl ? handleRemoveImage : onChooseFile}
          className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-[#12121a] transition-colors duration-200 cursor-pointer
            ${displayUrl
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-[#d4a853] text-black hover:bg-[#e8c87a]"
            }`}
          title={displayUrl ? "Remove photo" : "Upload photo"}
        >
          {displayUrl ? <LuTrash size={13} /> : <LuUpload size={13} />}
        </button>
      </div>

      <p className="text-xs text-[#8b8b9e]">
        {displayUrl ? (
          <span className="text-[#d4a853] font-medium">Photo selected ✓</span>
        ) : (
          "Upload profile photo (optional)"
        )}
      </p>
    </div>
  );
};

export default ProfilePhotoSelector;
