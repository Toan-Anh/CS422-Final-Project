import React, { Component } from 'react';
import {
	Modal,
	Button,
} from 'react-bootstrap';
import * as firebase from 'firebase';


export default class DeleteDishModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDeleteModal: false,
		}

		this._deleteDish = this._deleteDish.bind(this);
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}

	_deleteDish() {
		Object.keys(this.props.toBeDeleted).forEach(name => {
			this.dishsRef = firebase.database().ref(`/dishes/${name}`).remove();
		})
		this.props.afterDelete();
		this.close();
	}

	open() {
		this.setState({ showDeleteModal: true });
	}

	close() {
		this.setState({ showDeleteModal: false });
	}

	_renderDeleteModal() {
		return (
			<Modal show={this.state.showDeleteModal} onHide={this.close}>
				<Modal.Header closeButton>
					<Modal.Title>{`Delete dish${Object.keys(this.props.toBeDeleted).length > 1 ? 'es' : ''}`}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<p>{`Are you sure you want to delete ${Object.keys(this.props.toBeDeleted).length} dish${Object.keys(this.props.toBeDeleted).length > 1 ? 'es' : ''}?`}</p>
					{Object.keys(this.props.toBeDeleted).map(name => <p key={`ingr_${name}`}>{`- ${name}`}</p>)}
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.close}>Cancel</Button>
					<Button bsStyle='primary' onClick={() => this._deleteDish()}>Delete</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	_renderErrorModal() {
		return (<Modal show={this.state.showDeleteModal} onHide={this.close}>
			<Modal.Header closeButton>
				<Modal.Title>{`Error`}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<p>{`Please select which row(s) to delete`}</p>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={this.close}>OK</Button>
			</Modal.Footer>
		</Modal>);
	}

	render() {
		return Object.keys(this.props.toBeDeleted).length > 0 ? this._renderDeleteModal() : this._renderErrorModal();
	}
}