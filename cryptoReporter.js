
// let accountSid = process.env.MY_ACCT_SID;
// let authToken = process.env.MY_TOKEN;

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");


const accountSid = "AC6ebe7209c21cd5fbcdb66a63e691737f";
const authToken = "d50704a654d95bd4e1b2f56d34a51329";

const axios = require('axios');
const client = require("twilio")(accountSid, authToken);
const config = {
  method: 'get',
  url: 'https://betconix.com/api/v2/tickers',
  headers: { 
    'Cookie': 'betconix_session=cXYE2qBbryF4Q0ACzuN40k4SISvV9hC2UUNtE0Tk'
  }
};

let lastAda = Number;
let lastbtc = [];
let resultbtc = null;
let repCount = 0;

// 10000 is ten seconds, 60000 is one minute, 3600000 is one hour, 86400000 is 24 hours

let interval = 600000
let firstPassAda = true;
let firstPassBtc = true;

let getAda = async () => {

  await axios(config)
   .then(function (response) {
   //   console.log(JSON.stringify(response.data));
   //   console.log(response.data);

   let filteredResponse = response.data.filter((x)=> {return x.ticker_id == "ADA_USDT"});
   let btcResponse = filteredResponse[0];
   // console.log(btcResponse[0].last_price)

   if(firstPassBtc) {
      firstPassBtc = false
      lastbtc.push(btcResponse.last_price);
      console.log(parseFloat(lastbtc), "current price")
     }

     else {

           for (let f in lastbtc) {
           
          if(lastbtc[f] > parseFloat(btcResponse.last_price)){
           console.log('went down');
            resultbtc = parseFloat(btcResponse.last_price)/lastbtc[f];
          }

          if(lastbtc[f] < parseFloat(btcResponse.last_price)){
           console.log('went up');
            resultbtc = lastbtc[f]/parseFloat(btcResponse.last_price);
          }

          if(lastbtc[f] == parseFloat(btcResponse.last_price)){
           console.log('no change');
          }

          console.log(parseFloat(lastbtc[f]), "last price")
          console.log(parseFloat(btcResponse.last_price), "new price")
         
         
         }

          if(resultbtc>0.01){
           
           let message = `price changed by ${resultbtc.toString().replace("0.", "")}%`;
           console.log(message);
           client.messages.create({
               body: message,
               messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
               to: '+14065390742'})
               .then((message) => console.log(message.sid))
               .done();
       
       }
     
         }
         
   })
   .catch(function (error) {
     console.log(error);
   });
}


let getbtc = async () => {

   await axios(config)
    .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    //   console.log(response.data);

    let filteredResponse = response.data.filter((x)=> {return x.ticker_id == "BTC_USD"});
    let btcResponse = filteredResponse[0];
    // console.log(btcResponse[0].last_price)

    if(firstPassBtc) {
       firstPassBtc = false
       lastbtc.push(parseInt(btcResponse.last_price));
       console.log(parseFloat(lastbtc), "current price")
      }

      else {

            for (let f in lastbtc) {

          // if(lastbtc[f] == parseFloat(btcResponse.last_price)){
          //       console.log('no change');
          //      }   
            
           if(parseFloat(lastbtc[f]) > parseFloat(btcResponse.last_price)){
            console.log('went down');
             resultbtc = parseFloat(btcResponse.last_price)/parseFloat(lastbtc[f])
           }

           if(parseFloat(lastbtc[f]) < parseFloat(btcResponse.last_price)){
            console.log('went up since array index',f );
             resultbtc = parseFloat(lastbtc[f])/parseFloat(btcResponse.last_price);
           }           
          
          }

          console.log(parseFloat(lastbtc[lastbtc?.length-1]), "last price")
          console.log(parseFloat(btcResponse.last_price), "new price")

          // lastbtc.push('muffin')
          lastbtc.push(btcResponse.last_price)

          if(!resultbtc){console.log('no change')}
          
           if(resultbtc){ // console.log(resultbtc, "result ")

            let settleDown = ((100 - (resultbtc*100))).toPrecision(1)

            console.log(settleDown, '% change')

            // if(resultbtc>0.05){

              if(settleDown>=3 && settleDown<5){

            let message = `What up foo! BTC Price changed by ${settleDown}%`; console.log(message);
          
            sendEmail(message)
          
          }


          if(settleDown>5){

            let message = `What up foo! BTC Price changed by ${settleDown}%`; console.log(message);
          
            sendEmail(message)

             client.messages.create({
                body: message,
                messagingServiceSid: "MG6a6e4c67fd4bc51cec5f8e1223cad360",
                to: '+14065390742'})
                .then((message) => console.log(message.sid))
                .done();

          

          let timeElapsed = Date.now();
          const today = new Date(timeElapsed)

          // client.calls
          // .create({
          //    twiml: `<Response><Pause length="1"/><Say voice="woman"> ${today.toDateString().slice(4)}!! ${message}</Say></Response>`,
          //    to: '+14065390742',
          //    from: '+14062154416'
          //  })
          // .then(call => console.log(call.sid));
        
        }

            resultbtc=null;

        }
      }
         
    })
    .catch(function (error) {
      console.log(error);
    });
}

