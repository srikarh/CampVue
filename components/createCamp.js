import Amplify, {API, Storage} from 'aws-amplify';
import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
  TextInput,
  Alert,
  AsyncStorage,
  Button,
  View,
} from 'react-native';



export default class createCamp extends React.Component {
  static navigationOptions = {
    title: 'Camp Creation',
  };

  constructor(props) {
    super(props);
    this.state = {
      campName: '',
      campDescription: ''
    };
    
  }

_createCampPressed() 
{
  if (this.state.campName == '') {
    Alert.alert('Error', 'You did not name your camp!')
  }
  Alert.alert(
          'Create Camp',
          'A Camp Named ' + this.state.campName + ' will be created',
      [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this._createCamp()},
      ],
        { cancelable: false }
        );
}

async _createCamp() 
{
  let userToken = await AsyncStorage.getItem('vueid');
  let userName = await AsyncStorage.getItem('vuename');
  let myInit = {
      body: {AccountId:userToken, Name:userName, campName:this.state.campName, campDescription:this.state.campDescription},
      headers: {}
    }
    await API.post('CampVue', '/createcamp', myInit);
    this.props.navigation.navigate('campList');

}

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Camp Name"
          maxLength={30}
          onChangeText={campName => this.setState({campName})}
          value = {this.state.campName}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Camp Description(optional)"
          maxLength={500}
          onChangeText={campDescription => this.setState({campDescription})}
          value = {this.state.campDescription}
        />
        <Button title="Create Camp" onPress={this._createCampPressed.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
  },
  textInput: {
    height: 30,
    borderColor: 'black',
    borderBottomWidth: 1,
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
    fontSize: 25,
    color: '#000000',
  },
});
