import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Logout from '../components/Logout';
import Button from '../components/Button';

const Settings = () => {
  const [birthdaySubmitted, setBirthdaySubmitted] = useState(true);
  const [birthday, setBirthday] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Show the date picker when the button is clicked
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Hide the date picker when the user cancels or selects a date
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Handle date selection
  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setSelectedDate(formattedDate); // Format the date as needed
    hideDatePicker();
  };

  useEffect(() => {
    console.log(birthday)
  }, [birthday])

  return (
    <View style={styles.container}>
      <Button title="Enter your Birthday" onPress={showDatePicker} />
      <View style={styles.inputView}>
        <TextInput 
          style={styles.inputText}
          placeholder='Enter your birthday'
          placeholderTextColor="grey"
          editable= {false}
          secureTextEntry={false}
          value={selectedDate}
        />
      </View>
      <Button title="Save" onPress={() => setBirthday(selectedDate)} />
      {/* Date Picker */}
      <DateTimePickerModal
        display='spinner'
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date("1970-01-01")}
        maximumDate ={new Date("2018-01-01")}
        format="YYYY-MM-DD"
      />
      <Logout/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffd002',
  },
  inputView:{
    width:'75%',
    height: '6%',
    backgroundColor:'white',
    borderRadius:10,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    fontSize: 15,
    color:'black'
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Settings;
