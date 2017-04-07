#VegEasy - 305CDE Assignment
========================
### What you can do

A simple webserver of a vegetarian restaurant(which does not exist) with authentication built with Hapi, Hapi-auth-cookie, and Mongoose. Users can:
1) Search online recipes from food2fork.com (public API provider)
2) Add recipes to their favourite list (members only)
3) delete recipes from their favourite list (members only)
4) view the location of the restaurant (using Google Map API)

========================

### Before proceeding
Make sure you have done the below before proceeding:
1) Install Mongodb
2) edit your gmail account and password in "/controllers/authentication.js" --> export.register
(to test the email verification)


### Install an app

Run the following command in root directory of an app in command prompt.
(Make sure package.json is present in your directory)

###### *Install node packages*

```
npm install
```

### Run an app

###### *Run Server*

Run the following command in root directory of an app in command prompt.
```
node server.js
```
You can see the port number in command prompt after sucessfull run

```
The server has started on port: 5000
Connection with database succeeded.

```

You can change the settings in server/config/config.js file
