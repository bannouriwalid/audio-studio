import {type ChangeEvent, useState} from "react";
import "../styles/components/FileUpload.css";

type FileUploadFormProps = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FileUploadForm = ({ onChange }: FileUploadFormProps) => {
    const [fileName, setFileName] = useState("No file chosen");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name); // ✅ update filename
        } else {
            setFileName("No file chosen");
        }
        onChange(e); // still pass to parent
    };

    return (
        <div className="file-upload-wrapper this-input-row">
            <input
                type="file"
                accept="audio/wav"
                id="file-upload"
                className="file-input"
                onChange={handleChange}
                required
            />
            <label htmlFor="file-upload" className="file-upload-btn">
                Choose File
            </label>
            <span className="file-name">{fileName}</span>
        </div>
    );
};

export default FileUploadForm;