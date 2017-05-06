import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Button,
	FormGroup,
	FormControl,
	Row,
	Col,
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
			selectedRows: {},
			loading: true,
		};

		this.ingredients = [];

		this._onIngredientsReceived = this._onIngredientsReceived.bind(this);
		this._onIngredientAmountReceived = this._onIngredientAmountReceived.bind(this);
		this._onSelect = this._onSelect.bind(this);
		this._onSelectAll = this._onSelectAll.bind(this);
		this._onSearch = this._onSearch.bind(this);
		this._getAmountEditor = this._getAmountEditor.bind(this);
		this._updateAmount = this._updateAmount.bind(this);
		this._renderAmountCell = this._renderAmountCell.bind(this);
	}

	componentWillMount() {
		this.ingredientsRef = firebase.database().ref('/ingredientsAmountLeft/');
		this.ingredientsRef.on('value', this._onIngredientsReceived);

		this.ingredientAmountRef = firebase.database().ref('/ingredientsAmountMapping/');
		this.ingredientAmountRef.on('value', this._onIngredientAmountReceived);
	}

	componentWillUnmount() {
		this.ingredientsRef.off('value', this._onIngredientsReceived);
		this.ingredientAmountRef.off('value', this._onIngredientAmountReceived);
	}

	_onIngredientsReceived(snapshot) {
		let data = snapshot.val();
		this.ingredients = [];
		Object.keys(data).forEach((ingredientName, index) => {
			this.ingredients.push({
				id: index + 1,
				name: ingredientName,
				amount: data[ingredientName],
			});
		})

		this.setState({ ingredients: this.ingredients, loading: false });
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
			<AddIngredientModal ref={ref => this.addModal = ref} ingredientAmounts={this.state.ingredientAmounts} />
		);
	}

	_renderDeleteModal() {
		return (
			<DeleteIngredientModal ref={ref => this.deleteModal = ref}
				toBeDeleted={this.state.selectedRows}
				afterDelete={() => { this.setState({ selectedRows: {} }) }} />
		);
	}

	_getAmountEditor(onUpdate, props) {
		return (
			<IngredientAmountEditor onUpdate={onUpdate} {...props} />
		);
	}

	_updateAmount(row, cellName, cellValue) {
		if (cellName === 'amount')
			firebase.database().ref(`/ingredientsAmountLeft/${row.name}`).set(cellValue);
	}

	_renderAmountCell(cell, row, ingredientAmounts) {
		return ingredientAmounts.length > 0 ?
			<span style={{ color: `hsl(${120 * cell / Object.keys(ingredientAmounts).length}, 80%, 50%)` }}>{ingredientAmounts[cell].value}</span> :
			cell;
	}

	_onSearch(e) {
		let ingredients = [];
		this.ingredients.forEach(item => {
			if (item.name.toLowerCase().includes(e.target.value.toLowerCase()))
				ingredients.push(item);
		})
		this.setState({ ingredients: ingredients });
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

		const cellEdit = {
			mode: 'dbclick', // double click cell to edit
			beforeSaveCell: this._updateAmount,
		};

		return (
			<div>
				{/*<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>*/}
				<Row>
					<Col xs={12} sm={7}>
						<FormGroup controlId="formQuery" style={{ margin: 0 }}>
							<FormControl
								type="text"
								placeholder="Search"
								onChange={this._onSearch}
							/>
						</FormGroup>
					</Col>

					<Col xs={12} sm={5} style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button pullRight onClick={() => this.addModal.open()}>Add new ingredients</Button>
						<Button disabled={Object.keys(this.state.selectedRows).length < 1} onClick={() => this.deleteModal.open()}>Delete ingredients</Button>
					</Col>

				</Row>



				{/*</div>*/}

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.ingredients}
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
						dataFormat={this._renderAmountCell}
						formatExtraData={this.state.ingredientAmounts}
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
		if (!this.props.user)
			return this._renderLoading();
		if (this.props.user && this.props.user.level <= this.props.level)
			return (
				<div className='form-container'>

					<h1 id='title'>Ingredients</h1>

					{this.state.loading ? this._renderLoading() : this._renderTable()}
					{this._renderAddModal()}
					{this._renderDeleteModal()}

				</div>
			);
		else
			return (
				<div className="full-screen center">
					<p>You don't have permission to access this page</p>
				</div>
			);
	}
}