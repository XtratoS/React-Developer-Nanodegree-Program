import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { purple, white } from '../utils/colors';
import { calculateDirection } from '../utils/helpers';

export default class Live extends Component {
    state = {
        status: null,
        coords: null,
        direction: '',
        bounceValue: new Animated.Value(1),
    }
    componentDidMount() {
        this._isMounted = true;
        Permissions.getAsync(Permissions.LOCATION)
            .then(({ status }) => {
                if (status === 'granted') {
                    return this.setLocation();
                } else {
                    this.setState({ status });
                }
            }).catch((err) => {
                console.warn('Error getting location permission: ', err);

                this.setState({status: 'undetermined'});
            });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    askPermission = async () => {
        Permissions.askAsync(Permissions.LOCATION).then(({status}) => {
            if (status === 'granted') {
                return this.setLocation();
            }
            this.setState({status});
        }).catch((err) => {
            console.warn('Error while asking for location permission: ', err);
        })
    }
    setLocation = () => {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: 1,
            distanceInterval: 1,
        }, ({ coords }) => {
            const newDirection = calculateDirection(coords.heading);
            const { direction } = this.state;

            if (newDirection !== direction) {
                Animated.sequence([
                    Animated.timing(this.state.bounceValue, {toValue: 1.04, duration: 200, useNativeDriver: true}),
                    Animated.spring(this.state.bounceValue, {toValue: 1, friction: 3, useNativeDriver: true})
                ]).start();
            }

            if (this._isMounted === true) {
                this.setState({
                    status: 'granted',
                    coords,
                    direction: newDirection,
                })
            }
        });
    }
    render() {
        const { status, coords, direction, bounceValue } = this.state;

        if (status === null) {
            return <ActivityIndicator style={{marginTop: 30}} />
        }

        if (status === 'denied') {
            return <View style={styles.center}>
                <Foundation name='alert' size={50}/>
                <Text>
                    You denied this application from accessing your Location Service, you have to enable Location Services in your settings to use the Live feature of this app.
                </Text>
            </View>
        }

        if (status === 'undetermined') {
            return <View style={styles.center}>
                <Foundation name='alert' size={50}/>
                <Text>
                    You need to enable Location Services for this app
                </Text>
                <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Enable
                    </Text>
                </TouchableOpacity>
            </View>
        }

        return <View style={styles.container}>
            <View style={styles.directionContainer}>
                <Text style={styles.header}>You're heading</Text>
                <Animated.Text style={[styles.direction, {transform: [{ scale: bounceValue }]}]}>
                    {direction}
                </Animated.Text>
            </View>
            <View style={styles.metricContainer}>
                <View style={styles.metric}>
                    <Text style={[styles.header, {color: white}]}>
                        Altitude
                    </Text>
                    <Text style={[styles.subHeader, {color: white}]}>
                        {Math.round(coords.altitude)} meters
                    </Text>
                </View>
                <View style={styles.metric}>
                    <Text style={[styles.header, {color: white}]}>
                        Speed
                    </Text>
                    <Text style={[styles.subHeader, {color: white}]}>
                        {coords.speed.toFixed(1)} KPH
                    </Text>
                </View>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        padding: 10,
        backgroundColor: purple,
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20,
    },
    buttonText :{
        color: white,
        fontSize: 20,
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 35,
        textAlign: 'center',
    },
    direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
    },
    metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
    },
    metric: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
    },
});