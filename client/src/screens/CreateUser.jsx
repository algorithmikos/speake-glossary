import { React, useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import axios from "axios";
import { ngrokServer } from '../../server/config'
import Button from '../components/Button';

const CreateUser = () => {
  const [idNum, setIdNum] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [group, setGroup] = useState("Student");

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    isChecked ? setGroup("Admin") : setGroup("Student")
  }, [isChecked]);

  const createUser = () => {
    setIsLoading(true);

    if (!first_name) {
      failedMsg("Name required!", "First name cannot be empty.");
      setIsLoading(false);
      return;
    } else if (!last_name) {
      failedMsg("Last name required!", "Last name cannot be empty.");
      setIsLoading(false);
      return;
    }

    if (!idNum) {
      failedMsg("ID required!", "ID cannot be empty.");
      setIsLoading(false);
      return;
    }

    const regex = /^[0-9]+$/;
    if (!regex.test(idNum)) {
      failedMsg("ID isn't a nubmer!", "ID must be a number.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      failedMsg("Password is too short!", "Password must be 6 characters or longer.");
      setIsLoading(false);
      return;
    }
    
    axios.post(`${ngrokServer}/users/createUser`, {
      username: idNum,
      password,
      first_name,
      middle_name,
      last_name,
      sudo: isChecked,
    })
    .then((res) => {
      console.log(res.data);
      successMsg();
      setIdNum("");
      setPassword("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setIsChecked(false);
      setGroup("Student");
      setIsLoading(false);
    })
    .catch((error) => {
      if (error.response.status === 400) {
        failedMsg(error.response.data.message, "Please use another ID.");
        setIdNum("");
        setIsLoading(false);
      } else if (error.response.status === 500) {
        failedMsg();
        setIsLoading(false);
      }
    });
  }

  const successMsg = () => {
    Toast.show({
      type: "success",
      text1: "Created successfully!",
      text2: `${group} account has been successfully created.`,
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

  return (
    <>
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
    <KeyboardAvoidingView style={styles.container}>
    <Image
      style={styles.logo}
      source={require('../../assets/company.jpg')}
    />

    <Text style={styles.header}>
      Create a New Account
    </Text>
    
    <View style={{width: '75%', marginBottom: 10, borderRadius: 10}}>
      <CheckBox
      checked={isChecked}
      onPress={handleCheckBoxChange}
      title={isChecked ? "That will grant admin permissions." : "Admin?"}
      value={isChecked}
      />
    </View>
    
    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="First Name"
        placeholderTextColor="grey"
        onChangeText={text => setFirstName(text.trim())}
        value={first_name}
      />
    </View>

    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Middle Name (Optional)"
        placeholderTextColor="grey"
        onChangeText={text => setMiddleName(text.trim())}
        value={middle_name}
      />
    </View>

    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        placeholder="Last Name"
        placeholderTextColor="grey"
        onChangeText={text => setLastName(text.trim())}
        value={last_name}
      />
    </View>

    <View style={styles.inputView}>
    <TextInput
      style={styles.inputText}
      placeholder="Enter the ID No."
      placeholderTextColor="grey"
      onChangeText={id => setIdNum(id.trim())} 
      value={idNum}
      // keyboardType="numeric"
    />
    </View>
      
    <View style={styles.inputView}>
      <TextInput
        style={styles.inputText}
        secureTextEntry={true}
        autoCapitalize='none'
        placeholder="Enter the Password"
        placeholderTextColor="grey"
        onChangeText={text => setPassword(text)} 
        value={password}
        />
    </View>

    {!isLoading ?
        (
          group === 'Student' ? 
          <Button title={`Create a New ${group} Account`} onPress={createUser} /> :
          <Button title={`Create a New ${group} Account`} onPress={createUser} color='#800080'/>
        ) : 
        (
          <ActivityIndicator size="large" color="#0088cc" />
        )
      }
    </KeyboardAvoidingView>
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
  // nameInput: {
  //   flexDirection: "row",
  //   alignItems: 'center',
  //   width:'75%',
  //   height: '6%',
  //   backgroundColor:'white',
  //   borderRadius:10,
  //   marginBottom:20,
  // }
});

export default CreateUser

