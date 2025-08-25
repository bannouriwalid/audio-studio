import torch
import torchaudio

def load_wav_and_preprocess(wav_path, target_sr=16000, device="cpu"):
    """
    Load an audio file, convert to mono, resample to the target sampling rate,
    apply layer normalization, and move the tensor to the specified device.

    Args:
        wav_path (str): Path to the audio file.
        target_sr (int, optional): Target sampling rate. Defaults to 16000.
        device (str, optional): Device to load the tensor onto ("cpu" or "cuda"). Defaults to "cpu".

    Returns:
        torch.Tensor: Preprocessed audio tensor ready for model inference.
    """
    # Load audio file
    wav, sr = torchaudio.load(wav_path)
    # Convert to mono by averaging channels
    wav = wav.mean(dim=0)
    # Resample to target sampling rate
    wav = torchaudio.functional.resample(wav, sr, new_freq=target_sr)
    # Apply layer normalization
    wav = torch.nn.functional.layer_norm(wav, wav.shape)
    # Add batch dimension and move to device
    return wav.unsqueeze(0).to(device)