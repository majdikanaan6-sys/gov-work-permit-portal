import "./Stepper.css";
import {
  FaFileAlt,
  FaUniversity,
  FaFileInvoice,
  FaCreditCard,
  FaHeartbeat,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  { label: "Submitted", icon: <FaFileAlt /> },
  { label: "Review", icon: <FaUniversity /> },
  { label: "IHC", icon: <FaFileInvoice /> },
  { label: "Payment", icon: <FaCreditCard /> },
  { label: "Medical", icon: <FaHeartbeat /> },
  { label: "Approved", icon: <FaCheckCircle /> },
];

const Stepper = ({ currentStep = 0 }) => {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div className="step-wrapper" key={index}>
            
            {/* Circle */}
            <div
              className={`step-circle 
                ${isCompleted ? "completed" : ""} 
                ${isActive ? "active" : ""}`}
            >
              {isCompleted ? "✓" : step.icon}
            </div>

            {/* Label */}
            <div className="step-label">{step.label}</div>

            {/* Line (separate & cleaner) */}
            {index !== steps.length - 1 && (
              <div
                className={`step-line ${
                  isCompleted ? "completed" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;