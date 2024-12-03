import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
  RefreshControl
  } from 'react-native';
import axios from "axios";
import { ngrokServer } from '../../server/config';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');
const SPACING = 20;
const ITEM_SIZE = 70 + SPACING * 3;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Function to handle the pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true);

    fetchData();

    // Once the action is complete, set refreshing to false to stop the loading indicator
    setRefreshing(false);
  };
  
  const fetchData = async () => {
    try {
      const usersResponse = await axios.get(`${ngrokServer}/users/all`);
      if (usersResponse.status === 200) {
        setUsers(usersResponse.data.filter(user => !user.sudo));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteConfirm = (_id) => {
    Alert.alert(
      'ARE YOU SURE?',
      'This action is IRREVERSIBLE. Are you sure you want to delete this account FOREVER?',
      [
        {
          text: 'Yes, DELETE',
          onPress: () => terminate(_id), // Action to execute when 'OK' is pressed.
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'), // Action to execute when 'Cancel' is pressed.
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  const terminate = async (_id) => {
      try {
        await axios.delete(`${ngrokServer}/users/delete/${_id}`)
        .then(fetchData());
        return { success: true, message: 'User deleted successfully' };
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error; // Rethrow the error or handle it as needed
      }
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;
  return (
    <>
      <View style={{flex: 1, backgroundColor: '#ffd002'}}>
        <Animated.FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={users}
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
                      <Text style={{fontSize : 22, fontWeight: '700'}}>{item.first_name}{item.middle_name ? ' ' + item.middle_name + ' ' : ' '}{item.last_name}</Text>
                      <TouchableOpacity onPress={() => deleteConfirm(item._id)} style={{
                        alignSelf: 'center',
                      }}
                      >
                        <Feather 
                        name={'trash'}
                        size={25}
                        color={'red'}
                        />
                      </TouchableOpacity>
                      </View>
                      <Text style={{fontSize: 18, opacity: .7}}>ID: {item.username}</Text>
                      {/* <Text style={{fontSize: 18, fontStyle: 'italic'}}>{item.example}</Text>
                      <Text style={{fontSize: 14, textAlign: 'right'}}>Lvl. {item.level}</Text> */}
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

export default Users