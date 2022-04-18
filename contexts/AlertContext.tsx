import { createContext, FC, useState } from "react";
import { Alert } from "components/Alert";
import { AnimatePresence } from "framer-motion";

interface IAlert {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
}

interface IAlertsWithId extends IAlert {
  id: string;
}

interface IAlertContext {
  alerts: IAlertsWithId[];
  close(id: string): void;
  alert(alert: IAlert): void;
}

const doNothing = () => null;

export const AlertContext = createContext<IAlertContext>({
  alerts: [],
  close: doNothing,
  alert: doNothing,
});

const AlertContextProvider: FC = ({ children }) => {
  const [alerts, setAlerts] = useState<IAlertsWithId[]>([]);

  const alert = (alert: IAlert) =>
    setAlerts((prev) => [
      ...prev,
      { id: `${String(Date.now()) + alert.title + String(Math.random() * 100)}`, ...alert },
    ]);
  const close = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <AlertContext.Provider
      value={{
        alerts,
        close,
        alert,
      }}
    >
      <aside className={"fixed z-50 top-8 inset-x-4 container mx-auto flex flex-col gap-4"}>
        <AnimatePresence>
          {alerts.map(({ id, type, title, message }) => (
            <Alert key={id} type={type} title={title} message={message} close={() => close(id)} />
          ))}
        </AnimatePresence>
      </aside>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
