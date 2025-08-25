import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import DefaultLayout from "./layouts/DefaultLayout";
import EmbedView from "./pages/audioWatermarking/EmbedView.tsx";
import AboutModel from "./pages/audioWatermarking/AboutModel.tsx";
import TTSView from "./pages/textToSpeech/textToSpeechView.tsx";
import AboutModelTTS from "./pages/textToSpeech/AboutTtsModel.tsx";
import SpeakersCatalogue from "./pages/textToSpeech/SpeakersCatalogue.tsx";
import VoiceLibrary from "./pages/voiceCloning/VoiceLibrary.tsx";
import AboutCloningModel from "./pages/voiceCloning/AboutVoiceCloning.tsx";
import SpoofDetectView from "./pages/deepFakeDetection/SpoofDetectView.tsx";
import AboutPage from "./pages/deepFakeDetection/AboutPage.tsx";
import HistoryView from "./pages/deepFakeDetection/HistoryView.tsx";
import Playground from "./pages/voiceCloning/Playground.tsx";
import DetectorView from "./pages/audioWatermarking/DetectView.tsx";

export default function App() {
    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <DefaultLayout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/about-tts-models" replace />} />
                        <Route path="/voice-clone" element={<div>Voice Cloning</div>} />
                        <Route path="/watermark" element={<div>Watermarking</div>} />
                        <Route path="/deepfake" element={<div>Deepfake Detection</div>} />

                        <Route path="/watermarking" element={<EmbedView />} />
                        <Route path="/watermarking-detection" element={<DetectorView />} />
                        <Route path="/about_watermarking-model" element={<AboutModel />} />

                        <Route path="/tts" element={<TTSView />} />
                        <Route path="/about-tts-models" element={<AboutModelTTS />} />
                        <Route path="/available-speakers" element={<SpeakersCatalogue />} />

                        <Route path="/about-voice-cloning" element={<AboutCloningModel />} />
                        <Route path="/voice-library" element={<VoiceLibrary />} />
                        <Route path="/playground" element={<Playground />} />

                        <Route path="/deepfake-detector" element={<SpoofDetectView />} />
                        <Route path="/about-deepfake-detector" element={<AboutPage />} />
                        <Route path="/history" element={<HistoryView />} />

                    </Routes>
                </DefaultLayout>
            </BrowserRouter>
        </>
    );
}
