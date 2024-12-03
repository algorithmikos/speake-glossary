import { React, useState, useEffect } from 'react';
import { 
  Alert,
  StyleSheet,
  Text,
  Image,
  TextInput, 
  ScrollView,
  View,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import axios from "axios";
import { ngrokServer } from '../../server/config'
import Button from '../components/Button';

const AddWord = () => {
  const [word, setWord] = useState("");
  const [arTranslation, setArTranslation] = useState("");
  const [enDefinition, setEnDefinition] = useState("");
  const [example, setExample] = useState("");
  const [lvls, setLvls] = useState("");
  const [selectedLvl, setSelectedLvl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCourseLvls();
  }, []);

  const successMsg = (text1="Created successfully!", text2=`${group} account has been successfully created.`) => {
    Toast.show({
      type: "success",
      text1: text1,
      text2: text2,
      autoHide: true,
      visibilityTime: 3000,
      bottomOffset: 200,
      onPress: () => Toast.hide()
    })
  }

  const failedMsg = (text1="Something went wrong!", text2="Something unexpected happened during the creation process.") => {
    Toast.show({
      type: "error",
      text1: text1,
      text2: text2,
      autoHide: true,
      visibilityTime: 5000,
      bottomOffset: 200,
      onPress: () => Toast.hide()
    })
  }

  const newWord = () => {
    if (!word) {
      failedMsg("Word is empty!", "Word cannot be empty.");
      return;
    } else if (!arTranslation) {
      failedMsg("Translation is empty!", "Arabic translation cannot be empty.");
      return;
    } else if (!enDefinition) {
      failedMsg("Definition is empty!", "Dictionary definition cannot be empty.");
      return;
    } else if (!example) {
      failedMsg("Example is empty!", "Example cannot be empty.");
      return;
    } else if (!selectedLvl) {
      failedMsg("No Level Selected!", "A level must be selected.");
      return;
    }

    setIsLoading(true);
    const theWord = word;
    axios.post(`${ngrokServer}/words/newWord`, {
      word: word,
      arTranslation: arTranslation,
      enDefinition: enDefinition.trim(),
      example: example.trim(),
      level: selectedLvl,
    })
    .then(res => {
      console.log(res.data)
      setWord("");
      setArTranslation("");
      setEnDefinition("");
      setExample("");
      setSelectedLvl("");
      Alert.alert(`🟢 Word “${theWord}” added successfully!`);
      setIsLoading(false);
    }).catch(error => {
      failedMsg(error.response.data.message, "Word already exists in glossary");
      setIsLoading(false);
    })
  }

  const fetchCourseLvls = async () => {
    try {
      await axios.get(`${ngrokServer}/courses/`)
      .then((response) => {
        let courseLvlsList = response.data.map((item) => {
          return {key: item._id, value: `(${item.level}) ${item.description}`}
        })
        courseLvlsList.sort()
        setLvls(courseLvlsList);
      })
    } catch (error) {
      console.error('Error fetching lvls list:', error);
    }
  };

  return (
    <>
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/company.jpg')}
      />
      <Text style={styles.header}>
        Add a New Word
      </Text>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Type an English word"
          placeholderTextColor="grey"
          onChangeText={text => setWord(text)}
          value={word}
        />
      </View>
        
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Type the Arabic translation"
          placeholderTextColor="grey"
          onChangeText={text => setArTranslation(text)}
          value={arTranslation}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          multiline
          style={styles.inputText}
          placeholder="Type the dictionary definition"
          placeholderTextColor="grey"
          onChangeText={text => setEnDefinition(text)}
          value={enDefinition}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Type an example of usage"
          placeholderTextColor="grey"
          onChangeText={text => setExample(text)}
          value={example}
          />
      </View>

      <View style={{width:'75%', marginBottom:20 }}>
        <SelectList 
            setSelected={(val) => setSelectedLvl(val)} 
            data={lvls} 
            save="key"
            onSelect={() => console.log(selectedLvl)}
            label="Selected Level"
            placeholder="Select a level"
        />
      </View>
      
      {!isLoading ?
        (
          <Button title={"Add a New Word"} onPress={newWord} />
        ) : 
        (
          <ActivityIndicator size="large" color="#0088cc" />
        )
      }
    </SafeAreaView>
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd002',
    alignItems: 'center',  // Center horizontally
    justifyContent: 'flex-start', // Start from the top
    paddingTop: 50,
    // marginTop: StatusBar.currentHeight || 0
  },
  logo: {
    width: 300, // Adjust this width as needed
    height: 200,
    resizeMode: 'center',
  },
  header: {
    fontFamily: 'serif',
    color: '#080808',
    fontSize: 20,
    paddingBottom: 20,
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
  lastView: {
    height: 15
  }
});

export default AddWord

