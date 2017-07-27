var Joi = require('joi');
var User = require('../models/user');

/**
 * Responds to POST /login and logs the user in, well, soon.
 */
exports.login = {
  handler: function (request, reply) {
    User.authenticate()(request.payload.username, request.payload.password, function (err, user, passwordError) {

      // There has been an error, do something with it. I just print it to console for demo purposes.
      if (err) {
        console.error(err);
        return reply.redirect('/login');
      }

//wrong password or username
      if (passwordError) {
        // For now, just show the error and login form
        console.log(passwordError);
        return reply.view('login', {
          errorMessage: passwordError.message
        });
      //  return reply({success:false, error:passwordError.message})
      }

//username and password match
      if(user){
        //if the account has not been verified
        if (user.token === 0){
        console.log('pls verify email');
        var message = "Please verify your account first";
        return reply.view('login', {
          errorMessage: message
        });}
        else{
          request.auth.session.set(user);
          console.log(request.payload.email + ' login successful and user token is' + user.token);
          return reply.redirect('/success');}
      }

      return reply.redirect('/login');

    });
  }
};

exports.Verification = {
  handler: function (request, reply) {

    User.authenticate()(request.payload.username, request.payload.password, function (err, user, passwordError) {

      // There has been an error, do something with it. I just print it to console for demo purposes.
      if (err) {
        console.error(err);
        return reply.view('verify');
      }

      if (passwordError) {
        // For now, just show the error and login form
        console.log(passwordError);
        return reply.view('verify', {
          errorMessage: passwordError.message
        });
      }

      if(user.token === 1){
        var verifymessage = request.payload.username + " has been verified before";
        return reply.view('favlist', {
      email: user.email, userid: request.payload.username + verifymessage
      });}

      if(user){
          request.auth.session.set(user);
          var verifymessage = request.payload.username + " has been verified";
	      
	      //set token to confirm verification
          User.update( {"username": request.payload.username}, { $set: { token: "1" } },
          function (err, data) {
              if (err) return console.error(err);
              console.log(request.payload.username);
              console.log(data);

          }
        );
          console.log(request.payload.username + ' login successful and user token is ' + user.token);
          return reply.view('favlist', {
      		email: user.email, userid: request.payload.username + verifymessage
      		});
      }

      return reply.redirect('/login');

    });
  }
};
/**
 * Responds to GET /logout and logs out the user
 */
exports.logout = {
  auth: 'session',
  handler: function (request, reply) {
    request.auth.session.clear();
    reply().redirect('/login');
  }
};

/**
 * Responds to POST /register and creates a new user.
 */
exports.register = {
  validate: {
    payload: {
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })

    }
  },
  handler: function(request, reply) {

  //generate authentication token
var randToken =Math.floor((Math.random() * 100) + 54);


    // Create a new user, this is the place where you add firstName, lastName etc.
    // Just don't forget to add them to the validator above.
    var newUser = new User({
      username: request.payload.username,
      email: request.payload.email,
      vericode: randToken,
      token: 0
    });

    // The register function has been added by passport-local-mongoose and takes as first parameter
    // the user object, as second the password it has to hash and finally a callback with user info.
    User.register(newUser, request.payload.password, function(err, user) {



      // Return error if present
      if (err) {
        return reply(err);
      }

//prepare email verification link and send email
      var link = "http://127.0.0.1:5000" + "/verify/" + randToken;

const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: '305CDEAssignment'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"DO NOT REPLY" <amy305cde@gmail.com>', // sender address
    to: request.payload.email, // list of receivers
    subject: 'Account verification email', // Subject line
    //text: 'Hello world ?', // plain text body
    html: "Hello,<br> Please Click on the link to verify your email with your <u>username</u> and <u>password</u>.<br><a href=" + link + ">Click here to verify</a>"
   }

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
      console.log('registered');
      return reply.view('login', {errorMessage: 'Please check your mailbox to verify your account.'});
    });
  }
};

//loads fav list
exports.editfavlist = {

	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
      User.find({username: request.auth.credentials.username}, {fav:1},
          function (err, data) {
              if (err) return console.error(err);
              console.log(request.auth.credentials.username);
              console.log(data);
              return reply(data);

          }
      );
		}else{return reply.view('login',{errorMessage: "Members only. Pls login to continue."});}

	}
};

// add items to favlist
exports.addfav = {

	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {
  //  console.log(request.payload.f2f_url);
    //console.log(request.payload.image_url);
      //  console.log(request.payload.title);
	if (request.auth.isAuthenticated) {
//use $saddtoset to avoid adding duplicated items into the fav list
    User.update( {"username": request.auth.credentials.username}, { $addToSet: { "fav": {"recipe_id":request.params.recipe_id,"f2f_url":request.payload.f2f_url, "image_url":request.payload.image_url,"title":request.payload.title} } },
    function (err, data) {
         if (err) return console.error(err);
        return reply(data);
     }
 );
		}else{ return reply.view('login',{errorMessage: "Members only. Pls login to continue."}); }
	}

};

//remove recipes items from favouritelist
exports.removefav = {

	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {

    User.update({username: request.auth.credentials.username},  { $pull: { fav: { recipe_id: request.params.recipe_id } } },
     function (err, data) {
         if (err) return console.error(err);
        return reply(data);
     }
 );
		}else{ return reply.view('login',{errorMessage: "Members only. Pls login to continue."}); }
	}
};
