import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

import { Container, Content, Form, Item, Input, Header, Title, ListItem, List, InputGroup, Icon, Button, Body } from 'native-base';
import Grid from 'react-native-grid-component';

export default class FancyTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titles: [],
            dataSource: [],
            isLoading: true
        };

        this._preprocessDataSource = this._preprocessDataSource.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderTitle = this._renderTitle.bind(this);
    }

    componentDidMount() {
        if (this.props.titles && this.props.dataSource) {
            this.setState({
                titles: this.props.titles,
                dataSource: this.props.dataSource,
                isLoading: false
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        var processedData = this._preprocessDataSource();
        return (
            <View style={styles.container}>
                {this._renderTitle()}
                <Grid
                    style={styles.list}
                    renderItem={this._renderItem}
                    data={processedData}
                    itemsPerRow={1}
                />
            </View>
        );
    }

    _renderTitle() {
        return (
            <View style={styles.titleContainer}>
                {
                    this.state.titles.map(this._renderCell)
                }
            </View>
        )
    }

    _renderItem(row, index) {
        var convertedRow = [];
        for (let i = 0; i < this.state.titles.length; i++) {
            convertedRow.push(row[this.state.titles[i]]);
        }
        return (
            <View style={styles.itemContainer} key={index}>
                {
                    convertedRow.map(this._renderCell)
                }
            </View>
        )
    }

    _renderCell(item, i) {
        return (
            <View style={styles.cellContainer} key={i}>
                <Text style={styles.cellText}>
                    {item}
                </Text>
            </View>
        )
    }

    _preprocessDataSource() {
        return this.state.dataSource;
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        backgroundColor: '#DCDCDC',
        flexDirection: 'row',
        borderLeftWidth: 1
    },
    itemContainer: {
        flexDirection: 'row',
        borderLeftWidth: 1

    },
    list: {

    },
    container: {
        flexDirection: 'column',
        flex: 1,
        borderTopWidth: 1,
        margin: 10
    },
    cellContainer: {
        flex: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1
    },
    cellText: {
        padding: 3, 
        color: 'black'
    }
});

FancyTable.defaultProps = {
    titles: ['Table #', 'Time Ordered', 'State'],
    dataSource: [
        {
            'Table #': 0,
            'Time Ordered': 123,
            'State': 'done'
        },
        {
            'Table #': 0,
            'Time Ordered': 123,
            'State': 'done'
        },
        {
            'Table #': 0,
            'Time Ordered': 123,
            'State': 'done'
        },
        {
            'Table #': 0,
            'Time Ordered': 123,
            'State': 'done'
        }
    ]
}