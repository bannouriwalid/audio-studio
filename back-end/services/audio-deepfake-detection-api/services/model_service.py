import torch
from fairseq.models.wav2vec import Wav2Vec2Model, Wav2Vec2Config
from huggingface_hub import PyTorchModelHubMixin
from utils.logger import logger
from config import Config

# Determine computation device: GPU if available, otherwise CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class SSLModel(torch.nn.Module):
    """
    Self-supervised learning (SSL) model wrapper using Wav2Vec2.
    Provides feature extraction from raw audio input.
    """
    def __init__(self):
        super().__init__()
        # Configure Wav2Vec2 model parameters
        cfg = Wav2Vec2Config(
            quantize_targets=True,
            extractor_mode="layer_norm",
            layer_norm_first=True,
            final_dim=Config.FINAL_DIM,
            encoder_layers=Config.ENCODER_LAYERS,
            encoder_embed_dim=Config.ENCODER_EMBED_DIM,
            encoder_ffn_embed_dim=Config.ENCODER_FFN_EMBED_DIM,
            encoder_attention_heads=Config.ENCODER_ATTENTION_HEADS,
            latent_temp=(2.0, 0.1, 0.999995),  # Keep this fixed unless you want to tune
        )
        self.model = Wav2Vec2Model(cfg)

    def extract_feat(self, input_data):
        """
        Extract latent features from input audio.
        Args:
            input_data (torch.Tensor): Input waveform tensor.
        Returns:
            torch.Tensor: Extracted feature embeddings.
        """
        if input_data.ndim == 3:
            input_data = input_data[:, :, 0]
        with torch.no_grad():
            return self.model(input_data.to(device), mask=False, features_only=True)['x']


class DeepfakeDetector(torch.nn.Module, PyTorchModelHubMixin):
    """
    Deepfake audio detector model.
    Uses SSL features from Wav2Vec2 and a simple classification head.
    """
    def __init__(self):
        super().__init__()
        self.ssl_orig_output_dim = 1024
        self.num_classes = 2
        self.m_ssl = SSLModel()
        self.adap_pool1d = torch.nn.AdaptiveAvgPool1d(1)
        self.proj_fc = torch.nn.Linear(self.ssl_orig_output_dim, self.num_classes)

    def forward(self, wav):
        """
        Forward pass for audio input.
        Args:
            wav (torch.Tensor): Preprocessed audio tensor.
        Returns:
            torch.Tensor: Logits for real/fake classification.
        """
        emb = self.m_ssl.extract_feat(wav).transpose(1, 2)
        pooled_emb = self.adap_pool1d(emb).squeeze(-1)
        return self.proj_fc(pooled_emb)


# Load the deepfake detector model from Hugging Face at application startup
logger.info("Loading deepfake detector model...")
model = DeepfakeDetector.from_pretrained(Config.MODEL_NAME)
model.to(device)
model.eval()
logger.info("Model loaded successfully.")