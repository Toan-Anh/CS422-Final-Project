import React, { Component } from 'react';
import {
	Modal,
	Form,
	FormControl,
	FormGroup,
	ControlLabel,
	Button,
	Radio,
} from 'react-bootstrap';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

export default class AddDishModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddModal: false,
			nameValidState: null,
			priceValidState: null,
			imageValidState: null,
			dishName: '',
			dishImage: '',
			dishAvailable: true,
			errorMsg: '',
			imageFile: null,
			imageData: '',
			loading: false,
		}

		this._addDish = this._addDish.bind(this);
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this._onFileChange = this._onFileChange.bind(this);
	}

	_onFileChange(e) {
		let fileList = e.target.files;
		if (fileList.length > 0) {
			let reader = new FileReader();
			reader.onload = (event) => {
				this.setState({ imageFile: fileList[0], imageData: event.target.result });
			}

			reader.readAsDataURL(fileList[0]);
		}
	}

	_addDish() {
		let name = this.state.dishName;
		let price = this.newDishPrice.value;

		if (!name || name === '') {
			this.setState({ errorMsg: 'Dish name cannot be empty', nameValidState: 'error', priceValidState: null, imageValidState: null });
		}
		else if (!price || price === '') {
			this.setState({ errorMsg: 'Price cannot be empty', priceValidState: 'error', nameValidState: null, imageValidState: null });
		}
		else if (!this.state.imageFile) {
			this.setState({ errorMsg: 'Image cannot be empty', imageValidState: 'error', nameValidState: null, priceValidState: null });
		}
		else {
			firebase.database().ref(`/dishes`).once('value', (snapshot) => {
				if (!snapshot.hasChild(name)) {
					this.setState({ loading: true });
					let file = this.state.imageFile;
					let storageRef = firebase.storage().ref();
					let imageRef = storageRef.child(`images/${file.name}`);
					// Upload image to Firebase storage
					imageRef.put(file)
						.then(fileSnapshot => {
							// Create dummy recipe
							let currentTime = new Date();
							firebase.database().ref(`/recipes/${name}`).set({
								name: name,
								steps: false,
								created: `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()}`,
								updated: `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()}`,
							});

							// Add new dish
							firebase.database().ref(`/dishes/${name}`).set({
								available: true,
								image: fileSnapshot.downloadURL,
								name: name,
								price: price,
								recipe: name
							});
							this.close();
						})
						.catch(error => {
							console.log(error);
							this.setState({ loading: false })
						});
				}
				else {
					this.setState({ errorMsg: 'Dish already exists', nameValidState: 'error', priceValidState: null, loading: false });
				}
			});
		}
	}

	open() {
		this.setState({ showAddModal: true });
	}

	close() {
		this.setState({ showAddModal: false, errorMsg: '', nameValidState: null, priceValidState: null, imageValidState: null, imageFile: null, imageData: '', loading: false });
	}

	render() {
		return (
			<Modal show={this.state.showAddModal} onHide={this.close}>
				<Modal.Header closeButton={!this.state.loading}>
					<Modal.Title>Add new dish</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p id='error-message'>{this.state.errorMsg}</p>
					<Form>
						<FormGroup controlId="formName" validationState={this.state.nameValidState}>
							<ControlLabel>Dish name</ControlLabel>
							<FormControl
								type="text"
								disabled={this.state.loading}
								inputRef={ref => this.newDishName = ref}
								onChange={(e) => this.setState({ dishName: e.target.value })}
							/>
						</FormGroup>

						<FormGroup controlId="formPrice" validationState={this.state.priceValidState}>
							<ControlLabel>Dish price</ControlLabel>
							<FormControl
								type="text"
								disabled={this.state.loading}
								inputRef={ref => this.newDishPrice = ref}
							/>
						</FormGroup>

						<FormGroup controlId="formImage" validationState={this.state.imageValidState}>
							<ControlLabel>Dish image</ControlLabel>
							<FormControl
								type="file"
								accept="image/*"
								disabled={this.state.loading}
								inputRef={ref => this.newDishImage = ref}
								onChange={this._onFileChange}
							/>
							<i />

							{
								this.state.imageFile ?
									<img alt='Dish illustration' width="100%" src={this.state.imageData} /> :
									null
							}
						</FormGroup>

						<FormGroup controlId="formAvailability">
							<ControlLabel>Dish availability</ControlLabel>
							<div>
								<Radio inline checked={this.state.dishAvailable}
									disabled={this.state.loading}
									onChange={() => this.setState({ dishAvailable: true })}>
									Available
								</Radio>

								<Radio inline checked={!this.state.dishAvailable}
									disabled={this.state.loading}
									onChange={() => this.setState({ dishAvailable: false })}>
									Not available
								</Radio>
							</div>
						</FormGroup>

						<FormGroup controlId="formRecipe">
							<ControlLabel>Recipe</ControlLabel>
							<FormControl
								type="text"
								disabled={true}
								value={this.state.dishName}
							/>
						</FormGroup>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					{
						this.state.loading ?
							<i className="fa fa-spinner fa-pulse fa-fw"></i> :
							<div>
								<Button onClick={this.close}>Cancel</Button>
								<Button bsStyle='primary' onClick={() => this._addDish()}>Save</Button>
							</div>
					}
				</Modal.Footer>
			</Modal >
		);
	}
}