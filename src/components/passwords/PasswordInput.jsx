import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function PasswordInput({ onSubmit }) {
  const [pin, setPin] = useState(Array(8).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to next input
    if (value && index < 7) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = () => {
    const finalPin = pin.join("");
    if (finalPin.length === 8) {
      onSubmit(finalPin);
    } else {
      alert("PIN must be 8 digits long.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        {pin.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="password"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-10 h-10 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            autoFocus={index === 0}
          />
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        onClick={handleSubmit}
      >
        Submit
      </motion.button>
    </div>
  );
}
