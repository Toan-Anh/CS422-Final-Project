import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal
} from 'react-native';

import { Container, Content, Form, Item, Input, Header, Title, ListItem, List, InputGroup, Icon, Button, Body, StyleProvider, getTheme } from 'native-base';
import { Actions } from 'react-native-router-flux';

import * as firebase from 'firebase';
import variables from '../../../native-base-theme/variables/platform';
import CustomizedActivityIndicator from '../../modules/CustomizedActivityIndicator';

class LogInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
        }

        this._logIn = this._logIn.bind(this);
    }

    render() {
        var content = this.state.loading ?
            (<View style={{
                flex: 1,
                alignSelf: 'stretch',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <CustomizedActivityIndicator />
            </View>) : (
                <View>
                    <List>
                        <ListItem>
                            <InputGroup>
                                <Icon name="md-person" style={{ color: variables.toolbarDefaultBg }} />
                                <Input
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                    placeholder={"Email Address"} />
                            </InputGroup>
                        </ListItem>
                        <ListItem>
                            <InputGroup>
                                <Icon name="md-unlock" style={{ color: variables.toolbarDefaultBg }} />
                                <Input
                                    onChangeText={(text) => this.setState({ password: text })}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    placeholder={"Password"} />
                            </InputGroup>
                        </ListItem>
                    </List>
                    <Button block style={{ backgroundColor: variables.toolbarDefaultBg }} onPress={this._logIn}>
                        <Text style={{ color: 'white' }}> Log in </Text>
                    </Button>
                </View>
            );
        return (
            <StyleProvider style={getTheme(variables)}>
                <Container>
                    <Header>
                        <Body>
                            <Title>Login</Title>
                        </Body>
                    </Header>
                    <Content contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }}>
                        {content}
                    </Content>
                </Container>
            </StyleProvider>
        )
    }

    _logIn() {
        this.setState({ loading: true });
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((a) => {
                Actions.mainscreen();
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode || errorMessage) {
                    console.log('errorCode', errorCode);
                    console.log('errorMessage', errorMessage);
                    this.setState({ loading: false });
                    alert(errorMessage);
                    //this._alertError(errorMessage);
                }
            });
    }
}

module.exports = LogInScreen;