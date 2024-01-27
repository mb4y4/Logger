import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import ToastManager, { Toast } from 'toastify-react-native'


const Home = () => {
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        todoRef
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTodos(todos);
            });
    }, []);

    const deleteTodo = (id) => {
        todoRef
            .doc(id)
            .delete()
            .then(() => {
                // Show a success message using Toast
                Toast.success('Log deleted successfully!');
            })
            .catch(error => {
                // Show an error message using Toast
                Toast.error('Failed to delete log. Please try again.');
            });
    };

    const addTodo = () => {
        if (addData && addData.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = { heading: addData, createdAt: timestamp };

            todoRef
                .add(data)
                .then(() => {
                    // Show a success message using Toast
                    Toast.success('Log added successfully!');
                    setAddData('');
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    // Show an error message using Toast
                    Toast.error('Failed to add log. Please try again.');
                });
        }
    };

    const renderItem = ({ item }) => (
        <TodoItem item={item} onDelete={() => deleteTodo(item.id)} onPress={() => navigation.navigate('Detail', { item })} />
    );

    return (
        <View style={styles.container}>
            <ToastManager position="center" />
            <Text style={styles.welcomeText}>Welcome to your log App!</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new log'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setAddData(text)}
                    value={addData}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={addTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={todos}
                numColumns={1}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const TodoItem = ({ item, onDelete, onPress }) => (
    <View>
        <Pressable style={styles.todoContainer} onPress={onPress}>
            <FontAwesome name="trash-o" color="red" onPress={onDelete} style={styles.todoIcon} />
            <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>{item.heading}</Text>
            </View>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        borderRadius: 15,
        margin:5,
        paddingTop: 80,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2979ff',
        marginBottom: 20,
        textAlign: 'center',
    },
    formContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#e0e0e0',
        marginRight: 8,
    },
    button: {
        width: 80,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#2979ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    todoContainer: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    todoIcon: {
        fontSize: 20,
        color: 'red',
        marginRight: 16,
    },
    innerContainer: {
        flex: 1,
        marginLeft: 16,
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default Home;
