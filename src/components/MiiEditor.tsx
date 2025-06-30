import React, { useState } from "react";

// Props: gender ("male" or "female"), onBack (for cancel/back button)
export default function MiiEditor({ gender, onBack }) {
  // For now, we'll just show the gender and a placeholder.
  // We'll make this interactive and feature-rich step by step!
  return (
    <div className="mii-editor-root">
      <h2>Create Your Mii ({gender === "male" ? "Male" : "Female"})</h2>
      <div className="mii-editor-placeholder">
        {/* Here we'll build the full editor UI! */}
        <p>
          [WIP] The manual Mii editor will go here. You selected:{" "}
          <strong>{gender}</strong>
        </p>
      </div>
      <button onClick={onBack} className="secondary-button" style={{ marginTop: "2rem" }}>
        Back
      </button>
    </div>
  );
}