import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addEntry, receiveEntries } from '../actions';
import { fetchCalendarResults } from '../utils/api';
import { getDailyReminderValue, timeToString } from '../utils/helpers';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import DateHeader from './DateHeader';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';

class History extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        fetchCalendarResults().then((res) => {
            return dispatch(receiveEntries(res));
        }).then(({ entries }) => {
            
        })
    }

    renderItem = (date, item) => {
        if (item) {
            return (
                <View style={styles.item}>
                    <MetricCard
                        date={date}
                        metrics={item}
                    />
                </View>
            )
        } else {
            return null;
        }
    }

    renderEmptyDate(date) {
        return (
            <View style={styles.item}>
                <DateHeader date={timeToString(date)} />
                <Text style={styles.noDataText}>No Data for this day</Text>
            </View>
        )
    }

    render() {
        const { entries } = this.props;
        return (
            <View style={{flex: 1, width: '100%'}}>
                <Agenda
                    items={entries}
                    renderDay={this.renderItem}
                    onDayPress={(day)=>{console.log('day pressed', day)}}
                    onDayChange={(day)=>{console.log('day changed')}}
                    rowHasChanged={(r1, r2) => {
                        for (let key of Object.keys({...r1, ...r2})) {
                            if (r1[key] !== r2[key]) {
                                return true;
                            }
                        }
                        return false;
                    }}
                    renderEmptyDate={(date) => (this.renderEmptyDate(date))}
                    renderEmptyData={(date) => (this.renderEmptyDate(date))}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dayDataContainer: {
        marginTop: 32,
        justifyContent: 'center',
        marginLeft: 32,
        flex: 1,
    },
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios' ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
            width: 0,
            height: 3
        },
    },
    noDataText: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20
    }
})

function mapStateToProps(entries) {
    for (let key in entries) {
        entries[key] = entries[key] ? [entries[key]] : []
    }
    return {
        entries
    }
}

export default connect(mapStateToProps)(History);