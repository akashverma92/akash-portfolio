import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./AboutSection.css";
import profilePic from "../assets/profile.jpg";
import Typewriter from "typewriter-effect";

const AboutSection = () => {
  const mountRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
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

    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 3,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    group.add(stars);

    for (let i = 0; i < 4; i++) {
      const radius = 20 + i * 15;
      const geo = new THREE.SphereGeometry(2.5, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f5,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0xfff8dc,
        emissiveIntensity: 0.5,
      });
      const planet = new THREE.Mesh(geo, mat);
      planet.position.set(Math.cos(i) * radius, Math.sin(i) * radius, 0);
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
    <div id="about" className="about-section">
      <div ref={mountRef} className="background-canvas"></div>
      <div className="about-overlay">
        <div className="about-container">
          <div className="about-header-row">
            <div className="profile-circle">
              <img src={profilePic} alt="Akash Kumar Verma" />
            </div>
            <div className="royal-style">
              <h2>🪶 About Myself</h2>
              <div className="typewriter-wrapper">
                Hi, I'm{" "}
                <Typewriter
                  options={{
                    strings: ["Akash Kumar Verma"],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>
              <p>
                Driven and passionate student dedicated to advancing a career in
                machine learning, web development, and app development. Eager to
                apply and expand theoretical knowledge through real-world challenges.
                Committed to continuous learning and hands-on innovation.
              </p>
            </div>
          </div>

          <div className="royal-style">
            <h2>🎓 Education</h2>
            <ul>
              <li><b>Bachelor of Technology</b> – Information Technology, Kalasalingam University, 2022–2026</li><br />
              <li><b>Senior Secondary School</b> – Divya Bhaskar Public School, 2020–2022</li><br />
              <li><b>Secondary School</b> – Divya Bhaskar Public School, 2019–2020</li>
            </ul>
          </div>

          <div className="royal-style">
            <h2>🏆 Achievements</h2>
            <ul>
              <li>Winner in Kare ACM ML Hackathon</li><br />
              <li>2nd Runner Up in Hack2SKill ML Hackathon</li><br />
              <li>Published 1 research paper in IEEE journals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
