import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Preview = ({ images = [] }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f1f5f9");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);
    scene.add(camera);

    const keyLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(keyLight);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2.5, 3, 1.5);
    const textureLoader = new THREE.TextureLoader();

    const defaultSideMaterial = new THREE.MeshStandardMaterial({
      color: "#cbd5e1",
      roughness: 0.4,
    });

    const texturesToDispose = [];
    const makeTexturedMaterial = (url) => {
      if (!url) return defaultSideMaterial;

      const texture = textureLoader.load(url);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texturesToDispose.push(texture);

      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
      });
    };

    const imgs = images || [null, null, null, null];

    const faceMaterials = [
      imgs[3] ? makeTexturedMaterial(imgs[3]) : defaultSideMaterial,
      imgs[2] ? makeTexturedMaterial(imgs[2]) : defaultSideMaterial,
      defaultSideMaterial,
      defaultSideMaterial,
      imgs[0] ? makeTexturedMaterial(imgs[0]) : defaultSideMaterial,
      imgs[1] ? makeTexturedMaterial(imgs[1]) : defaultSideMaterial,
    ];

    const boxMesh = new THREE.Mesh(geometry, faceMaterials);
    scene.add(boxMesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.enableZoom = true;
    controls.minDistance = 3.5;
    controls.maxDistance = 10;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      geometry.dispose();
      defaultSideMaterial.dispose();
      texturesToDispose.forEach((tex) => tex.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [images]);

  return (
    <div className="w-full">
      <div
        ref={mountRef}
        className="w-full h-[380px] rounded-xl border border-gray-200 overflow-hidden shadow-inner bg-slate-100"
      />
    </div>
  );
};

export default Preview;
