import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {
	Button,
	Row,
	Col,
	FormGroup,
	FormControl,
} from 'react-bootstrap';
import { AddDishModal, DeleteDishModal, ImageSourceEditor } from '../components'
// import { Route } from 'react-router';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";

export default class DishManagementPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dishes: [],
			dishAmounts: [],
			selectedRows: {},
			loading: true,
		};

		this.dishes = [];

		this._onDishesReceived = this._onDishesReceived.bind(this);
		this._onSelect = this._onSelect.bind(this);
		this._onSelectAll = this._onSelectAll.bind(this);
		this._onSearch = this._onSearch.bind(this);
		this._getImageEditor = this._getImageEditor.bind(this);
		this._updateCell = this._updateCell.bind(this);
		this._renderNameCell = this._renderNameCell.bind(this);
		this._renderImageCell = this._renderImageCell.bind(this);
		this._renderPriceCell = this._renderPriceCell.bind(this);
		this._renderExternalLinkCell = this._renderExternalLinkCell.bind(this);
		this._renderAvailableCell = this._renderAvailableCell.bind(this);
	}

	componentWillMount() {
		this.dishesRef = firebase.database().ref('/dishes/');
		this.dishesRef.on('value', this._onDishesReceived);
	}

	componentWillUnmount() {
		this.dishesRef.off('value', this._onDishesReceived);
	}

	_onDishesReceived(snapshot) {
		let data = snapshot.val();
		this.dishes = [];
		Object.keys(data).forEach((dishName, index) => {
			this.dishes.push({
				...data[dishName],
			});
		})

		this.setState({ dishes: this.dishes, loading: false });
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

	_onSearch(e) {
		let dishes = [];
		this.dishes.forEach(item => {
			if (item.name.toLowerCase().includes(e.target.value.toLowerCase()))
				dishes.push(item);
		})
		this.setState({ dishes: dishes });
	}

	_renderHelp() {
		return (null);
	}

	_renderAddModal() {
		return (
			<AddDishModal ref={ref => this.addModal = ref} />
		);
	}

	_renderDeleteModal() {
		return (
			<DeleteDishModal ref={ref => this.deleteModal = ref}
				toBeDeleted={this.state.selectedRows}
				afterDelete={() => { this.setState({ selectedRows: {} }) }} />
		);
	}

	_getImageEditor(onUpdate, props) {
		return (
			<ImageSourceEditor onUpdate={onUpdate} {...props} />
		);
	}

	_updateCell(row, cellName, cellValue) {
		if (cellName === 'image')
			firebase.database().ref(`/dishes/${row.name}/image`).set(cellValue);
		else if (cellName === 'price')
			firebase.database().ref(`/dishes/${row.name}/price`).set(parseInt(cellValue, 10));
	}

	_renderAvailableCell(cell, row) {
		return (
			<i className={`clickable fa ${cell ? "fa-check-square" : "fa-square-o"}`}
				style={{ color: `rgba(0, 0, 0, ${(cell ? 1 : 0.5)})` }}
				onClick={(e) => {
					e.stopPropagation();
					firebase.database().ref(`/dishes/${row.name}/available`).set(!row.available);
				}}
			/>
		);
	}

	_renderExternalLinkCell(cell, row) {
		return (
			<i className="fa fa-external-link clickable"
				onClick={(e) => { e.stopPropagation(); this.props.history.push(`/recipes/${cell}`) }}
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

		const cellEdit = {
			mode: 'dbclick', // double click cell to edit
			beforeSaveCell: this._updateCell,
		};

		return (
			<div>
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
						<Button onClick={() => this.addModal.open()}>Add new dishes</Button>
						<Button disabled={Object.keys(this.state.selectedRows).length < 1} onClick={() => this.deleteModal.open()}>Delete dishes</Button>
					</Col>
				</Row>

				<BootstrapTable ref={(ref) => this.table = ref}
					data={this.state.dishes}
					options={options}
					selectRow={selectRow}
					cellEdit={cellEdit}
					{...styles}>

					<TableHeaderColumn
						dataField="image"
						dataAlign="center"
						width='40%'
						dataSort
						dataFormat={this._renderImageCell}
						customEditor={{ getElement: this._getImageEditor, customEditorParameters: { ingredientAmounts: this.state.ingredientAmounts } }}>
						Illustration
					</TableHeaderColumn>

					<TableHeaderColumn isKey
						dataField="name"
						dataAlign="center"
						width='20%'
						dataSort
						dataFormat={this._renderNameCell}>
						Name
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="price"
						dataAlign="center"
						width='20%'
						dataSort
						dataFormat={this._renderPriceCell}>
						Price
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="available"
						dataAlign="center"
						width='10%'
						dataSort
						dataFormat={this._renderAvailableCell}
						editable={false}>
						Available
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField='name'
						dataAlign="center"
						width="10%"
						dataFormat={this._renderExternalLinkCell}>
						Recipe
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

				<h1 id='title'>Dishes</h1>

				{this.state.loading ? this._renderLoading() : this._renderTable()}
				{this._renderAddModal()}
				{this._renderDeleteModal()}

			</div>
		);
	}
}