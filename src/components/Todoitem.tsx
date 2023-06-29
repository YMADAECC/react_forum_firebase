import { useState, useEffect, useRef } from 'react';
import { db } from '../utilities/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

type TodoItemType = {
  todo: { id: string; text: string; timestamp: Timestamp };
};

const TodoItem: React.FC<TodoItemType> = ({ todo }) => {
  const { id, text, timestamp } = todo;

  const [update, setUpdate] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const updateInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 選択したアイテムにフォーカスを当てる
    const refInput = updateInput.current;
    if (isEdit && refInput) {
      refInput.focus();
    }
  }, [isEdit]);

  const onSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateItem(id);
  };

  const updateItem = async (id: string) => {
    if (!update) return;
    await updateDoc(doc(db, 'todos', id), {
      text: update,
    });
    setIsEdit(false);
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  return (
    <li className="todo-item">
      {isEdit ? (
        <div>
          <form onSubmit={onSubmitUpdate}>
            <input
              type="text"
              className="update-input"
              placeholder={text}
              ref={updateInput}
              value={update}
              onChange={(e) => setUpdate(e.target.value)}
            />
            <button className="updateBtn" type="submit">
              更新
            </button>
          </form>
        </div>
      ) : (
        <div onDoubleClick={() => setIsEdit(true)}>
          <span>{text}</span>
          <span className="date-text">
            {new Date(timestamp?.toDate()).toLocaleString()}
          </span>
        </div>
      )}

      <button className="deleteBtn" onClick={() => deleteItem(id)}>
        削除
      </button>
    </li>
  );
};

export default TodoItem;