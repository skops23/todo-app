import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useTodoContext } from "../../context/TodoContext";

function returnToList() {
  if (router.canGoBack()) router.back();
  else router.replace("/");
}

function TodoEditor({ todo, theme, onEdit }) {
  const [title, setTitle] = useState(todo.title);
  const canSave = title.trim().length > 0;

  function handleSave() {
    if (canSave && onEdit(todo.id, title)) returnToList();
  }

  return (
    <>
      <Text style={{ color: theme.muted }}>{todo.completed ? "Completada" : "Pendiente"}</Text>
      <TextInput
        accessibilityLabel="Título de la tarea"
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSave}
        returnKeyType="done"
      />
      <Pressable
        accessibilityRole="button"
        disabled={!canSave}
        onPress={handleSave}
        style={[styles.button, { backgroundColor: theme.primary, opacity: canSave ? 1 : 0.65 }]}
      >
        <Text style={{ color: theme.buttonText }}>Guardar</Text>
      </Pressable>
    </>
  );
}

export default function Details() {
  const { id } = useLocalSearchParams();
  const { todos, editTodo, loadError, retryLoad } = useTodoContext();
  const { theme } = useTheme();
  const task = todos?.find((item) => String(item.id) === id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable accessibilityRole="button" onPress={returnToList} style={styles.button}>
        <Text style={{ color: theme.text }}>Volver a mis tareas</Text>
      </Pressable>
      <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>Editar tarea</Text>
      {task && <TodoEditor key={task.id} todo={task} theme={theme} onEdit={editTodo} />}
      {todos !== null && !task && <Text style={{ color: theme.muted }}>No se encontró la tarea.</Text>}
      {todos === null && !loadError && <ActivityIndicator color={theme.primary} accessibilityLabel="Cargando tarea" />}
      {loadError && (
        <Text accessibilityRole="button" onPress={retryLoad} style={{ color: theme.danger }}>
          No se pudieron cargar las tareas. Reintentar.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", maxWidth: 680, alignSelf: "center", padding: 16, gap: 16 },
  heading: { fontSize: 28, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  button: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", borderRadius: 8, paddingHorizontal: 14 },
});
