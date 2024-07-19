import React, { useEffect, useRef } from 'react';
import { View, Animated, PanResponder, StyleSheet, Text, ViewStyle } from 'react-native';
import { PasswordItem } from '../types';

interface SwipeCardProps {
    data: PasswordItem;
    children: React.ReactNode;
    onSwipeLeft: (pass:PasswordItem) => void;
    onSwipeRight: () => void;
    style?: ViewStyle;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ data, children, onSwipeLeft, onSwipeRight, style }) => {
    const dataRef = useRef(data);
    useEffect(()=>{
        dataRef.current = data; 
    },[data])
    const position = useRef(new Animated.ValueXY()).current; 
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
            onPanResponderRelease: async (e, gesture) => {
                if (gesture.dx > 150) { 
                    onSwipeRight();
                    Animated.timing(position, { toValue: { x: 500, y: 0 }, duration: 200, useNativeDriver: false }).start();
                } 
                else if (gesture.dx < -150) { 
                    onSwipeLeft(dataRef.current);
                    Animated.timing(position, { toValue: { x: -500, y: 0 }, duration: 200, useNativeDriver: false }).start();
                } 
                Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
        })
    ).current;

    return (
        <View>
            <Animated.View style={[ styles.editBackground,{ width: position.x.interpolate({ inputRange: [-150, 0], outputRange: [150, 0] }) }]} >
                <Text style={styles.editText}>Edit</Text>
            </Animated.View>
            <Animated.View style={[styles.deleteBackground,{ width: position.x.interpolate({ inputRange: [0, 150], outputRange: [0, 150] }) },]} >
                <Text style={styles.deleteText}>Delete</Text>
            </Animated.View>
            <Animated.View style={[style,{ transform: [{ translateX: position.x }] },]} {...panResponder.panHandlers} >{children}</Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({

    deleteBackground: {
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: -1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft:20
    },
    editBackground: {
        backgroundColor: 'orange', 
        position: 'absolute',
        top: 0,
        right: 0, 
        bottom: 0,
        zIndex: -1,
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        alignItems: 'center',
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    editText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 20,
    },
});

export default SwipeCard;
