import pytest
import numpy as np
from PIL import Image
import os
from preprocess_file.npy_to_img import npy_to_image
from preprocess_file.audio_to_npy import extract_mfcc

@pytest.fixture
def test_input_path():
    path = "temp_audio/LA_E_1000345.flac"
    assert os.path.exists(path), f"Test file not found: {path}"
    return path

@pytest.fixture
def test_output_path(tmp_path):
    # Create a temporary output path for saving the numpy file
    return tmp_path / "output"

def test_npy_to_image(test_input_path, test_output_path):
    input_path = test_input_path
    npy_output_path = test_output_path.with_suffix('.npy')
    png_output_path = test_output_path.with_suffix('.png')
    # Run conversion
    mfcc = extract_mfcc(input_path, npy_output_path, n_mfcc=40, target_sr=16000)
    loaded = np.load(npy_output_path) #Load the saved numpy file
    assert np.allclose(mfcc, loaded)  # Check if saved and extracted MFCCs are the same
    
    npy_to_image(npy_output_path, png_output_path)
    # Check if the image file was created
    assert os.path.exists(png_output_path), "Image file was not created"

    # Check if it's a valid image
    try:
        img = Image.open(png_output_path)
        img.verify()  # verifies file integrity
    except Exception as e:
        assert False, f"Image verification failed: {e}"

    print("✅ test_npy_to_image passed")

