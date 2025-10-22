let ctx;
let analyser;
let dataArray;
let source;
let rafId;


export function startLipsyncForAudioElement(audioEl, onAmp) {
  stopLipsync();

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  ctx = new AudioCtx();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;

  const bufferLength = analyser.fftSize;
  dataArray = new Uint8Array(bufferLength);

  source = ctx.createMediaElementSource(audioEl);
  source.connect(analyser);
  analyser.connect(ctx.destination);

  const tick = () => {
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / dataArray.length); // ~0..0.5
    const amp = Math.min(1, rms * 8);              // boost
    if (typeof onAmp === 'function') onAmp(amp);
    rafId = requestAnimationFrame(tick);
  };

  if (ctx.state === 'suspended') ctx.resume();
  tick();
}

export function stopLipsync() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = undefined;
  }
  if (source) {
    try {
      source.disconnect();
    } catch (e) {
      // analyser pipeline kapanırken bazen "already disconnected" atar, sorun değil
      console.debug('[lipsync] source.disconnect skip:', e?.message);
    }
    source = undefined;
  }
  if (analyser) {
    try {
      analyser.disconnect();
    } catch (e) {
      console.debug('[lipsync] analyser.disconnect skip:', e?.message);
    }
    analyser = undefined;
  }
  if (ctx) {
    try {
      ctx.close();
    } catch (e) {
      console.debug('[lipsync] ctx.close skip:', e?.message);
    }
    ctx = undefined;
  }
  dataArray = undefined;
}
