VegEasy - 305CDE Assignment
========================

A simple webserver of a vegetarian restaurant(which does not exist) with authentication built with Hapi, Hapi-auth-cookie, and Mongoose, users can:
1) Search online recipes from food2fork.com (public API provider)
2) Add recipes to their favourite list (members only)
3) delete recipes from their favourite list (members only)
4) view the location of the restaurant (using Google Map API)

========================

Make sure you have done the below before proceeding:
1) Install Mongodb
2) edit your gmail account and password in "/controllers/authentication.js" --> export.register
(to test the email verification)


### Install an app

Run the following command in root directory of an app in command prompt.
(Make sure package.json is present in your directory)

###### *Install node packages*

server/ npm install

### Run an app

###### *Run Server*

Run the following command in root directory of an app in command prompt.

server/ node server.js

You can see the port number in command prompt after sucessfull run

You can change the settings in server/config/config.js file
