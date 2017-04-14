import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Button,
} from 'react-bootstrap';
import { AddIngredientModal, DeleteIngredientModal, IngredientAmountEditor } from '../components'
// import { Route } from 'react-router';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";

export default class IngredientManagementPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ingredients: [],
			ingredientAmounts: [],
			loading: true,
		};

		this.selectedRows = {};

		this._onIngredientsReceived = this._onIngredientsReceived.bind(this);
		this._onIngredientAmountReceived = this._onIngredientAmountReceived.bind(this);
		this._onSelect = this._onSelect.bind(this);
		this._getAmountEditor = this._getAmountEditor.bind(this);
		this._updateAmount = this._updateAmount.bind(this);
	}

	componentWillMount() {
		this.ingredientsRef = firebase.database().ref('/ingredients/');
		this.ingredientsRef.on('value', this._onIngredientsReceived);

		this.ingredientAmountRef = firebase.database().ref('/ingredient_amount/');
		this.ingredientAmountRef.on('value', this._onIngredientAmountReceived);
	}

	componentWillUnmount() {
		this.ingredientsRef.off('value', this._onIngredientsReceived);
		this.ingredientAmountRef.off('value', this._onIngredientAmountReceived);
	}

	_onIngredientsReceived(snapshot) {
		let data = snapshot.val();
		let ingredients = [];
		Object.keys(data).forEach((ingredientName, index) => {
			ingredients.push({
				id: index + 1,
				name: ingredientName,
				amount: data[ingredientName],
			});
		})

		this.setState({ ingredients: ingredients, loading: false });
	}

	_onIngredientAmountReceived(snapshot) {
		let data = snapshot.val();
		let amounts = [];
		Object.keys(data).forEach((id, index) => {
			amounts.push({
				id: id,
				value: data[id],
			});
		})

		this.setState({ ingredientAmounts: amounts, loading: false });
	}

	_onSelect(row, isSelected, e) {
		if (isSelected)
			this.selectedRows[row.name] = true;
		else {
			if (this.selectedRows[row.name])
				delete this.selectedRows[row.name];
		}
	}

	_renderHelp() {
		return (null);
	}

	_renderAddModal() {
		return (
			<AddIngredientModal ref={ref => this.addModal = ref} ingredientAmounts={this.state.ingredientAmounts} />
		);
	}

	_renderDeleteModal() {
		return (
			<DeleteIngredientModal ref={ref => this.deleteModal = ref} toBeDeleted={this.selectedRows} />
		);
	}

	_getAmountEditor(onUpdate, props) {
		return (
			<IngredientAmountEditor onUpdate={onUpdate} {...props} />
		);
	}

	_updateAmount(row, cellName, cellValue) {
		console.log(row, cellName, cellValue);
		// firebase.database().ref(`/ingredients/${cellName}`).set(cellValue);
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
			className: '',
			onSelect: this._onSelect,
		};

		const cellEdit = {
			mode: 'dbclick', // double click cell to edit
			beforeSaveCell: this._updateAmount,
		};

		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
					<Button onClick={() => this.addModal.open()}>Add new ingredients</Button>
					<Button onClick={() => this.deleteModal.open()}>Delete ingredients</Button>
				</div>

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.ingredients}
					hover
					options={options}
					selectRow={selectRow}
					cellEdit={cellEdit}
					{...styles}>

					<TableHeaderColumn isKey
						dataField="name"
						dataAlign="center"
						dataSort>
						Ingredient
						</TableHeaderColumn>

					<TableHeaderColumn
						dataField="amount"
						dataAlign="center"
						dataSort
						customEditor={{ getElement: this._getAmountEditor, customEditorParameters: { ingredientAmounts: this.state.ingredientAmounts } }}>
						Amount
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

				<h1 id='title'>Ingredients</h1>

				{this.state.loading ? this._renderLoading() : this._renderTable()}
				{this._renderAddModal()}
				{this._renderDeleteModal()}

			</div>
		);
	}
}