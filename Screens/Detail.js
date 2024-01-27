import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import ToastManager, { Toast } from 'toastify-react-native'


const Detail = ({ route }) => {
    const todoRef = firebase.firestore().collection('todos');
    const [textHeading, onChangeHeadingText] = useState(route.params.item.heading);
    const navigation = useNavigation();

    const updateTodo = () => {
        if (textHeading && textHeading.length > 0) {
            todoRef
                .doc(route.params.item.id)
                .update({
                    heading: textHeading,
                })
                .then(() => {
                    // Show a success message using Toast
                    Toast.success('Logs updated successfully!');
                    navigation.navigate("Home");
                })
                .catch((error) => {
                    // Show an error message using Toast
                    Toast.error('Failed to update logs. Please try again.');
                    console.error(error);
                });
        } else {
            // Show an error message for empty input
            Toast.error('Logs heading cannot be empty!');
            navigation.navigate("Home");
        }
    };

    return (
        <View style={styles.container}>
            <ToastManager position="center" />
            <Text style={styles.welcomeText}>Update your logs here...</Text>
            <TextInput 
                style={styles.textfield}
                onChangeText={onChangeHeadingText}
                value={textHeading}
                placeholder="Update Todo"
            />
            <Pressable 
                style={styles.buttonUpdate}
                onPress={() => {updateTodo()}}>
                <Text>Update Log</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 80,
        marginHorizontal: 15,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0de065',
        marginBottom: 20,
        textAlign: 'center',
    },
    textfield: {
        marginBottom: 10,
        padding: 10,
        fontSize: 15,
        color: "#000000",
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
    buttonUpdate: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 10,
        backgroundColor: '#0de065',
    },
});

export default Detail;
