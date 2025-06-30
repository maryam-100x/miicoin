import React from "react";

export default function GenderSelectionModal({
  onSelect,
  onCancel,
}: {
  onSelect: (gender: "male" | "female") => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal">
      <h2>Select the Mii's gender</h2>
      <button onClick={() => onSelect("male")}>Male</button>
      <button onClick={() => onSelect("female")}>Female</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}