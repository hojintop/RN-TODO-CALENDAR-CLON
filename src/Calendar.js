import { FlatList, Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { getColorByDay, getDayByText } from "./util";

export default ({
  columns,
  selectedDate,
  onPressLeftArrow,
  onPressRightArrow,
  showDatePicker,
  setSelectedDate,
  todoList,
}) => {
  const columnSize = 35;
  const now = dayjs();

  function Column({ text, color, opacity, disabled, onPress, isSelected, hasTodo }) {
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
        <Text style={{ color, opacity, fontWeight: hasTodo ? 'bold' : 'normal' }}>{text}</Text>
      </TouchableOpacity>
    );
  }

  function renderItem({ item: date }) {
    const dateText = dayjs(date).get("date");
    const day = dayjs(date).get("day");
    // 현재 월 여부 확인
    const isCurrentMonth = dayjs(date).isSame(selectedDate, "month");
    const color = getColorByDay(day);
    const onPress = () => setSelectedDate(date);
    const isSelected = dayjs(date).isSame(selectedDate, "date");
    const hasTodo = todoList.find(todo => dayjs(todo.date).isSame(dayjs(date), 'date'));
    return (
      <Column
        text={dateText}
        color={color}
        opacity={isCurrentMonth ? 1 : 0.4}
        onPress={onPress}
        isSelected={isSelected}
        hasTodo={hasTodo}
      />
    );
  }

  function ArrowButton({
    iconName,
    iconSize,
    iconColor,
    hori,
    verti,
    onPress,
  }) {
    return (
      <TouchableOpacity
        style={{ paddingHorizontal: hori, paddingVertical: verti }}
        onPress={onPress}
      >
        <SimpleLineIcons name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
    );
  }

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

  return (
    <FlatList
      data={columns}
      scrollEnabled={false}
      keyExtractor={(_, idx) => `column-${idx}`}
      numColumns={7}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};
