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

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadTodos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (playload) => setText(playload);
  const saveTodos = async (toSave) => {
    //object를 string으로 바꿔줌
    //setItem은 promise를 return 해줌 따라서 await사용 가능
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    //string to object
    setToDos(JSON.parse(s));
    // console.log("storage: ", s);
  };
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // const newTodos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newTodos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newTodos);
    await saveTodos(newTodos);
    // save todo
    setText("");
  };
  const deleteTodo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      {
        text: "calcel",
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
    //  //이 object는 아직 state에 있지 않기 때문에 mutate해도된다
    // //하지만 state는 절대 mutate하면 안됨!!!
    // const newTodos = { ...toDos };
    // //삭제
    // delete newTodos[key];
    // //update state
    // setToDos(newTodos);
    // //save in asyncStorage
    // await saveTodos(newTodos);
  };

  // console.log(toDos);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
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
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
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
