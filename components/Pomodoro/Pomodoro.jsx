import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Pressable } from 'react-native';

const WORK_TIME = 30;  // Initial work timer duration in seconds
const BREAK_TIME = 10; // Initial break timer duration in seconds

// Pomodoro Timer Component
export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME); // Timer state
  const [isRunning, setIsRunning] = useState(false); // Flag to check if timer is running
  const [isWorkMode, setIsWorkMode] = useState(true); // Flag to check if it's work mode or break mode
  const [intervalId, setIntervalId] = useState(null); // To store interval id for clearing it later

  // Effect to handle timer countdown
  useEffect(() => {
    let id;

    if (isRunning) {
      id = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(id);
            setIsRunning(false); // Stop the timer
            handleTimerEnd(); // Handle timer end logic
            return 0;
          }
          return prevTime - 1; // Decrease time by 1 second
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId); // Clear previous interval when timer is stopped
    }

    return () => {
      clearInterval(id); // Cleanup interval on component unmount
    };
  }, [isRunning]);

  // Function to handle timer end
  const handleTimerEnd = () => {
    Alert.alert(
      "Time's up!",
      isWorkMode ? "Would you like to start your break timer?" : "Would you like to start another work session?",
      [
        {
          text: "Yes", onPress: () => {
            if (isWorkMode) {
              startBreakTimer();
            } else {
              startWorkTimer();
            }
          }
        },
        { text: "No", onPress: resetTimer }
      ],
      { cancelable: false }
    );
  };

  // Function to start a work timer session
  const startWorkTimer = () => {
    resetTimerState(WORK_TIME, true);
  };

  // Function to start a break timer session
  const startBreakTimer = () => {
    resetTimerState(BREAK_TIME, false);
  };

  // Function to reset the timer state
  const resetTimerState = (time, isWork) => {
    setTimeLeft(time);
    setIsWorkMode(isWork);
    setIsRunning(true);
  };

  // Function to reset the timer to the default work time
  const resetTimer = () => {
    setTimeLeft(WORK_TIME);
    setIsWorkMode(true);
    setIsRunning(false);
    clearInterval(intervalId);
  };

  // Function to format time in minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modeText}>
        {isWorkMode ? "Work" : "Break"} {/* Display mode: Work or Break */}
      </Text>
      <Text style={styles.timerText}>
        {formatTime(timeLeft)} {/* Display formatted timer */}
      </Text>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <Pressable style={[styles.button, styles.startButton]} onPress={() => setIsRunning(true)}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.button, styles.pauseButton]} onPress={() => setIsRunning(false)}>
            <Text style={styles.buttonText}>Pause</Text>
          </Pressable>
        )}
        <Pressable style={[styles.button, styles.resetButton]} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
      <Text style={styles.descriptionText}>
        Use this Pomodoro Timer to increase your productivity. Start with a work session and follow up with a break. This method helps you maintain focus and manage your time efficiently. Repeat cycles to enhance your productivity.
      </Text>
    </View>
  );
}

// Styles for the Pomodoro Timer Component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  modeText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});