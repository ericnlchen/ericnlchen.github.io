import { Noise } from "./vendor/noisejs.js";

const noise = new Noise(Math.random());

export function curlNoise(x, y, t) {
    const freq = 0.01;
    const timeFreq = 0.01;

    const amplitude = 400;
    // Referenced https://al-ro.github.io/projects/curl/
    let eps = 0.0005;

    x *= freq;
    y *= freq;
    t *= timeFreq;

    const noisePlusX = noise.simplex3(x + eps, y, t);
    const noiseMinusX = noise.simplex3(x - eps, y, t);
    const dNoise_dX = (noisePlusX - noiseMinusX) / (2 * eps);
    const noisePlusY = noise.simplex3(x, y + eps, t);
    const noiseMinusY = noise.simplex3(x, y - eps, t);
    const dNoise_dY = (noisePlusY - noiseMinusY) / (2 * eps);

    return [dNoise_dY * amplitude, -dNoise_dX * amplitude];
}
