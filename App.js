import { useEffect, useRef } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getCalendarColumns, getColorByDay, getDayByText, ITEM_WIDTH } from "./src/util";
import { runPracticeDayjs } from "./src/practice-dayjs";
import Margin from "./src/Margin";
import { useCalendar } from "./src/hook/use-calendar";
import { useToDoList } from "./src/hook/use-todo-list";
import Calendar from "./src/Calendar";
import AddTodoInput from "./src/AddTodoInput";

export default function App() {
  const flatListRef = useRef(null);
  const now = dayjs();

  const {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtractMonth,
    addMonth,
  } = useCalendar(now);

  const { todoList, filteredTodoList, inputTodo, setInputTodo, toggleTodo, removeTodo, addTodo, resetInput } = useToDoList(selectedDate);

  const columns = getCalendarColumns(selectedDate);

  useEffect(() => {
    runPracticeDayjs();

    console.log("columns", columns);
  }, []);

  useEffect(() => {
    console.log(dayjs(selectedDate).format("YYYY.MM.DD."));
  }, [selectedDate]);

  const onPressLeftArrow = subtractMonth;
  const onPressRightArrow = addMonth;

  function ListHeaderComponent() {
    return (
      <View>
        <View style={{ width: 10, height: 10, borderRadius: 10 / 2 }} />
        <Calendar
          columns={columns}
          selectedDate={selectedDate}
          onPressLeftArrow={onPressLeftArrow}
          onPressRightArrow={onPressRightArrow}
          showDatePicker={showDatePicker}
          setSelectedDate={setSelectedDate}
          todoList = {todoList}
        />
        <Margin height={15} />
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 5 / 2,
            backgroundColor: "#a3a3a3",
            alignSelf: "center",
          }}
        />
        <Margin height={15} />
      </View>
    );
  }

  function renderTodoItem({ item: todo }) {
    const isSuccess = todo.isSuccess;
    const onPress = () => toggleTodo(todo.id);
    const onLongPress = () => {
      Alert.alert('삭제하시겠어요?',"",[
        {
          style: 'cancel',
          text: '아니요'
        },
        {
          text: '예',
          onPress: () => removeTodo(todo.id)
        },
      ]);
    }
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
          flexDirection: "row",
          width: ITEM_WIDTH,
          alignSelf: "center",
          borderBottomWidth: 0.2,
          paddingVertical: 10,
          paddingHorizontal: 5,
        }}
      >
        <Text style={{ flex: 1, fontSize: 18, color: "#595959" }}>
          {todo.content}
        </Text>
        <Ionicons
          name="checkmark-outline"
          size={20}
          color={isSuccess ? "#595959" : "#bfbfbf"}
        />
      </Pressable>
    );
  }

  function onPressAdd(){
    addTodo();
    resetInput();
    scrollToEnd();
  }

  function scrollToEnd(){
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();  
    }, 300);
  }
  return (
    <SafeAreaProvider>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          <Image
            source={{
              // 출처: https://kr.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1189772.htm
              uri: "https://img.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1373-159.jpg?w=1060&t=st=1667524235~exp=1667524835~hmac=8a3d988d6c33a32017e280768e1aa4037b1ec8078c98fe21f0ea2ef361aebf2c",
            }}
            style={{
              width: "100%",
              height: "110%",
              position: "absolute",
            }}
          />

          <FlatList
            ref={flatListRef}
            data={filteredTodoList}
            renderItem={renderTodoItem}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={false}
          />

          
          <AddTodoInput
            value={inputTodo}
            onChangeText={setInputTodo}
            selectedDate={selectedDate}
            onPressAdd={onPressAdd}
            onFocus={scrollToEnd}
          />

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </SafeAreaView>
      </Pressable>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
