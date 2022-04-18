import { createContext, FC, Reducer, useReducer } from "react";
import { Color } from "types/tailwindcss";
import produce from "immer";

interface IModal {
  id: string;
  callback(action: string): void;
  title: string;
  message: string;
  actions: IActions[];
}

type IModalInput = Omit<IModal, "id" | "callback">;

interface IActions {
  color: Color;
  action: string;
  content: string;
}

interface IModalContext {
  modals: IModal[];
  modal(input: IModalInput): Promise<string>;
}

export const ModalContext = createContext<IModalContext>({
  modals: [],
  modal: async () => "",
});

type Action =
  | {
      type: "createModal";
      input: IModal;
    }
  | {
      type: "resolveModal";
      id: string;
    };

const reducer: Reducer<IModal[], Action> = (draft, action) => {
  switch (action.type) {
    case "createModal":
      draft.push(action.input);
      break;
    case "resolveModal":
      const index = draft.findIndex((modal) => modal.id === action.id);
      if (index !== -1) draft.splice(index, 1);
      break;
  }

  return draft;
};

const curriedReducer = produce(reducer);

const ModalContextProvider: FC = ({ children }) => {
  const [modals, dispatch] = useReducer(curriedReducer, []);

  const modal = (input: IModalInput) =>
    new Promise<string>((resolve) => {
      const id = String(Math.random() * 10 ** 10);
      const callback = (action: string) => {
        resolve(action);
        dispatch({
          type: "resolveModal",
          id,
        });
      };

      // create modal
      dispatch({
        type: "createModal",
        input: {
          ...input,
          id,
          callback,
        },
      });
    });

  return (
    <ModalContext.Provider
      value={{
        modals,
        modal,
      }}
    >
      {children}
      <div id={"modal-container"}>
        {modals.map((modal) => (
          <Modal key={modal.id} {...modal} />
        ))}
      </div>
    </ModalContext.Provider>
  );
};

function Modal({ title, message, actions, callback }: IModal) {
  return (
    <>
      <input type="checkbox" className="modal-toggle" defaultChecked={true} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4 whitespace-pre-line keep-all">{message}</p>
          <div className="modal-action">
            {actions.map(({ action, color, content }) => (
              <label key={action} onClick={() => callback(action)} className={`btn btn-${color}`}>
                {content}
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalContextProvider;
