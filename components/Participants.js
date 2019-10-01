import Amplify, {API, Storage} from 'aws-amplify';
import React, { Component } from 'react';

import {
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  View,
} from 'react-native';

import { MaterialIcons } from '.././node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf'
import { Font, AppLoading } from 'expo'

import {FlatList} from "react-native";
import { List, ListItem } from "react-native-elements";


export default class Participants extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
   title: "Participants",
   headerRight: <Button title="Add Participant" onPress={()=>{ navigation.navigate('addParticipant'); }} />,
 })

constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      data: [],
      error: null,
      refreshing: false,
      fontLoaded: false,
    };

  }

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  async componentDidMount() {
    try{
    await Font.loadAsync({
        FontAwesome,
        MaterialIcons
      });
  }
  catch(error)
  {
    console.log('error loading icon fonts', error);
  }
    this.setState({ fontLoaded: true });

    this.makeRemoteRequest();
  }

  async makeRemoteRequest() {
      let camp = await AsyncStorage.getItem('camp');
      camp = JSON.parse(camp);
      CampId = camp.CampId;
      let myInit = {
        body: {CampId:CampId},
        headers: {}
        }

      
      let campAccounts = await API.post('CampVue', '/getparticipants', myInit);

      this.setState({
          data: campAccounts,
          error: campAccounts.error || null,
          loading: false,
          refreshing: false
        });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  _gotoaddParticipant() {
    this.props.navigation.navigate('addParticipant');
  }

  
  render() {
    if (this.state.fontLoaded) {
    return (      
        <FlatList
          roundAvatar
          data={this.state.data}
          renderItem={({ item }) => (
            //<TouchableOpacity onPress={() => this.props.navigation.navigate()}>
            <ListItem
              title={`${item.Name}`}
              subtitle={item.Role}
              avatar={{ uri: 'https://randomuser.me/api/portraits/thumb/men/42.jpg' }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
            //</TouchableOpacity>
          )}
          keyExtractor={item => item.AccountId}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
        //<Button title='Participants' onPress={this._gotoaddParticipant.bind(this)} />
    );
   }
   else
   {
    return <AppLoading />;
   }

  }
}
