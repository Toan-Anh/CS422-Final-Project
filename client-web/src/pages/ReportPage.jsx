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
		let records = [];
		this.setState({ records: records, loading: false });
	}

	componentWillMount() {
		this.recordRef = firebase.database().ref(`/records/`);
		this.recordRef.on('value', this._onRecordsReceived);
	}

	componentWillUnmount() {
		this.recordRef.off('value', this._onRecordsReceived);
	}



	render() {
		return (
			<div className='form-container'>

				<h1 id='title'>Report</h1>
				{/*{this.state.loading ? this._renderLoading() : this._renderTable()}*/}

			</div>
		);
	}
}