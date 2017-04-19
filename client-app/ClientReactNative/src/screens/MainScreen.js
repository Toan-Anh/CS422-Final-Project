import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import * as firebase from 'firebase';
import { Container, Content, Tab, Tabs, Header, Body, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ListDish from './MainScreenFragments/ListDish';

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        }
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ currentUser: user });

            } else {
                Actions.pop();
            }
        });
    }

    render() {
        return (
            <Container>
                <Header hasTabs>
                    <Body>
                        <Title>Main Menu</Title>
                    </Body>
                </Header>
                <Tabs>
                    <Tab heading="List Order">
                        <ListDish />
                    </Tab>
                    <Tab heading="Notification">
                        <View />
                    </Tab>
                </Tabs>
            </Container>
        );
    }

}

module.exports = MainScreen;