import { Color } from "types/tailwindcss";

interface IModalProps {
  callback(action: string): void;
  title: string;
  message: string;
  actions: {
    id: string;
    color: Color;
    content: string;
  }[];
}

export function Modal({ title, message, actions, callback }: IModalProps) {
  return (
    <>
      <input type="checkbox" className="modal-toggle" defaultChecked={true} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4 whitespace-pre-line keep-all">{message}</p>
          <div className="modal-action">
            {actions.map(({ id, color, content }) => (
              <label key={id} onClick={() => callback(id)} className={`btn btn-${color}`}>
                {content}
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
