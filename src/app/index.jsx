import { useState } from "react";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TodoItem } from "../../components/TodoItem";
import { useTheme } from "../context/ThemeContext";
import { useTodoContext } from "../context/TodoContext";

export default function Index() {
  const [text, setText] = useState("");
  const { todos, addTodo, toggleTodo, removeTodo, loadError, saveError, retryLoad, retrySave } = useTodoContext();
  const { scheme, theme, toggleTheme } = useTheme();
  const canAdd = todos !== null && text.trim().length > 0;

  function handleAdd() {
    if (canAdd && addTodo(text)) setText("");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.text }]}>Mis tareas</Text>
          <Pressable
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={scheme === "dark" ? "Activar tema claro" : "Activar tema oscuro"}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons name={scheme === "dark" ? "weather-sunny" : "weather-night"} size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
            accessibilityLabel="Nueva tarea"
            placeholder="Nueva tarea"
            placeholderTextColor={theme.muted}
            editable={todos !== null}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <Pressable
            accessibilityRole="button"
            disabled={!canAdd}
            onPress={handleAdd}
            style={[styles.addButton, { backgroundColor: theme.primary, opacity: canAdd ? 1 : 0.65 }]}
          >
            <Text style={{ color: theme.buttonText }}>Agregar</Text>
          </Pressable>
        </View>

        {loadError && (
          <Text accessibilityRole="button" onPress={retryLoad} style={{ color: theme.danger }}>
            No se pudieron cargar las tareas. Reintentar.
          </Text>
        )}
        {saveError && (
          <Text accessibilityRole="button" onPress={retrySave} style={{ color: theme.danger }}>
            No se pudieron guardar los cambios. Reintentar.
          </Text>
        )}

        {todos === null ? (
          !loadError && <ActivityIndicator color={theme.primary} accessibilityLabel="Cargando tareas" />
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(todo) => String(todo.id)}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={{ color: theme.muted }}>No hay tareas.</Text>}
            renderItem={({ item }) => (
              <TodoItem
                item={item}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onDetails={(id) => router.push({ pathname: "/details/[id]", params: { id: String(id) } })}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignSelf: "center", width: "100%", maxWidth: 680, padding: 16, gap: 16 },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 28, fontWeight: "700" },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  inputRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  addButton: { minHeight: 44, borderRadius: 8, paddingHorizontal: 14, justifyContent: "center" },
});
