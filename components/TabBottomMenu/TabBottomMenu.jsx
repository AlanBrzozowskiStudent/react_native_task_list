import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

export function TabBottomMenu({ onPress, todoList, selectedTabName }) {
    function getTextStyle(tabName) {
        return { fontWeight: "bold", color: tabName === selectedTabName ? "#2F76E5" : "black" }
    }

    const onPressTab = (selectedTabName) => () => {
        onPress(selectedTabName);
    }

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: 'space-evenly',
            paddingVertical: 20,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10
        }}>
            <TouchableOpacity onPress={onPressTab("all")}><Text style={getTextStyle("all")}>All ({todoList.length})</Text></TouchableOpacity>
            <TouchableOpacity onPress={onPressTab("inProgress")}><Text style={getTextStyle("inProgress")}>In Progress ({todoList.filter(({ isCompleted }) => !isCompleted).length})</Text></TouchableOpacity>
            <TouchableOpacity onPress={onPressTab("done")}><Text style={getTextStyle("done")}>Done ({todoList.filter(({ isCompleted }) => isCompleted).length})</Text></TouchableOpacity>
            <TouchableOpacity onPress={onPressTab("pomodoro")}><Text style={getTextStyle("pomodoro")}>Pomodoro Timer</Text></TouchableOpacity>
        </View>
    );
}