//getAda()

if(firstPassBtc){getbtc()}

setInterval(function () {
    var date = new Date(); // Or the date you'd like converted.
    var isoDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  
    let timeString = isoDateTime.slice(0, 19).replace("T", " ").replace("Z", "");
    console.log(timeString);
  
    //getAda()

    if(repCount<6){repCount++; console.log('rep count', repCount); console.log(lastbtc)
  
  }else{repCount=0; lastbtc.splice(0, 7)}

     getbtc()
  }, interval);
  

  let sendEmail = async (message) => {

    if(message==null){return}

      // AIzaSyDm7JyQMil4NoXYBUBInJl7V-vemCpoEqQ

  
      // If modifying these scopes, delete token.json.
      var SCOPES = [
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.send",
      ];
      // The file token.json stores the user's access and refresh tokens, and is
      // created automatically when the authorization flow completes for the first
      // time.
      const TOKEN_PATH = "./token.json";
  
      // Load client secrets from a local file.
      fs.readFile("credentials.json", (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Authorize a client with credentials, then call the Gmail API.
        authorize(JSON.parse(content), listLabels);
      });
  
      /**
       * Create an OAuth2 client with the given credentials, and then execute the
       * given callback function.
       * @param {Object} credentials The authorization client credentials.
       * @param {function} callback The callback to call with the authorized client.
       */
      function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uris[0]
        );
  
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getNewToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client);
        });
      }
  
      /**
       * Get and store new token after prompting for user authorization, and then
       * execute the given callback with the authorized OAuth2 client.
       * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
       * @param {getEventsCallback} callback The callback for the authorized client.
       */
      function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES,
        });
        console.log("Authorize this app by visiting this url:", authUrl);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question("Enter the code from that page here: ", (code) => {
          rl.close();
          oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("Error retrieving access token", err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log("Token stored to", TOKEN_PATH);
            });
            callback(oAuth2Client);
          });
        });
      }
  
      /**
       * Lists the labels in the user's account.
       *
       * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
       */
      function listLabels(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        gmail.users.labels.list(
          {
            userId: "me",
          },
          (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            const labels = res.data.labels;
            // if (labels.length) {
            //   console.log("Labels:");
            //   labels.forEach((label) => {
            //     console.log(`- ${label.name}`);
            //   });
            // } else {
            //   console.log("No labels found.");
            // }
          }
        );
      }
  
      function makeBody(to, from, subject, message) {
        var str = [
          'Content-Type: text/plain; charset="UTF-8"\n',
          "MIME-Version: 1.0\n",
          "Content-Transfer-Encoding: 7bit\n",
          "to: ",
          to,
          "\n",
          "from: ",
          from,
          "\n",
          "subject: ",
          subject,
          "\n\n",
          message,
        ].join("");
  
        var encodedMail = new Buffer(str)
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
        return encodedMail;
      }
  
      function sendMessage(auth) {
        var raw = makeBody(
         "mtmusicandart@gmail.com",
          "",
          "Email from Leify",
          message
        );
        const gmail = google.gmail({ version: "v1", auth });
        gmail.users.messages.send(
          {
            auth: auth,
            userId: "me",
            resource: {
              raw: raw,
            },
          },
          function (err, response) {
            return err || response;
          }
        );
      }
  
      fs.readFile(
        "credentials.json",
        function processClientSecrets(err, content) {
          if (err) {
            console.log("Error loading client secret file: " + err);
            return;
          }
          // Authorize a client with the loaded credentials, then call the
          // Gmail API.
          authorize(JSON.parse(content), sendMessage);
        }
      );
  
      sendMessage();
    }
