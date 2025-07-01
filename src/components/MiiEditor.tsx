import React, { useState, useRef } from "react";

// Placeholder feature options (we'll fill these from mii-creator assets/config)
const hairStyles = ["Short", "Medium", "Long"];
const eyeStyles = ["Round", "Almond", "Sharp"];

export default function MiiEditor({ gender, onBack }) {
  // State for Mii features
  const [hair, setHair] = useState(hairStyles[0]);
  const [eyes, setEyes] = useState(eyeStyles[0]);
  // ...add more as we go (mouth, color, etc.)

  const canvasRef = useRef(null);

  // Download as PNG handler (stub)
  const handleDownload = () => {
    // TODO: implement actual rendering logic!
    alert("Download feature coming soon!");
  };

  return (
    <div className="mii-editor-root">
      <h2>Create Your Mii ({gender === "male" ? "Male" : "Female"})</h2>
      {/* Mii Preview */}
      <div className="mii-preview-area">
        <canvas ref={canvasRef} width={220} height={220} style={{ background: "#fff", borderRadius: "50%", boxShadow: "0 2px 12px #aaa", marginBottom: "1.5rem" }} />
      </div>
      {/* Feature Controls */}
      <div className="mii-controls">
        <label>
          Hair:
          <select value={hair} onChange={e => setHair(e.target.value)}>
            {hairStyles.map(h => <option key={h}>{h}</option>)}
          </select>
        </label>
        <label>
          Eyes:
          <select value={eyes} onChange={e => setEyes(e.target.value)}>
            {eyeStyles.map(e => <option key={e}>{e}</option>)}
          </select>
        </label>
        {/* More controls will be added here */}
      </div>
      {/* Action Buttons */}
      <div style={{marginTop: "2rem", display: "flex", gap: "1rem"}}>
        <button className="generate-button" onClick={handleDownload}>
          Download as PNG
        </button>
        <button className="secondary-button" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}