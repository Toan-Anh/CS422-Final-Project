import React, { Component } from 'react';
import {
	FormGroup,
	FormControl,
	Button,
	Row,
	Col,
} from 'react-bootstrap';
import * as firebase from 'firebase';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

export default class ImageSourceEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			image: props.defaultValue,
			imageFile: null,
			loading: false,
		};

		this.updateData = this.updateData.bind(this);
		this._onFileChange = this._onFileChange.bind(this);
	}

	focus() {
		this.imageFileControl.focus();
	}

	updateData() {
		if (!this.state.imageFile) {
			this.props.onUpdate(this.props.defaultValue);
			return;
		}

		this.setState({ loading: true });
		let file = this.state.imageFile;
		let storageRef = firebase.storage().ref();
		let imageRef = storageRef.child(`images/${file.name}`);
		// Upload image to Firebase storage
		imageRef.put(file)
			.then(fileSnapshot => {
				this.props.onUpdate(fileSnapshot.downloadURL);
			})
			.catch(error => {
				console.log(error);
				this.setState({ loading: false })
			});
	}

	_onFileChange(e) {
		let fileList = e.target.files;
		if (fileList.length > 0) {
			let reader = new FileReader();
			reader.onload = (event) => {
				this.setState({ imageFile: fileList[0], image: event.target.result });
			}

			reader.readAsDataURL(fileList[0]);
		}
	}

	render() {
		if (this.state.loading)
			return (<i className="fa fa-spinner fa-pulse fa-fw"></i>);
		else
			return (
				<Row>
					<Col xs={12}>
						<img alt="Dish illustration" src={this.state.image} width="100%" />
					</Col>

					<Col xs={12} sm={8}>
						<FormGroup controlId="formImageEditor" style={{ margin: 'auto' }}>
							<FormControl
								type="file"
								accept="image/*"
								disabled={this.state.loading}
								inputRef={ref => this.imageFileControl = ref}
								onKeyDown={this.props.onKeyDown}
								defaultValue={this.props.defaultValue}
								onChange={this._onFileChange}
							/>
						</FormGroup>
					</Col>

					<Col xs={12} sm={4}>
						<Button bsStyle='primary' style={{ margin: 'auto' }} onClick={this.updateData}>Update</Button>
					</Col>
				</Row>
			);
	}
}