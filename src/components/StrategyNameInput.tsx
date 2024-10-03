//components/ui/StrategyNameInput.jsx
import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface StrategyNameInputProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const StrategyNameInput: React.FC<StrategyNameInputProps> = ({ name, description, onNameChange, onDescriptionChange }) => {
  return (
    <div>
      <Input
        type="text"
        placeholder={name || "Strategy Name"}
        value={name || ""}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Textarea
        placeholder={description || "Strategy Description"}
        value={description || ""}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
    </div>
  )
}

export default StrategyNameInput