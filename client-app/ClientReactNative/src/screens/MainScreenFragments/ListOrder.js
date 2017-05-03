import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback
} from 'react-native';
import { Fab, Button, Icon, } from 'native-base';
import CreateOrderFAB from '../../modules/CreateOrderFAB';
import GiftedListView from 'react-native-gifted-listview';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
require('moment/locale/vi');
import * as firebase from 'firebase';
import CustomizedActivityIndicator from '../../modules/CustomizedActivityIndicator';

class ListOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        moment.locale('vi');
        this._onFetch = this._onFetch.bind(this);
        this._renderRowView = this._renderRowView.bind(this);
        this._renderPaginationWaitingView = this._renderPaginationWaitingView.bind(this);
    }

    componentDidMount() {
        var that = this;
        var ordersRef = firebase.database().ref('orders');
        ordersRef.on('value', function (snapshot) {
            var processedData = that._preprocessListOrders(snapshot.val());
            that.setState({
                data: processedData
            });
        });
    }

    componentDidUpdate() {
        this.refs.giftedListView._refresh();
    }

    _preprocessListOrders(myObject) {
        var result = [];
        for (x in myObject) {
            for (let i = 0; i < myObject[x].length; i++) {
                var item = myObject[x][i];
                result.push({
                    table: x,
                    time: (moment.unix(item.time)).fromNow(),
                    state: item.state
                });
            }
        }
        return result;
    }

    _onFetch(page = 1, callback, options) {
        var rows = JSON.parse(JSON.stringify(this.state.data));
        if (page === 3) {
            callback(rows, {
                allLoaded: true, // the end of the list is reached
            });
        } else {
            callback(rows);
        }
    }

    _onPress(rowData) {
        console.log(rowData + ' pressed');
    }

    _renderRowView(rowData) {
        var icon = 'md-checkmark-circle-outline';
        if (rowData.state === 'ready') {
            icon = 'md-checkmark-circle';
        }
        else if (rowData.state === 'served') {
            icon = 'md-done-all';
        }
        return (
            <TouchableNativeFeedback onPress={() => { Actions.orderdetail() }}>
                <View style={styles.rowItemContainer}>
                    <View style={styles.leftRowItemContainer}>
                        <Text style={styles.tableText}>
                            {rowData.table}
                        </Text>
                        <Text style={styles.orderTimeText}>
                            {rowData.time}
                        </Text>
                    </View>
                    <View style={styles.rightRowItemContainer}>
                        <Icon name={icon} style={styles.iconText} />
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }

    _renderPaginationWaitingView(paginateCallback) {
        return (
            <TouchableNativeFeedback
                onPress={paginateCallback}
            >
                <View style={styles.paginationView}>
                    <Text style={styles.loadMoreText}>
                        Load more
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    }

    _renderEmptyView(refreshCallback) {
        return (
            <View style={{
                flex: 1,
                alignSelf: 'stretch',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <CustomizedActivityIndicator />
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                <GiftedListView
                    ref={'giftedListView'}
                    rowView={this._renderRowView}
                    onFetch={this._onFetch}
                    firstLoader={true} // display a loader for the first fetching
                    pagination={true} // enable infinite scrolling using touch to load more
                    refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                    withSections={false} // enable sections
                    customStyles={{
                        paginationView: {
                            backgroundColor: '#eee',
                        },
                    }}
                    emptyView={this._renderEmptyView}
                    paginationWaitingView={this._renderPaginationWaitingView}
                    refreshableTintColor="blue"
                    contentContainerStyle={{ flex: 1, alignSelf: 'stretch' }}
                />
                <CreateOrderFAB />
            </View>
        )
    }


}

var styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    navBar: {
        height: 64,
        backgroundColor: '#CCC'
    },
    rowItemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed'
    },
    leftRowItemContainer: {
        flex: 9,
    },
    rightRowItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableText: {
        color: 'black',
        fontSize: 18
    },
    orderTimeText: {
        fontSize: 14
    },
    iconText: {
        color: 'green'
    },
    paginationView: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    loadMoreText: {
        fontSize: 13,
        color: '#007aff',
    },
};

module.exports = ListOrder;