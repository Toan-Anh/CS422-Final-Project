import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Button,
} from 'react-bootstrap';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";

export default class RecipeManagementPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recipes: [],
			recipeAmounts: [],
			selectedRows: {},
			loading: true,
		};

		this._onRecipesReceived = this._onRecipesReceived.bind(this);
		this._onSelect = this._onSelect.bind(this);
		this._onSelectAll = this._onSelectAll.bind(this);
		this._getAmountEditor = this._getAmountEditor.bind(this);
		this._updateAmount = this._updateAmount.bind(this);
		this._renderNameCell = this._renderNameCell.bind(this);
		this._renderImageCell = this._renderImageCell.bind(this);
		this._renderPriceCell = this._renderPriceCell.bind(this);
		this._renderExternalLinkCell = this._renderExternalLinkCell.bind(this);
		this._renderAvailableCell = this._renderAvailableCell.bind(this);
	}

	componentWillMount() {
		this.recipesRef = firebase.database().ref('/recipes/');
		this.recipesRef.on('value', this._onRecipesReceived);
	}

	componentWillUnmount() {
		this.recipesRef.off('value', this._onRecipesReceived);
	}

	_onRecipesReceived(snapshot) {
		let data = snapshot.val();
		let recipes = [];
		Object.keys(data).forEach((recipeName, index) => {
			recipes.push({
				...data[recipeName],
			});
		})

		this.setState({ recipes: recipes, loading: false });
	}

	_onSelect(row, isSelected, e) {
		let selected = this.state.selectedRows;
		if (isSelected)
			selected[row.name] = true;
		else {
			if (selected[row.name])
				delete selected[row.name];
		}

		this.setState({ selectedRows: selected });
	}

	_onSelectAll(isSelected, rows) {
		let selected = {};
		if (isSelected)
			rows.forEach(row => selected[row.name] = true);

		this.setState({ selectedRows: selected });
		return true;
	}

	_renderHelp() {
		return (null);
	}

	_renderAddModal() {
		return (
			null
		);
	}

	_renderDeleteModal() {
		return (
			null
		);
	}

	_getAmountEditor(onUpdate, props) {
		return (
			null
		);
	}

	_updateAmount(row, cellName, cellValue) {
		firebase.database().ref(`/recipesAmountLeft/${row.name}`).set(cellValue);
	}

	_renderAvailableCell(cell, row) {
		return (
			<i className={cell ? "fa fa-check-square" : "fa fa-square-o"}
				style={{ color: `rgba(0, 0, 0, ${(cell ? 1 : 0.5)})` }}
			/>
		);
	}

	_renderExternalLinkCell(cell, row) {
		return (
			<i className="fa fa-external-link clickable"
				onClick={(e) => { e.stopPropagation(); this.props.history.push(`recipe_management/${row.name}`) }}
			/>
		);
	}

	_renderPriceCell(cell, row) {
		return (
			<div style={{ color: `rgba(0, 0, 0, ${(row.available ? 1 : 0.5)})` }}>
				{cell.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
			</div>
		);
	}

	_renderImageCell(cell, row) {
		return (
			<img
				alt={row.name}
				src={cell}
				width='100%'
				style={{ opacity: `${row.available ? 1 : 0.5}` }}
			/>
		);
	}

	_renderNameCell(cell, row) {
		return (
			<div style={{ color: `rgba(0, 0, 0, ${(row.available ? 1 : 0.5)})` }}>
				{cell}
			</div>
		);
	}

	_renderTable() {
		const styles = {
			headerStyle: {
				backgroundColor: 'white',
			},

			tableStyle: {
				margin: 0,
			},

			containerStyle: {
			}
		};

		const options = {
			afterInsertRow: (row) => {
				alert(row);
			}
		};

		const selectRow = {
			mode: 'checkbox',  // multi select
			clickToSelectAndEditCell: true,
			className: 'row-selected',
			onSelect: this._onSelect,
			onSelectAll: this._onSelectAll,
		};

		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
					<Button onClick={() => this.addModal.open()}>Add new recipes</Button>
					<Button disabled={Object.keys(this.state.selectedRows).length < 1} onClick={() => this.deleteModal.open()}>Delete recipes</Button>
				</div>

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.recipes}
					options={options}
					selectRow={selectRow}
					{...styles}>

					<TableHeaderColumn isKey
						dataField="name"
						dataAlign="center"
						width='50%'
						dataSort>
						Name
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="created"
						dataAlign="center"
						width='20%'
						dataSort>
						Created
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="updated"
						dataAlign="center"
						width='20%'
						dataSort>
						Updated
					</TableHeaderColumn>

					<TableHeaderColumn
						dataAlign="center"
						width='10%'
						dataFormat={this._renderExternalLinkCell}>
						Detail
					</TableHeaderColumn>

				</BootstrapTable>
			</div>
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
		return (
			<div className='form-container'>

				<h1 id='title'>Recipes</h1>

				{this.state.loading ? this._renderLoading() : this._renderTable()}
				{this._renderAddModal()}
				{this._renderDeleteModal()}

			</div>
		);
	}
}