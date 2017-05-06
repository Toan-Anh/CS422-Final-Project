import React, { Component } from 'react';
import * as firebase from 'firebase';

export default class ReportPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			records: null,
		};

		this._onRecordsReceived = this._onRecordsReceived.bind(this);
	}

	_onRecordsReceived(snapshot) {
		this.setState({ records: snapshot.val(), loading: false });
	}

	componentWillMount() {
		this.recordRef = firebase.database().ref(`/records/`);
		this.recordRef.on('value', this._onRecordsReceived);
	}

	componentWillUnmount() {
		this.recordRef.off('value', this._onRecordsReceived);
	}

	_renderLoading() {
		return (
			<div className='loading-box'>
				<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				<p id='loading'>Loading...</p>
			</div>
		);
	}

	_renderTable() {
		return (null);
	}

	render() {
		if (!this.props.user)
			return this._renderLoading();
		if (this.props.user && this.props.user.level <= this.props.level)
			return (
				<div className='form-container'>

					<h1 id='title'>Report</h1>
					{this.state.loading ? this._renderLoading() : this._renderTable()}

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