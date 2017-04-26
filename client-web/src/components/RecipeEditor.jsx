import React, { Component } from 'react';
import { RecipeStepEditor, RecipeIngredientEditor } from './'
import {
	Button,
} from 'react-bootstrap'
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

export default class RecipeEditor extends Component {

	constructor(props) {
		super(props);

		let recipe = JSON.parse(JSON.stringify(this.props.recipe));
		recipe.steps.forEach((step, index) => step.index = index);
		this.state = {
			recipe: recipe,
			ingredientsAvailable: [],
			loading: false,
		};

		this.ingredients = [];

		this._addNextStep = this._addNextStep.bind(this);
		this._addNextIngredient = this._addNextIngredient.bind(this);
		this._onIngredientsReceived = this._onIngredientsReceived.bind(this);
	}

	getData(onDone) {
		this.setState({ loading: true });
		this.count = 0;
		this.updatedRecipe = this.state.recipe;

		if (this.updatedRecipe.ingredients.length < 1) {
			this.updatedRecipe.steps.forEach(item => delete item.index);
			this.setState({ loading: false });
			onDone(this.updatedRecipe);
			return;
		}

		this.updatedRecipe.ingredients.forEach((ingr, index) => {
			if (!ingr.imageFile) {
				this._updateRecipe(onDone);
			} else {
				this._uploadImage(index, onDone);
			}
		});
	}

	_updateRecipe(callback) {
		++this.count;

		if (this.count === this.updatedRecipe.ingredients.length) {
			this.updatedRecipe.steps.forEach(item => delete item.index);
			this.setState({ loading: false });
			callback(this.updatedRecipe);
		}
	}

	_uploadImage(index, onDone) {
		let ingr = this.updatedRecipe.ingredients[index];
		firebase.storage().ref().child(`images/${ingr.imageFile.name}`).put(ingr.imageFile)
			.then(snapshot => {
				console.log(snapshot.downloadURL);
				ingr.image = snapshot.downloadURL;
				delete ingr.imageFile;
				this._updateRecipe(onDone);
			})
			.catch(exception => {
				console.log(exception);
				this._uploadImage(index, onDone);
			});
	}

	componentWillMount() {
		firebase.database().ref('ingredientsAmountLeft').on('value', this._onIngredientsReceived);
	}

	componentWillUnmount() {
		firebase.database().ref('ingredientsAmountLeft').off('value', this._onIngredientsReceived);
	}

	_onIngredientsReceived(snapshot) {
		this.ingredients = [];
		snapshot.forEach((child) => {
			this.ingredients.push(child.key);
		});
		this.setState({ ingredientsAvailable: this.ingredients });
	}

	_addNextStep() {
		let recipe = this.state.recipe;
		recipe.steps.push({
			description: '',
			index: recipe.steps.length > 0 ? (recipe.steps[recipe.steps.length - 1].index + 1) : 0,
		});
		console.log(recipe.steps);
		this.setState({ recipe: recipe });
	}

	_addNextIngredient() {
		let recipe = this.state.recipe;
		let ingredientsUsed = recipe.ingredients.map(ingr => ingr.name);
		let ingredientsLeft = this.ingredients.filter(item => ingredientsUsed.indexOf(item) < 0);

		if (ingredientsLeft.length < 1)
			return;

		recipe.ingredients.push({
			name: ingredientsLeft[0],
			amount: '0',
		});

		this.setState({ recipe: recipe });
	}

	_onDeleteIngredient(e, index) {
		let recipe = this.state.recipe;
		recipe.ingredients.splice(index, 1);
		this.setState({ recipe: recipe });
	}

	_onDeleteStep(e, index) {
		let recipe = this.state.recipe;
		recipe.steps.splice(index, 1);
		this.setState({ recipe: recipe });
	}

	_onChangeIngredient(data, index) {
		if (this.state.recipe.ingredients.map(ingr => ingr.name).indexOf(data.name) >= 0 &&
			this.state.recipe.ingredients[index].amount === data.amount)
			return false;

		let recipe = this.state.recipe;
		recipe.ingredients[index] = data;

		this.setState({ recipe: recipe });
		return true;
	}

	_onChangeStep(data, index) {
		let recipe = this.state.recipe;
		recipe.steps[index] = Object.assign({}, recipe.steps[index], data);
		this.setState({ recipe: recipe });
		return true;
	}

	_renderIngredientEditor() {
		return (
			<div>
				{
					this.state.recipe.ingredients.map((ingr, index) => {
						return (
							<RecipeIngredientEditor
								ingredientsAvailable={this.state.ingredientsAvailable}
								key={`ingr_${ingr.name}`}
								{...ingr}
								onDelete={(e) => this._onDeleteIngredient(e, index)}
								onChange={(data) => this._onChangeIngredient(data, index)} />
						);
					})
				}
				<Button onClick={this._addNextIngredient}>Add next ingredient</Button>
			</div>
		);
	}

	_renderInstructionEditor() {
		return (
			<div>
				{
					this.state.recipe.steps ?
						this.state.recipe.steps.map((step, index) => {
							return (
								<RecipeStepEditor key={`step_${step.index + 1}`}
									ref={`Step ${index + 1}`}
									stepNumber={index + 1}
									stepData={step}
									onDelete={(e) => this._onDeleteStep(e, index)}
									onChange={(data) => this._onChangeStep(data, index)} />
							);
						}) :
						null
				}
				<Button onClick={this._addNextStep}>Add next step</Button>
			</div>
		);
	}

	render() {
		if (this.state.loading)
			return (
				<div className='loading-box'>
					<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
					<p id='loading'>Saving recipe...</p>
				</div>
			);

		return (
			<div style={{ alignItems: 'flex-start' }}>
				<h2>Ingredients</h2>
				{this._renderIngredientEditor()}

				<h2>Instructions</h2>
				{this._renderInstructionEditor()}
			</div>
		);
	}
}