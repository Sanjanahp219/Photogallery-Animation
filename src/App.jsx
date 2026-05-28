import { useState, useEffect, useRef } from 'react';
import EditorialHeader from './components/EditorialHeader';
import EditorialFooter from './components/EditorialFooter';
import SectionTextContent from './components/SectionTextContent';
import CardStack from './components/CardStack';

const INITIAL_CARDS = [
  { id: 0, image: '/images/forest.png', meta: '01 / SILENT GREEN', title: 'Mist.', desc: 'Ancient pine giants shrouded in morning fog, filtering rays of golden light.' },
  { id: 1, image: '/images/moss.png', meta: '02 / DEEP TEXTURES', title: 'Moss.', desc: 'Dew-sparkled micro-forest floor radiating silent, fresh organic energy.' },
  { id: 2, image: '/images/waterfall.png', meta: '03 / CONTINUOUS STREAM', title: 'Flow.', desc: 'Water falling like smooth white silk against highly textured basalt volcanic rock.' },
  { id: 3, image: '/images/dunes.jpg', meta: '04 / GOLDEN SILENCE', title: 'Dunes.', desc: 'Curves of hot sand casting deep shadows under the fading terracotta sky.' },
  { id: 4, image: '/images/ocean.png', meta: '05 / ENDLESS DEPTH', title: 'Wave.', desc: 'Deep blue teal crests freezing in high shutter speed spray and chaotic raw foam.' }
];

export default function App() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyOutCardId, setFlyOutCardId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragState, setDragState] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false
  });

  const cardsRef = useRef(cards);
  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Cycle Forward: Top card flies out to the back
  const cycleNext = () => {
    if (isAnimatingRef.current) return;
    setIsAnimating(true);

    const currentList = cardsRef.current;
    const activeCard = currentList[0];
    setFlyOutCardId(activeCard.id);

    // 1000ms (1s): Shift deck cards forward AND remove animation class concurrently to prevent double-animation glitches
    setTimeout(() => {
      setCards(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setFlyOutCardId(null);
    }, 1000);

    // 1800ms: Complete the cycle and unlock user controls
    setTimeout(() => {
      setIsAnimating(false);
    }, 1800);
  };

  // Cycle Backward: Bottom card slides back to the front
  const cyclePrev = () => {
    if (isAnimatingRef.current) return;
    setIsAnimating(true);

    setCards(prev => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      return [last, ...rest];
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // Click on background cards shuffles them to front
  const handleCardClick = (card, index) => {
    if (index === 0) {
      // Trigger a light scale effect for visual satisfaction if clicking active card
      return;
    }
    if (index > 0 && index < 3 && !isAnimating) {
      let delay = 0;
      for (let i = 0; i < index; i++) {
        setTimeout(() => {
          cycleNext();
        }, delay);
        delay += 200;
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') cycleNext();
      if (e.key === 'ArrowLeft') cyclePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isHovered || dragState.isDragging || isAnimating) return;

    const interval = setInterval(() => {
      cycleNext();
    }, 3200);

    return () => clearInterval(interval);
  }, [isHovered, dragState.isDragging, isAnimating]);

  // Mouse & Touch Swipe Drag Gesture handlers
  const handleDragStart = (e, isTouch) => {
    if (isAnimating) return;

    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    setDragState({
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isDragging: true
    });
  };

  const handleDragMove = (clientX, clientY) => {
    setDragState(prev => {
      if (!prev.isDragging) return prev;
      return {
        ...prev,
        currentX: clientX,
        currentY: clientY
      };
    });
  };

  const handleDragEnd = () => {
    setDragState(prev => {
      if (!prev.isDragging) return prev;

      const diffX = prev.currentX - prev.startX;

      // Threshold: 120 pixels to cycle cards
      if (diffX < -120) {
        setTimeout(() => cycleNext(), 0);
      } else if (diffX > 120) {
        setTimeout(() => cyclePrev(), 0);
      }

      return {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false
      };
    });
  };

  useEffect(() => {
    if (!dragState.isDragging) return;

    const onMouseMove = (e) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchMove = (e) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState.isDragging]);

  const diffX = dragState.isDragging ? dragState.currentX - dragState.startX : 0;
  const diffY = dragState.isDragging ? dragState.currentY - dragState.startY : 0;
  const rotation = diffX * 0.04;
  const tilt = diffY * -0.02;

  // Active card real-time drag style
  const dragStyle = dragState.isDragging ? {
    transform: `translate3d(${diffX}px, ${diffY}px, 50px) rotate(${rotation}deg) rotateX(${tilt}deg) scale(1.03)`,
    boxShadow: '0 50px 80px -20px rgba(0, 0, 0, 0.9)',
    transition: 'none',
    zIndex: 100
  } : {};

  return (
    <div className="wrapper">
      <div className="ambient-glow"></div>
      
      {/* Decorative branches */}
      <img className="branch branch-top" src="/images/branch.png" alt="" />
      <img className="branch branch-bottom" src="/images/branch.png" alt="" aria-hidden="true" />

      {/* Editorial Header */}
      <EditorialHeader />

      {/* Main Section Content */}
      <main className="carousel-section">
        <SectionTextContent cyclePrev={cyclePrev} cycleNext={cycleNext} />
        
        {/* The Staggered 3D Card Stack */}
        <CardStack
          cards={cards}
          flyOutCardId={flyOutCardId}
          dragStyle={dragStyle}
          handleCardClick={handleCardClick}
          handleDragStart={handleDragStart}
          setIsHovered={setIsHovered}
        />
      </main>

      
      {/* <EditorialFooter /> */}
    </div>
  );
}
