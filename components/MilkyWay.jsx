import React, { useRef, Suspense } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  CubeTextureLoader,
  CubeCamera,
  WebGLCubeRenderTarget,
  RGBFormat,
  LinearMipmapLinearFilter,
  useLoader,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={true}
      autoRotateSpeed={0.05}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.01}
    />
  );
};

// Loads the skybox texture and applies it to the scene.
function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "./images/milkyway/ultra/px.webp",
    "./images/milkyway/ultra/nx.webp",
    "./images/milkyway/ultra/py.webp",
    "./images/milkyway/ultra/ny.webp",
    "./images/milkyway/ultra/pz.webp",
    "./images/milkyway/ultra/nz.webp",
  ]);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}

// Geometry
function Sphere() {
  const { scene, gl } = useThree();
  // The cubeRenderTarget is used to generate a texture for the reflective sphere.
  // It must be updated on each frame in order to track camera movement and other changes.
  const cubeRenderTarget = new WebGLCubeRenderTarget(256, {
    format: RGBFormat,
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
  });
  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);
  cubeCamera.position.set(0, 0, 0);
  scene.add(cubeCamera);

  // Update the cubeCamera with current renderer and scene.
  useFrame(() => cubeCamera.update(gl, scene));

  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <directionalLight intensity={5} />
      <sphereGeometry attach="geometry" args={[2, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        envMap={cubeCamera.renderTarget.texture}
        color="white"
        roughness={1}
        metalness={1}
      />
    </mesh>
  );
}

// EXPORT MILKY WAY
export default function MilkyWay() {
  return (
    <div className="canvas__wrapper">
      <Canvas className="canvas">
        {/* <Suspense fallback={null}> */}
        <CameraControls />
        {/* <Sphere /> */}
        <SkyBox />
        {/* </Suspense> */}
      </Canvas>
    </div>
  );
}
