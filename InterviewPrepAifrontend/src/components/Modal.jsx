import { useEffect } from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-[#12121a] border border-[#1e1e2e] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          className="absolute top-3.5 right-3.5 text-[#8b8b9e] hover:text-white hover:bg-[#1e1e2e] rounded-lg w-8 h-8 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
            />
          </svg>
        </button>

        {/* Optional header */}
        {!hideHeader && title && (
          <div className="flex items-center px-6 pt-5 pb-3 border-b border-[#1e1e2e]">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;