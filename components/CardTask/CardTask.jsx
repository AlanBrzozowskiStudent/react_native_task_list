import React from 'react';
import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const priorityColors = {
  1: '#B0BEC5', // Light gray
  2: '#66BB6A', // Green
  3: '#FFEB3B', // Yellow
  4: '#F44336', // Red
};

export function CardTask({ todo, onPress, onLongPress, index }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: todo.isCompleted ? "#E0E0E0" : "#F5F5F5",
          marginTop: index === 0 ? 50 : 5,
        }
      ]}
      onPress={() => onPress(todo)}
      onLongPress={() => onLongPress(todo)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {typeof todo.priority === 'number' && todo.priority < 5 ? (
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: priorityColors[todo.priority] }
            ]}
          />
        ) : (
          <View style={styles.priorityDotRed}>
            <Text style={styles.priorityDotText}>!</Text>
          </View>
        )}
        <View>
          {!!todo.title && (
            <Text style={[styles.title, todo.isCompleted && styles.completedTitle]}>
              {todo.title}
            </Text>
          )}
          {!!todo.description && (
            <Text style={styles.description}>
              {todo.description}
            </Text>
          )}
        </View>
      </View>
      {todo.isCompleted && (
        <Image
          source={require("../../assets/check.png")}
          style={styles.checkIcon}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    paddingHorizontal: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.2,
    elevation: 3,
    height: 90,
    borderRadius: 10,
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  priorityDotRed: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: priorityColors[4],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  priorityDotText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#9E9E9E",
  },
  description: {
    fontSize: 14,
    color: "#757575",
  },
  checkIcon: {
    height: 25,
    width: 25,
  }
});