import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  Image,
  View,
  StatusBar,
  Dimensions,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
  } from 'react-native';
import axios from "axios";
import { ngrokServer } from '../../server/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('screen');
const SPACING = 20;
const ITEM_SIZE = 70 + SPACING * 3;
const BG_IMG = 'https://images.unsplash.com/photo-1597847511602-f6213e29d13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80';

const MyWords = () => {
  const [words, setWords] = useState([]);
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const soundObject = new Audio.Sound(); // Initialize the sound object
  const [loading, setLoading] = useState(true); // State to track loading
  const [loaded] = useFonts({
    NameFont: require('../../assets/fonts/RhumaSineraRegular.ttf'),
    Kahire: require('../../assets/fonts/Cairo-Bold.ttf'),
    KahireRegular: require('../../assets/fonts/Cairo-Regular.ttf'),
    Gelasio: require('../../assets/fonts/Gelasio-Regular.ttf'),
    GelasioBold: require('../../assets/fonts/Gelasio-Bold.ttf'),
    GelasioMedium: require('../../assets/fonts/Gelasio-Medium.ttf'),
    Mono: require('../../assets/fonts/VT323-Regular.ttf'),
  });

  useEffect(() => {
    const fetchUserWords = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = JSON.parse(userInfoString);
        const userId = userInfo.userID;
        const response = await axios.get(`${ngrokServer}/words/user-words/`, { params: { userId } });
        // Fetch audio URLs for each word
        const wordsWithAudio = await Promise.all(
          response.data.map(async (wordData) => {
            const audioResponse = await axios.get(
              `https://api.dictionaryapi.dev/api/v2/entries/en/${wordData.word}`
            );
            // const audioURL = audioResponse.data[0]?.phonetics[0]?.audio || '';
            const audioURL = findValidAudioURL(audioResponse.data[0]);
            return {
              ...wordData,
              wordSound: audioURL,
            };
          })
        );

        setWords(wordsWithAudio);
        setLoading(false); // Mark loading as false when data is fetched
      } catch (error) {
        console.error('Error fetching user words:', error);
      }
    };

    fetchUserWords();

    const StudentName = async () => {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoString);
      const userName = userInfo.userNAME;
      console.log(userInfo)
      setName(userName)
    };
    StudentName();
  }, []);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const pronounce = async (wordSound) => {
    try {
      await soundObject.unloadAsync(); // Unload previous audio if any
      await soundObject.loadAsync({ uri: wordSound }); // Load the new audio
      await soundObject.playAsync(); // Play the audio
    } catch (error) {
      console.error('Error playing sound:', error);
      console.log(wordSound)
    }
  };

  // Function to find the first valid audio URL in the phonetics array
  const findValidAudioURL = (wordData) => {
    for (const phonetic of wordData.phonetics) {
      const audioURL = phonetic.audio;
      if (audioURL && audioURL.trim() !== '') {
        return audioURL;
      }
    }
    return ''; // Return an empty string if no valid audio URL found
  };
  if (!loaded) {
    return (
      <>
          <View style={{
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            backgroundColor: 'rgba(47, 46, 41, 0.79)'
          }}>
            <ActivityIndicator 
            size="large" color="white" 
            style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
            }} 
            />
            <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'white'
              }}
            >
            Loading App
            </Text>
          </View>
      </>
    )
  } else {
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#ffd002'}}>
        <Image 
          source={{uri: BG_IMG}}
          style={StyleSheet.absoluteFillObject}
          blurRadius={5}
        />
        {/* Show activity indicator while loading */}
        {loading ? (
          <>
          <View style={{
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            backgroundColor: 'rgba(47, 46, 41, 0.79)'
          }}>
            <ActivityIndicator 
            size="large" color="white" 
            style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
            }} 
            />
            <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'white'
              }}
            >Please wait,
            </Text>
            <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'white'
              }}
            >we're loading your vocabulary.
            </Text>
          </View>
          </>
        ) : (
        <>
        <View
          style={{
            backgroundColor: '#ffd002',
            height: 100,
            alignItems: 'center',
          }}
        >
        <Text
          style={{
            marginTop: '13%',
            textAlign: 'center',
            fontSize: 35,
            fontFamily: 'NameFont'
          }}
        >
        Welcome, {name}!
        </Text>
        </View>
          {/* Search bar */}
        <TextInput
          style={{
            backgroundColor: 'white',
            margin: SPACING,
            marginBottom: -5,
            padding: 10,
            borderRadius: 10,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          placeholder="Find a word..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        
        {!words.length && 
          <Text
          style={{
            width: '80%',
            borderStyle: 'dotted',
            borderWidth: 3,
            borderColor: 'black',
            padding: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.40)',
            alignSelf: 'center',
            textAlign: 'center',
            marginTop: '45%',
            fontSize: 22,
            fontFamily: 'Gelasio',
            color: 'black'
          }}
          >
            You have no words yet.{"\n"}Don't worry, with each lesson you take in Speak-E, teachers will add your new vocabulary to your account.
          </Text>
        }

        <Animated.FlatList
          // data={words}
          data={words.filter((word) =>
            word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.arTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.category.toLowerCase().includes(searchQuery.toLowerCase())
          )}
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
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'Kahire', fontSize : 22}}>{item.word} — {item.arTranslation}</Text>
                    <TouchableOpacity onPress={() => pronounce(item.wordSound)} style={{
                      alignSelf: 'center',
                    }}
                    >
                      <Feather 
                      name={'volume-2'}
                      size={25}
                      color={'black'}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={{fontFamily: 'Gelasio', fontSize: 16, opacity: .7, color: 'green'}}><Feather name={'book-open'} size={15} color={'black'}/> {item.enDefinition}</Text>
                  <Text style={{fontFamily: 'Gelasio', fontSize: 18, fontStyle: 'italic', color: '#0099cc'}}><Feather name={'chevrons-right'} size={15} color={'black'}/> {item.example}</Text>
                  <Text style={{fontSize: 14, color: 'black', textAlign: 'right', fontFamily: 'Mono'}}>#{item.category}</Text>
                </View>
              </Animated.View>
          }}
        />
        </>
        )}
      </View>
    </>
  )}
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'right',
  },
});


export default MyWords