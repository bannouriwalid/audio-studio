import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const SPOOF_DETECTOR_API = `${API_BASE}/deepfake`;

export interface DetectionResult {
    filename: string;
    real_prob?: number;
    fake_prob?: number;
    error?: string;
    timestamp?: string;
    reset_at?: string;
    message?: string;
}

/**
 * Upload one or multiple files to /detect endpoint.
 * @param files - array of File objects to detect
 * @returns detection result(s), single object if one file, else array
 */
export const detectDeepfake = async (
    files: File[]
): Promise<DetectionResult | DetectionResult[]> => {
    if (!files || files.length === 0) {
        throw new Error("At least one file must be provided for detection");
    }

    const form = new FormData();
    files.forEach((file) => form.append("file", file));

    try {
        const res = await axios.post<DetectionResult | DetectionResult[]>(`${SPOOF_DETECTOR_API}/detect`, form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        const message = err.response?.data?.error || "Detection request failed.";
        toast.error(message);
        throw new Error(message);
    }
};

/**
 * Fetch detection history from /history endpoint.
 * @returns array of detection history entries
 */
export const fetchHistory = async (): Promise<DetectionResult[]> => {
    try {
        const res = await axios.get<DetectionResult[]>(`${SPOOF_DETECTOR_API}/history`);
        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        toast.error("Failed to fetch detection history.");
        return [];
    }
};

/**
 * Reset detection history by POSTing to /history/reset.
 * @returns confirmation message
 */
export const resetHistory = async (): Promise<string> => {
    try {
        const res = await axios.post<{ message: string; reset_at: string }>(`${SPOOF_DETECTOR_API}/history/reset`);
        toast.success("History reset successfully.");
        return res.data.message;
    } catch (error) {
        toast.error("Failed to reset history.");
        throw error;
    }
};
