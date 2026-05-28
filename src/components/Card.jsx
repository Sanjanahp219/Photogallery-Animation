

export default function Card({
  card,
  index,
  isFlyOut,
  dragStyle,
  handleCardClick,
  handleDragStart,
}) {
  const isPos0 = index === 0;

  // Build class name
  let cardClass = `stack-card card-pos-${index}`;
  if (isFlyOut) {
    cardClass += ' card-fly-out';
  }

  // Apply custom style if dragging active card
  const customStyle = isPos0 ? dragStyle : {};

  return (
    <div
      className={cardClass}
      onClick={() => handleCardClick(card, index)}
      onMouseDown={(e) => {
        if (isPos0 && e.button === 0) {
          e.preventDefault();
          handleDragStart(e, false);
        }
      }}
      onTouchStart={(e) => {
        if (isPos0) {
          handleDragStart(e, true);
        }
      }}
      style={{
        display: index < 5 ? 'block' : 'none',
        ...customStyle
      }}
    >
      <div className="card-image-wrapper">
        <div 
          className="card-image" 
          style={{ backgroundImage: `url(${card.image})` }}
        ></div>
      </div>
      <div className="card-overlay">
        <span className="card-meta">{card.meta}</span>
        <h2 className="card-title">{card.title}</h2>
        <p className="card-desc">{card.desc}</p>
      </div>
    </div>
  );
}
