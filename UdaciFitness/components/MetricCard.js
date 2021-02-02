import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { gray } from '../utils/colors'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import DateHeader from './DateHeader'

export default function MetricCard({ date, metrics }) {
    return (
        <View>
            {date && <DateHeader date={date.dateString} />}
            {Object.keys(metrics).map((metric) => {
                const { getIcon, displayName, unit } = getMetricMetaInfo(metric);
                return (
                    <View style={styles.metric} key={displayName}>
                        {getIcon()}
                        <View>
                            <Text style={{fontSize: 20}}>
                                {displayName}
                            </Text>
                            <Text style={{fontSize: 16, color:gray}}>
                                {metrics[metric]} {unit}
                            </Text>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    metric: {
        width: 300,
        flexDirection: 'row',
        marginTop: 12,
    }
})