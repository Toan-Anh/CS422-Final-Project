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
	DishManagementPage,
	// RecipeManagementPage,
	IngredientManagementPage,
	RecipeDetailPage,
	OrderPage,
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
		zIndex: 11,
	},
	content: {
	},
	overlay: {
		zIndex: 10,
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
			{ title: 'Report', path: '/report', component: ReportPage, level: 0 },
			{ title: 'Orders', path: '/orders', component: OrderPage, level: 1 },
			{ title: 'Dish Management', path: '/dish_management', component: DishManagementPage, level: 2 },
			// { title: 'Recipe Management', path: '/recipe_management' },
			{ title: 'Ingredient Management', path: '/ingredient_management', component: IngredientManagementPage, level: 2 },
		];
		this.roles = null;

		this.mql = window.matchMedia(`(min-width: 1520px)`);
		this._mediaQueryChanged = this._mediaQueryChanged.bind(this);
		this._onSetSidebarOpen = this._onSetSidebarOpen.bind(this);
		this._onOrderAdded = this._onOrderAdded.bind(this);
	}

	_onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open });
	}

	_mediaQueryChanged() {
		this.setState({ sidebarDocked: this.mql.matches });
	}

	componentWillMount() {
		this.orderRef = firebase.database().ref(`/orders/`);
		this.orderRef.on('child_added', this._onOrderAdded);

		this.mql.addListener(this._mediaQueryChanged);
		this.setState({ sidebarDocked: this.mql.matches });

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this._navigateByUser(user);
			} else {
				this.props.history.replace('/login');
			}
		});
	}

	componentWillUnmount() {
		this.mql.removeListener(this.mediaQueryChanged);
		this.orderRef.off('child_added', this._onOrderAdded);
	}

	_extractLevel(users, user, callback) {
		Object.keys(users).some(key => {
			let data = users[key];
			if (data.email === user.email) {
				user.level = this.roles[data.role];
				return true;
			}
			return false;
		});
		callback(user.level);
		this.setState({ currentUser: user });
	}

	_navigateByUser(user) {
		this.userRef = firebase.database().ref(`/users/`);
		this.userRef.once('value', (snapshot) => {
			if (!this.roles) {
				firebase.database().ref(`/roles/`).once('value', s => {
					this.roles = s.val();
					this._extractLevel(snapshot.val(), user, (user_level) => this._navigate(user_level));
				});
			}
			else
				this._extractLevel(snapshot.val(), user, (user_level) => this._navigate(user_level));
		});
	}

	_navigate(user_level) {
		if (this.props.location.pathname === '/') {
			for (let i = 0; i < this.tabs.length; ++i) {
				if (user_level <= this.tabs[i].level) {
					this._changeTab(i);
					break;
				}
			}
		}
		else {
			this.tabs.forEach((tab, index) => {
				if (this.props.location.pathname === tab.path)
					this._changeTab(index);
			});
		}
	}

	_onOrderAdded(snapshot) {
		if (this.state.currentUser && this.state.currentUser.level <= 1) {
			let title = 'New order';
			let options = {
				body: 'A new order has arrived',
				icon: "https://firebasestorage.googleapis.com/v0/b/mini-restaurant-management.appspot.com/o/logo.png?alt=media&token=2d22531d-5c69-4ffb-bc44-8d1719345665",
				url: '/orders'
			};

			this._notifyUser(title, options);
		}
	}

	_notifyUser(title, options) {
		if (!("Notification" in window)) {
			console.log("This browser does not support desktop notification");
		}
		// Let's check whether notification permissions have already been granted
		else if (Notification.permission === "granted") {
			// If it's okay let's create a notification
			// var notification = new Notification(title, options);
			// notification.onclick = () => window.open('/orders');
			new Notification(title, options);
		}
		// Otherwise, we need to ask the user for permission
		else if (Notification.permission !== "denied") {
			Notification.requestPermission(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					// var notification = new Notification(title, options);
					// notification.onclick = () => window.open('/orders');
					new Notification(title, options);
				}
			});
		}

		// At last, if the user has denied notifications, and you 
		// want to be respectful there is no need to bother them any more.
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
			this.props.history.replace(item.path);
		else
			this.props.history.push(item.path);
		document.title = 'MMS - ' + item.title;
		this.setState({ currentTab: index, sidebarOpen: this.state.sidebarDocked });
	}

	_renderSideBarContent() {
		return (
			<div className="sidebar-container">
				<img id='sidebar-logo' alt='logo' src={require('./res/logo.svg')} />
				{this.tabs.map((item, index) => {
					if (this.state.currentUser && item.level >= this.state.currentUser.level)
						return (
							<div key={item.path}
								className={'sidebar-item' + (this.state.currentTab === index ? " sidebar-item-active" : "")}
								onClick={() => { this._changeTab(index) }}>
								{item.title}
							</div>
						);
					return <div key={item.path} />;
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
						{/*<Route path='/report' component={ReportPage} level={this.tabs}/>
						<Route path='/orders' component={IngredientManagementPage} />
						<Route path='/dish_management' component={DishManagementPage} />
						<Route path='/recipes/:recipe_name' component={RecipeDetailPage} />
						<Route path='/ingredient_management' component={IngredientManagementPage} />*/}
						{this.tabs.map(item => {
							return (
								<Route key={item.path} path={item.path} render={(props) =>
									<item.component level={item.level} user={this.state.currentUser} {...props} />} />
							);
						})}
						<Route path='/recipes/:recipe_name' render={(props) =>
							<RecipeDetailPage level={2} user={this.state.currentUser} {...props} />} />

					</div>

				</Sidebar>

			</div>
		);
	}
}

export default App;
