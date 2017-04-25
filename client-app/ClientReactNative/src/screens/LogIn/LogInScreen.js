import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

import { Container, Content, Form, Item, Input, Header, Title, ListItem, List, InputGroup, Icon, Button, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';

import * as firebase from 'firebase';

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
                <ActivityIndicator size="large" />
            </View>) : (
                <View>
                    <List>
                        <ListItem>
                            <InputGroup>
                                <Icon name="ios-person" style={{ color: '#2874F0' }} />
                                <Input
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                    placeholder={"Email Address"} />
                            </InputGroup>
                        </ListItem>
                        <ListItem>
                            <InputGroup>
                                <Icon name="ios-unlock" style={{ color: '#2874F0' }} />
                                <Input
                                    onChangeText={(text) => this.setState({ password: text })}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    placeholder={"Password"} />
                            </InputGroup>
                        </ListItem>
                    </List>
                    <Button block primary onPress={this._logIn}>
                        <Text style={{ color: 'white' }}> Log in </Text>
                    </Button>
                </View>
            );
        return (
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
                    this._alertError(errorMessage);
                }
            });
    }
}

module.exports = LogInScreen;