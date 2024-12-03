import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import axios from 'axios';
import Toast from 'react-native-toast-message';

import { ngrokServer } from '../../server/config';
import Button from '../components/Button';

const BG_IMG = 'https://images.unsplash.com/photo-1529419412599-7bb870e11810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80';

const WordToUser = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [wordList, setWordList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchWordList();
    fetchUserList();
    setIsLoading(false);
  }, []);

  const fetchWordList = async () => {
    try {
      await axios.get(`${ngrokServer}/words/all`)
      .then((response) => {
        let wordsList = response.data.map((item) => {
          return {key: item._id, value: item.word}
        })
        setWordList(wordsList);
      })
    } catch (error) {
      console.error('Error fetching word list:', error);
    }
  };

  const fetchUserList = async () => {
    try {
      await axios.get(`${ngrokServer}/users/all`)
      .then((response) => {
        let usersList = response.data.filter(user => !user.sudo).map((item) => {
          return {key: item._id, value: `(${item.username}) ${item.first_name} ${item.last_name}`}
        })
        setUserList(usersList);
      })
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const handleAddWordsToUsers = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${ngrokServer}/words/add-words-to-users`,
        {
          wordIds: selectedWords,
          userIds: selectedUsers,
        }
      ).then((res) => {
        Toast.show({
          type: "success",
          text1: "Added Successfully!",
          text2: "Words have been added successfully.",
          autoHide: true,
          visibilityTime: 5000,
          bottomOffset: 200,
          onPress: () => Toast.hide(),
        })
        setIsLoading(false);
      })
      setSelectedUsers([]);
      setSelectedWords([]);
    } catch (error) {
      console.error('Error adding words to users:', error);
      setIsLoading(false);
      // Handle error
      Toast.show({
        type: "error",
        text1: "Already added",
        text2: error.response.data.message,
        autoHide: true,
        visibilityTime: 5000,
        bottomOffset: 200,
        onPress: () => Toast.hide(),
      })
    }
  };

  return (
    <View style={styles.container}>
      <Image 
          source={{uri: BG_IMG}}
          style={StyleSheet.absoluteFillObject}
          blurRadius={8}
      />
      <Text
        style={{
          marginTop: '12%',
          marginBottom: '5%',
          fontFamily: 'serif',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 25,
          // fontFamily: 'Gelasio'
        }}
      >
      Add 📄 Words to 🧒🏽 Students
      </Text>
      <View style={styles.multiselect}>
      <MultipleSelectList 
        setSelected={(val) => setSelectedWords(val)} 
        data={wordList} 
        save="key"
        onSelect={() => console.log(selectedWords)}
        notFoundText="No word found"
        label="Selected Words"
        placeholder="Select Word(s)"
        dropdownStyles={{backgroundColor: 'rgba(255, 255, 255, 0.45)'}}
        boxStyles={{backgroundColor: 'rgba(255, 255, 255, 0.45)'}}
      />
      </View>
      <View style={styles.multiselect}>
      <MultipleSelectList 
        setSelected={(val) => setSelectedUsers(val)} 
        data={userList}
        save="key"
        onSelect={() => console.log(selectedUsers)}
        notFoundText="No student found"
        label="Selected Students"
        placeholder="Select Student(s)"
        dropdownStyles={{backgroundColor: 'rgba(255, 255, 255, 0.45)'}}
        boxStyles={{backgroundColor: 'rgba(255, 255, 255, 0.45)'}}
      />
      </View>
      
      {!isLoading ?
        (
          <Button title="Add selected" onPress={handleAddWordsToUsers} />
        ) : 
        (
          <ActivityIndicator size="large" color="#0088cc" />
        )
      }
      
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
  multiselect: {
    width: '100%', 
    // backgroundColor: 'rgba(255, 255, 255, 0.45)',
    marginBottom: 10,
  }
});

export default WordToUser;
