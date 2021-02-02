import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import Slider from './Slider';
import Steppers from './Steppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { removeEntry as _removeEntry, submitEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry, removeEntry } from '../actions';
import { purple, white } from '../utils/colors';

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={Platform.OS === 'ios' ? styles.iosSubmit : styles.androidSubmit}
        >
            <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }
    
    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric);
    
        this.setState((prevState) => {
            const count = prevState[metric] + step;
        
            return {
                ...prevState,
                [metric]: count > max ? max : count
            }
        });
    }
    
    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric);
    
        this.setState((prevState) => {
            const count = prevState[metric] - step;
        
            return {
                ...prevState,
                [metric]: count < 0 ? 0 : count
            }
        });
    }

    slide = (metric, value) => {
        this.setState({[metric]: value});
    }

    submit = () => {
        const key = timeToString();
        const entry = this.state;

        // RESET STATE
        this.setState((prevState)=>(
            Object.keys(prevState).reduce((newState, currKey) => {
                newState[currKey] = 0;
                return newState;
            }, {})
        ));
        
        // UPDATE REDUX
        this.props.dispatch(addEntry({
            [key]: entry
        }))

        // NAVIGATE TO HOME

        // UPDATE ASYNCSTORAGE
        submitEntry({key, entry});

        // CLEAR LOCAL NOTIFICATION
    }

    reset = () => {
        const key = timeToString();

        // UPDATE REDUX
        this.props.dispatch(removeEntry(key));

        // ROUTE TO HOME

        // UPDATE ASYNCSTORAGE
        _removeEntry(key);
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        if (this.props.alreadyLogged) {
            return (
                <View style={[styles.center]}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? "ios-happy-outline" : "md-happy"}
                        size={96}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton style={{padding: 10}} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }StyleSheet

        return (
            <View style={styles.container}>
                <DateHeader
                    date={(new Date()).toLocaleDateString()}
                />
                {Object.keys(metaInfo).map((key) => {
                    const { getIcon, type, displayName, ...rest } = metaInfo[key];
                    const value = this.state[key];

                    return (
                        <View key={displayName} style={styles.row}>
                            {getIcon()}
                            {type === 'slider' ?
                                <Slider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                /> :
                                <Steppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />
                            }
                        </View>
                    )
                })}
                <View style={[styles.row, {justifyContent: 'center'}]}>
                    <SubmitBtn onPress={this.submit} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        padding: 20,
        backgroundColor: white,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iosSubmit: {
        backgroundColor: purple,
        color: white,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmit: {
        backgroundColor: purple,
        color: white,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30
    }
})

function mapStateToProps(state) {
    const key = timeToString();

    const getLoggedStatus = () => {
        if (state[key]) {
            return true;
        }
    }

    return {
        alreadyLogged: getLoggedStatus()
    }
}

export default connect(mapStateToProps)(AddEntry);
