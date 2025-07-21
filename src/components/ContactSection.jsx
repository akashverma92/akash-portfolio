import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ContactSection.css";

export default function ContactSection() {
  const mountRef = useRef(null);

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

    const starTexture = (() => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.translate(size / 2, size / 2);
      ctx.fillStyle = "white";
      const outer = size * 0.4, inner = size * 0.15;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i;
        const r = i % 2 ? inner : outer;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath(); ctx.fill();
      const grad = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
      grad.addColorStop(0, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, 0, outer, 0, Math.PI * 2); ctx.fill();
      return new THREE.CanvasTexture(canvas);
    })();

    const starGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(300 * 3).map(() => (Math.random() - 0.5) * 600);
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 3,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    group.add(new THREE.Points(starGeo, starMat));

    for (let i = 0; i < 4; i++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xf5f5f5,
          metalness: 0.3,
          roughness: 0.4,
          emissive: 0xfff8dc,
          emissiveIntensity: 0.5
        })
      );
      const r = 20 + i * 15;
      sphere.position.set(Math.cos(i) * r, Math.sin(i) * r, 0);
      group.add(sphere);
    }

    const onMouse = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      group.rotation.y = x * 0.4;
      group.rotation.x = y * 0.4;
      renderer.render(scene, camera);
    };

    window.addEventListener("mousemove", onMouse);
    renderer.render(scene, camera);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="contact-section">
  <div ref={mountRef} className="background-canvas"></div>
  <div className="contact-overlay">
    <div className="contact-card">
      <h2>Let’s Collaborate</h2>
      <p>
        I'm always excited to connect with like-minded developers, potential collaborators,
        or recruiters. Whether you have an idea, a project, or an opportunity — feel free
        to get in touch.
      </p>
      <a
        href="mailto:akashverma.ara1@gmail.com"
        className="send-btn"
        aria-label="Send Email"
      >
        <span className="leaf-icon">🪶</span>
      </a>
    </div>
  </div>
</div>

  );
}

