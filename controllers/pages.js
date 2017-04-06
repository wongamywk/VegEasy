//routes to the default page
exports.index = {

	handler: function (request, reply) {
		return reply.view('index');
	}
};

/**
 * Handles a call to /login and shows a login form
 */
exports.login = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			//console.log(request.auth.credentials.username);
			return reply.redirect('/success');
		}

   		return reply.view('login',{errorMessage: ""});
	}
};

//Allows users to save favourite list only after loggin in
exports.recipes = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {

			return reply.view('recipesmember', {usr: request.auth.credentials.username});
		}
		//if the visitor has not become a member yet
			return reply.view('recipes',{errorMessage:""});
	}
                  };

//Handles a call to /verify/* and shows a verification form

exports.verify = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			return reply.redirect('/success');
		}

   		return reply.view('verify',{errorMessage: ""});
	}
};

/**
 * Handles a call to /register and shows a registration form
 */
exports.register = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			return reply.redirect('/success');
		}

		return reply.view('register',{errorMessage: ""});
	}
};


//Handles when user has logged in successfully and shows member stuff
exports.secret = {
	auth: 'session',

	handler: function (request, reply) {
	//	console.log(request.auth.credentials.username);
		if (request.auth.isAuthenticated) {
		return reply.view('favlist', {
			email: request.auth.credentials.email, userid: request.auth.credentials.username
		});
	}
		return reply.redirect('/login',{errorMessage: "Please log in."});
	}

};
