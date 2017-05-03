import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import * as firebase from 'firebase';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Right, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ListOrder from './MainScreenFragments/ListOrder';
import variables from '../../native-base-theme/variables/platform';

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
            <StyleProvider style={getTheme(variables)}>
                <Container>
                    <Header hasTabs>
                        <Body>
                            <Title>Main Menu</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon name={'md-menu'}/>
                            </Button>
                        </Right>
                    </Header>
                    <Tabs>
                        <Tab heading="List Order">
                            <ListOrder />
                        </Tab>
                        <Tab heading="Notification">
                            <View />
                        </Tab>
                    </Tabs>
                </Container>
            </StyleProvider>
        );
    }

}

module.exports = MainScreen;