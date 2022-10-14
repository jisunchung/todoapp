import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { theme } from "./colors";

export default function Task(toDos, working, updateCompleted, saveTodos) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const editText = () => {
    setIsEditing(true);
  };
  const updateTodo = (key) => {
    const newTodos = { ...toDos };
    newTodos[key].text = text;
    saveTodos(newTodos);
  };
  useEffect(() => {
    console.log("task", toDos);
  }, []);
  return (
    <View>
      {Object.values(toDos).map((item) =>
        item.working === working ? (
          <View style={styles.todo} key={item.id}>
            <Checkbox
              value={item.completed}
              onValueChange={() => updateCompleted(key)}
              color={item.completed ? "#4630EB" : undefined}
            />
            <Text
              style={{
                ...styles.todoText,
                textDecorationLine: item.completed ? "line-through" : null,
                color: item.completed ? theme.grey : "white",
              }}
            >
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => updateTodo(key)}>
              <AntDesign name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(key)}>
              <Fontisto name="trash" size={18} color={theme.grey} />
            </TouchableOpacity>
          </View>
        ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
