import React, {Component} from 'react';
import Auth0 from 'react-native-auth0';
import {Button, View, TextInput, Modal, Text, Image} from 'react-native';

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      phone: '',
      code: '',
      codeRequestSent: false,
      LogginIn: false,
      isLoggedin: false,
      image: '',
      accessToken: '',
      idToken: '',
    };
    this.loginUser = this.loginUser.bind(this);
    this.getLoginCode = this.getLoginCode.bind(this);
  }
  componentDidMount() {
    this.auth0 = new Auth0({
      domain: 'YOUR_DOMAIN',
      clientId: 'YOUR_APP_ID',
    });
  }

  getLoginCode() {
    this.setState({LogginIn: true});
    this.auth0.auth
      .passwordlessWithSMS({
        phoneNumber: this.state.phone,
      })
      .then(() => {
        this.setState({codeRequestSent: true});
      })
      .catch(console.error);
  }

  loginUser() {
    this.auth0.auth
      .loginWithSMS({
        phoneNumber: this.state.phone,
        code: this.state.code,
      })
      .then(response => {
        console.log(response);
        this.setState({
          image: response.picture,
          accessToken: response.accessToken,
          idToken: response.idToken,
          isLoggedin: true,
        });
      })
      .catch(console.error);
  }
  render() {
    const {
      codeRequestSent,
      LogginIn,
      code,
      isLoggedin,
      accessToken,
      idToken,
    } = this.state;
    return (
      <View>
        {!codeRequestSent ? (
          <>
            <TextInput
              style={{
                borderColor: 'blue',
                borderWidth: 1,
                borderRadius: 5,
                height: 40,
                padding: 10,
              }}
              placeholder="Enter Phone"
              onChangeText={text => this.setState({phone: text})}
            />
            <Button
              style={{padding: 10, marginBottom: 5}}
              title={LogginIn ? 'Processing...' : 'Get Code'}
              onPress={this.getLoginCode}
            />
          </>
        ) : (
          <>
            <TextInput
              style={{
                borderColor: 'blue',
                borderWidth: 1,
                borderRadius: 5,
                height: 40,
                padding: 10,
                marginBottom: 5,
                marginTop: 30,
              }}
              placeholder="Enter Code"
              value={code}
              onChangeText={text => this.setState({code: text})}
            />
            <Button title="Login" onPress={this.loginUser} />
            <View style={{flex: 1}}>
              <Modal transparent={true} visible={isLoggedin}>
                <View style={{backgroundColor: '#000000aa', flex: 1}}>
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      margin: 50,
                      padding: 40,
                      borderRadius: 10,
                    }}>
                    <Text> Login Successful 👍🏼🎉 {'\n'}</Text>

                    <Text> Here are your details:{'\n'}</Text>
                    <Text>
                      AccessToken: {' ' + accessToken}
                      {'\n'}
                    </Text>
                    <Text>
                      IDToken:
                      {' ' + idToken.length > 200
                        ? `${idToken.substring(0, 200)}...`
                        : idToken}
                      {'\n'}
                    </Text>
                    <Button title="Logout" />
                  </View>
                </View>
              </Modal>
            </View>
          </>
        )}
      </View>
    );
  }
}

export default Auth;
