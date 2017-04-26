import React, { Component } from 'react';
import {
	FormGroup,
	FormControl,
	ControlLabel,
} from 'react-bootstrap';
import "../stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";

export default class RecipeStepEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			imageFile: null,
			imageData: this.props.stepData && this.props.stepData.image ? this.props.stepData.image : '',
			description: this.props.stepData ? this.props.stepData.description : '',
		};

		this._onFileChange = this._onFileChange.bind(this);
		this._onDescriptionChange = this._onDescriptionChange.bind(this);
	}

	hasData() {
		return this.state.description !== '';
	}

	getData() {

	}

	_onDescriptionChange(e) {
		this.setState({ description: e.target.value }, () => this.descTextArea.focus());
		this.props.onChange({ imageFile: this.state.imageFile, image: this.state.imageData, description: e.target.value });
	}

	_onFileChange(e) {
		let fileList = e.target.files;
		if (fileList.length > 0) {
			let reader = new FileReader();
			reader.onload = (event) => {
				this.setState({ imageFile: fileList[0], imageData: event.target.result });
				this.props.onChange({ imageFile: fileList[0], image: event.target.result, description: this.state.description });
			}

			reader.readAsDataURL(fileList[0]);
		}
	}

	render() {
		return (
			<div>
				<h3>
					{`Step ${this.props.stepNumber}`}
					<span>
						<i className='clickable fa fa-times'
							style={{ fontSize: 24, float: 'right' }}
							onClick={this.props.onDelete} />
					</span>
				</h3>

				<FormGroup controlId="formControlsTextarea">
					<ControlLabel>Description</ControlLabel>
					<FormControl
						componentClass="textarea"
						value={this.state.description}
						onChange={this._onDescriptionChange}
						inputRef={ref => this.descTextArea = ref}
						style={{ minHeight: 156 }} />
				</FormGroup>


				<FormGroup controlId="formImageEditor">
					<ControlLabel>Image</ControlLabel>
					<FormControl
						type="file"
						accept="image/*"
						inputRef={ref => this.imageFileControl = ref}
						defaultValue={this.props.defaultValue}
						onChange={this._onFileChange}
					/>
				</FormGroup>

				{
					this.state.imageData !== '' ?
						<img alt={`Step ${this.props.stepNumber} illustration`} src={this.state.imageData} width='80%' /> :
						null
				}
			</div>
		);
	}

}