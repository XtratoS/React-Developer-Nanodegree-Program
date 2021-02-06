// import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AddEntry from './components/AddEntry';
import { getMetricMetaInfo } from './utils/helpers';
import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import History from './components/History';
import { StatusBar } from 'expo-status-bar';
import { gray, lightPurp, pink, purple, white } from './utils/colors';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const store = createStore(reducer);

function UStatusBar() {
  return (
    <View style={{backgroundColor: purple, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={purple} style="light" />
    </View>
  )
}

const Tab = createBottomTabNavigator();

const _tabBarOptions = {
  activeTintColor: white,
  inactiveTintColor: purple,
  activeBackgroundColor: lightPurp,
  inactiveBackgroundColor: white,
  keyboardHidesTabBar: true,
}

const addTabOptions = () => ({
  tabBarIcon: ({color, size}) => (<FontAwesome name="plus" color={color} size={size} />)
})

const homeTabOptions = () => ({
  tabBarIcon: ({color, size}) => (<FontAwesome name="history" color={color} size={size} />)
})

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer style={styles.container}>
          <UStatusBar />
          <Tab.Navigator backBehavior="none" tabBarOptions={_tabBarOptions}>
            <Tab.Screen name="History" component={History} options={homeTabOptions()} />
            <Tab.Screen name="Add" component={AddEntry} options={addTabOptions()} />
            {/* <History /> */}
            {/* <AddEntry /> */}
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})