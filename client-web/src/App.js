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
import {
	ReportPage,
	RecipeManagementPage,
	IngredientManagementPage,
	AddRecipePage
} from './pages';

import './stylesheets/App.css';

const sidebarStyle = {
	root: {
		backgroundColor: '#f7f7f7',
	},
	sidebar: {
		backgroundColor: 'white',
		// padding: '16px 24px',
		minWidth: 320,
	},
	content: {
	},
	overlay: {
	},
	dragHandle: {
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
				this.setState({ currentUser: user });

				if (this.props.location.pathname === '/')
					this._changeTab(0);
				else {
					this.tabs.forEach((tab, index) => {
						if (this.props.location.pathname === tab.path)
							this._changeTab(index);
					})
				}

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

	_signOut() {
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
		this.setState({ currentTab: index, sidebarOpen: this.state.sidebarDocked });
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
						<Route path='/recipe_management' component={RecipeManagementPage} />
						<Route path='/ingredient_management' component={IngredientManagementPage} />

						<Route path='/add_recipe' component={AddRecipePage} />

					</div>

				</Sidebar>

			</div>
		);
	}
}

export default App;
