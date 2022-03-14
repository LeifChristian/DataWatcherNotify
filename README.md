# PRICE REPORTER API AND NOTIFIER
This app makes a simple call to coingecko API, returns the last 6 values for BTC per desired increment, 
and compares them to each other. If (condition A) is true, an email is sent to an address showing the percent change.

If a second more urgent condition (condition B) is true, the user is called and emailed as well.

# INSTALL & RUN
npm install
nodemon cryptoReporter.js

# APIs USED
Integrating Gmail and Twilio APIs with coingecko's API for realtime price information.

# GMAIL API
This app will require your own API key from Gmail, which will be included in the project in a credentials.json and a token.json file. More info here: https://developers.google.com/gmail/api/quickstart/nodejs.

Run the app once installed, Follow Google prompts via the cli to confirm and generate your local auth token.

# ADAPTATION IDEAS
This app can be used to watch any data and notify a user via phone or email if a condition changes based on an API response.
Watch any stock market value, server side data or threshhold based data, call or email a user when condition is true
Can auto send a response to a user based on any condition. 
Heck, you could even call someone every year on their birthday.

# ENVIRONMENT VARIABLES
API tokens for Twilio should be stored in .env file in the root of the project. 
Accessed these variables via process.env.MY_VARIABLE and the dotenv package, which is included.
View the Gmail API documentation to create your credentials.json and generate your token.

in your .env file in the root of the project, add the folowing variables:

MY_ACCT_SID= (Twilio Accout SID here)
MY_TOKEN=(Twilio Token Here)

# ENJOY!
