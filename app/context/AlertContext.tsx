import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Toast, ToastToggle } from "flowbite-react";

export type AlertType = "success" | "error" | "info" | "warning";

export type AlertState = {
  type: AlertType;
  message: string;
} | null;

interface AlertContextValue {
  alert: AlertState;
  showAlert: (type: AlertType, message: string) => void;
  clearAlert: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>(null);

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({ type, message });
  }, []);

  const clearAlert = useCallback(() => setAlert(null), []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        {alert && (
          <Toast>
            <div className="flex items-center space-x-2 mr-2">
              {alert.type === "success" ? (
                <i className="fa-solid fa-circle-check text-green-500"></i>
              ) : alert.type === "error" ? (
                <i className="fa-solid fa-circle-exclamation text-red-500"></i>
              ) : alert.type === "warning" ? (
                <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
              ) : (
                <i className="fa-solid fa-circle-info text-blue-500"></i>
              )}
            </div>
            <div className="text-sm font-normal">{alert.message}</div>
            <div className="ml-auto flex items-center space-x-2">
              <ToastToggle onDismiss={clearAlert} />
            </div>
          </Toast>
        )}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
}
