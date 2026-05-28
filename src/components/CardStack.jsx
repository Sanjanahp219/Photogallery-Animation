
import Card from './Card';

export default function CardStack({
  cards,
  flyOutCardId,
  dragStyle,
  handleCardClick,
  handleDragStart,
  setIsHovered,
}) {
  return (
    <div className="card-stack-viewport">
      <div 
        className="card-stack" 
        id="cardStack"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {cards.map((card, index) => {
          const isFlyOut = flyOutCardId === card.id;

          return (
            <Card
              key={card.id}
              card={card}
              index={index}
              isFlyOut={isFlyOut}
              dragStyle={dragStyle}
              handleCardClick={handleCardClick}
              handleDragStart={handleDragStart}
            />
          );
        })}
      </div>
    </div>
  );
}
