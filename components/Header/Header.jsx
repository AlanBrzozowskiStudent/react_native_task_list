import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

export function Header() {
    // Utworzenie stanu dla daty
    const [currentDate, setCurrentDate] = useState('');

    // Ustawienie daty przy ładowaniu komponentu
    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toDateString(); // Możesz dostosować formatowanie daty, jeśli chcesz
        setCurrentDate(formattedDate);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.image} />
            <Text style={styles.text}>
                Your tasks for today: {currentDate}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', // Wyśrodkuj zawartość kontenera w poziomie
        padding: 10, // Dodaj padding do kontenera
    },
    image: {
        maxHeight: 100, // Maksymalna wysokość obrazu
        maxWidth: 500, // Maksymalna szerokość obrazu
        resizeMode: 'contain', // Dopasuj obraz w ramach dostępnego miejsca
        alignSelf: 'center', // Wyśrodkuj obraz poziomo
    },
    text: {
        marginTop: 10,
        color: "#ABABAB",
        fontSize: 20,
    }
});