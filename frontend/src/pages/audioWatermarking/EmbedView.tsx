import {type ChangeEvent, type FormEvent, useState} from "react";
import FileUploadForm from "../../components/FileUploadForm.tsx";
import AudioPlayer from "../../components/AudioPlayer.tsx";
import {embedRandom, embedWithBits} from "../../api/audioWatermarkingApi.ts";
import SubNav from "../../components/SubNav.tsx";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/audioWatermarking/EmbedView.css";

const buttonLinks = [
    {
        path: "/about_watermarking-model",
        line1: "Learn more about",
        line2: "The model",
    },
    {
        path: "/watermarking",
        line1: "Try the",
        line2: "Watermarker",
    },
    {
        path: "/watermarking-detection",
        line1: "Try the",
        line2: "Detector",
    },
];

const EmbedView = () => {
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [bits, setBits] = useState<string>("");
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // ✅ track loading state

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!inputFile) {
            toast.error("Please upload an audio file.");
            return;
        }

        if (bits && (!/^[01]{16}$/.test(bits))) {
            toast.error("Secret code must be exactly 16 bits (0s and 1s).");
            return;
        }

        try {
            setIsLoading(true); // ✅ start loading

            const result = bits
                ? await embedWithBits(inputFile, bits)
                : await embedRandom(inputFile);

            setOutputUrl(result);
            toast.success("Watermark embedded and audio downloaded!");
        } catch {
            toast.error("An error occurred during embedding.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setInputFile(e.target.files[0]);
            setOutputUrl(null); // reset old output if user uploads new file
        }
    };

    const generateRandomBits = () => {
        const randomBits = Array.from({ length: 16 }, () => Math.round(Math.random())).join('');
        setBits(randomBits);
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks}/>
            <h1>watermark embedding</h1>
            <div className="aw-special-row">
                <FileUploadForm onChange={handleFileChange}/>
                <div className="mt-3 mb-3">
                    <AudioPlayer src={inputFile ? URL.createObjectURL(inputFile) : undefined}/>
                </div>
                <form onSubmit={handleSubmit} className="watermark-form">
                    <div className="this-wrapper">
                        <div className="this-input-row">
                            <input type="text"
                                   placeholder="Optional 16-bit secret"
                                   className="this-new-input"
                                   value={bits}
                                   onChange={(e) => setBits(e.target.value)}
                            />
                            <button type="button" className="add-this-btn" onClick={generateRandomBits}>
                                Generate
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="this-generate-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span>Watermarking ...</span> // you can replace this with spinner animation
                        ) : (
                            <>
                                <i className="bi bi-magic icon-white-big"></i>
                                <span>Embed Watermark</span>
                            </>
                        )}
                    </button>
                </form>
                <div className="mb-3 mt-3">
                    <AudioPlayer src={outputUrl ?? undefined}/>
                </div>
                <h2 className="tutorial-title mt-3">🚀 Quick Start Guide</h2>
                <div className="this-tutorial-step">
                    <div className="step-number">1️⃣</div>
                    <div className="step-content">
                        <h3>Upload Your Audio Clip</h3>
                        <p>Select a <strong>.wav</strong> file from your computer that you want to protect with a
                            watermark.</p>
                        <p className="note">
                            Only <code>.wav</code> files are supported.
                        </p>
                    </div>
                </div>

                <div className="this-tutorial-step">
                    <div className="step-number">2️⃣</div>
                    <div className="step-content">
                        <h3>Generate or Add a Secret Key</h3>
                        <p>Enter a 16-bit secret key to embed in your audio. This key will help protect and verify your
                            audio.</p>
                        <p className="note">
                            You can also click <strong>Generate</strong> to create a random secret key. This step is
                            optional.
                        </p>
                    </div>
                </div>

                <div className="this-tutorial-step">
                    <div className="step-number">3️⃣</div>
                    <div className="step-content">
                        <h3>Embed Watermark and Secure Your Audio</h3>
                        <p>Click the <strong>Embed</strong> button to apply the watermark. Once embedded, you can listen
                            to your watermarked audio to verify it.</p>
                        <p className="note">
                            You can download the watermarked audio. The process protects your audio with minimal impact
                            on quality.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmbedView;
