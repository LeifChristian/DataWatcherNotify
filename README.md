# PRICE REPORTER API AND NOTIFIER
This app makes a simple call to coingecko API, returns the last 12 values for BTC per desired increment, 
and compares them to each other. If (condition A) is true, an email is sent to an address showing the percent change.
If a second more urgent condition (condition B) is true, the user is called and emailed as well.

# APIs USED
Integrated Gmail and Twilio APIs with coingecko.

# GMAIL API
This app will require your own authorization and API key from Gmail, which will be included in the project in a "credentials.json and a token.json file. More info here: https://developers.google.com/gmail/api/quickstart/nodejs

# INSTALL & RUN
npm install
nodemon cryptoReporter.js

# ADAPTATION IDEAS
This app can be used to watch any data, and notify users via phone or email if a condition changes based on API response.
Watch any stock market value, server side data or threshhold based data, call and email a user when condition is true

# ENVIRONMENT VARIABLES
API tokens for Gmail and Twilio should be stored in .env file in the root of the project. Accessed through process.env and the dotenv package

# ENJOY!
