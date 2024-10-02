import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [appState, setAppState] = useState(AppState.currentState);
    const [modalVisible, setModalVisible] = useState(false); // State để kiểm soát modal

    // Hàm xử lý việc chỉ cho phép nhập số và tự động định dạng
    const handlePhoneNumberChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        let formattedNumber = numericValue;
        if (numericValue.length > 3 && numericValue.length <= 6) {
            formattedNumber = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        } else if (numericValue.length > 6) {
            formattedNumber = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        }
        setPhoneNumber(formattedNumber);
        setErrorMessage('');
    };

    const handleContinuePress = async () => {
        const plainNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (plainNumber.length !== 10) {
            setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập 10 số.');
        } else {
            await AsyncStorage.setItem('hasSeenWelcome', 'true');
            alert('Số điện thoại: ' + plainNumber);
            navigateToHome();
        }
    };

    // Điều hướng tới màn hình HomeScreen
    const navigateToHome = () => {
        HomeScreen();
    };

    // Lắng nghe sự thay đổi của AppState
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App đã chuyển sang trạng thái foreground!');
            }
            setAppState(nextAppState);
        });

        return () => {
            subscription.remove();
        };
    }, [appState]);

    // useEffect để hiển thị thông báo chào mừng 1 lần duy nhất
    useEffect(() => {
        const checkWelcomeMessage = async () => {
            try {
                const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
                if (!hasSeenWelcome) {
                    setModalVisible(true); // Hiển thị modal
                    await AsyncStorage.setItem('hasSeenWelcome', 'true');
                }
            } catch (error) {
                console.error('Failed to check AsyncStorage:', error);
            }
        };

        checkWelcomeMessage();
    }, []); // Chỉ chạy 1 lần khi component được mount

    return (
        <View style={styles.container}>
            {/* Modal thông báo */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Welcome</Text>
                        <Text style={styles.modalText}>
                            Chào mừng đến với khoá học lập trình React Native tại CodeFresher.vn
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>Đăng nhập</Text>
            </View>

            <KeyboardAvoidingView
                style={styles.innerContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Text style={styles.subHeader}>Nhập số điện thoại</Text>
                <Text style={styles.description}>
                    Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản tại OneHousing Pro
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nhập số điện thoại của bạn"
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    maxLength={12}
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleContinuePress}>
                    <Text style={styles.buttonText}>Tiếp tục</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#eee',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    // Styles cho Modal
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm tối nền phía sau
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});
