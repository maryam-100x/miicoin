import React, { useState } from "react";
import GenderSelectionModal from "./GenderSelectionModal";
import MiiEditor from "./MiiEditor";

export default function ManualMiiCreator() {
  const [stage, setStage] = useState<"menu" | "gender" | "editor">("menu");
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  // Handler for "Create Mii from scratch"
  const handleCreate = () => setStage("gender");

  // Handler when gender is selected
  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
    setStage("editor");
  };

  // Handler for going back to menu
  const handleBack = () => {
    setStage("menu");
    setGender(null);
  };

  return (
    <div>
      {stage === "menu" && (
        <button onClick={handleCreate}>Create Mii from scratch</button>
      )}

      {stage === "gender" && (
        <GenderSelectionModal
          onSelect={handleGenderSelect}
          onCancel={handleBack}
        />
      )}

      {stage === "editor" && gender && (
        <MiiEditor gender={gender} onBack={handleBack} />
      )}
    </div>
  );
}