'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StreamingTypewriterProps {
  content: string;
  speed?: number; // ms per word
  className?: string;
  onComplete?: () => void;
}

export function StreamingTypewriter({
  content,
  speed = 60,
  className,
  onComplete
}: StreamingTypewriterProps) {
  const [displayedWordCount, setDisplayedWordCount] = useState(0);
  const targetRef = useRef(content);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevContentRef = useRef('');
  const hasCalledComplete = useRef(false);

  // Split content into words
  const words = useMemo(() => content.split(' ').filter(w => w), [content]);

  // Update target when content changes
  useEffect(() => {
    targetRef.current = content;
  }, [content]);

  // Reset when content is completely new (new message)
  useEffect(() => {
    if (content && prevContentRef.current && !content.startsWith(prevContentRef.current.slice(0, 20))) {
      setDisplayedWordCount(0);
    }
    prevContentRef.current = content;
  }, [content]);

  // Typewriter effect
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDisplayedWordCount(prev => {
        if (prev < words.length) {
          return prev + 1;
        }
        return prev;
      });
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [speed, words.length]);

  // Call onComplete when finished
  useEffect(() => {
    if (displayedWordCount >= words.length && words.length > 0 && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete?.();
    }
  }, [displayedWordCount, words.length, onComplete]);

  return (
    <div className={className}>
      <p className="leading-7">
        <AnimatePresence mode="popLayout">
          {words.slice(0, displayedWordCount).map((word, index) => (
            <motion.span
              key={`${index}-${word}`}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="inline"
            >
              {word}{index < displayedWordCount - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </AnimatePresence>
      </p>
    </div>
  );
}
