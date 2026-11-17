import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../src/context/ThemeContext";

export function TodoItem({ item, onToggle, onRemove, onDetails }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.itemRow, { borderBottomColor: theme.border }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={item.title}
        aria-checked={item.completed}
        onPress={() => onToggle(item.id)}
        style={styles.task}
      >
        <MaterialCommunityIcons name={item.completed ? "check-circle-outline" : "circle-outline"} size={22} color={theme.muted} />
        <Text style={[
          styles.title,
          { color: item.completed ? theme.muted : theme.text },
          item.completed && styles.completed,
        ]}>
          {item.title}
        </Text>
      </Pressable>
      <Pressable
        style={styles.action}
        accessibilityRole="button"
        accessibilityLabel={`Editar ${item.title}`}
        onPress={() => onDetails(item.id)}
      >
        <MaterialCommunityIcons name="pencil-outline" size={22} color={theme.text} />
      </Pressable>
      <Pressable
        style={styles.action}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar ${item.title}`}
        onPress={() => onRemove(item.id)}
      >
        <MaterialCommunityIcons name="delete-outline" size={22} color={theme.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, paddingVertical: 4 },
  task: { flex: 1, flexDirection: "row", alignItems: "center", minHeight: 44, gap: 10 },
  title: { flex: 1, fontSize: 16 },
  completed: { textDecorationLine: "line-through" },
  action: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
