import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { Container, Content, Form, Item, Input, Header, Title, ListItem, List, InputGroup, Icon, Button, Body } from 'native-base';

class LogInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }

    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Login</Title>
                    </Body>
                </Header>
                <Content>
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
                    <Button block primary>
                        <Text style={{ color: 'white' }}> Log in </Text>
                    </Button>

                </Content>
            </Container>
        )
    }
}

module.exports = LogInScreen;