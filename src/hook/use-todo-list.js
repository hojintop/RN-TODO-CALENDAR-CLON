import dayjs from "dayjs";
import { useState } from "react";

const defaultTodoList = [
  {
    id: 1,
    content: "운동하기",
    date: dayjs(),
    isSuccess: true,
  },
  {
    id: 2,
    content: "커피챗 신청 하기",
    date: dayjs(),
    isSuccess: false,
  },
  {
    id: 3,
    content: "공부 하기",
    date: dayjs(),
    isSuccess: false,
  },
];
export function useToDoList(selectedDate) {
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [inputTodo, setInputTodo] = useState("");

  const todoLength = todoList.length;
  const lastId = todoLength === 0 ? 0 : todoList[todoLength - 1].id;
  // 추가
  function addTodo() {
    const newTodoList = [
      ...todoList,
      {
        id: lastId + 1,
        content: inputTodo,
        date: selectedDate,
        isSuccess: false,
      },
    ];
    setTodoList(newTodoList);
  }

  //삭제
  function removeTodo(id) {
    const newTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(newTodoList);
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
    setTodoList(newTodoList);
  }

  return {todoList, inputTodo, setInputTodo, toggleTodo, removeTodo, addTodo};
}
