"use client";

import { createContext, useContext, useState } from 'react';
import AlertModal from '@/components/AlertModal';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error" or "success"

  const showAlert = (message, type = "error") => {
    setAlertType(type);
    setAlertMessage(message);
  };

  const showError = (message) => {
    showAlert(message, "error");
  };

  const showSuccess = (message) => {
    showAlert(message, "success");
  };

  const hideAlert = () => {
    setAlertMessage("");
  };

  return (
    <AlertContext.Provider value={{ showAlert, showError, showSuccess, hideAlert }}>
      {children}
      <AlertModal
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
        autoClose={true}
        duration={alertType === "success" ? 3000 : 5000}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
