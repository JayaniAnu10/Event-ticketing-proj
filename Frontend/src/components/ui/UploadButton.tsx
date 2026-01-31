import React from "react";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  label?: string;
  onChange: (file: File | null) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ label, onChange }) => {
  return (
    <label
      className="group flex justify-center items-center  px-4 w-12 h-12 rounded-full cursor-pointer 
                       bg-violet-600 shadow-sm hover:bg-violet-500 transition"
    >
      <Upload
        size={16}
        className="text-secondary dark:text-white dark:group-hover:text-white"
      />
      <span className="text-[14px] text-secondary dark:text-primary dark:hover:text-secondary font-medium">
        {label}
      </span>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  );
};

export default UploadButton;
