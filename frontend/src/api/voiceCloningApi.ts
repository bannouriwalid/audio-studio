import axios, {type AxiosError} from "axios";
import {toast} from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const VOICE_CLONING_API = `${API_BASE}/voice_cloning`;

export interface TTSResponse {
    text: string;
    duration: number;
    audio_base64: string;
    sample_rate: number;
}
// === Voices ===

export const getVoices = async (): Promise<string[]> => {
    const res = await axios.get(`${VOICE_CLONING_API}/voices`);
    return res.data;
};

export const createVoice = async (name: string) => {
    try {
        const form = new FormData();
        form.append("name", name);

        const res = await axios.post(`${VOICE_CLONING_API}/voices`, form);
        toast.success("Voice created successfully! ✅");
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        const message = err.response?.data?.error || "An error occurred while creating the voice.";
        toast.error(message); // Show backend message like "Voice already exists"
    }
};

export const renameVoice = async (oldName: string, newName: string) => {
    try {
        const form = new FormData();
        form.append("old", oldName);
        form.append("new", newName);

        await axios.put(`${VOICE_CLONING_API}/voices/rename`, form);
        toast.success("Voice renamed.");
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Rename failed.");
    }
};

export const deleteVoice = async (name: string) => {
    try {
        await axios.delete(`${VOICE_CLONING_API}/voices`, { params: { name } });
        toast.success("Voice deleted.");
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to delete voice.");
    }
};

// === Files ===

export const listVoiceFiles = async (voice: string): Promise<string[]> => {
    try {
        const res = await axios.get(`${VOICE_CLONING_API}/voices/${voice}`);
        return res.data;
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to load voice files.");
        return [];
    }
};

export const uploadVoiceFile = async (voice: string, file: File) => {
    try {
        const form = new FormData();
        form.append("file", file);

        await axios.post(`${VOICE_CLONING_API}/voices/${voice}`, form);
        toast.success("File uploaded successfully!");
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Upload failed.");
    }
};

export const deleteVoiceFile = async (voice: string, filename: string) => {
    try {
        await axios.delete(`${VOICE_CLONING_API}/voices/${voice}`, {
            params: { filename },
        });
        toast.success("File deleted.");
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to delete file.");
    }
};

export const renameVoiceFile = async (voice: string, oldName: string, newName: string) => {
    try {
        const form = new FormData();
        form.append("old", oldName);
        form.append("new", newName);

        await axios.put(`${VOICE_CLONING_API}/voices/${voice}/rename`, form);
        toast.success("File renamed successfully.");
    } catch (error: any) {
        toast.error(error.response?.data?.error || "Rename failed.");
    }
};

// TTS
export const synthesizeClone = async (text: string, language: string, files: File[]) => {
    if (!text || !text.trim()) {
        throw new Error("Text must not be empty");
    }
    if (!language || !language.trim()) {
        throw new Error("Language must be specified");
    }
    if (!files || files.length === 0) {
        throw new Error("At least one voice file must be provided");
    }

    const form = new FormData();
    form.append("text", text);
    form.append("language", language);
    for (const file of files) {
        form.append("speaker_wav", file);
    }

    const res = await axios.post<TTSResponse>(`${VOICE_CLONING_API}/synthesize_clone`, form);
    return res.data;
};
