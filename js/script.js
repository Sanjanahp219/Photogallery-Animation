document.addEventListener('DOMContentLoaded', () => {
    const stackContainer = document.getElementById('cardStack');
    const cards = Array.from(stackContainer.querySelectorAll('.stack-card'));
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    
    let isAnimating = false;
    let cardArray = [...cards]; 
    
    // Autoplay & Hover state
    let autoplayInterval = null;
    let isHovered = false;
    
    // Drag/Swipe States
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    
    
    function updateCardPositions() {
        cardArray.forEach((card, index) => {
           
            card.classList.remove('card-pos-0', 'card-pos-1', 'card-pos-2', 'card-pos-3', 'card-pos-4');
            
            // Assign new positional class based on its order in the array
            if (index < 5) {
                card.classList.add(`card-pos-${index}`);
                card.style.display = 'block';
            } else {
                card.style.display = 'none'; // Hide overflow cards if any
            }
        });
    }
    
    // Initial Setup
    updateCardPositions();
    startAutoplay();
    
    /* --------------------------------------------------
       Autoplay Control Functions
       -------------------------------------------------- */
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isDragging && !isHovered && !isAnimating) {
                cycleNext();
            }
        }, 3200); // Cycles every 3.2 seconds
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    /* --------------------------------------------------
       Carousel Navigation Functions
       -------------------------------------------------- */
    
    // Cycle Forward (Active card flies out to the back)
    function cycleNext() {
        if (isAnimating) return;
        isAnimating = true;
        
        const activeCard = cardArray[0];
        
        // 1. Trigger the fly-out animation
        activeCard.classList.add('card-fly-out');
        
        // 2. Midway through fly-out (at 400ms), update card z-indexes and classes.
        // This ensures the active card slides under the stack in the background seamlessly.
        setTimeout(() => {
            cardArray.shift();           // Remove from front
            cardArray.push(activeCard);  // Add to back
            updateCardPositions();       // Rearrange remaining cards
        }, 100);
        
        // 3. Complete animation cycle (at 850ms)
        setTimeout(() => {
            activeCard.classList.remove('card-fly-out');
            isAnimating = false;
        }, 800);

        // Reset autoplay timer if manually triggered (outside stack hover)
        if (!isHovered) {
            startAutoplay();
        }
    }
    
    // Cycle Backward (Bottom card slides to the front)
    function cyclePrev() {
        if (isAnimating) return;
        isAnimating = true;
        
        const lastCard = cardArray[cardArray.length - 1];
        
        // Shift array elements: pop from back, unshift to front
        cardArray.pop();
        cardArray.unshift(lastCard);
        
        // Update positions (the card will transition smoothly from pos-4 to pos-0)
        updateCardPositions();
        
        // Unlock controls after the standard transition duration
        setTimeout(() => {
            isAnimating = false;
        }, 800);

        // Reset autoplay timer if manually triggered (outside stack hover)
        if (!isHovered) {
            startAutoplay();
        }
    }
    
    /* --------------------------------------------------
       Event Listeners
       -------------------------------------------------- */
    
    // Autoplay Pause on Hover / Play on Leave
    stackContainer.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoplay();
    });

    stackContainer.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoplay();
    });
    
    // Button clicks
    btnNext.addEventListener('click', cycleNext);
    btnPrev.addEventListener('click', cyclePrev);
    
    // Keyboard navigation (Left/Right Arrows)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') cycleNext();
        if (e.key === 'ArrowLeft') cyclePrev();
    });
    
    // Click on stack cards directly
    stackContainer.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.stack-card');
        if (!clickedCard) return;
        
        // If they click the active card, maybe they want to play or perform an action
        if (clickedCard.classList.contains('card-pos-0')) {
            // Trigger play pulse effect or expand detail (visual reward)
            const playImg = clickedCard.querySelector('.play-img');
            if (playImg) {
                playImg.style.transition = 'none';
                playImg.style.transform = 'scale(0.8) rotate(-15deg)';
                setTimeout(() => {
                    playImg.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.35, 1)';
                    playImg.style.transform = 'scale(1.1) rotate(5deg)';
                }, 50);
            }
        } else {
            // If they click any secondary stacked card behind, advance the stack to that card
            const targetIndex = cardArray.indexOf(clickedCard);
            if (targetIndex > 0 && targetIndex < 3 && !isAnimating) {
                // Loop cycleNext to bring the clicked card to the front
                let delay = 0;
                for (let i = 0; i < targetIndex; i++) {
                    setTimeout(() => {
                        cycleNext();
                    }, delay);
                    delay += 200; // Staggered rapid shuffle
                }
            }
        }
    });
    
    /* --------------------------------------------------
       Touch & Mouse Swipe Gestures
       -------------------------------------------------- */
    
    function handleDragStart(x, y) {
        if (isAnimating) return;
        
        const activeCard = cardArray[0];
        if (!activeCard) return;
        
        startX = x;
        startY = y;
        isDragging = true;
        
        // Disable smooth transitions during active dragging for high performance responsiveness
        activeCard.style.transition = 'none';
    }
    
    function handleDragMove(x, y) {
        if (!isDragging) return;
        
        const activeCard = cardArray[0];
        if (!activeCard) return;
        
        currentX = x;
        currentY = y;
        
        const diffX = currentX - startX;
        const diffY = currentY - startY;
        
        // Apply interactive 3D rotation and translation following cursor/finger
        // Rotate card slightly as it is dragged sideways
        const rotation = diffX * 0.04; 
        const tilt = diffY * -0.02;
        
        activeCard.style.transform = `translate3d(${diffX}px, ${diffY}px, 50px) rotate(${rotation}deg) rotateX(${tilt}deg) scale(1.03)`;
        activeCard.style.boxShadow = '0 50px 80px -20px rgba(0, 0, 0, 0.9)';
    }
    
    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const activeCard = cardArray[0];
        if (!activeCard) return;
        
        // Restore smooth CSS transitions
        activeCard.style.transition = '';
        activeCard.style.boxShadow = '';
        
        const diffX = currentX - startX;
        
        // Threshold to trigger page cycle: 120 pixels drag
        if (diffX < -120) {
            // Dragged Left: Cycle Next
            cycleNext();
        } else if (diffX > 120) {
            // Dragged Right: Cycle Prev
            cyclePrev();
        } else {
            // Snap back to default pos-0 style
            activeCard.style.transform = '';
        }
        
        // Reset coordinates
        startX = 0;
        startY = 0;
        currentX = 0;
        currentY = 0;
    }
    
    // Mouse Event Listeners (specifically target active card area)
    stackContainer.addEventListener('mousedown', (e) => {
        const activeCard = e.target.closest('.card-pos-0');
        if (!activeCard) return;
        
        // Only trigger on left-click
        if (e.button !== 0) return;
        
        handleDragStart(e.clientX, e.clientY);
        
        // Prevent default browser text selections or image dragging
        e.preventDefault();
    });
    
    window.addEventListener('mousemove', (e) => {
        handleDragMove(e.clientX, e.clientY);
    });
    
    window.addEventListener('mouseup', () => {
        handleDragEnd();
    });
    
    // Touch Event Listeners (Mobile devices)
    stackContainer.addEventListener('touchstart', (e) => {
        const activeCard = e.target.closest('.card-pos-0');
        if (!activeCard) return;
        
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
    }, { passive: false });
    
    window.addEventListener('touchend', () => {
        handleDragEnd();
    });
});
