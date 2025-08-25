import io
import base64
import soundfile as sf

def tts_to_bytes(tts_instance, **kwargs):
    """Convert TTS output to base64 encoded audio with metadata."""
    output = tts_instance.tts(**kwargs)

    if not isinstance(output, tuple):
        audio = output
        sample_rate = getattr(tts_instance, "output_sample_rate", 22050)
    elif len(output) == 2:
        audio, sample_rate = output
    else:
        audio, sample_rate = output[0], output[1]

    buffer = io.BytesIO()
    sf.write(buffer, audio, sample_rate, format="WAV")
    buffer.seek(0)

    audio_base64 = base64.b64encode(buffer.read()).decode("utf-8")
    duration = len(audio) / sample_rate

    return {
        "text": kwargs["text"],
        "duration": round(duration, 2),
        "audio_base64": audio_base64,
        "sample_rate": sample_rate
    }