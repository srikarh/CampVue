import Amplify, {API, Storage} from 'aws-amplify';
import awsmobile from './aws-exports';
import React, { Component } from 'react';

import {
  ImageBackground,
  Text,
  StyleSheet,
  TextInput,
  NumberInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal, 
  TouchableHighlight,
} from 'react-native';

import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  View,
} from 'react-native';

import { createSwitchNavigator, StackNavigator, createStackNavigator } from 'react-navigation';

import logoname from './assets/icons/logo.png'
import backgroundname from './assets/icons/Background.jpg'

import ImageGallery from './components/ImageGallery';
import Chat from './components/Chat';
import homePage from './components/homePage';
import createCamp from './components/createCamp';
import campPage from './components/campPage';
import Participants from './components/Participants';
import addParticipant from './components/addParticipant';
import Events from './components/Events';
export default class App extends React.Component {

  constructor(props)
  {
    super(props);
    Amplify.configure(awsmobile);
  }

  render() {
    return <RootStack />;
  }
}



/*
class homePage extends Component {
  static navigationOptions = {
    title: 'Camps',
  };

   constructor(props) {
    super(props);
    this._getCamps();
  }

async _getCamps() 
{
  let userToken = await AsyncStorage.getItem('vueid');
  let myInit = {
        body: {AccountId:userToken},
        headers: {}
        }

   let camps = await API.post('CampVue', '/getcamps', myInit);
}

_goAuth() 
  {
    this.props.navigation.navigate('auth');
  }

  async _clearAuth()
  {
      await AsyncStorage.removeItem('vueid');
  }

  async _createAccount() 
  {
    let myInit = {
      body: {Phone:"9255498280"},
      headers: {}
    }

    await API.post('CampVue', '/createrequest', myInit);
  }

  _gotoCamp() 
  {
     this.props.navigation.navigate('createcamp');
  }
  render() {
    return (
      <View style={styles.container}>
      <Button title="Authenticate" onPress={this._goAuth.bind(this)} />
      <Button title="Clear userToken" onPress={this._clearAuth.bind(this)} />
      <Button title="Test API" onPress={this._createAccount.bind(this)} />
      <Button title="Create A Camp" onPress={this._gotoCamp.bind(this)} />
      </View>
    );
  }
  
}
*/
class authenticate extends Component {
    constructor(props) {
    super(props);
    this._verifyAccount();
  }

  async _verifyAccount() {
    let userToken = await AsyncStorage.getItem('vueid');
    if (userToken == null) {
      this.props.navigation.navigate('activate');
    }
    else {

      let myInit = {
      body: {AccountId:userToken},
      headers: {}
      }

      let postResponse = await API.post('CampVue', '/verifyaccount', myInit);
      if(postResponse != null && postResponse == userToken)
      {
        this.props.navigation.navigate('home');
      }
      else
      {
         await AsyncStorage.removeItem('vueid');
         this.props.navigation.navigate('activate');
      }
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

class activation extends React.Component {
  static navigationOptions = {
    title: 'Activation',
  };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: ''
    };
    //this.handleLogin = this.handleLogin.bind(this);
  }

async _sendMessage() {
      let myInit = {
      body: {Phone:this.state.phoneNumber},
      headers: {}
    }

    let accountId = await API.post('CampVue', '/createrequest', myInit);
    if(accountId != null) {
      AsyncStorage.setItem('vueid', accountId);
      this.props.navigation.navigate('verify');  
    }
    else {
      Alert.alert('Error','Oops! Please retry');
    }
}

  handleLogin() {
    if (this.state.phoneNumber.length == 10)
    {

        Alert.alert(
          'Verification',
          'A SMS message will be sent to ' + this.state.phoneNumber + ' for verification',
      [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this._sendMessage()},
      ],
        { cancelable: false }
        );
    }

    else 
    {
          Alert.alert('Error', 'Your phone number seems a bit off!');
    }
  }

  render() {
    return (
      <ImageBackground
        source={backgroundname}
        style={styles.backgroundImage}>
        <Image
          style={{
            width: 300,
            height: 75,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '15%',
          }}
          source={logoname}
        />

        <Text style={styles.text}></Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Phone Number"
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={phoneNumber => this.setState({phoneNumber})}
          value = {this.state.phoneNumber}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleLogin.bind(this)}>
          <Text style={styles.textSmall}> Get Started </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

class verification extends React.Component {
  static navigationOptions = {
    title: 'Verification',
  };
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: '',
      displayName: '' 
    };
  }

  
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Verification Code"
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={verificationCode => this.setState({verificationCode})}
          value = {this.state.verificationCode}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Enter Your Name"
          maxLength={20}
          onChangeText={displayName => this.setState({displayName})}
          value = {this.state.displayName}
        />

        <Button title="Verify" onPress={this._gotoVerify.bind(this)} />
    
       
      </View>
    );
  }

 async _gotoVerify()
    {
      if (this.state.verificationCode.length == 4  && this.state.displayName.length > 0) 
      {
        let accountId = await AsyncStorage.getItem('vueid');
  
        let myInit = {
        body: 
        {
          ActivationCode:this.state.verificationCode,
          Name:this.state.displayName,
          AccountId:accountId
        },
        headers: {}
        }

        let returnValue = await API.post('CampVue', '/activateaccount', myInit);
        if (returnValue != null && returnValue != '0') {
            await AsyncStorage.setItem('vuename', returnValue);
            this.props.navigation.navigate('home');  
          }
          else {
            Alert.alert("Error", "Please Retry");
            await AsyncStorage.removeItem('vueid');
            this.props.navigation.navigate('auth'); 
          }
      }
      else
      {
        Alert.alert('Error', 'Check Your Verification Code or Name Again');
      }
    
  }
}



const VerifyStack = createStackNavigator ({

Profile: {
screen:verification
}
  })

const AuthStack = createStackNavigator ({
Profile: {
  screen:authenticate
}
  })

const HomeStack = createStackNavigator({
  campList: {
    screen:homePage
  },
  CampPage: {
    screen:campPage
  },
  events: {
    screen:Events
  },
  Gallery: {
    screen:ImageGallery
  },
  ChatPage: {
    screen:Chat
  },
  createCamp: {
    screen:createCamp
  },
  Participants: {
    screen: Participants
  },
  addParticipant: {
    screen:addParticipant
  }
  })

const RootStack = createSwitchNavigator(
  {
    activate: activation,
    verify: VerifyStack,
    auth: AuthStack,
    home: HomeStack,
  },
  {
    initialRouteName: 'auth',
  }
);

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#8A080A',
  },
  backgroundImage: {
    flex: 1,
    position: 'relative',
  },
  text: {
    color: '#000000',
    fontSize: 50,
    backgroundColor: 'rgba(255,255,255,0)',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: '10%',
    marginBottom: '15%',
    fontFamily: 'Arial',
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
  button: {
    alignItems: 'center',
    padding: 10,
    marginTop: '5%',
    width: '50%',
    height: 70,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#8a2be2',
    borderRadius: 100,
  },
  textSmall: {
    color: '#ffffff',
    fontSize: 20,
    backgroundColor: 'rgba(255,255,255,0)',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop:'6%'
  },
});
