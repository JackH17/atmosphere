export const distortionCurve = async (amount) => {

    var k = typeof amount === 'number' ? amount : 50,
  
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      
      x;
      for (let i = 0; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
  
    return curve; 
}