uniform float uTime;
varying vec2 vUv;
float rand(vec2 seed);
float noise(vec2 position);
void main() {
  vec2 position1 = vec2(vUv.x * 4.0, vUv.y - uTime);
  vec2 position2 = vec2(vUv.x * 4.0, vUv.y - uTime * 2.0);
  vec2 position3 = vec2(vUv.x * 4.0, vUv.y - uTime * 3.0);
  float color = (
    noise(position1 * 5.0)
    + noise(position2 * 10.0)
    + noise(position3 * 15.0)) / 4.0;
  gl_FragColor = vec4(0.173, 0.635, 1., color - smoothstep(0.1, 1.3, vUv.y));
}
float rand(vec2 seed) {
  return fract(sin(dot(seed, vec2(12.9898,78.233))) * 43758.5453123);
}
float noise(vec2 position) {
  vec2 blockPosition = floor(position);
  float topLeftValue     = rand(blockPosition);
  float topRightValue    = rand(blockPosition + vec2(1.0, 0.0));
  float bottomLeftValue  = rand(blockPosition + vec2(0.0, 1.0));
  float bottomRightValue = rand(blockPosition + vec2(1.0, 1.0));
  vec2 computedValue = smoothstep(0.0, 1.0, fract(position));
  return mix(topLeftValue, topRightValue, computedValue.x)
    + (bottomLeftValue  - topLeftValue)  * computedValue.y * (1.0 - computedValue.x)
    + (bottomRightValue - topRightValue) * computedValue.x * computedValue.y;
}