import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import TextButton from './TextButton';

import { removeEntry as _removeEntry } from '../utils/api';
import { removeEntry } from '../actions';

class EntryDetail extends Component {
    componentDidMount() {
        const { navigation, route } = this.props;
        const { entryId } = route.params;
        const date = entryId.dateString;

        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8);

        navigation.setOptions({
            title: `${day}/${month}/${year}`
        });
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.metrics;
    }

    reset = () => {
        const { remove, goBack, entryId } = this.props;

        // REDUX
        remove();
        // API
        _removeEntry(entryId.dateString).then(() => {
            goBack();
        });
    }
    
    render() {
        const key = this.props.route.params.entryId.dateString;
        const { metrics } = this.props;

        return (
            <View style={styles.container}>
                <MetricCard metrics={metrics} />
                <TextButton style={{margin: 20}} onPress={this.reset}>
                    RESET
                </TextButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        padding: 15
    }
});

function mapStateToProps(state, { route }) {
    const { entryId } = route.params;

    return {
        entryId,
        metrics: state[entryId.dateString]
    }
}

function mapDispatchToProps(dispatch, { navigation, route }) {
    const { entryId } = route.params;
    const goBack = navigation.goBack;

    return {
        goBack,
        remove: () => { dispatch(removeEntry(entryId.dateString)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);