import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const HologramMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color('#FF4D00'), 
    uColorB: new THREE.Color('#000000'), 
    uOpacity: 0.4,
    uScanStrength: 0.5,
    uEdgeStrength: 2.5,
    uPulse: 1.0,
  },
  // Vertex Shader
  `
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec2 vUv;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPos.xyz;
      
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-modelViewPosition.xyz);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    precision highp float;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uOpacity;
    uniform float uScanStrength;
    uniform float uEdgeStrength;
    uniform float uPulse;
    
    float sat(float x) { return clamp(x, 0.0, 1.0); }
    
    void main() {
      // 1. Precise Scanlines
      float scan = sin((vWorldPos.y * 15.0) - (uTime * 5.0)) * 0.5 + 0.5;
      scan = pow(scan, 8.0);
      
      // 2. Premium Fresnel Edge
      float fresnel = 1.0 - sat(dot(normalize(vNormal), normalize(vViewDir)));
      fresnel = pow(fresnel, 2.5) * uEdgeStrength;
      
      // 3. Grid Pattern
      float grid = abs(sin(vUv.x * 40.0)) * abs(sin(vUv.y * 40.0));
      grid = pow(grid, 0.1) * 0.2;

      // Color Blend
      vec3 col = mix(uColorA, vec3(1.0), scan * 0.3);
      col += fresnel * uColorA;
      
      // Alpha
      float alpha = uOpacity * (0.3 + fresnel + scan * uScanStrength);
      alpha *= uPulse;
      
      // Micro Flicker for "Energy" feel
      float flicker = 0.98 + 0.02 * sin(uTime * 100.0);
      
      gl_FragColor = vec4(col, sat(alpha * flicker));
    }
  `
);

extend({ HologramMaterialImpl });

export default HologramMaterialImpl;
