import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { data } from "../data/todos";

const STORAGE_KEY = "TodoApp";

export function useTodos() {
  const [todos, setTodos] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const pendingSave = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const saved = json === null ? data : JSON.parse(json);
        if (!Array.isArray(saved) || !saved.every((todo) =>
          todo && Number.isSafeInteger(todo.id) &&
          typeof todo.title === "string" && typeof todo.completed === "boolean"
        )) {
          throw new Error("Invalid task list");
        }
        if (active) setTodos([...saved].sort((a, b) => b.id - a.id));
      } catch {
        if (active) setLoadError(true);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    if (todos === null) return;

    // Keep writes in order when several tasks change quickly.
    pendingSave.current = pendingSave.current.then(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    });
  }, [todos, saveAttempt]);

  function addTodo(text) {
    const title = text.trim();
    if (!title) return false;
    setTodos((previous) => [
      { id: (previous[0]?.id ?? 0) + 1, title, completed: false },
      ...previous,
    ]);
    return true;
  }

  function editTodo(id, text) {
    const title = text.trim();
    if (!title) return false;
    setTodos((previous) => previous.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    ));
    return true;
  }

  function toggleTodo(id) {
    setTodos((previous) => previous.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  function removeTodo(id) {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
  }

  function retryLoad() {
    setLoadError(false);
    setLoadAttempt((attempt) => attempt + 1);
  }

  return {
    todos, addTodo, editTodo, toggleTodo, removeTodo,
    loadError, saveError, retryLoad,
    retrySave: () => setSaveAttempt((attempt) => attempt + 1),
  };
}
