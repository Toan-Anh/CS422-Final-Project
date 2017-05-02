import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme } from 'native-base';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        var content = <View/>;
        return (
            <StyleProvider style={getTheme(variables)}>
                <Container>
                    <Header>
                        <Body>
                            <Title>Order Detail</Title>
                        </Body>
                    </Header>
                    <Content contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }}>
                        {content}
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}