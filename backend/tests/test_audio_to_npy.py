import os
from preprocess_file.audio_to_npy import load_audio, extract_mfcc
import numpy as np
import pytest

# Test when audio is loaded
@pytest.fixture
def test_audio_path():
    path = "temp_audio/0d81bda0-d6f6-4fe1-8494-788ff658ad7e_recorded_audio.webm"
    assert os.path.exists(path), f"Test file not found: {path}"
    return path

@pytest.fixture
def test_output_path(tmp_path):
    # Create a temporary output path for saving the numpy file
    return tmp_path / "output.npy"

def test_load_audio(test_audio_path):
    y,sr = load_audio(test_audio_path) #Take sample audio
    print(len(y),sr)
    print("Audio Duration in Seconds : ",len(y)/sr)
    assert isinstance(y, np.ndarray) #"Waveform not a NumPy array"
    assert isinstance(sr, int) #"Sample rate not an integer"
    assert y.ndim == 1 #"Audio must be mono"
    assert len(y) > 0 #"Audio signal is empty"

# Test when audio is downsampled
def test_load_audio_8k(test_audio_path):
    y,sr = load_audio(test_audio_path,target_sr=8000) #Take sample audio
    print(len(y),sr)
    print("Audio Duration in Seconds : ",len(y)/sr)
    assert isinstance(y, np.ndarray) #"Waveform not a NumPy array"
    assert isinstance(sr, int) #"Sample rate not an integer"
    assert y.ndim == 1 #"Audio must be mono"
    assert len(y) > 0 #"Audio signal is empty"
    assert sr == 8000 #"Resampling failed"

# Test when MFCC features are extracted
def test_extract_mfcc(test_audio_path, test_output_path):
    y,sr = load_audio(test_audio_path)
    mfcc = extract_mfcc(test_audio_path, test_output_path) #Second Step : Extract MFCC Features
    loaded = np.load(test_output_path) #Load the saved numpy file
    print("Predicted Frame :",len(y)/128)
    print("MFCC Shape :",mfcc.shape)
    assert isinstance(mfcc, np.ndarray) #Check if is not numpy array
    assert mfcc.ndim == 2  # (time, n_mfcc) Check if output is 2D
    assert mfcc.shape[0] == 26 # Values from n_mels
    assert np.allclose(mfcc, loaded)  # Check if saved and extracted MFCCs are the same