import { useState } from "react";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import Input from "../Inputs/Input";
import Modal from "../Modal";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useUser } from "../../context/userContext";
import toast from "react-hot-toast";

const ProfileUpdateModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useUser();
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || null);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            let profileImageUrl = previewUrl;

            // If user selected a new local file, upload it first
            if (profilePic) {
                profileImageUrl = await uploadImage(profilePic);
            }

            // Update user document
            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
                name,
                profileImageUrl,
            });

            // Fast refresh the entire app Context locally
            updateUser({
                name: response.data.name,
                profileImageUrl: response.data.profileImageUrl
            });
            toast.success("Profile updated! ✨");
            onClose();
        } catch (err) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    // Close and reset state
    const handleClose = () => {
        setProfilePic(null);
        setPreviewUrl(user?.profileImageUrl || null);
        setName(user?.name || "");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Update Profile">
            <div className="flex flex-col sm:flex-row items-start gap-6 py-4 w-full">
                <div className="flex flex-col items-center shrink-0 mx-auto sm:mx-0">
                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic}
                        preview={previewUrl}
                        setPreview={setPreviewUrl}
                    />
                    <p className="text-[11px] text-center text-[#8b8b9e] max-w-[150px] mt-1 hidden sm:block">
                        This picture will be visible across all your sessions.
                    </p>
                </div>

                <div className="flex-1 w-full space-y-4">
                    <div>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Full Name"
                            placeholder="John Doe"
                            type="text"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#1e1e2e] mt-2">
                <button
                    onClick={handleClose}
                    type="button"
                    className="w-full sm:flex-1 py-2.5 rounded-lg border border-[#1e1e2e] text-[#8b8b9e] hover:text-white hover:bg-[#12121a] transition-all text-sm font-medium cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading || (!name.trim() || (!profilePic && user?.profileImageUrl === previewUrl && name === user?.name))}
                    className="w-full sm:flex-1 bg-gradient-to-r from-[#d4a853] to-[#e8c87a] text-black py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all text-sm disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </Modal>
    );
};

export default ProfileUpdateModal;
