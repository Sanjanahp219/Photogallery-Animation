

export default function SectionTextContent({ cyclePrev, cycleNext }) {
  return (
    <div className="section-text-content">
      <span className="sub-title">FINE ART EXHIBITION</span>
      <h1 className="main-heading">Whispering Woods &amp;<br />Endless Tides</h1>
      <p className="description">
        A cinematic 3D study of natural textures. Swipe or click the deck to immerse yourself in details of ancient growth, raw currents, and silent spaces.
      </p>
      <div className="controls-container">
        <button className="nav-btn btn-prev" aria-label="Previous Slide" onClick={cyclePrev}>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <button className="nav-btn btn-next" aria-label="Next Slide" onClick={cycleNext}>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
