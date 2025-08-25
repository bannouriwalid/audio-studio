import torch
import numpy as np
import torchaudio
from audioseal import AudioSeal
from dotenv import load_dotenv
import os

load_dotenv()

GENERATOR_MODEL = os.getenv("GENERATOR_MODEL", "audioseal_wm_16bits")
DETECTOR_MODEL = os.getenv("DETECTOR_MODEL", "audioseal_detector_16bits")

GENERATOR = AudioSeal.load_generator(GENERATOR_MODEL)
DETECTOR = AudioSeal.load_detector(DETECTOR_MODEL)


def load_audio_tensor(path):
    """
    Load an audio file into a tensor.
    Converts stereo -> mono if needed.
    Returns (waveform, sample_rate).
    """
    waveform, sr = torchaudio.load(path)

    if waveform.shape[0] > 1:  # Stereo -> Mono
        waveform = waveform.mean(dim=0, keepdim=True)

    return waveform.unsqueeze(0), sr


def embed_random_watermark(input_path, output_path):
    """
    Embed a **random watermark** into the given audio file.
    """
    audio, sr = load_audio_tensor(input_path)
    wm = GENERATOR.get_watermark(audio, sample_rate=sr)
    watermarked = audio + wm
    torchaudio.save(output_path, watermarked.squeeze(0).detach(), sr)


def embed_custom_bits(input_path, output_path, bit_list):
    """
    Embed a **custom sequence of bits** into the given audio file.
    Example: [0, 1, 0, 1, 1, 0]
    """
    audio, sr = load_audio_tensor(input_path)
    message = torch.tensor([bit_list], dtype=torch.int32)
    watermarked = GENERATOR(audio, sample_rate=sr, message=message, alpha=1)
    torchaudio.save(output_path, watermarked.squeeze(0).detach(), sr)


def detect_watermark(input_path, threshold=0.5):
    """
    Detect if an audio file contains a watermark.
    Returns:
        - is_watermarked (bool)
        - probability (float)
        - decoded_bits (list or None)
    """
    audio, sr = load_audio_tensor(input_path)
    result, message = DETECTOR.detect_watermark(audio, sample_rate=sr, message_threshold=threshold)
    return {
        "is_watermarked": result > 0.5,
        "probability": float(result),
        "decoded_bits": message.int().tolist()[0] if result > 0.5 else None
    }


def get_detection_probabilities(input_path, threshold=0.5):
    """
    Compute **detection probability statistics**:
        - Frame-level stats: min, max, mean, std, % above threshold
        - Bit-level stats: min, max, mean, std
    """
    audio, sr = load_audio_tensor(input_path)
    prediction_prob, message_prob = DETECTOR(audio, sample_rate=sr)

    # Frame-level probabilities
    frame_probs = prediction_prob[:, 1, :].squeeze().detach().cpu().numpy()
    bit_confidences = message_prob.squeeze().detach().cpu().numpy()

    total_points = len(frame_probs)
    above_thresh = np.sum(frame_probs > threshold)
    frame_stats = {
        "total_points": total_points,
        "above_threshold": int(above_thresh),
        "percentage_above_threshold": float(above_thresh / total_points * 100),
        "min": float(np.min(frame_probs)),
        "max": float(np.max(frame_probs)),
        "mean": float(np.mean(frame_probs)),
        "std": float(np.std(frame_probs)),
    }

    # Bit confidence statistics
    bit_stats = {
        "total_bits": len(bit_confidences),
        "min": float(np.min(bit_confidences)),
        "max": float(np.max(bit_confidences)),
        "mean": float(np.mean(bit_confidences)),
        "std": float(np.std(bit_confidences)),
    }

    return {
        "frame_stats": frame_stats,
        "bit_stats": bit_stats
    }
