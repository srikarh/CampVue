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
  Modal,
  TouchableHighlight ,
} from 'react-native';



export default class addParticipant extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
   title: "Add Participant",
 })

constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      Name: '',
      pickerSelection: '',
      pickerDisplayed: false
    };
}
async _addParticipant() {
  let camp = await AsyncStorage.getItem('camp');
  camp = JSON.parse(camp);
  let CampId = camp.CampId;

  let myInit = {
    body: 
    {
      CampId:CampId,
      Name:this.state.Name,
      Phone:this.state.phoneNumber,
      Role:this.state.pickerSelection
    },
    headers: {}
    }
      
  let value = await API.post('CampVue', '/addaccounttocamp', myInit);
  if(value == "Failed") {
    Alert.alert('Error', 'Participant is already in the camp');
  }
}
setPickerValue(newValue) {
    this.setState({
      pickerSelection: newValue
    })

    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      pickerDisplayed: !this.state.pickerDisplayed
    })
  }
render() {
    const pickerValues = [
      {
        title: 'Admin',
        value: 'Admin'
      },
      {
        title: 'Counselor',
        value: 'Counselor'
      },
      {
        title: 'Attendee',
        value: 'Attendee'
      }
    ]
    return (     
    <View style={styles.container}>
    <Text  style={styles.text}> Enter the the Participant phone number 
    and select their role(Attendee, Counselor, Admin) to add a camp participant.</Text>
      <TextInput
          style={styles.textInput}
          placeholder="Participant Phone Number"
          keyboardType="number-pad"
          maxLength={10}
          onChangeText={phoneNumber => this.setState({phoneNumber})}
          value = {this.state.phoneNumber}
      />
        <View style={styles.roleView}>
        <Text style={{fontSize: 14,}}>{this.state.Name}:{ this.state.pickerSelection }</Text>
        <Button onPress={() => this.togglePicker()} title={ "Select a Role" } />
        </View>
        <Modal visible={this.state.pickerDisplayed} animationType={"slide"} transparent={true}>
          <View style={{ margin: 20, padding: 20,
            backgroundColor: '#efefef',
            bottom: 20,
            left: 20,
            right: 20,
            alignItems: 'center',
            position: 'absolute' }}>
            <Text>Please pick a value</Text>
            { pickerValues.map((value, index) => {
              return <TouchableHighlight  key={index} 
                        onPress={() => this.setPickerValue(value.value)} 
                        style={{ paddingTop: 4, paddingBottom: 4 }}>
                                    <Text>{ value.title }</Text>
                </TouchableHighlight >
            })}

            
            <TouchableHighlight  onPress={() => this.togglePicker()} style={{ paddingTop: 4, paddingBottom: 4 }}>
              <Text style={{ color: '#999' }}>Cancel</Text>
            </TouchableHighlight >
          </View>
      </Modal>

      <TextInput
          style={styles.textInput}
          placeholder="Name"
          maxLength={30}
          onChangeText={Name => this.setState({Name})}
          value = {this.state.name}
      />
        <Button title="Add" onPress={this._addParticipant.bind(this)} />
    </View>
    );
   }
}

const styles = StyleSheet.create({
  container:{
    
  },

  roleView:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop: '10%',
    marginLeft:'2%',
    marginRight:'2%',
    
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
  text: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: '10%',
    marginLeft:'2%',
    marginRight:'2%',
    marginBottom: '5%',
    fontFamily: 'Arial',
  },
  
});
