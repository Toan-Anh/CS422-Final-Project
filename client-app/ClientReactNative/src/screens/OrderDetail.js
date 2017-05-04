import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Left, Button, Icon, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import variables from '../../native-base-theme/variables/platform';
import Dash from 'react-native-dash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                // {
                //     dish: 'Dish 1',
                //     quantity: 1,
                //     price: 35000
                // },
                // {
                //     dish: 'Dish 2',
                //     quantity: 2,
                //     price: 40000
                // },
                // {
                //     dish: 'Dish 3',
                //     quantity: 4,
                //     price: 30000
                // }
            ],
            isLoading: false
        }

        this._renderHeaderRow = this._renderHeaderRow.bind(this);
        this._renderDishItem = this._renderDishItem.bind(this);
        this._renderTotal = this._renderTotal.bind(this);
        this._calculateTotal = this._calculateTotal.bind(this);
    }

    componentDidMount() {
        var that = this;
        this.setState({isLoading: true});
        var tableRef = firebase.database().ref('orders/' + this.props.table);
        tableRef.on('value', function(snapshot) {
            var processedData = that._preprocessData(snapshot.val());
            that.setState({
                data: processedData
            })
        });
    }

    componentWillUnmount() {
        var tableRef = firebase.database().ref('orders/' + this.props.table);
        tableRef.off();
    }

    _preprocessData(dishes) {
        var result = [];
        var tempDict = {};
        for (let i = 0; i < dishes.length; i++) {
            for (let j = 0; j < dishes[i]['dishes'].length; j++) {
                if (dishes[i]['dishes'][j].name in tempDict) {
                    tempDict[dishes[i]['dishes'][j].name]['quantity'] = tempDict[dishes[i]['dishes'][j].name]['quantity'] + dishes[i]['dishes'][j]['quantity'];
                }
                else {
                    tempDict[dishes[i]['dishes'][j].name] = {}
                    tempDict[dishes[i]['dishes'][j].name]['quantity'] =  dishes[i]['dishes'][j]['quantity'];
                    tempDict[dishes[i]['dishes'][j].name]['price'] = dishes[i]['dishes'][j]['price'];
                }
            }
        }
        for (x in tempDict) {
            result.push({
                dish: x,
                quantity: tempDict[x]['quantity'],
                price: tempDict[x]['price']
            });
        }
        return result;

    }

    render() {
        return (
            <StyleProvider style={getTheme(variables)}>
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={Actions.pop}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{this.props.table}</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                            <MaterialIcons name={'file-upload'} color={'white'} size={25}/>
                            </Button>
                        </Right>
                    </Header>
                    <Content contentContainerStyle={{ flex: 1, alignSelf: 'stretch', margin: 12 }}>
                        {this._renderHeaderRow()}
                        {this.state.data.map(this._renderDishItem)}
                        {this._renderTotal()}
                    </Content>
                </Container>
            </StyleProvider>
        )
    }

    _renderHeaderRow() {
        return (
            <View style={[styles.commonPadding, styles.headerRowContainer]}>
                <Text style={[styles.headerText, styles.leftColumn]}>
                    Dish
                </Text>
                <Text style={[styles.headerText, styles.middleColumn]}>
                    Quantity
                </Text>
                <Text style={[styles.headerText, styles.rightColumn]}>
                    Dish Price
                </Text>
            </View>
        )
    }
    _renderDishItem(rowData, idx) {
        var dash = <Dash dashGap={10} />;
        if (idx == this.state.data.length - 1) {
            dash = <View />
        }
        return (
            <View style={[styles.commonPadding, { paddingBottom: 0 }]} key={idx}>
                <View style={styles.dishItemContainer}>
                    <Text style={[styles.dishItemText, styles.leftColumn]}>
                        {rowData.dish}
                    </Text>
                    <Text style={[styles.dishItemText, styles.middleColumn]}>
                        {rowData.quantity}
                    </Text>
                    <Text style={[styles.dishItemText, styles.rightColumn]}>
                        {this._numberWithCommas(rowData.price)}
                    </Text>
                </View>
                {dash}
            </View>
        );
    }

    _numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    _renderTotal() {
        var total = this._calculateTotal();
        return (
            <View style={[styles.commonPadding, styles.totalRowContainer]}>
                <Text style={[styles.headerText, styles.leftMiddleColumn]}>
                    Total
                </Text>
                <Text style={[styles.headerText, styles.rightColumn]}>
                    {this._numberWithCommas(total)}
                </Text>
            </View>
        )
    }

    _calculateTotal() {
        var total = 0;
        for (let i = 0; i < this.state.data.length; ++i) {
            total = total + this.state.data[i]['price']*this.state.data[i]['quantity'];
        }
        return total
    }
}

const styles = StyleSheet.create({
    commonPadding: {
        paddingBottom: 10
    },
    headerRowContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    headerText: {
        fontSize: 18,
        color: 'black'
    },
    leftColumn: {
        flex: 4,
    },
    middleColumn: {
        flex: 2
    },
    leftMiddleColumn: {
        flex: 6
    },
    rightColumn: {
        flex: 3,
        textAlign: 'right'
    },
    dishItemContainer: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    dishItemText: {
        fontSize: 15,
        color: 'black'
    },
    totalRowContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 10
    }
});