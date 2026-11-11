import json, sys, subprocess
from pathlib import Path
sys.path.insert(0, r'E:\Onter VN\ONTER-VOICE-LAB')
from engines.vieneu.adapter import VieNeuEngine
import soundfile as sf
root=Path(__file__).resolve().parents[1]
tmp=root/'tmp'/'voice'
tmp.mkdir(parents=True,exist_ok=True)
engine=VieNeuEngine()
engine.load()
for key,line in json.loads((root/'src'/'voice-lines.json').read_text(encoding='utf-8-sig')).items():
    out=root/'audio'/f'{key}.mp3'
    if out.exists() and out.stat().st_size: continue
    wav=tmp/f'{key}.wav'
    sf.write(wav,engine.generate(line,'Ngọc Linh'),engine.sample_rate)
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af','loudnorm=I=-18:TP=-1.5:LRA=7','-codec:a','libmp3lame','-q:a','4',str(out)],check=True)
    wav.unlink()
    print(key,flush=True)
tmp.rmdir()
