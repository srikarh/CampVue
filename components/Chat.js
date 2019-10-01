import React from 'react';
import Amplify, {API, Storage} from 'aws-amplify';
import { StyleSheet, Text, View,KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import uuidv4 from 'uuid'
import TimerMixin from 'react-timer-mixin';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      AccountId: ''
    };
    
  }

async componentWillMount() {
  TimerMixin.setTimeout.call(this, () =>{ 
                this.getData()
            },1000);
  }
async getData() {
  let accountId = await AsyncStorage.getItem('vueid');
    let camp = await AsyncStorage.getItem('camp');
    camp = JSON.parse(camp);
    CampId = camp.CampId;
    let myInit = {
        body: {CampId:CampId},
        headers: {}
        }

    let messageArray = await API.post('CampVue', '/getmessages', myInit);
    console.log(messageArray);
    this.setState({ messages:messageArray, AccountId:accountId});
}
  
  helpIdGenerator = () => {

    const uuidv4 = require('uuid/v4')
	return uuidv4();

}
async onSend(messages = []) {
    
    let camp = await AsyncStorage.getItem('camp');
    camp = JSON.parse(camp);
    CampId = camp.CampId;
    let Name = await AsyncStorage.getItem('vuename');
    
    let myInit = {
      body: {CampId:CampId, Name:Name, messageArray:messages},
      headers: {}
    }
    await API.post('CampVue', '/sendmessage', myInit);
  
    //this.setState((previousState) => ({
     // messages: GiftedChat.append(previousState.messages, messages),
    //}));
  }


  render() {
    return (
	
       <GiftedChat 
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        inverted={true}
        user={{
          _id: this.state.AccountId 
        }}
      />
	
    );
  }
}


