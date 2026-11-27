"use client";

import { useEffect, useRef, useState } from "react";

const MODEL_URL = "/projects/hip-reduction-simulator/hip-dislocation-simulator-dark-canopy-studio.glb";

export function HipReductionModelViewer() {
  const stage = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const host = stage.current;
    if (!host) return;

    let active = true;
    let started = false;
    let disposeScene = () => {};

    const loadModel = async () => {
      if (started) return;
      started = true;

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
        canvas.setAttribute("aria-label", "Interactive three-dimensional Hip Reduction Simulator model");
        canvas.setAttribute("aria-describedby", "hip-model-instructions");
        host.append(canvas);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.AgXToneMapping;
        renderer.toneMappingExposure = 0.88;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x181b1f);
        const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
        const controls = new OrbitControls(camera, canvas);
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.minPolarAngle = Math.PI * 0.14;
        controls.maxPolarAngle = Math.PI * 0.86;

        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        scene.environment = pmrem.fromScene(room).texture;
        scene.environmentIntensity = 0.08;
        room.dispose();
        pmrem.dispose();

        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync(MODEL_URL);
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
        const authoredCamera = model.getObjectByName("Camera_Studio_Hero_34");
        const authoredPosition = authoredCamera?.getWorldPosition(new THREE.Vector3());

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
          if (light instanceof THREE.DirectionalLight) light.intensity = Math.min(light.intensity * 0.0009, 1.5);
          if (light instanceof THREE.PointLight || light instanceof THREE.SpotLight) light.intensity = Math.min(light.intensity * 0.008, 6);
          if (light instanceof THREE.SpotLight) {
            light.castShadow = true;
            light.shadow.mapSize.set(1024, 1024);
            light.shadow.bias = -0.0001;
          }
        });

        const turntable = new THREE.Group();
        turntable.add(model);
        scene.add(turntable);
        const mixer = gltf.animations[0] ? new THREE.AnimationMixer(model) : null;
        const action = mixer && gltf.animations[0] ? mixer.clipAction(gltf.animations[0]).play() : null;
        const fallbackDistance = Math.max(size.x, size.y, size.z) * 1.62;
        const initialPosition = authoredPosition ?? new THREE.Vector3(fallbackDistance * 0.9, fallbackDistance * 0.42, fallbackDistance * 1.18);
        const initialDistance = Math.max(initialPosition.length(), fallbackDistance * 0.7);
        if (authoredCamera instanceof THREE.PerspectiveCamera) camera.fov = authoredCamera.fov;
        camera.far = Math.max(25, initialDistance * 4);
        camera.updateProjectionMatrix();

        const render = () => renderer.render(scene, camera);
        const fitView = () => {
          turntable.rotation.y = 0;
          const rect = host.getBoundingClientRect();
          const aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
          const responsiveDistance = initialDistance * Math.max(1, 1.6 / aspect);
          camera.position.copy(initialPosition).normalize().multiplyScalar(responsiveDistance);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
          controls.minDistance = responsiveDistance * 0.58;
          controls.maxDistance = responsiveDistance * 2.8;
          controls.update();
          render();
        };

        let animationFrame = 0;
        let resumeTimer = 0;
        let sectionInView = true;
        let previousFrameTime = 0;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let motionEnabled = !reducedMotion.matches;
        const shouldAnimate = () => motionEnabled && sectionInView && document.visibilityState === "visible";
        const animate = (frameTime: number) => {
          animationFrame = 0;
          if (!shouldAnimate()) return;
          const frameDelta = previousFrameTime ? Math.min((frameTime - previousFrameTime) / 1000, 0.05) : 0;
          previousFrameTime = frameTime;
          mixer?.update(frameDelta * 0.72);
          turntable.rotation.y = (turntable.rotation.y + frameDelta * 0.1) % (Math.PI * 2);
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
        const pauseMotion = () => {
          motionEnabled = false;
          action?.setEffectiveTimeScale(0);
          if (animationFrame) cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          render();
        };
        const resumeMotion = () => {
          if (reducedMotion.matches) return;
          motionEnabled = true;
          action?.setEffectiveTimeScale(1);
          startAnimation();
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
          window.clearTimeout(resumeTimer);
          if (motionEnabled) pauseMotion();
        };
        const resumeAfterInput = () => {
          if (reducedMotion.matches) return;
          window.clearTimeout(resumeTimer);
          resumeTimer = window.setTimeout(resumeMotion, 1100);
        };
        const onVisibilityChange = () => startAnimation();
        const onMotionPreferenceChange = () => {
          if (reducedMotion.matches) pauseMotion();
          else resumeMotion();
        };
        const modelVisibilityObserver = new IntersectionObserver(([entry]) => {
          sectionInView = entry.isIntersecting;
          startAnimation();
        }, { threshold: 0.1 });
        modelVisibilityObserver.observe(host);
        controls.addEventListener("change", render);
        controls.addEventListener("start", pauseForInput);
        controls.addEventListener("end", resumeAfterInput);
        canvas.addEventListener("dblclick", fitView);
        document.addEventListener("visibilitychange", onVisibilityChange);
        reducedMotion.addEventListener("change", onMotionPreferenceChange);
        fitView();
        resize();
        startAnimation();

        disposeScene = () => {
          window.clearTimeout(resumeTimer);
          if (animationFrame) cancelAnimationFrame(animationFrame);
          resizeObserver.disconnect();
          modelVisibilityObserver.disconnect();
          controls.removeEventListener("change", render);
          controls.removeEventListener("start", pauseForInput);
          controls.removeEventListener("end", resumeAfterInput);
          canvas.removeEventListener("dblclick", fitView);
          document.removeEventListener("visibilitychange", onVisibilityChange);
          reducedMotion.removeEventListener("change", onMotionPreferenceChange);
          controls.dispose();
          mixer?.stopAllAction();
          mixer?.uncacheRoot(model);
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

  return <section className="hip-model" aria-labelledby="hip-model-title">
    <div className="hip-model-copy">
      <p className="label">Interactive model</p>
      <h2 id="hip-model-title">Explore the simulator.</h2>
      <p>An interactive 3D model of the Hip Reduction Simulator, shown in its supplied studio setting.</p>
      <p className="hip-model-instructions" id="hip-model-instructions">Drag to orbit. Scroll or pinch to zoom. Double-click to reset.</p>
    </div>
    <div className="hip-model-stage" ref={stage} role="group" aria-label="Interactive Hip Reduction Simulator model viewer">
      {status && <p className="hip-model-status" role="status">{status}</p>}
    </div>
  </section>;
}
