uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 delta = normal * sin(position.x * position.y * uTime / 10.0);
  vec3 newPosition = position + delta;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}