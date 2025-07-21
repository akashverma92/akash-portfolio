import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./SkillsSection.css";
import {
  FaPython,
  FaReact,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaGitAlt,
  FaAndroid,
  FaGithub, 
  FaDocker,
} from "react-icons/fa";
import { SiMongodb, SiMysql, SiFirebase } from "react-icons/si";
import { SiFastapi, SiTailwindcss, SiPytorch, SiTensorflow, SiC } from "react-icons/si";

export default function SkillsSection() {
  const mountRef = useRef(null);
  const groupRef = useRef(null);

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

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Star texture identical to About:
    const starTexture = (() => {
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
        const angle = (Math.PI / 5) * i;
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
    })();

    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 3,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    group.add(new THREE.Points(starGeo, starMaterial));

    // Planets same as About:
    for (let i = 0; i < 4; i++) {
      const radius = 20 + i * 15;
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xf5f5f5,
          metalness: 0.3,
          roughness: 0.4,
          emissive: 0xfff8dc,
          emissiveIntensity: 0.5,
        })
      );
      planet.position.set(
        Math.cos(i) * radius,
        Math.sin(i) * radius,
        0
      );
      group.add(planet);
    }

    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      group.rotation.y = x * 0.4;
      group.rotation.x = y * 0.4;
      renderer.render(scene, camera);
    };

    window.addEventListener("mousemove", onMouseMove);
    renderer.render(scene, camera);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="skills-section">
      <div ref={mountRef} className="background-canvas"></div>
      <div className="skills-overlay">
        <div className="skill-card skills-top-right">
          <h2>Skills</h2>
          <div className="hole white-hole" />
          <div className="ribbon-container">
            <div className="ribbon ribbon-out">
              <FaHtml5 /> HTML5 — <FaCss3Alt /> CSS3 — <FaPython /> Machine Learning — <FaJava /> Java — <SiMongodb /> MongoDB — <SiMysql/> MySQL —  <SiFirebase/> Firebase

            </div>
          </div>
          <div className="cold-sun">❄️</div>
        </div>
        <div className="skill-card toolbox-bottom-left">
          <h2>My ToolBox</h2>
          <div className="hole black-hole" />
          <div className="ribbon-container">
            <div className="ribbon ribbon-in">
              <FaPython /> Python — <FaReact /> React — <FaNodeJs /> NodeJS — <FaGitAlt /> Git — <SiFastapi /> FastAPI — <SiTailwindcss /> TailwindCSS — <FaAndroid /> Android Studio —  VSCode — <FaGithub /> GitHub — <FaDocker /> Docker — <SiPytorch /> PyTorch — <SiTensorflow /> TensorFlow — <SiC /> CUDA
            </div>
          </div>
          <div className="cold-sun">❄️</div>
        </div>
      </div>
    </div>
  );
}
