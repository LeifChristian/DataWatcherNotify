
// let accountSid = process.env.MY_ACCT_SID;
// let authToken = process.env.MY_TOKEN;

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
let lastbtc = Number;
let resultbtc = Number;
let repCount = 0;

let interval = 10000
let firstPassAda = true;
let firstPassBtc = true;

let getAda = async () => {

    axios(config)
    .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    //   console.log(response.data);

    if(firstPassAda) {
    
     console.log('first time')
     firstPassAda=false
      for(i in response.data) {
    
    if(response.data[i].ticker_id == "ADA_USDT") {
    //    console.log(response.data[i])
       lastAda = response.data[i].last_price;
       console.log('last price: ' + lastAda)
    }
      }}

      else {
      for(i in response.data) {
    
        if(response.data[i].ticker_id == "ADA_USDT") {
            // console.log(response.data[i])
           if(lastAda > parseFloat(response.data[i].last_price)){
            console.log('went down');
           }

           if(lastAda < parseFloat(response.data[i].last_price)){
            console.log('went up');
           }

           if(lastAda == parseFloat(response.data[i].last_price)){
            console.log('no change');
           }

           console.log(parseFloat(lastAda), "last price")
           console.log(parseFloat(response.data[i].last_price), "new price")
           lastAda = response.data[i].last_price;
                // console.log(lastAda)
        }
          }}
    })
    .catch(function (error) {
      console.log(error);
    });
}

let getbtc = async () => {

    axios(config)
    .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    //   console.log(response.data);
    if(firstPassBtc) {
         firstPassBtc = false
        // console.log('first time')
  
      for(i in response.data) {
    
    if(response.data[i].ticker_id == "BTC_USD") {
    //    console.log(response.data[i])
       lastbtc = response.data[i].last_price;
       console.log(parseFloat(lastbtc), "current price")
    }
      }}

      else {
      for(i in response.data) {

        if(response.data[i].ticker_id == "BTC_USD") {
            // console.log(response.data[i])
            
           if(lastbtc > parseFloat(response.data[i].last_price)){
            console.log('went down');
             resultbtc = parseFloat(response.data[i].last_price)/lastbtc;
           }

           if(lastbtc < parseFloat(response.data[i].last_price)){
            console.log('went up');
             resultbtc = lastbtc/parseFloat(response.data[i].last_price);
           }

           if(lastbtc == parseFloat(response.data[i].last_price)){
            console.log('no change');
           }

           console.log(parseFloat(lastbtc), "last price")
           console.log(parseFloat(response.data[i].last_price), "new price")
           lastbtc = response.data[i].last_price;

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
          }}
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

    if(repCount<2){repCount++; console.log('rep count', repCount)}else{repCount=0;}

     getbtc()
  }, interval);
  