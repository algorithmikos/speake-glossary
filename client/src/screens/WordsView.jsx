import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  Image,
  View,
  StatusBar,
  Dimensions,
  Animated
  } from 'react-native';
import axios from "axios";
import { ngrokServer } from '../../server/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');
const SPACING = 20;
const ITEM_SIZE = 70 + SPACING * 3;

let BG_IMG;
const currentTime = new Date();
const currentHour = currentTime.getHours();
if (currentHour >= 6 && currentHour < 20) {
  BG_IMG = 'https://images.unsplash.com/photo-1597847511602-f6213e29d13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80'
} else {
  BG_IMG = 'https://images.unsplash.com/photo-1518826778770-a729fb53327c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80';
}
const WordsView = () => {
  const [words, setWords] = useState([]);
  const [leveledWords, setLeveledWords] = useState([]);
  const [lvls, setLvls] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        const userName = userInfo.name;
        setName(userName);
      } catch (error) {
        console.error('Error fetching student name:', error);
      }
    };
    fetchStudentName();

    const fetchData = async () => {
      try {
        const wordsResponse = await axios.get(`${ngrokServer}/words/all`);
        if (wordsResponse.status === 200) {
          setWords(wordsResponse.data);
        }

        const lvlsResponse = await axios.get(`${ngrokServer}/courses/`);
        if (lvlsResponse.status === 200) {
          setLvls(lvlsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateWords = () => {
      const updatedWords = words.map((w) => {
        const matchedLevel = lvls.find((l) => l._id === w.level);
        if (matchedLevel) {
          w.level = `${matchedLevel.level} - ${matchedLevel.description}`;
        }
        return w;
      });
      setLeveledWords(updatedWords);
    };

    // Make sure lvls and words are available before updating words.
    if (lvls.length > 0 && words.length > 0) {
      updateWords();
    }
  }, [lvls, words]); // Add lvls and words to the dependency array.


  const scrollY = React.useRef(new Animated.Value(0)).current;
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#ffd002'}}>
        <Image 
          source={{uri: BG_IMG}}
          style={StyleSheet.absoluteFillObject}
          blurRadius={5}
        />
        <Text>{name}</Text>
        <Animated.FlatList
          data={leveledWords}
          onScroll={Animated.event(
            [{ nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true}
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 42
          }}
          renderItem={({item, index}) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 2)
            ]

            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 1)
            ]

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0]
            })

            const opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0]
            })
            return <Animated.View style={{
              flexDirection: 'row', 
              padding: SPACING, 
              marginBottom: SPACING, 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: 20, 
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 10
              },
              shadowOpacity: 1,
              shadowRaduis: 20,
              opacity,
              transform: [{scale}]
              }}>
                    <View>
                      <Text style={{fontSize : 22, fontWeight: '700'}}>{item.word} — {item.arTranslation}</Text>
                      <Text style={{fontSize: 18, opacity: .7}}>{item.enDefinition}</Text>
                      <Text style={{fontSize: 18, fontStyle: 'italic'}}>{item.example}</Text>
                      <Text style={{fontSize: 14, textAlign: 'right'}}>Lvl. {item.level}</Text>
                      <Text style={{fontSize: 14, color: '#0099cc', textAlign: 'right'}}>{new Date(item.dateAdded).toDateString()}</Text>
                    </View>
                  </Animated.View>
          }}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 5,
    margin: 5,
  },
  header: {
    fontSize: 30,
    margin: 5,
  },
  scrollView: {
    backgroundColor: '#ffd002',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffd002',
    paddingTop: 40,
    // alignItems: 'center',  // Center horizontally
    // justifyContent: 'flex-start', // Start from the top
    // marginTop: StatusBar.currentHeight || 0
  },
  imageContainer: {
    flex: 0.5,
    backgroundColor: '#ffd002',
    alignItems: 'center',  // Center horizontally
  },
  logo: {
    width: 300, // Adjust this width as needed
    height: 200,
    resizeMode: 'center',
  },
  welcome: {
    fontFamily: 'serif',
    color: '#080808',
    fontSize: 20,
    paddingBottom: 20,
  },
  text:{
    height: '100%',
    width: '75%',
    fontSize: 15,
    color:'black'
  },
  itemStyle: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '75%',
    flex: 1,
    margin: 5,
    borderRadius: 20,
  },
  itemText: {
    color: 'black',
    fontSize: 30,
    margin: 10,
  }
});

export default WordsView