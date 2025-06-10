import os
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

def npy_to_image(npy_path, image_path):
    try:
        mfcc = np.load(npy_path, allow_pickle=True)
        if not isinstance(mfcc, np.ndarray):
            raise ValueError("Loaded MFCC is not a NumPy array")

        # Normalize to 0–255
        mfcc_min, mfcc_max = mfcc.min(), mfcc.max()
        mfcc_norm = 255 * (mfcc - mfcc_min) / (mfcc_max - mfcc_min + 1e-8)
        mfcc_img = mfcc_norm.astype(np.uint8)

        # Convert and save as PNG
        image = Image.fromarray(mfcc_img)
        image.save(image_path)
    except Exception as e:
        print(f"Failed to convert {npy_path}: {e}")
        raise RuntimeError(f"Image conversion failed for {npy_path}")


