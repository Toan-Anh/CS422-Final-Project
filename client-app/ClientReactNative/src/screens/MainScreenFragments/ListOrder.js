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
require('moment/locale/vi');


class ListOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        moment.locale('vi');
        this._renderRowView = this._renderRowView.bind(this);
        this._renderPaginationWaitingView = this._renderPaginationWaitingView.bind(this);
    }

    _onFetch(page = 1, callback, options) {
        var rows = [
            {
                tableNum: 'Table ' + ((page - 1) * 3 + 1),
                time: moment().fromNow(),
                status: 'preparing'
            },
            {
                tableNum: 'Table ' + ((page - 1) * 3 + 2),
                time: moment().fromNow(),
                status: 'ready'
            },
            {
                tableNum: 'Table ' + ((page - 1) * 3 + 3),
                time: moment().fromNow(),
                status: 'served'
            }];
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
        if (rowData.status === 'ready') {
            icon = 'md-checkmark-circle';
        }
        else if (rowData.status === 'served') {
            icon = 'md-done-all';
        }
        return (
            <TouchableNativeFeedback>
                <View style={styles.rowItemContainer}>
                    <View style={styles.leftRowItemContainer}>
                        <Text style={styles.tableText}>
                            {rowData.tableNum}
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

    render() {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch' }}>
                <GiftedListView
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
                    paginationWaitingView={this._renderPaginationWaitingView}
                    refreshableTintColor="blue"
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