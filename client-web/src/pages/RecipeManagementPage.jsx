import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";


function priceFormatter(cell, row) {
	console.log(cell);
	return '<i class="fa fa-bars"></i> ' + cell;
}

export default class RecipeManagementPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recipes: [],
			loading: true,
		}

		this._onDataReceived = this._onDataReceived.bind(this);
	}

	componentWillMount() {
		this.recipesRef = firebase.database().ref('/recipe/');
		this.recipesRef.on('value', this._onDataReceived);
	}

	componentWillUnmount() {
		this.recipesRef.off('value', this._onDataReceived);
	}

	_onDataReceived(snapshot) {
		let data = snapshot.val();
		let recipes = [];
		Object.keys(data).forEach((recipeName, index) => {
			recipes.push({
				name: recipeName,
				created: '',
				updated: 'data[recipeName].ingredients',
			});
		})

		this.setState({ recipes: recipes, loading: false });
	}

	_renderTable() {
		return (
			<BootstrapTable data={this.state.recipes} hover={true}>
				<TableHeaderColumn dataField="name" isKey dataAlign="center" dataSort>Công thức</TableHeaderColumn>
				<TableHeaderColumn dataField="created" dataAlign="center" dataSort>Ngày tạo ra</TableHeaderColumn>
				<TableHeaderColumn dataField="updated" dataAlign="center" dataSort dataFormat={priceFormatter}>Ngày cập nhật</TableHeaderColumn>
			</BootstrapTable>
		);
	}

	_renderLoading() {
		return (
			<div className='loading-box'>
				<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				<p id='loading'>Loading...</p>
			</div>
		);
	}

	render() {
		return this.state.loading ? this._renderLoading() : this._renderTable();
	}
}