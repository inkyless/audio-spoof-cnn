import os
import numpy as np
from PIL import Image
from pathlib import Path
import librosa
import librosa.display
import matplotlib.pyplot as plt
import io

def generate_mfcc_image(npy_path, image_path):
    try:
        mfcc = np.load(npy_path, allow_pickle=True)
        if not isinstance(mfcc, np.ndarray):
            raise ValueError("Loaded MFCC is not a NumPy array")

        # Plot MFCC
        fig, ax = plt.subplots()
        img = librosa.display.specshow(mfcc, x_axis='time', ax=ax)
        ax.set(title='MFCC Visualization')
        plt.colorbar(img, ax=ax)

        # Save plot to buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close(fig)
        buf.seek(0)

        # Convert and save as PNG
        image = Image.open(buf)
        image.save(image_path)

        print(f"MFCC visualization saved to {image_path}")
    except Exception as e:
        print(f"Failed to convert {npy_path}: {e}")
        raise RuntimeError(f"Image conversion failed for {npy_path}")