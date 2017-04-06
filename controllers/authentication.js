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
        return reply.redirect('/verify');
      }

      if (passwordError) {
        // For now, just show the error and login form
        console.log(passwordError);
        return reply.view('verify', {
          errorMessage: passwordError.message
        });
      }

      if (request.param.vericode != user.vericode) {
        // For now, just show the error and login form
        console.log('Verification code is not correct.');
        return reply.view('verify', {
          errorMessage: "Please verify your account by clicking the link in your email."
        });
      }
      if(user){
        user.token = 1; //set token to confirm verification
          request.auth.session.set(user);
          var verifymessage = request.payload.email + " has been verified";

          console.log(request.payload.email + ' login successful and user token is ' + user.token);
          return reply.view('secrethideout', {
          email: verifymessage
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
        user: 'amy305cde@gmail.com',
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
      return reply.redirect('/login');
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