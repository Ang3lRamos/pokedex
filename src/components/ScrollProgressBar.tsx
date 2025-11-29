import { useState, useEffect, useRef } from 'react';
import styles from './scrollProgressBar.module.css';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      if (!isDragging) {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / scrollHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, [isDragging]);

  const handleInteraction = (clientY: number) => {
    if (!progressContainerRef.current) return;

    const rect = progressContainerRef.current.getBoundingClientRect();
    const percentage = ((clientY - rect.top) / rect.height) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setScrollProgress(clampedPercentage);

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (clampedPercentage / 100) * scrollHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: isDragging ? 'auto' : 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleInteraction(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      handleInteraction(e.clientY);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={progressContainerRef}
      className={`${styles.progressContainer} ${isDragging ? styles.dragging : ''}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div 
        className={styles.progressBar} 
        style={{ height: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;