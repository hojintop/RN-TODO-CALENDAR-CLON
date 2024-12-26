import dayjs from "dayjs";
import { useState } from "react";

export function useCalendar(now){
    const [selectedDate, setSelectedDate] = useState(now);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    function showDatePicker(){
    setDatePickerVisibility(true);
    };

    function hideDatePicker(){
    setDatePickerVisibility(false);
    };

    function handleConfirm(date){
    // console.warn("A date has been picked: ", date);
    setSelectedDate(dayjs(date));
    hideDatePicker();
    };

    function subtractMonth() {
    setSelectedDate(dayjs(selectedDate).subtract("1", "month"));
    }

    function addMonth() {
    setSelectedDate(dayjs(selectedDate).add("1", "month"));
    }

    return{
        selectedDate,
        setSelectedDate,
        isDatePickerVisible,
        showDatePicker,
        hideDatePicker,
        handleConfirm,
        subtractMonth,
        addMonth,
    };

}