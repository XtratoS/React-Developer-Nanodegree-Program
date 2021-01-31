import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import Slider from './Slider';
import Steppers from './Steppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { removeEntry as _removeEntry, submitEntry } from '../utils/api';
import { connect } from 'react-redux';
import { addEntry, removeEntry } from '../actions';

function SubmitBtn({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text>SUBMIT</Text>
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
                <View>
                    <Ionicons
                        name="ios-happy-outline"
                        size={96}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View>
                <DateHeader
                    date={(new Date()).toLocaleDateString()}
                />
                {Object.keys(metaInfo).map((key) => {
                    const { getIcon, type, displayName, ...rest } = metaInfo[key];
                    const value = this.state[key];

                    return (
                        <View key={displayName}>
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
                <SubmitBtn onPress={this.submit} />
            </View>
        )
    }
}

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
