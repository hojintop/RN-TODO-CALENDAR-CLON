import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { runPracticeDayjs } from "./src/practice-dayjs";
import dayjs from "dayjs";
import { getCalendarColumns, getColorByDay, getDayByText } from "./src/util";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Margin from "./src/Margin";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useCalendar } from "./src/hook/use-calendar";

const columnSize = 35;

function Column({ text, color, opacity, disabled, onPress, isSelected }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        width: columnSize,
        height: columnSize,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isSelected ? "#c2c2c2" : "transparent",
        borderRadius: columnSize / 2,
      }}
      onPress={onPress}
    >
      <Text style={{ color, opacity }}>{text}</Text>
    </TouchableOpacity>
  );
}

function ArrowButton({ iconName, iconSize, iconColor, hori, verti, onPress }) {
  return (
    <TouchableOpacity
      style={{ paddingHorizontal: hori, paddingVertical: verti }}
      onPress={onPress}
    >
      <SimpleLineIcons name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

export default function App() {
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
    const currentDateText = dayjs(selectedDate).format("YYYY.MM.DD.");
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowButton
            iconName="arrow-left"
            iconSize={15}
            iconColor="#404040"
            hori={20}
            verti={15}
            onPress={onPressLeftArrow}
          />

          <Text
            style={{ fontSize: 20, color: "#404040" }}
            onPress={showDatePicker}
          >
            {currentDateText}
          </Text>

          <ArrowButton
            iconName="arrow-right"
            iconSize={15}
            iconColor="#404040"
            hori={20}
            verti={15}
            onPress={onPressRightArrow}
          />
        </View>

        {/* 일~토 요일 랜더 */}
        <View style={{ flexDirection: "row" }}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const datText = getDayByText(day);
            const color = getColorByDay(day);
            return (
              <Column
                disabled={true}
                key={`day-${day}`}
                text={datText}
                color={color}
                opacity={1}
              />
            );
          })}
        </View>
      </View>
    );
  }

  function renderItem({ item: date }) {
    const dateText = dayjs(date).get("date");
    const day = dayjs(date).get("day");
    // 현재 월 여부 확인
    const isCurrentMonth = dayjs(date).isSame(now, "month");
    const color = getColorByDay(day);
    const onPress = () => {
      setSelectedDate(date);
    };
    const isSelected = dayjs(date).isSame(selectedDate, "date");
    return (
      <Column
        text={dateText}
        color={color}
        opacity={isCurrentMonth ? 1 : 0.4}
        onPress={onPress}
        isSelected={isSelected}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <FlatList
          data={columns}
          keyExtractor={(_, idx) => `column-${idx}`}
          numColumns={7}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </SafeAreaView>
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
