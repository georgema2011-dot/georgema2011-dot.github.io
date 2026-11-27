"use client";

import { useEffect, useRef, useState } from "react";

export function SomepenModelViewer() {
  const stage = useRef<HTMLDivElement>(null);
  const resetView = useRef<(() => void) | null>(null);
  const toggleMotion = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState("Model loads when this section enters view.");
  const [ready, setReady] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);

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

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.AgXToneMapping;
        renderer.toneMappingExposure = 0.86;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x20211f);
        const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
        const controls = new OrbitControls(camera, canvas);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.autoRotate = false;
        controls.minPolarAngle = Math.PI * 0.16;
        controls.maxPolarAngle = Math.PI * 0.84;

        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        scene.environment = pmrem.fromScene(room).texture;
        scene.environmentIntensity = 0.12;
        room.dispose();
        pmrem.dispose();

        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync("/projects/somepen/somepen-v2.glb");
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
        const bounds = new THREE.Box3().setFromObject(model);
        const centre = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        model.position.sub(centre);
        model.updateMatrixWorld(true);

        const embeddedLights: THREE.Light[] = [];
        model.traverse((item) => {
          if (item instanceof THREE.Light) embeddedLights.push(item);
          if (item instanceof THREE.Mesh) {
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });
        embeddedLights.forEach((light) => {
          const worldPosition = light.getWorldPosition(new THREE.Vector3());
          const worldQuaternion = light.getWorldQuaternion(new THREE.Quaternion());
          light.parent?.remove(light);
          scene.add(light);
          light.position.copy(worldPosition);
          light.quaternion.copy(worldQuaternion);
          if (light instanceof THREE.SpotLight) {
            light.castShadow = true;
            light.shadow.mapSize.set(1024, 1024);
            light.shadow.bias = -0.0001;
          }
        });

        const turntable = new THREE.Group();
        turntable.add(model);
        scene.add(turntable);
        const distance = Math.max(size.x, size.y, size.z) * 1.5;
        const initialPosition = new THREE.Vector3(distance * 0.78, distance * 0.4, distance);
        const render = () => renderer.render(scene, camera);
        let animationFrame = 0;
        let sectionInView = true;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let turntableRotates = !reducedMotion.matches;
        let previousFrameTime = 0;
        const shouldAnimate = () => turntableRotates && sectionInView && document.visibilityState === "visible";
        const animate = (frameTime: number) => {
          animationFrame = 0;
          if (!shouldAnimate()) return;
          const frameDelta = previousFrameTime ? Math.min((frameTime - previousFrameTime) / 1000, 0.05) : 0;
          previousFrameTime = frameTime;
          turntable.rotation.y = (turntable.rotation.y + frameDelta * 0.16) % (Math.PI * 2);
          controls.update();
          render();
          animationFrame = requestAnimationFrame(animate);
        };
        const startAnimation = () => {
          if (shouldAnimate() && !animationFrame) {
            previousFrameTime = 0;
            animationFrame = requestAnimationFrame(animate);
          }
        };
        const pauseMotion = (message?: string) => {
          turntableRotates = false;
          setMotionEnabled(false);
          if (animationFrame) cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          if (message) setStatus(message);
          render();
        };
        const resumeMotion = () => {
          if (reducedMotion.matches) return;
          turntableRotates = true;
          setMotionEnabled(true);
          setStatus("Model ready. Turntable rotating — drag to inspect.");
          startAnimation();
          render();
        };
        const fitView = () => {
          turntable.rotation.y = 0;
          camera.position.copy(initialPosition);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
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
        const pauseForInput = () => {
          if (turntableRotates) pauseMotion("Model ready. Manual view active.");
        };
        const onVisibilityChange = () => startAnimation();
        const onMotionPreferenceChange = () => {
          if (reducedMotion.matches) pauseMotion("Model ready. Rotation paused to respect your motion preference.");
        };
        const modelVisibilityObserver = new IntersectionObserver(([entry]) => {
          sectionInView = entry.isIntersecting;
          startAnimation();
        }, { threshold: 0.1 });
        modelVisibilityObserver.observe(host);
        controls.addEventListener("change", render);
        controls.addEventListener("start", pauseForInput);
        document.addEventListener("visibilitychange", onVisibilityChange);
        reducedMotion.addEventListener("change", onMotionPreferenceChange);
        fitView();
        resize();

        resetView.current = fitView;
        toggleMotion.current = () => {
          if (turntableRotates) pauseMotion("Model ready. Rotation paused.");
          else resumeMotion();
        };
        setReady(true);
        setMotionEnabled(turntableRotates);
        setStatus(turntableRotates
          ? "Model ready. Turntable rotating — drag to inspect."
          : "Model ready. Drag to rotate and scroll to zoom.");
        startAnimation();

        disposeScene = () => {
          resetView.current = null;
          toggleMotion.current = null;
          if (animationFrame) cancelAnimationFrame(animationFrame);
          resizeObserver.disconnect();
          modelVisibilityObserver.disconnect();
          controls.removeEventListener("change", render);
          controls.removeEventListener("start", pauseForInput);
          document.removeEventListener("visibilitychange", onVisibilityChange);
          reducedMotion.removeEventListener("change", onMotionPreferenceChange);
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
          scene.environment?.dispose();
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
      <p className="somepen-model-instructions">It turns slowly until you take control. Drag to rotate. Scroll or pinch to zoom.</p>
    </div>
    <div className="somepen-model-stage" ref={stage} role="group" aria-label="Interactive SOMPEN model viewer">
      <p className="somepen-model-status" role="status">{status}</p>
      <div className="somepen-model-controls">
        <button type="button" onClick={() => toggleMotion.current?.()} disabled={!ready} aria-pressed={motionEnabled}>{motionEnabled ? "Pause motion" : "Play motion"}</button>
        <button type="button" onClick={() => resetView.current?.()} disabled={!ready}>Reset view</button>
      </div>
    </div>
  </section>;
}
