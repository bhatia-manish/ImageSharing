import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Image,Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import logo from './assets/logo.png'
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';


export default function App() {
  const [selectedImage,setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async()=> {
    let persmissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if(persmissionResult.granted == false){
      alert("Permission to access camera roll is required");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    
    if(pickerResult.cancelled == true){
      return;
    }

    if(Platform.OS == 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({localUri: pickerResult.uri,remoteUri});
    }else{
      setSelectedImage({localUri : pickerResult.uri,remoteUri:null});
    }
  };

  let openShareDialogAsync = async()=>{
    if(!(await Sharing.isAvailableAsync())){
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);o
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }

  if(selectedImage !== null){
    return (
      <View style={styles.container}>
        <Image
          source={{uri : selectedImage.localUri}}
          style = {styles.thumbnail}>
        </Image>
        <TouchableOpacity onPress = {openShareDialogAsync} style={styles.button}>
          <Text style = {styles.buttonText}>Share This Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} /> 
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!
      </Text>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    width:305,
    height:159,
    marginBottom:10,
  },
  instructions:{
    color : '#888',
    fontSize:18,
    marginHorizontal:15,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
