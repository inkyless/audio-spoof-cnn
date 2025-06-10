import numpy as np
import librosa
import pytest
import soundfile as sf
import os


# Extract MFCC Features from Audio Input

def load_audio(file_path, target_sr=None, output_path=None):
    try:
        # Load audio with Librosa Library with original sample rate first
        
        y, sr = librosa.load(file_path, sr=None)

        if target_sr is not None and target_sr != sr:
            # Resample audio to designated sample rate if needed
            y = librosa.resample(y, orig_sr=sr, target_sr=8000)
            sr = target_sr
            if output_path:
                sf.write(output_path, y, sr)
        return y,sr
        
    except Exception as e: 
        print(f"Error processing {file_path}: {e}")
        return None,None

def extract_mfcc(audio_path, output_path, n_mfcc=40, target_sr=16000):
    try:
        y,sr = load_audio(audio_path,target_sr=target_sr)
        # Calculate suitable FFT size
        n_fft = min(512, 2 ** int(np.log2(len(y))))

        # Extract MFCC features
        mfccs = librosa.feature.mfcc(
            y=y,
            sr=target_sr,
            n_mfcc=n_mfcc, #Number of features 
            n_fft=n_fft,
            hop_length=128,
            n_mels=26,
            fmax=target_sr // 2
        )
        if mfccs is not None:
                np.save(output_path, mfccs)
        return mfccs
    except Exception as e: #Return error if cannot load audio
        print(f"Error processing {audio_path}: {e}")
        return None
    






