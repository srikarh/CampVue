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


export default class homePage extends Component {
  static navigationOptions = ({ navigate, navigation }) => ({
   title: "Camps",
   headerRight: <Button title="Create Camp" onPress={()=>{ navigation.navigate('createCamp'); }} />,
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

  _gotoCamp() 
  {
     this.props.navigation.navigate('createcamp');
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

async _campPress(item) {
    stringItem = JSON.stringify(item)
    await AsyncStorage.setItem('camp', stringItem);
    this.props.navigation.navigate('CampPage', {title: item.CampName});
  };

  async makeRemoteRequest() {
      let userToken = await AsyncStorage.getItem('vueid');
      let myInit = {
        body: {AccountId:userToken},
        headers: {}
        }

      
      let camps = await API.post('CampVue', '/getcamps', myInit);
      //camps = camps.json();
      //Alert.alert(camps);
      this.setState({
          data: camps.results,
          error: camps.error || null,
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

  render() {
    if (this.state.fontLoaded) {
    return (      
        <FlatList
          roundAvatar
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this._campPress(item)}>
            <ListItem
              title={`${item.CampName}`}
              subtitle={item.CampDescription}
              avatar={{ uri: 'https://randomuser.me/api/portraits/thumb/men/42.jpg' }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.CampId}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
    );
   }
   else
   {
    return <AppLoading />;
   }

  }
}