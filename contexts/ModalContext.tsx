import { createContext, FC, Reducer, useReducer } from "react";
import { Color } from "types/tailwindcss";
import produce from "immer";
import { Modal } from "components/Modal";

export interface IModal {
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

export default ModalContextProvider;
