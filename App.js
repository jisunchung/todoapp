import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";
import Task from "./Task";
import TodoComp from "./TodoComp";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [completed] = useState(false);
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadTodos();
    loadWorking();
    Object.keys(toDos).map((id) => console.log("id!!!!!!!!!!!", id));
  }, []);

  const travel = async () => {
    setWorking(false);
    await saveWorking(false);
    // console.log(working);
  };
  const work = async () => {
    setWorking(true);
    await saveWorking(true);
    // console.log(working);
  };
  const onChangeText = (playload) => setText(playload);
  const saveTodos = async (toSave) => {
    //object를 string으로 바꿔줌r
    //setItem은 promise를 return 해줌 따라서 await사용 가능
    setToDos(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    //string to object
    setToDos(JSON.parse(s));
    console.log("storage: ", s);
  };
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // const newTodos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newTodos = { ...toDos, [Date.now()]: { text, working, completed } };
    setToDos(newTodos);
    await saveTodos(newTodos);
    // save todo
    setText("");
  };
  const deleteTodo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      {
        text: "cancel",
      },
      {
        text: "Im sure",
        onPress: () => {
          const newTodos = { ...toDos };
          delete newTodos[key];
          setToDos(newTodos);
          saveTodos(newTodos);
        },
      },
    ]);
    return;
  };
  const saveWorking = async (work) => {
    await AsyncStorage.setItem("work", work.toString());
  };
  const loadWorking = async () => {
    const s = await AsyncStorage.getItem("work");
    var isFalseBoolean = s === "true";
    setWorking(isFalseBoolean);
  };
  const updateCompleted = async (key) => {
    // console.log(key, toDos[key].completed);
    const newTodos = { ...toDos };
    newTodos[key].completed = !toDos[key].completed;
    setToDos(newTodos);
    saveTodos(newTodos);
    console.log("update!", toDos);
  };
  const updateText = () => {
    Alert.alert("edit");
  };

  // console.log(toDos);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you go?"}
          style={styles.input}
        />
      </View>
      <ScrollView>
        {/* <Task toDos={toDos} working={working}></Task> */}
        {Object.keys(toDos).map((id) =>
          toDos[id].working === working ? (
            <View style={styles.todo} key={id}>
              {/* <TodoComp ></TodoComp> */}
              <Checkbox
                value={toDos[id].completed}
                onValueChange={() => updateCompleted(id)}
                color={toDos[id].completed ? "#4630EB" : undefined}
              />
              <Text
                style={{
                  ...styles.todoText,
                  textDecorationLine: toDos[id].completed
                    ? "line-through"
                    : null,
                  color: toDos[id].completed ? theme.grey : "white",
                }}
              >
                {toDos[id].text}
              </Text>
              {/* <TouchableOpacity onPress={() => updateText()}>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => deleteTodo(id)}>
                <Fontisto name="trash" size={18} color={theme.grey} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 28,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
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
