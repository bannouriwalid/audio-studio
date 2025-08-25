import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const TTS_API = `${API_BASE}/tts`;

export interface Speaker {
    name: string;
    tags: string[];
}

export interface Language {
    code: string;
    name: string;
}

export interface TTSResponse {
    text: string;
    duration: number;
    audio_base64: string;
    sample_rate: number;
}

/**
 * Fetch list of speakers
 */
export const fetchSpeakers = async (): Promise<Speaker[]> => {
    const res = await axios.get(`${TTS_API}/speakers`);
    return res.data.speakers;
};

/**
 * Fetch list of languages
 */
export const fetchLanguages = async (): Promise<Language[]> => {
    const res = await axios.get<string[]>(`${TTS_API}/languages`);
    const codes = res.data;

    const langMap: Record<string, string> = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "pl": "Polish",
        "tr": "Turkish",
        "ru": "Russian",
        "nl": "Dutch",
        "cs": "Czech",
        "ar": "Arabic",
        "zh-cn": "Chinese (Simplified)",
        "hu": "Hungarian",
        "ko": "Korean",
        "ja": "Japanese",
        "hi": "Hindi"
    };

    return codes.map(code => ({
        code,
        name: langMap[code] || code
    }));
};

/**
 * Generate TTS using XTTS
 */
export const generateTTS_XTTS = async (
    text: string,
    speaker: string,
    language: string
): Promise<TTSResponse> => {
    const res = await axios.post<TTSResponse>(`${TTS_API}/synthesize_xtts`, {
        text,
        speaker,
        language
    });
    return res.data;
};

/**
 * Generate TTS using VITS
 */
export const generateTTS_VITS = async (
    text: string
): Promise<TTSResponse> => {
    const res = await axios.post<TTSResponse>(`${TTS_API}/synthesize_vits`, {
        text
    });
    return res.data;
};
