import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Typewriter from "typewriter-effect";
import "./HeroSection.css";

export default function HeroSection() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(0, 0, 100);
    scene.add(light);

    function createStarTexture() {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.translate(size / 2, size / 2);
      ctx.fillStyle = "white";
      const outer = size * 0.4;
      const inner = size * 0.15;

      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = Math.PI / 5 / 2 * i;
        const radius = i % 2 === 0 ? outer : inner;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();

      const grad = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
      grad.addColorStop(0, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, outer, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    }

    const starTexture = createStarTexture();
    const starGroups = [];

    for (let g = 0; g < 5; g++) {
      const geometry = new THREE.BufferGeometry();
      const count = 300;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 3 + Math.random() * 2,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: Math.random() * 0.5 + 0.5,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      starGroups.push({ mesh: points, speed: 0.008 + Math.random() * 0.014 });
    }

    const planets = [];
    for (let i = 0; i < 7; i++) {
      const radius = 15 + i * 10;
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 100 }, (_, j) => {
          const theta = (j / 100) * Math.PI * 2;
          return new THREE.Vector3(
            Math.cos(theta) * radius,
            Math.sin(theta) * radius,
            0
          );
        })
      );
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.3 + i * 0.1,
      });
      scene.add(new THREE.LineLoop(ringGeo, ringMat));

      const geo = new THREE.SphereGeometry(1.8, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0xb0c4de,
        emissiveIntensity: 0.5,
      });

      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      planets.push({
        mesh,
        radius,
        angle: Math.random() * Math.PI * 2,
        speed: 0.002 + i * 0.0008,
      });
    }

    let tick = 0;
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    function animate() {
      tick += 0.01;
      starGroups.forEach(({ mesh, speed }, idx) => {
        mesh.material.opacity = 0.5 + 0.5 * Math.sin(tick * speed + idx);
      });
      planets.forEach((p) => {
        p.angle += p.speed;
        p.mesh.position.set(
          Math.cos(p.angle) * p.radius,
          Math.sin(p.angle) * p.radius,
          0
        );
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="hero-container">
      <div className="hero-text">
        <div className="emoji">👨‍💻</div>
        <div className="availability-badge">
          <span className="green-dot"></span> Available for new Project
        </div>
        <h1 className="hero-title">
          Crafting Outstanding <br />
          Digital Experiences
        </h1>
        <p className="hero-subtext">
          I build high-performing web apps and integrate machine learning to create smarter, user-focused solutions. Let’s bring your next project to life.
        </p>
        <div className="typewriter-wrapper">
          Open for role in{" "}
          <span className="underline">
            <Typewriter
              options={{
                strings: ["Machine Learning", "Web Development", "App Development"],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
