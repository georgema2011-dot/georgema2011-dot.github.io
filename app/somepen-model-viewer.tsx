"use client";

import { useEffect, useRef, useState } from "react";

export function SomepenModelViewer() {
  const stage = useRef<HTMLDivElement>(null);
  const resetView = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState("Model loads when this section enters view.");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = stage.current;
    if (!host) return;

    let active = true;
    let started = false;
    let disposeScene = () => {};

    const loadModel = async () => {
      if (started) return;
      started = true;
      setStatus("Loading interactive model…");

      try {
        const [THREE, { GLTFLoader }, { DRACOLoader }, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/loaders/DRACOLoader.js"),
          import("three/examples/jsm/controls/OrbitControls.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
        if (!active) return;

        const canvas = document.createElement("canvas");
        canvas.setAttribute("aria-label", "Interactive three-dimensional SOMPEN concept model");
        host.append(canvas);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
        const controls = new OrbitControls(camera, canvas);
        controls.enablePan = false;
        controls.enableDamping = false;
        controls.minPolarAngle = Math.PI * 0.16;
        controls.maxPolarAngle = Math.PI * 0.84;

        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        scene.environment = pmrem.fromScene(room).texture;
        room.dispose();
        pmrem.dispose();

        scene.add(new THREE.HemisphereLight(0xffffff, 0x292929, 2.5));
        const keyLight = new THREE.DirectionalLight(0xffffff, 3);
        keyLight.position.set(3, 5, 6);
        scene.add(keyLight);

        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        draco.setDecoderConfig({ type: "wasm" });
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync("/projects/somepen/somepen-web.glb");
        if (!active) {
          gltf.scene.traverse((item) => {
            if (item instanceof THREE.Mesh) item.geometry.dispose();
          });
          renderer.dispose();
          canvas.remove();
          draco.dispose();
          return;
        }

        const model = gltf.scene;
        scene.add(model);
        const bounds = new THREE.Box3().setFromObject(model);
        const centre = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const distance = Math.max(size.x, size.y, size.z) * 1.18;
        const initialPosition = centre.clone().add(new THREE.Vector3(distance * 0.78, distance * 0.4, distance));
        const render = () => renderer.render(scene, camera);
        const fitView = () => {
          camera.position.copy(initialPosition);
          camera.lookAt(centre);
          controls.target.copy(centre);
          controls.minDistance = distance * 0.5;
          controls.maxDistance = distance * 2.25;
          controls.update();
          render();
        };

        const resize = () => {
          const rect = host.getBoundingClientRect();
          renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
          camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
          camera.updateProjectionMatrix();
          render();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        controls.addEventListener("change", render);
        fitView();
        resize();

        resetView.current = fitView;
        setReady(true);
        setStatus("Model ready. Drag to rotate and scroll to zoom.");

        disposeScene = () => {
          resetView.current = null;
          resizeObserver.disconnect();
          controls.removeEventListener("change", render);
          controls.dispose();
          scene.traverse((item) => {
            if (item instanceof THREE.Mesh) {
              item.geometry.dispose();
              const materials = Array.isArray(item.material) ? item.material : [item.material];
              materials.forEach((material) => {
                Object.values(material).forEach((value) => {
                  if (value && typeof value === "object" && "isTexture" in value) (value as THREE.Texture).dispose();
                });
                material.dispose();
              });
            }
          });
          renderer.dispose();
          canvas.remove();
          draco.dispose();
        };
      } catch {
        if (!active) return;
        setStatus("The interactive model could not load. The project boards below remain available.");
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void loadModel();
    }, { rootMargin: "500px 0px" });
    observer.observe(host);

    return () => {
      active = false;
      observer.disconnect();
      disposeScene();
    };
  }, []);

  return <section className="somepen-model" aria-labelledby="somepen-model-title">
    <div className="somepen-model-copy">
      <p className="label">Interactive model</p>
      <h2 id="somepen-model-title">Turn the idea over.</h2>
      <p>A web-optimised 3D model of the finger-mounted, four-colour writing-tool concept.</p>
      <p className="somepen-model-instructions">Drag to rotate. Scroll or pinch to zoom. The project boards below remain the full visual record.</p>
    </div>
    <div className="somepen-model-stage" ref={stage} role="group" aria-label="Interactive SOMPEN model viewer">
      <p className="somepen-model-status" role="status">{status}</p>
      <button type="button" onClick={() => resetView.current?.()} disabled={!ready}>Reset view</button>
    </div>
  </section>;
}
