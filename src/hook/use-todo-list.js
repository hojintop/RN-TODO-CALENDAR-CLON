import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const TODO_STORAGE_KEY = 'TODO_STORAGE_KEY';

const defaultTodoList = [
  // {
  //   id: 1,
  //   content: "운동하기",
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 2,
  //   content: "커피챗 신청 하기",
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 3,
  //   content: "공부 하기",
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 4,
  //   content: "공부4 하기",
  //   date: "2024-12-30",
  //   isSuccess: false,
  // },
];
export function useToDoList(selectedDate) {
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [inputTodo, setInputTodo] = useState("");

  const todoLength = todoList.length;
  const lastId = todoLength === 0 ? 0 : todoList[todoLength - 1].id;


  function reStorTodoList(newTodoList){
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(newTodoList));
  }

  // 추가
  function addTodo() {
    if (!inputTodo) {
      Alert.alert("추가할 내용을 입력해 주세요.", "", [
        {
          text: "확인",
        },
      ]);
    } else {
      const newTodoList = [
        ...todoList,
        {
          id: lastId + 1,
          content: inputTodo,
          date: selectedDate,
          isSuccess: false,
        },
      ];
      reStorTodoList(newTodoList);
    }
  }

  //삭제
  function removeTodo(id) {
    const newTodoList = todoList.filter((todo) => todo.id !== id);
    reStorTodoList(newTodoList);
  }

  function toggleTodo(id) {
    const newTodoList = todoList.map((todo) => {
      if (todo.id !== id) {
        return todo;
      } else {
        return {
          ...todo,
          isSuccess: !todo.isSuccess,
        };
      }
    });
    reStorTodoList(newTodoList);
  }

  function resetInput() {
    setInputTodo("");
  }

  const filteredTodoList = todoList.filter((todo) => {
    const isSameDate = dayjs(todo.date).isSame(selectedDate, "date");
    return isSameDate;
  });

  useEffect(() => {
    initData();
  },[]);

  async function initData(){
    const result = await AsyncStorage.getItem(TODO_STORAGE_KEY);
    if(result){
      /// 딜레이생김 // 인디케이터 처리 필요
      setTodoList(JSON.parse(result));
    }
  }

  return {
    todoList,
    filteredTodoList,
    inputTodo,
    setInputTodo,
    toggleTodo,
    removeTodo,
    addTodo,
    resetInput,
  };
}
