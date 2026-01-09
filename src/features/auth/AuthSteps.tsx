"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { setStep, AuthStep } from "@/store/services/authSlice";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { VerificationForm } from "./VerificationForm";
import { AnimatePresence, motion } from "framer-motion";

interface AuthStepsProps {
  initialStep?: AuthStep;
  onSuccess?: () => void;
}

export const AuthSteps: React.FC<AuthStepsProps> = ({ initialStep, onSuccess }) => {
  const dispatch = useDispatch();
  const { step } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (initialStep) {
      dispatch(setStep(initialStep));
    }
  }, [initialStep, dispatch]);

  const renderStep = () => {
    switch (step) {
      case "LOGIN":
        return <LoginForm onSuccess={onSuccess} />;
      case "REGISTER":
        return <RegisterForm />;
      case "VERIFICATION":
        return <VerificationForm onSuccess={onSuccess} />;
      default:
        return <LoginForm onSuccess={onSuccess} />;
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
