import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const WATERMARK_API = `${API_BASE}/watermark`;

// Utility function return type: string (object URL from blob)
export const embedRandom = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("wav_file", file);

    const res = await axios.post<Blob>(`${WATERMARK_API}/embed`, formData, {
        responseType: "blob",
    });

    return URL.createObjectURL(res.data);
};

export const embedWithBits = async (file: File, bits: string): Promise<string> => {
    const formData = new FormData();
    formData.append("wav_file", file);
    formData.append("bits", bits);

    const res = await axios.post<Blob>(`${WATERMARK_API}/embed-bits`, formData, {
        responseType: "blob",
    });

    return URL.createObjectURL(res.data);
};

export const detectWatermark = async (
    file: File,
    threshold: number = 0.5
): Promise<any> => {
    const formData = new FormData();
    formData.append("wav_file", file);
    formData.append("threshold", threshold.toString());

    const res = await axios.post(`${WATERMARK_API}/detect`, formData);
    return res.data;
};

export const getProbabilityMap = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("wav_file", file);

    const res = await axios.post(`${WATERMARK_API}/probability-map`, formData);
    return res.data;
};
