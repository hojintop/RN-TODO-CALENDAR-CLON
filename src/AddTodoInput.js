import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ITEM_WIDTH } from "./util";
import dayjs from "dayjs";

export default ({ value, onChangeText, selectedDate, onPressAdd, onFocus }) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={-insets.bottom+10}>
        <View
        style={{
            width: ITEM_WIDTH,
            marginBottom: insets.bottom,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center"
        }}
        >
        <TextInput 
            value={value}
            onChangeText={onChangeText}
            placeholder={`${dayjs(selectedDate).format("MM.DD")}에 추가할 투두`}
            style={{
            flex: 1,
            fontSize: 17,
            padding:10,
            color: '#595959'
            }}
            onSubmitEditing={onPressAdd}
            blurOnSubmit={false}
            onFocus={onFocus}
        />
        <TouchableOpacity onPress={onPressAdd} style={{ padding: 5 }}>
            <Ionicons name="add" size={30} color="#595959" />
        </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};
