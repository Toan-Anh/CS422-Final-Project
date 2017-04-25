import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/react-bootstrap-table/react-bootstrap-table.css";

export default class RecipeDetailPage extends Component {

	constructor(props) {
		super(props);
		document.title = 'MMS - Recipe - ' + this.props.match.params.recipe_name;

		this.state = {
			recipe: { ingredients: [] },
			loading: true,
		};

		this._onRecipeReceived = this._onRecipeReceived.bind(this);
		this._onIngredientsReceived = this._onIngredientsReceived.bind(this);
	}

	componentWillMount() {
		this.recipeRef = firebase.database().ref(`/recipes/${this.props.match.params.recipe_name}`);
		this.recipeRef.on('value', this._onRecipeReceived);

		this.ingredientsRef = firebase.database().ref(`/ingredientsPerDish/${this.props.match.params.recipe_name}`);
		this.ingredientsRef.on('value', this._onIngredientsReceived);
	}

	componentWillUnmount() {
		this.recipeRef.off('value', this._onRecipeReceived);
		this.ingredientsRef.off('value', this._onIngredientsReceived);
	}

	_onRecipeReceived(snapshot) {
		this.setState({ recipe: Object.assign({}, this.state.recipe, snapshot.val()), loading: false });
	}

	_onIngredientsReceived(snapshot) {
		let tmp = { ingredients: [] };
		snapshot.forEach(child => {
			tmp.ingredients.push({
				name: child.key,
				amount: child.val()
			});
		});
		this.setState({ recipe: Object.assign({}, this.state.recipe, tmp), loading: false });
	}

	_renderLoading() {
		return (
			<div className='loading-box'>
				<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				<p id='loading'>Loading...</p>
			</div>
		);
	}

	_renderRecipe() {
		return (
			<div style={{ alignItems: 'flex-start' }}>
				<h2>Ingredients</h2>
				<BootstrapTable data={this.state.recipe.ingredients}>
					<TableHeaderColumn isKey
						dataField="name"
						dataAlign="center"
						dataSort>
						Name
					</TableHeaderColumn>

					<TableHeaderColumn
						dataField="amount"
						dataAlign="center"
						dataSort>
						Amount (per dish)
					</TableHeaderColumn>
				</BootstrapTable>


				<h2>Instructions</h2>
				{
					this.state.recipe.steps ? 
					this.state.recipe.steps.map((step, index) => {
					let image = null;
					if (step.image)
						image = <img alt={`${this.state.recipe.name} - Step ${index + 1}`}
							src={step.image} width='80%' />
					return (
						<div key={`step_${index + 1}`}>
							<h3>{`Step ${index + 1}`}</h3>
							<p>{step.description}</p>
							{image}
						</div>
					);
				}) : 
				<p>No instruction</p>
				}
			</div>
		);
	}

	render() {
		return (
			<div className='form-container'>

				<h1 id='title'>{this.props.match.params.recipe_name}</h1>

				{this.state.loading ? this._renderLoading() : this._renderRecipe()}

			</div>
		);
	}
}