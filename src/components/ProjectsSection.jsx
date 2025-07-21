import React, { useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import * as THREE from "three";
import "./ProjectsSection.css";
import mlAppImage from "../assets/aipred.png";
import portfolioImage from "../assets/port.png";
import Aiimage from "../assets/Ai.png";
import clusterimage from "../assets/clu.png";
import campusimage from "../assets/cam.png";
import fraudimage from "../assets/fraud.png";
import zovitraImage from "../assets/zov.png";

const projects = [
  {
    title: "Portfolio Website",
    date: "Jul 2025",
    description: [
      "This project is developed using ReactJs , CSS, ",
      "It showcases my skills, projects, and experience",
      "The website is responsive and user-friendly",
      "It's live on vercel",
    ],
    image: portfolioImage,
    link: "https://github.com/your-ml-app",
  },
  {
    title: "Zovitra",
    date: "Mar 2025",
    description: [
      "Built an Website that helps tourists get real-time updates about places.",
      "Tourists and local people can post news, share alerts, and upload recent photos.",
      "Built with ReactJs, HTML, CSS, JavaScript,MySQL",
    ],
    image: zovitraImage,
    link: "https://github.com/your-ml-app",
  },
  {
    title: "Fraud detection in financial transactions using GNN",
    date: "Mar 2025",
    description: [
      "Modeled financial transaction data as a graph where users, transactions, and devices form interconnected nodes and edges to reflect behavioral and relational patterns",
      "Combined GNN-generated embeddings with handcrafted features in an XGBoost classifier to enhance predictive performance",
      "Achieved high accuracy and recall in fraud detection",
    ],
    image: fraudimage,
    link: "https://github.com/your-portfolio",
  },
  {
    title: "Ai Disease Outbreak Prediction",
    date: "Nov 2024",
    description: [
      "This project uses machine learning to predict disease outbreaks",
      "Helps in early detection and prevention By Notifying To Goverment Authorities",
      "Built with Python, Flask, HTML, CSS, JavaScript, TensorFlow",
      "Developed on 8 Disease Datasets",
    ],
    image: mlAppImage,
    link: "https://github.com/your-ml-app",
  },
  {
    title: "Student Grivence App",
    date: "Oct 2024",
    description: [
      "Developed an Android app for students to submit complaints directly to college administration.",
      "Used Firebase for database, user login, and secure admin access.",
      "Designed a clean and friendly interface to ensure smooth usage for both students and admins.",
    ],
    image: campusimage,
    link: "https://github.com/your-ml-app",
  },
  {
    title: "Clustering Prediction Model",
    date: "Sep 2023",
    description: [
      "Built a clustering-based model using unsupervised learning to uncover patterns in complex datasets.",
      "Applied feature engineering and hyperparameter tuning to optimize model performance",
      "Ranked 3rd among top participants in a competitive machine learning hackathon.",
    ],
    image: clusterimage,
    link: "https://github.com/your-ml-app",
  },
  {
    title: "Ai Voice assistant",
    date: "Jan 2023",
    description: [
      "This projects uses the basics of python",
      "Helps in doing the daily task easily it's automate the tasks",
      "Built using Python & API integration for automate the tasks",
    ],
    image: Aiimage,
    link: "https://github.com/your-android-game",
  },
];

const Page = React.forwardRef(({ children }, ref) => (
  <div className="page" ref={ref}>
    {children}
  </div>
));

const ProjectsSection = () => {
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
    <div className="projects-section">
      <div ref={mountRef} className="projects-background" />

      <div className="flipbook-container">
        <HTMLFlipBook
          width={550}
          height={400}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1536}
          drawShadow={true}
          flippingTime={800}
          useMouseEvents={true}
          showCover={true}
          startPage={0}
          mobileScrollSupport={false}
          className="flipbook"
        >
          {/* Cover Page */}
          <Page>
            <div className="book-cover">
              <h1 className="cover-title">Projects</h1>
            </div>
          </Page>

          {/* Project Pages */}
          {projects.map((proj, idx) => {
            return [
              <Page key={`${idx}-desc`}>
                <div className="project-text-page">
                  <h2>{proj.title}</h2>
                  <p>({proj.date})</p>
                  <div className="project-description">
                    <ul>
                      {proj.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Page>,

              <Page key={`${idx}-img`}>
                <div className="image-page-container">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="project-image-auto"
                  />
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="image-page-icon"
                      title="View Project"
                    >
                      🔗
                    </a>
                  )}
                </div>
              </Page>
            ];
          })}

          {/* Add blank page if total is odd */}
          {projects.length % 2 === 0 ? null : <Page />}

          {/* End Page */}
          <Page>
            <div className="book-cover">
              <h1 className="cover-title">The End</h1>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default ProjectsSection;
