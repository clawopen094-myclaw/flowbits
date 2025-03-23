import React, { useRef, useEffect, useState } from "react";

interface DonutProps {
  speed?: number;
  wireframeColor?: string;
  majorSegments?: number;
  minorSegments?: number;
  projectionDistance?: number; // Add this for perspective control
}

const Donut: React.FC<DonutProps> = ({
  speed = 1,
  wireframeColor,
  majorSegments = 24,
  minorSegments = 12,
  projectionDistance = 500, // Default projection distance
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const actualTheme = localStorage.getItem('my-theme')
    if (actualTheme==="system"){
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    else{
      setIsDarkMode(actualTheme==="dark"? true:false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawDonut = (time: number) => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + Math.sin(time * 0.5) * 20;
      const majorRadius = Math.min(canvas.width, canvas.height) * 0.2;
      const minorRadius = majorRadius * 0.4;


      const angleA = time * speed * 0.5;
      const angleB = time * speed * 0.3;

      const cosA = Math.cos(angleA);
      const sinA = Math.sin(angleA);
      const cosB = Math.cos(angleB);
      const sinB = Math.sin(angleB);

      ctx.strokeStyle = isDarkMode
        ? wireframeColor || "#fff"
        : wireframeColor || "#000";
      ctx.lineWidth = 1;

      const points: { x: number; y: number }[][] = [];

      // Generate torus points
      for (let i = 0; i < majorSegments; i++) {
        points[i] = [];
        const theta = (i * 2 * Math.PI) / majorSegments;

        for (let j = 0; j < minorSegments; j++) {
          const phi = (j * 2 * Math.PI) / minorSegments;

          const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
          const y = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
          const z = minorRadius * Math.sin(phi);

          // Rotate around Y axis
          let xRotY = x * cosA - z * sinA;
          let zRotY = x * sinA + z * cosA;

          // Rotate around X axis
          let yRotX = y * cosB - zRotY * sinB;
          let zRotX = y * sinB + zRotY * cosB;


          // Project to 2D with PERSPECTIVE:
          const perspective = projectionDistance / (projectionDistance + zRotX);
          const projX = xRotY * perspective + centerX;
          const projY = yRotX * perspective + centerY;


          points[i][j] = { x: projX, y: projY };
        }
      }

      // Draw theta lines
      ctx.beginPath();
      for (let i = 0; i < majorSegments; i++) {
        for (let j = 0; j < minorSegments; j++) {
          const nextI = (i + 1) % majorSegments;
          const current = points[i][j];
          const next = points[nextI][j];
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
        }
      }
      ctx.stroke();

      // Draw phi lines
      ctx.beginPath();
      for (let i = 0; i < majorSegments; i++) {
        for (let j = 0; j < minorSegments; j++) {
          const nextJ = (j + 1) % minorSegments;
          const current = points[i][j];
          const next = points[i][nextJ];
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
        }
      }
      ctx.stroke();

      // NO requestAnimationFrame here!
    };

    const animate = (timestamp: number) => {
      drawDonut(timestamp / 1000);
      requestRef.current = requestAnimationFrame(animate); // Correct animation loop
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [speed, isDarkMode, wireframeColor, majorSegments, minorSegments, projectionDistance]); // Include projectionDistance

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: isDarkMode ? "black" : "white" }}
    />
  );
};

export default Donut;


{/* <Donut speed={1.5} wireframeColor="#00ff00" majorSegments={32} minorSegments={16} /> */}