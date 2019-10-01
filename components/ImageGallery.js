import React, { Component } from 'react';
import {Dimensions} from 'react-native'
import Amplify, {Storage} from 'aws-amplify';

import {
  StyleSheet,
  Image,
  Alert,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';

import ImageElement from './ImageGallery'

export default class ImageGallery extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = {
				modalVisible:false,
				modalImage:'https://s3.amazonaws.com/campvue-userfiles-mobilehub-1059875972/public/example-image.png',
				images:[],
				imgLoaded:false
			};
		 this.getImages();
	}

	

	async getImages()
	{
		let result = await Storage.list('photos/', { level: 'public' });
		let keysArray = [];
		let len = result.length;
		for(i=0;i<len;i++)
		{
			y = result[i];
			if(y.size>0)
			{
				//console.log(y.key);
				let imgURI = await Storage.get(y.key, { level: 'public' });
				//console.log(imgURI);
				keysArray.push(imgURI);
			}
		}
		this.setState({images:keysArray, imgLoaded:true});
		
		//console.log(keysArray);
  			//.then(result => console.log(result))
  			//.catch(err => console.log(err));
  			
	}
	

	setModalVisible(visibility, imageKey)
	{
			this.setState({modalImage:this.state.images[imageKey], modalVisible:visibility});
	}

	getImage()
	{
		this.state.modalImage;
	}

	render()
	{
		if(this.state.imgLoaded)
		{

		return (
			<View style={styles.container}>
			{
			this.state.images.map((val, key) => (
					<View key={key} style={styles.imagewrap}>
					<Image key={key} source={{uri:val}} style={styles.image}/>
					</View>
				)
				)
			}
			</View>
			);
		}
		else
		{
		return (
      		<View style={styles.container}>
        		<ActivityIndicator />
        		<StatusBar barStyle="default" />
      		</View>
    		);
		}
	}
}

const styles = StyleSheet.create({
	container:
	{
		flex:1,
		flexDirection:'row',
		flexWrap:'wrap',
		backgroundColor:'#eee',
	},
	imagewrap:{
		margin:2,
		padding:2,
		height:(Dimensions.get('window').height/4) - 12,
		width:(Dimensions.get('window').width/2) - 4,
		backgroundColor:'#fff'
	},
	image:
	{
		flex:1,
		width:null,
		alignSelf:'stretch',
	}
  });