import { useEffect, useRef, useState } from "react";
import {
    deleteVoice,
    getVoices,
    createVoice,
    uploadVoiceFile,
    listVoiceFiles,
    deleteVoiceFile,
    renameVoice,
    renameVoiceFile, VOICE_CLONING_API
} from "../../api/voiceCloningApi.ts";
import SubNav from "../../components/SubNav.tsx";
import "../../styles/voiceCloning/VoiceLibrary.css";
import { useDropzone } from "react-dropzone";
import {toast} from "react-toastify";

const buttonLinks = [
    { path: "/about-voice-cloning", line1: "Learn more about", line2: "Cloning process" },
    { path: "/playground", line1: "Generate audios with your", line2: "Own voices" },
    { path: "/voice-library", line1: "Manage your", line2: "Voices" },
];

const VoiceLibrary = () => {
    const [voices, setVoices] = useState<string[]>([]);
    const [expandedVoice, setExpandedVoice] = useState<string | null>(null);
    const [files, setFiles] = useState<{ [key: string]: string[] }>({});
    const [voiceInput, setVoiceInput] = useState<string>("");
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const selectedVoiceRef = useRef<string | null>(null);

    useEffect(() => {
        loadVoices();
    }, []);

    const loadVoices = async () => {
        const res = await getVoices();
        setVoices(res);
    };

    const loadFiles = async (voice: string) => {
        const res = await listVoiceFiles(voice);
        setFiles(prev => ({ ...prev, [voice]: res }));
    };

    const handleCreate = async () => {
        if (!voiceInput.trim()) {
            toast.error("Please type a voice name.");
            return;
        }
        await createVoice(voiceInput.trim());
        setVoiceInput("");
        loadVoices();
    };

    const handleDeleteVoice = async (name: string) => {
        await deleteVoice(name);
        const updated = await getVoices();
        setVoices(updated);
    };

    const handleRename = async (oldName: string) => {
        const newName = prompt("Enter new name:", oldName);
        if (newName && newName !== oldName) {
            await renameVoice(oldName, newName);
            loadVoices();
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        if (!expandedVoice) return;
        for (const file of acceptedFiles) {
            await uploadVoiceFile(expandedVoice, file);
        }
        loadFiles(expandedVoice);
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        accept: { "audio/wav": [] },
    });


    const startRecording = async (voice: string) => {
        selectedVoiceRef.current = voice;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        setRecordedChunks([]);
        setRecordingSeconds(0);

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                setRecordedChunks(prev => [...prev, e.data]);
            }
        };

        recorder.onstop = async () => {
            clearInterval(recordingIntervalRef.current!);
            const blob = new Blob(recordedChunks, { type: "audio/wav" });
            const file = new File([blob], `recording_${Date.now()}.wav`, { type: "audio/wav" });
            if (selectedVoiceRef.current) {
                await uploadVoiceFile(selectedVoiceRef.current, file);
                loadFiles(selectedVoiceRef.current);
            }
            setRecordedChunks([]);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);

        recordingIntervalRef.current = setInterval(() => {
            setRecordingSeconds(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setRecording(false);
    };

    return (
        <div className="container">
            <SubNav buttons={buttonLinks}/>
            <h1>Voice Library</h1>

            <div className="voice-wrapper">
                <div className="voice-input-row">
                    <input type="text"
                           placeholder="Enter new voice name..."
                           className="new-input"
                           value={voiceInput}
                           onChange={(e) => setVoiceInput(e.target.value)}/>
                    <button className="add-voice-btn" onClick={handleCreate}>
                        <i className="bi bi-mic-fill me-2"></i> Add Voice
                    </button>
                </div>
            </div>


            {voices.length === 0 ? (
                <p className="text-center mt-5 fs-4">😢 You have no voices yet. Try adding one above!</p>
            ) : (
                <div className="accordion" id="voiceAccordion">
                    {voices.map((voice) => (
                        <div className="accordion-item" key={voice}>
                            <h2 className="accordion-header custom-accordion-header">
                                <div className="accordion-title-row">
                                    <span className="voice-name">{voice}</span>
                                    <div className="button-group">

                                        <button className="edit-button" onClick={() => handleRename(voice)}>
                                            <svg className="delete-svgIcon" viewBox="0 0 512 512">
                                                <path
                                                    d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                            </svg>
                                        </button>
                                        <button className="delete-button" onClick={() => handleDeleteVoice(voice)}>
                                            <svg className="delete-svgIcon" viewBox="0 0 448 512">
                                                <path
                                                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                            </svg>
                                        </button>

                                        <button
                                            className={`accordion-button-toggle ${expandedVoice === voice ? "expanded" : ""}`}
                                            onClick={() => {
                                                setExpandedVoice(expandedVoice === voice ? null : voice);
                                                loadFiles(voice);
                                            }}
                                        >
                                            <i className={`bi bi-toggles ${expandedVoice === voice ? "bi bi-toggles" : "bi bi-toggles"}`}></i>
                                        </button>
                                    </div>
                                </div>
                            </h2>
                            <div className={`accordion-collapse collapse ${expandedVoice === voice ? "show" : ""}`}>

                                <div className="accordion-body">
                                    {/* Dropzone */}
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone border p-4 text-center ${isDragActive ? "bg-light" : ""}`}
                                        style={{cursor: "pointer"}}
                                    >
                                        <input {...getInputProps()} />
                                        <i className="bi bi-upload" style={{fontSize: 24}}></i>
                                        <p className="mt-2">Drag & drop WAV files here, or click to browse</p>
                                    </div>

                                    {/* Recorder */}
                                    <div className="recorder-controls">
                                        {!recording ? (
                                            <button className="btn record-btn" onClick={() => startRecording(voice)}>
                                                <span className="record-label"><i className="bi bi-mic me-1"></i> Start Recording</span>
                                            </button>
                                        ) : (
                                            <button className="btn record-btn" onClick={stopRecording}>
                                                <span className="record-label"><i className="bi bi-mic me-1"></i> Start Recording{recording &&
                                                    <span>⏱️ {recordingSeconds}s</span>}</span>
                                            </button>
                                        )}

                                    </div>

                                    {/* Files List */}
                                    <ul className="list-group file-list-container mt-4">
                                        {files[voice]?.map((file) => (
                                            <li key={file} className="list-group-item file-list-item">
                                                <span className="this-file-name">{file}</span>
                                                <div className="file-actions">
                                                    <audio className="this-audio" controls
                                                           src={`${VOICE_CLONING_API}/voices/${voice}/${file}`}/>
                                                    <button className="edit-button" onClick={async () => {
                                                        const newName = prompt("Rename file to:", file);
                                                        if (newName && newName !== file) {
                                                            await renameVoiceFile(voice, file, newName);
                                                            loadFiles(voice);
                                                        }
                                                    }}>
                                                        <svg className="delete-svgIcon" viewBox="0 0 512 512">
                                                            <path
                                                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                                        </svg>
                                                    </button>
                                                    <button className="delete-button"
                                                            onClick={async () => {
                                                                await deleteVoiceFile(voice, file);
                                                                loadFiles(voice);
                                                            }}>
                                                        <svg className="delete-svgIcon" viewBox="0 0 448 512">
                                                            <path
                                                                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VoiceLibrary;
