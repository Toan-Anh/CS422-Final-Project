import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    CameraRoll
} from 'react-native';
import { Container, Content, Tab, Tabs, Header, Body, Title, StyleProvider, getTheme, Left, Button, Icon, Right, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
import variables from '../../native-base-theme/variables/platform';
import Dash from 'react-native-dash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../modules/CustomizedActivityIndicator';
require('moment/locale/vi');
import moment from 'moment';
import { takeSnapshot, dirs } from "react-native-view-shot";
const { DocumentDir, MainBundleDir, MovieDir, MusicDir, PictureDir } = dirs;
const { DCIMDir, DownloadDir, RingtoneDir, SDCardDir } = dirs;

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
            isLoading: false,
            key: null
        }
        moment.locale('vi');
        this._renderHeaderRow = this._renderHeaderRow.bind(this);
        this._renderDishItem = this._renderDishItem.bind(this);
        this._renderTotal = this._renderTotal.bind(this);
        this._calculateTotal = this._calculateTotal.bind(this);
        this._onExportOrder = this._onExportOrder.bind(this);
    }

    componentDidMount() {
        var that = this;
        this.setState({ isLoading: true });
        var tableRef = firebase.database().ref('orders/' + this.props.table);
        tableRef.once('value', function (snapshot) {
            var processedData = that._preprocessData(snapshot.val());
            that.setState({
                data: processedData
            })
        });
    }

    componentWillUnmount() {
        // var tableRef = firebase.database().ref('orders/' + this.props.table);
        // tableRef.off();
    }

    componentDidUpdate() {
        var that = this;
        if (this.state.key) {
            takeSnapshot(this.refs.contentToPrint, { format: 'png', quality: 1.0, path: DownloadDir + `/${this.state.key}.png` }).then(
                uri => {
                    console.log("Image saved to", uri);
                    CameraRoll.saveToCameraRoll(uri);
                    firebase.database().ref('orders/' + this.props.table).remove().then(()=>{Actions.pop()})
                },
                error => console.error("Oops, snapshot failed", error)
            );
        }
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
                    tempDict[dishes[i]['dishes'][j].name]['quantity'] = dishes[i]['dishes'][j]['quantity'];
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

    _onExportOrder() {
        var that = this;
        var day = moment().date();
        var month = moment().month();
        var year = moment().year();
        let key = firebase.database().ref(`/records/${year}/${month}/${day}/orders`).push({
            table: this.props.table,
            dishes: this.state.data
        }).key;
        this.setState({ key: key });

    }

    render() {
        var printKey = this.state.key
            ? (
                <Text style={{ fontSize: 20, color: 'black', borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 30 }}>
                    Note ID: {this.state.key}
                </Text>
            )
            :
            <View />
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
                            <Button transparent onPress={this._onExportOrder}>
                                <MaterialIcons name={'file-upload'} color={'white'} size={25} />
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <View style={{ padding: 10, backgroundColor: 'white' }} ref={'contentToPrint'} collapsable={false}>
                            {printKey}
                            {this._renderHeaderRow()}
                            {this.state.data.map(this._renderDishItem)}
                            {this._renderTotal()}
                        </View>
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
            total = total + this.state.data[i]['price'] * this.state.data[i]['quantity'];
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