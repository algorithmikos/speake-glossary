import React from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

const Button = ({onPress, title, color='#0088cc'}) => {
  return (
  <TouchableOpacity style={[styles.button, {backgroundColor: color, borderColor: color}]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    width: 290,
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  }
});

export default Button;