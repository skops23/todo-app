import { createContext, useContext } from "react";
import { useTodos } from "../../hooks/useTodos";

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const store = useTodos();
  return <TodoContext.Provider value={store}>{children}</TodoContext.Provider>;
}

export function useTodoContext() {
  return useContext(TodoContext);
}
