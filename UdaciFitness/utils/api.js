import AsyncStorage from '@react-native-async-storage/async-storage';
import { CALENDAR_STORAGE_KEY } from './_calender';

export async function submitEntry({ key, entry }) {
    let initialStorage = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
    console.log('initialStorage', initialStorage);
    await AsyncStorage.mergeItem(CALENDAR_STORAGE_KEY, JSON.stringify({[key]: entry}));
    let finalStorage = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
    console.log('finalStorage', finalStorage);
    return 
}

export async function removeEntry(key) {
    let calendarStorage = await AsyncStorage.getItem(CALENDAR_STORAGE_KEY);
    let items = JSON.parse(calendarStorage);
    items[key] = null;
    delete items[key];
    await AsyncStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(items));
    return true;
}