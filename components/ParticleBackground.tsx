'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 4 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = -Math.random() * 0.3 - 0.1; // float up
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = theme === 'dark' ? (Math.random() > 0.5 ? '#7c3aed' : '#06b6d4') : '#7c3aed';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around bounds
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
        if (this.x < 0 || this.x > width) {
          this.speedX *= -1;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowBlur = theme === 'dark' ? 8 : 0;
        c.shadowColor = this.color;
        c.fill();
        c.restore();
      }
    }

    // Initialize particles
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background ambient blobs in dark mode
      if (theme === 'dark') {
        const gradient1 = ctx.createRadialGradient(
          width * 0.2, height * 0.8, 10,
          width * 0.2, height * 0.8, Math.min(width, height) * 0.4
        );
        gradient1.addColorStop(0, 'rgba(124, 58, 237, 0.06)');
        gradient1.addColorStop(1, 'rgba(10, 10, 26, 0)');
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, width, height);

        const gradient2 = ctx.createRadialGradient(
          width * 0.8, height * 0.2, 10,
          width * 0.8, height * 0.2, Math.min(width, height) * 0.4
        );
        gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
        gradient2.addColorStop(1, 'rgba(10, 10, 26, 0)');
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Light mode soft background blobs
        const gradient = ctx.createRadialGradient(
          width * 0.5, height * 0.5, 50,
          width * 0.5, height * 0.5, Math.min(width, height) * 0.6
        );
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.03)');
        gradient.addColorStop(1, 'rgba(248, 249, 252, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity: 0.8 }}
    />
  );
}
