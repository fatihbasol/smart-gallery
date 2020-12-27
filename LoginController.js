import React, {Component} from 'react';
import {
  Image, KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import firebase from 'firebase';


import GDrive from 'react-native-google-drive-api-wrapper';
import LoadingDialog from './src/Utils/LoadingDialog';
import Button from 'react-native-paper/src/components/Button';
import Dialog, {DialogContent, ScaleAnimation} from 'react-native-popup-dialog';
import {DotIndicator} from 'react-native-indicators';

const apiKey = 'AIzaSyDZb_8E9CbNbaeVEdtMi54nt8mKglmUEDc';

export default class LoginController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      accessToken: '',
      responseData: [], // Gdrive ile çekilen dosya bilgileri
      loggedIn: false,
      images: [],	 	 // Çekilen dosyalar arasından image olanlar
      isImagesLoaded: false,
      resimSayac: 0,
    };
  }

  componentDidMount() {

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/cloud-platform'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '782164780681-b0l1j7qp4foct7u4ipkauh7m75sku37p.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
    });

    const firebaseConfig = {
      apiKey: 'AIzaSyB04i2qwQAAVqnyAbWQfUtnW0V_1pN8Dqc',
      authDomain: 'smart-gallery-80e66.firebaseapp.com',
      databaseURL: 'https://smart-gallery-80e66.firebaseio.com',
      projectId: 'smart-gallery-80e66',
      storageBucket: 'smart-gallery-80e66.appspot.com',
      messagingSenderId: '782164780681',
      appId: '1:782164780681:web:e2f624b7abcd4155ea8858',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);


  }

  checkUser = async (userInfo) => {
    let images = this.state.images;
    firebase.database().ref('UsersList/' + userInfo.user.id).once('value', function(snapshot) {
      console.log('exists-----' + snapshot.exists());

      if (snapshot.exists()) {

        console.log('kayıt var unstate-' + images);
        firebase.database().ref('UsersList/' + userInfo.user.id).update({
          images: images,
        });

      } else {
        console.log('kayıt yok');
        firebase.database().ref('UsersList/' + userInfo.user.id).set({ // databasede ilk veriyi açacak
          name: userInfo.user.givenName,
          surname: userInfo.user.familyName,
          images: images,
        }).then((data) => {
          //success callback
          console.log('set data: ----' + data);
        }).catch((error) => {
          console.log('error ', error);
        });
      }

    });
  };
  sendImage = async (url) => {
    let body = JSON.stringify({
      requests: [
        {
          features: [
            {type: 'LABEL_DETECTION', maxResults: 1},
          ],
          image: {
            source: {
              imageUri: url,
            },
          },
        },
      ],
    });
    let response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDZb_8E9CbNbaeVEdtMi54nt8mKglmUEDc', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    });
    let responseJson = await response.json().then((response) => {
      return response['responses'][0]['labelAnnotations'][0].description ? response['responses'][0]['labelAnnotations'][0].description : '';
    });
    console.log(responseJson);  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return responseJson;
  };
  getImageUrl = async () => {
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    await asyncForEach(this.state.images, async (item) => {
      await
        fetch(item.source['embedLink'], {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GDrive.accessToken}`,
          },
        }).then((res) => {  // fetch işleminden sonra gelen veri : res
          return res.json(); // res datasını jsona çevirdik
        }).then( (data) => {
          item.embedLink = data['thumbnailLink'];
          console.log('asdasdasd ' + item.embedLink['uri']);
        });

    });

    const sIn  = setInterval(() => {
      this.setState(() => ({isImagesLoaded: true}));
      clearInterval(sIn);
      this.props.navigation.navigate('Home', {
        images: this.state.images,
        isLoggedIn: this.state.loggedIn,
        currentUser: this.state.userInfo,
        navigation:this.props.navigation
      });
    }, 1000);

  };
  getAllImageFromResponseData = () => {
    //DOSYA BİLGİLERİ CEKİLECEK
    const data = this.state.responseData;
    this.state.images = [];
    for (let item of data) {
      console.log(item.id);
      this.state.images.push({
        source: {
          embedLink: `https://www.googleapis.com/drive/v2/files/${item.id}?projection=FULL`,
          uri: ``,
        },
        id: item.id,
      });
    }
  };
  fetchData = async () => {
    //DOSYA BİLGİLERİ CEKİLECEK
    this.state.responseData = await GDrive.files.list({key: apiKey, q: 'mimeType = "image/jpeg"'}).then((response) => {
      return response.json().then((response) => {
        console.log("Gelen dosya: "+response['files']);
        return response['files'];
      });
    });

  };
  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log(userInfo);
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        console.log('user has not signed in yet');
        this.setState({loggedIn: false});
      } else {
        // some other error
        console.log('some other error happened');
        this.setState({loggedIn: false});
      }
    }
  };
  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({userInfo: null, loggedIn: false}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }

  };
  firebaseGoogleLogin = async () => {
    try {
      // add any configuration settings here:
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      console.log(userInfo);

      this.setState(() => ({userInfo: userInfo, loggedIn: true}));

      const token = await GoogleSignin.getTokens();

      GDrive.s
      GDrive.init();
      console.log('Drive is Initialized? ' + GDrive.isInitialized());
      console.log('Token:' + token.accessToken);

      console.log('987987987-' + userInfo.user.id);

      await this.fetchData().then(async () => {
        await this.getAllImageFromResponseData();
        console.log('responsedata');
      }).then(async () => {
        await this.getImageUrl();
      }).then(async () => {
        console.log('*--');
        await this.checkUser(userInfo);
      });

      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken, token.accessToken);
      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);


      // firebase id kullanılmayacak googledan gelen id kullanılacak

      //console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (error) {

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        console.log('operation (f.e. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated');
      } else {
        // some other error happened
        console.log(error);
        console.log('some other error happened');
      }
    }


  };

  render() {
    return (

      <View style={styles.container}>

        {this.state.loggedIn && <Dialog
          visible={!this.state.isImagesLoaded}
          dialogAnimation={new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })}
        >
          <DialogContent style={{maxHeight: 140}}>
            {this.state.resimSayac !== 0 && <View>
              <Text style={{
                margin: 8,
                color: '#292b2c',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}>{this.state.responseData.length} resim bulundu</Text>
              <Text style={{margin: 14, color: '#292b2c', fontWeight: 'bold'}}>{this.state.resimSayac} resim senkronize
                edildi.</Text>
            </View>}
            {this.state.resimSayac === 0 && <Text style={{
              marginTop: 8,
              marginBottom: 4,
              color: '#292b2c',
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
            }}> Resimler Bekleniyor...</Text>}

            <DotIndicator color={'#0275d8'}/>
          </DialogContent>
        </Dialog>}

        <View style={styles.headBackground}/>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Gallery App</Text>
          <Text style={styles.logoDescription}>Smart & Usable</Text>
        </View>
        <ScrollView>
          <View style={styles.loginArea}>
            <Text style={styles.loginAreaTitle}>Your Smart Gallery Application</Text>
            <Text style={styles.loginAreaDescription}>Sign In Your Account</Text>
            <GoogleSigninButton
              style={{width: 230, height: 60, marginTop: 80, marginBottom: 40, alignSelf: 'center'}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this.firebaseGoogleLogin}
              disabled={this.state.isSigninInProgress}/>
            <Button title="DiğerSyafayaGit"
                    onPress={() => this.props.navigation.navigate('Tags', {images: this.state.images})}/>
          </View>
        </ScrollView>
        <View style={styles.signUpArea}>
          <Text style={styles.signUpDescription}>Giriş Sorunları Mı Yaşıyorsun ?</Text>
          <TouchableOpacity>
            <Text style={styles.signUpText}>İletişime Geç</Text>
          </TouchableOpacity>
        </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    alignItems: 'center',
    position: 'absolute',
    zIndex: 999,
    marginTop: 'auto',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#222831',
    paddingVertical: 80,
  },
  headBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 300,
    width: '100%',
    backgroundColor: '#4885ed',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#f0f0f0',
  },
  logoDescription: {
    color: '#f0f0f0',
  },
  loginArea: {
    marginVertical: 40,
    marginHorizontal: 40,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 6,
    borderColor: '#ffffff',
    borderWidth: .4,
    shadowColor: '#000',
    shadowOpacity: .8,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 12,
  },
  loginAreaTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#3e3e3e',
  },
  loginAreaDescription: {
    color: '#3e3e3e',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  signUpArea: {
    alignItems: 'center',
  },
  signUpDescription: {
    color: '#ffffff',
  },
  signUpText: {
    color: '#ffffff',
  },

});

