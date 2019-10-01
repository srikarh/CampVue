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
  Image,
} from 'react-native';

import chaticon from '.././assets/icons/Chat.png';
import announceicon from '.././assets/icons/Announcements.png';
import eventsicon from '.././assets/icons/Events.png';

export default class campPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`
  });

  constructor(props) {
    super(props);
    this._getCamp();
    //camp = JSON.parse(camp);
    this.state = {
      camp:'',
      imgsrc:'https://s3.amazonaws.com/campvue-userfiles-mobilehub-1059875972/public/example-image.png',
      imgLoaded:false
    };

  }

async _getCamp() {
  let camp = await AsyncStorage.getItem('camp');
  camp = JSON.parse(camp);
  //let imgUrl = await Storage.get('photos/42.jpg',{ level: 'public' });
  this.setState({
    camp: camp, //imgsrc:imgUrl
    });
  //console.log(this.state.imgsrc);
}

  render() {
    return (
      <View style={styles.container}>
        <Text> {this.state.camp.CampDescription} </Text>
        
        //<Image source={{uri:this.state.imgsrc}} style={{width: 100, height: 100}} />
        <Button title='Gallery' onPress={this._gotoGallery.bind(this)} />
        <Button title='Participants' onPress={this._gotoParticipants.bind(this)} />
        <Button title='Chat' onPress={this._gotoChat.bind(this)} />
        <Button title='Events' onPress={this._gotoEvents.bind(this)} />
        <View style={{flex: 1, flexDirection: 'row', backgroundColor:'#8A080A',}}>
        <Image source={chaticon} style={{width: 120, height: 120, backgroundColor:'#8A080A',}}/>
        <Image source={announceicon} style={{width: 120, height: 120, backgroundColor:'#8A080A',}}/>
        <Image source={eventsicon} style={{width: 120, height: 120, backgroundColor:'#8A080A',}}/>
        </View>
      </View>
    );
  }

  _gotoEvents() {
    this.props.navigation.navigate('events');
  }
  _gotoParticipants() {
    this.props.navigation.navigate('Participants');
  }
  _gotoGallery()
  {
    this.props.navigation.navigate('Gallery');
  }

  _gotoChat()
  {
    this.props.navigation.navigate('ChatPage');
  }
}

const styles = StyleSheet.create({
  container:{
  },
  
});