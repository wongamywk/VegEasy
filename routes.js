var Pages = require('./controllers/pages');
var Static = require('./controllers/static');
var Authentication = require('./controllers/authentication');

/**
 * Contains the list of all routes, i.e. methods, paths and the config functions
 * that take care of the actions
 */
exports.endpoints = [

//routes to dynamic pages
	//loads different search pages for visitors and members respectively
	{ method: 'GET',  path: '/recipes', 					 config: Pages.recipes	},

	//for members login
	{ method: 'GET',   path: '/login',          							config: Pages.login},
	{ method: 'POST',   path: '/login',          config: Authentication.login },

	//for members registration
	{ method: 'GET',   path: '/register',      							  config: Pages.register 	},
	{ method: 'POST',   path: '/register',       config: Authentication.register },

	//for email verfication
	{ method: 'GET',   path: '/verify/{vericode*}',        config: Pages.verify 		},
	{ method: 'POST',   path: '/verification',   config: Authentication.Verification },

	//loads when user logged in successfully
	{ method: 'GET',   path: '/success', 											config: Pages.secret   	},

//retrieve items from fav list
	{ method: 'GET',  path: '/editfavlist/', 					 config: Authentication.editfavlist 	},
	//add/remove items in fav list
	{ method: 'PUT',   path: '/removefavlist/{recipe_id*}',  config: Authentication.removefav },
	{ method: 'PUT',   path: '/addfavlist/{recipe_id*}',  config: Authentication.addfav },

	{ method: 'GET',    path: '/logout',         							config: Authentication.logout },


	//routes to static pages
	{ method: 'GET',    path: '/',               	 config: Pages.index  	},
	{ method: 'GET',  path: '/public/{param*}',    config: Static.public 	},
	{ method: 'GET',  path: '/home', 							 config: Static.home 		},
	{ method: 'GET',  path: '/menu', 							 config: Static.menu 		},
	{ method: 'GET',  path: '/member', 						 config: Static.member 	},
	{ method: 'GET',  path: '/contact', 					 config: Static.contact },
	{ method: 'GET',  path: '/doc', 					 		 config: Static.doc },
	//loads Google map API
	{ method: 'GET',  path: '/map', 							 config: Static.map 		},

];
