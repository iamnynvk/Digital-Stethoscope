import wave, audioop
import noisereduce as nr
import librosa
import soundfile as sf
import os
from io import BytesIO

def main(fileName, filePath, sr=16000,factor=100):
    print(fileName)
    print(filePath)
    url = os.path.join(filePath, fileName)
    file = BytesIO()
    with wave.open(url, 'rb') as wav:
        p = wav.getparams()
        with wave.open(file, 'wb') as audio:
            audio.setparams(p)
            frames = wav.readframes(p.nframes)
            audio.writeframesraw( audioop.mul(frames, p.sampwidth, factor))
    file.seek(0)
    response,sr = librosa.load(file, mono=True, sr=sr, offset=0, duration=30)
    reduced_noise = nr.reduce_noise(y = response, sr=sr, thresh_n_mult_nonstationary=2,stationary=False)
    os.remove(url)
    sf.write(url, reduced_noise, sr)
    return url