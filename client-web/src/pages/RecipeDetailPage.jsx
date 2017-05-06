import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { RecipeEditor } from '../components'
import { Button } from 'react-bootstrap'
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
			editing: false,
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
		let recipe = Object.assign({}, this.state.recipe, snapshot.val());
		if (!recipe.steps)
			recipe.steps = [];
		this.setState({ recipe: recipe, loading: false });
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

	_renderRecipeEditor() {
		return <RecipeEditor
			recipeName={this.props.match.params.recipe_name}
			recipe={Object.assign({}, this.state.recipe)}
			ref={(ref) => this.recipeEditor = ref}
		/>
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
					this.state.recipe.steps && this.state.recipe.steps.length > 0 ?
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

	_saveRecipe() {
		this.recipeEditor.getData((newRecipe) => {
			this.recipeRef.set(newRecipe);
			this.setState({ editing: false });
		});
	}

	render() {
		if (!this.props.user)
			return this._renderLoading();
		if (this.props.user && this.props.user.level <= this.props.level) {
			let content = this.state.editing ? this._renderRecipeEditor() : this._renderRecipe();
			let editButton = null;
			if (!this.state.loading && !this.state.editing)
				editButton = (
					<span>
						<Button bsStyle='primary'
							onClick={(e) => { this.setState({ editing: true }) }}>
							Edit recipe
					</Button>
					</span>
				);
			else if (!this.state.loading)
				editButton = (
					<span>
						<Button onClick={(e) => { this.setState({ editing: false }) }}>
							Cancel editing
					</Button>

						<Button bsStyle='primary'
							onClick={(e) => { this._saveRecipe() }}>
							Save recipe
					</Button>
					</span>
				);

			return (
				<div className='form-container'>

					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<h1 id='title'>{this.props.match.params.recipe_name}</h1>
						{editButton}
					</div>

					{this.state.loading ? this._renderLoading() : content}

				</div>
			);
		}
		else
			return (
				<div className="full-screen center">
					<p>You don't have permission to access this page</p>
				</div>
			);
	}
}