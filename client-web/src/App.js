import React, { Component } from 'react';
import "./stylesheets/font-awesome-4.7.0/css/font-awesome.min.css";
import {
	Route
} from 'react-router-dom';
import {
	// Nav,
	// Navbar,
	// NavItem,
	// MenuItem,
	Dropdown,
} from 'react-bootstrap';
import * as firebase from 'firebase';
import Sidebar from 'react-sidebar';
import ReportPage from './pages/ReportPage';

import './stylesheets/App.css';

const sidebarStyle = {
	root: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		overflow: 'hidden',
		backgroundColor: '#f7f7f7',
	},
	sidebar: {
		zIndex: 2,
		position: 'absolute',
		top: 0,
		bottom: 0,
		transition: 'transform .3s ease-out',
		WebkitTransition: '-webkit-transform .3s ease-out',
		willChange: 'transform',
		overflowY: 'auto',
		backgroundColor: 'white',
		// padding: '16px 24px',
		minWidth: 320,
	},
	content: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		overflowY: 'scroll',
		WebkitOverflowScrolling: 'touch',
		transition: 'left .3s ease-out, right .3s ease-out',
	},
	overlay: {
		zIndex: 1,
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		opacity: 0,
		visibility: 'hidden',
		transition: 'opacity .3s ease-out, visibility .3s ease-out',
		backgroundColor: 'rgba(0,0,0,.3)',
	},
	dragHandle: {
		zIndex: 1,
		position: 'fixed',
		top: 0,
		bottom: 0,
	},
};

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentUser: null,
			sidebarDocked: false,
			sidebarOpen: false,
			currentTab: -1,
		}

		this.tabs = [
			{ title: 'Report', path: '/report' },
			{ title: 'Dish Management', path: '/dish_management' },
			{ title: 'Recipe Management', path: '/recipe_management' },
			{ title: 'Ingredient Management', path: '/ingredient_management' },
		];

		this.mql = window.matchMedia(`(min-width: 1520px)`);
		this._mediaQueryChanged = this._mediaQueryChanged.bind(this);
		this._onSetSidebarOpen = this._onSetSidebarOpen.bind(this);
	}

	_onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open });
	}

	_mediaQueryChanged() {
		this.setState({ sidebarDocked: this.mql.matches });
	}

	componentWillMount() {
		this.mql.addListener(this._mediaQueryChanged);
		this.setState({ sidebarDocked: this.mql.matches });

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// // User is signed in.
				// var displayName = user.displayName;
				// var email = user.email;
				// var emailVerified = user.emailVerified;
				// var photoURL = user.photoURL;
				// var isAnonymous = user.isAnonymous;
				// var uid = user.uid;
				// var providerData = user.providerData;
				// // ...
				this.setState({ currentUser: user }, () => console.log(this.state.currentUser));
				this._changeTab(0);
			} else {
				this.props.history.replace('/login');
			}
		});
	}

	componentWillUnmount() {
		this.mql.removeListener(this.mediaQueryChanged);
	}

	_onNavSelect() {
	}

	_signOut()
	{
		firebase.auth().signOut();
	}

	_renderNavBar() {
		return (
			<div className='custom-navbar'>
				{
					this.state.sidebarDocked ?
						null :
						<i className="nav-icon fa fa-bars fa-2x" onClick={() => { this._onSetSidebarOpen(!this.state.sidebarOpen) }} />
				}

				<div style={{ flex: 1 }} />

				<Dropdown pullRight id='dropdown'>
					{/*<p>{this.state.currentUser ? this.state.currentUser.displayName : ''}</p>*/}
					<span bsRole="toggle"><i className="nav-icon fa fa-user-circle-o fa-2x" /></span>

					<div className="dropdown-menu dropdown-menu-right" bsRole='menu'>
						<div className="dropdown-item" onClick={() => this._signOut()}><span>Sign out</span></div>
					</div>
				</Dropdown>
			</div>
		);
	}

	_changeTab(index) {
		let item = this.tabs[index];
		if (this.state.currentTab === -1)
			this.props.history.replace(item.path)
		else
			this.props.history.push(item.path)
		document.title = 'MMS - ' + item.title;
		this.setState({ currentTab: index });
	}

	_renderSideBarContent() {
		return (
			<div>
				<img id='sidebar-logo' alt='logo' src={require('./res/logo.svg')} />
				{this.tabs.map((item, index) => {
					return (
						<div key={item.path}
							className={'sidebar-item' + (this.state.currentTab === index ? " sidebar-item-active" : "")}
							onClick={() => { this._changeTab(index) }}>
							{item.title}
						</div>
					);
				})}
			</div>
		);
	}

	render() {
		return (
			<div className="App">

				<Sidebar docked={this.state.sidebarDocked} shadow={false}
					sidebar={this._renderSideBarContent()}
					open={this.state.sidebarOpen}
					onSetOpen={this._onSetSidebarOpen} styles={sidebarStyle}>

					{this._renderNavBar()}

					<div className="container">

						{/* Routes here */}
						<Route path='/report' component={ReportPage} />
						<Route path='/dish_management' component={ReportPage} />
						<Route path='/recipe_management' component={ReportPage} />
						<Route path='/ingredient_management' component={ReportPage} />

					</div>

				</Sidebar>

			</div>
		);
	}
}

export default App;
