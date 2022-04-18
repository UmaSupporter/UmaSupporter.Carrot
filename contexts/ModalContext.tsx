import { createContext, FC, Reducer, useReducer } from "react";
import produce from "immer";

interface IModalActions {
  callback: () => void;
  content: string;
  color:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "ghost"
    | "link"
    | "outline"
    | "active"
    | "disabled";
}

interface IModal {
  id: string;
  title: string;
  message: string;
  actions: IModalActions[];
}

interface IModalContext {
  modals: IModal[];
  push(data: IModal): void;
  close(id: string): void;
}

const doNothing = async () => "";

type Actions =
  | {
      type: "push";
      data: IModal;
    }
  | {
      type: "close";
      id: string;
    };

const reducer: Reducer<IModal[], Actions> = (draft, action) => {
  switch (action.type) {
    case "push":
      draft.push(action.data);
      break;
    case "close":
      const index = draft.findIndex((modal) => modal.id === action.id);
      if (index !== -1) draft.splice(index, 1);
      break;
  }

  return draft;
};

export const ModalContext = createContext<IModalContext>({
  modals: [],
  push: doNothing,
  close: doNothing,
});

const curriedReducer = produce(reducer);

const ModalContextProvider: FC = ({ children }) => {
  const [modals, dispatch] = useReducer(curriedReducer, []);

  const push = (modal: IModal) =>
    dispatch({
      type: "push",
      data: modal,
    });

  const close = (id: string) =>
    dispatch({
      type: "close",
      id,
    });

  const closeWithAction = (id: string, callback: Function) => {
    close(id);
    callback?.();
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        push,
        close,
      }}
    >
      {children}
      {modals.map((modal) => (
        <div key={modal.id}>
          <input type="checkbox" className="modal-toggle" defaultChecked={true} />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg">{modal.title}</h3>
              <p className="py-4">{modal.message}</p>
              <div className="modal-action">
                {modal.actions.map(({ color, content, callback }, i) => (
                  <label key={i} onClick={() => closeWithAction(modal.id, callback)} className={`btn btn-${color}`}>
                    {content}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
