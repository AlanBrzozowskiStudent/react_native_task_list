import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CardTask } from './components/CardTask/CardTask';
import Dialog from 'react-native-dialog';
import { Header } from './components/Header/Header';
import { TabBottomMenu } from './components/TabBottomMenu/TabBottomMenu';
import { PomodoroTimer } from './components/Pomodoro/Pomodoro';
import { s } from './App.style';
import * as SQLite from 'expo-sqlite';

// Open or create the SQLite database
const db = SQLite.openDatabase('todo.db');

const App = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(1);
  const [selectedTabName, setSelectedTabName] = useState('all');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [currentTodo, setCurrentTodo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [todoList, setTodoList] = useState([]);

  // Seed data for the initial population of the database
  const seedData = [
    { title: 'Test Task 1', isCompleted: false, priority: 3, description: 'Task description 1' },
    { title: 'Test Task 2', isCompleted: false, priority: 1, description: 'Task description 2' },
    { title: 'Test Task 3', isCompleted: true, priority: 2, description: '' },
    { title: 'Test Task 4', isCompleted: true, priority: 5, description: '' },
  ];

  // Function to create the 'todos' table if it doesn't exist
  useEffect(() => {
    createTable();
  }, []);

  // Create 'todos' table and populate with seed data if empty
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, isCompleted BOOLEAN, priority INTEGER, description TEXT);',
        [],
        () => {
          tx.executeSql('SELECT COUNT(*) AS count FROM todos', [], (_, { rows: { _array } }) => {
            if (_array[0].count === 0) {
              seedData.forEach((todo) => {
                insertInitialData(todo.title, todo.isCompleted, todo.priority, todo.description);
              });
            } else {
              loadTodos();
            }
          });
        }
      );
    });
  };

  // Insert initial data into 'todos' table
  const insertInitialData = (title, isCompleted, priority, description) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO todos (title, isCompleted, priority, description) VALUES (?, ?, ?, ?);',
        [title, isCompleted, priority, description],
        loadTodos,
        (_, error) => console.error('Error inserting initial data:', error)
      );
    });
  };

  // Load todos from the database
  const loadTodos = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM todos;',
        [],
        (_, { rows: { _array } }) => {
          const convertedTodos = _array.map((todo) => ({
            ...todo,
            isCompleted: !!todo.isCompleted,  // Convert to boolean
          }));
          setTodoList(convertedTodos);
        },
        (_, error) => console.error('Error loading todos:', error)
      );
    });
  };

  // Insert a new todo into the database
  const insertTodo = (title, isCompleted, priority, description) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO todos (title, isCompleted, priority, description) VALUES (?, ?, ?, ?);',
        [title, isCompleted, priority, description],
        loadTodos,
        (_, error) => console.error('Error inserting todo:', error)
      );
    });
  };

  // Update an existing todo in the database
  const updateTodo = (id, title, isCompleted, priority, description) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE todos SET title = ?, isCompleted = ?, priority = ?, description = ? WHERE id = ?;',
        [title, isCompleted, priority, description, id],
        loadTodos,
        (_, error) => console.error('Error updating todo:', error)
      );
    });
  };

  // Delete a todo from the database
  const deleteTodo = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM todos WHERE id = ?;',
        [id],
        loadTodos,
        (_, error) => console.error('Error deleting todo:', error)
      );
    });
  };

  // Toggle the completion status of a todo
  const onPressTodo = (pressedTodo) => {
    const updatedTodo = {
      ...pressedTodo,
      isCompleted: !pressedTodo.isCompleted,
    };

    updateTodo(updatedTodo.id, updatedTodo.title, updatedTodo.isCompleted, updatedTodo.priority, updatedTodo.description);
  };

  // Handle long press on a todo to show edit/delete options
  const onLongPressTodo = (longPressedTodo) => {
    setModalVisible(true);
    setCurrentTodo(longPressedTodo);
  };

  // Initiate edit mode for a todo
  const editTodo = () => {
    setModalVisible(false);
    setIsEditMode(true);
    setInputValue(currentTodo.title);
    setDescription(currentTodo.description);
    setSelectedPriority(currentTodo.priority);
    setIsDialogVisible(true);
  };

  // Filter the todo list based on the selected tab
  const getFilteredNoteList = () => {
    let filteredList = [];
    switch (selectedTabName) {
      case 'all':
        filteredList = todoList;
        break;
      case 'inProgress':
        filteredList = todoList.filter(({ isCompleted }) => !isCompleted);
        break;
      case 'done':
        filteredList = todoList.filter(({ isCompleted }) => isCompleted);
        break;
      case 'pomodoro':
        filteredList = []; // Return an empty list since Pomodoro Timer will display
        break;
      default:
        filteredList = todoList;
        break;
    }

    // Sort list: uncompleted tasks on top, completed tasks at the bottom
    filteredList.sort((a, b) => a.isCompleted - b.isCompleted);
    return filteredList;
  };

  const filteredNoteList = getFilteredNoteList();

  // Render the list of tasks or the Pomodoro timer
  const renderTasks = () => {
    if (selectedTabName === 'pomodoro') {
      return <PomodoroTimer />;
    }
    return filteredNoteList.map((todo, index) => (
      <View key={todo.id} style={{ marginBottom: 20 }}>
        <CardTask
          todo={todo}
          onPress={() => onPressTodo(todo)}
          onLongPress={() => onLongPressTodo(todo)}
          index={index}
        />
      </View>
    ));
  };

  // Handle creation or update of a todo
  const createOrUpdateTodo = () => {
    if (inputValue.trim().length === 0) {
      setErrorMessage('Task name is mandatory');
      return;
    }
    if (description.length > 50) {
      setDescriptionError('Description must be within 50 characters.');
      return;
    }

    if (isEditMode && currentTodo) {
      updateTodo(currentTodo.id, inputValue, currentTodo.isCompleted, selectedPriority, description);
    } else {
      insertTodo(inputValue, false, selectedPriority, description);
    }

    setInputValue('');
    setSelectedPriority(1);
    setDescription('');
    setErrorMessage('');
    setDescriptionError('');
    setIsDialogVisible(false);
    setIsEditMode(false);
    setCurrentTodo(null);
  };

  // Component for displaying priority buttons
  const PriorityButton = ({ priority, label }) => (
    <Pressable
      style={{
        padding: 10,
        borderRadius: 5,
        borderColor: selectedPriority === priority ? '#000' : '#ccc',
        borderWidth: 1,
        marginHorizontal: 5,
        backgroundColor: selectedPriority === priority ? '#ddd' : '#fff',
      }}
      onPress={() => setSelectedPriority(priority)}
    >
      <Text>{label}</Text>
    </Pressable>
  );

  // Button for adding a new task
  const buttonAdd = () => {
    return (
      <Pressable
        style={{
          position: 'absolute',
          bottom: 60,
          right: 20,
          backgroundColor: '#C2DAFF',
          width: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
        }}
        onPress={() => {
          setIsDialogVisible(true);
          setErrorMessage('');
          setDescriptionError('');
          setIsEditMode(false);
          setCurrentTodo(null);
        }}
      >
        <Text
          style={{
            color: '#2F76E5',
            fontWeight: 'bold',
            fontSize: 18,
            paddingVertical: 15,
          }}
        >
          + New todo
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: '#F9F9F9' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.root}>
          <View style={{ flex: 1 }}>
            <Header />
          </View>
          <View style={{ flex: 5 }}>
            <ScrollView>{renderTasks()}</ScrollView>
          </View>
        </View>
        {buttonAdd()}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType='fade'
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}
              activeOpacity={1}
            >
              <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>Action</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Pressable onPress={editTodo}>
                  <Text style={{ fontSize: 20, color: 'blue' }}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => deleteTodo(currentTodo.id)}>
                  <Text style={{ fontSize: 20, color: 'red' }}>Delete</Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <Dialog.Container
          visible={isDialogVisible}
          onBackdropPress={() => {
            setIsDialogVisible(false);
            setErrorMessage('');
            setDescriptionError('');
            setIsEditMode(false);
            setCurrentTodo(null);
          }}
        >
          <Dialog.Title style={{ textAlign: 'center' }}>{isEditMode ? 'Edit task' : 'Create a task'}</Dialog.Title>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Task name:</Text>
            <Dialog.Input
              onChangeText={(text) => {
                setInputValue(text);
                setErrorMessage('');
              }}
              value={inputValue}
            />
            {errorMessage ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage}</Text>
            ) : null}
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Description (max 50 chars):</Text>
            <Dialog.Input
              onChangeText={(text) => {
                setDescription(text);
                if (text.length <= 50) {
                  setDescriptionError('');
                }
              }}
              value={description}
              maxLength={50}
            />
            {descriptionError ? (
              <Text style={{ color: 'red', marginTop: 5 }}>{descriptionError}</Text>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
            <Text>Low</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((priority) => (
                <PriorityButton key={priority} priority={priority} label={priority} />
              ))}
            </View>
            <Text>High</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
            <Pressable
              onPress={createOrUpdateTodo}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                backgroundColor: '#A5D6A7',
                marginRight: 10,
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{isEditMode ? 'SAVE' : 'CREATE'}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsDialogVisible(false);
                setErrorMessage('');
                setDescriptionError('');
                setIsEditMode(false);
                setCurrentTodo(null);
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 25,
                backgroundColor: '#EF5350',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>CANCEL</Text>
            </Pressable>
          </View>
        </Dialog.Container>
      </SafeAreaView>
      <TabBottomMenu
        todoList={todoList}
        onPress={setSelectedTabName}
        selectedTabName={selectedTabName}
      />
    </SafeAreaProvider>
  );
};

export default App;