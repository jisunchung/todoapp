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

export default function TodoComp(id) {
  //   useEffect(() => {
  //     console.log("task", toDos);
  //   }, []);
  return (
    <View>
      <Text>{id}</Text>
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
