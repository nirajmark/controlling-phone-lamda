/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
var gcm = require('node-gcm');
const mongoose = require('mongoose');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const constantValues = require('./config');

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'SilentPhoneIntent': function () {
        mongoose.connect(this.t('mongoURI'),(err)=>{
          if (err) {
            console.log("not able to connect to db");
            require('./models/User');
            this.emit('SilentPhone');
          }else{
            console.log("connection to db is success");
            require('./models/User');
            this.emit('SilentPhone');
          }
        });

    },
    'SilentPhone': function () {
        var resultString ='';
        //calling api to silent the phone
        const User = mongoose.model('users');

        console.log('this.t.API_KEY = '+this.t('API_KEY'));
        var sender = new gcm.Sender(this.t('API_KEY'));

        // Prepare a message to be sent
        var message = new gcm.Message({
            data: { action: 'silent' }
        });



        // Specify which registration IDs to deliver the message to
        // console.log('this.t.registrationTokens = '+this.t('registrationToken'));
        // var regTokens = [this.t('registrationToken')];
        const outerContext = this;

        //new - getting registration token from db
        console.log("userID = "+this.t('userID'));
        User.findOne({_id:this.t('userID')}).
          then((existingUser)=>{
            if(existingUser){
              console.log('existingUser = '+JSON.stringify(existingUser));
              var regTokens = [existingUser.gcmToken];
              // Actually send the message

              sender.send(message, { registrationTokens: regTokens }, function (err, response) {
                  if (err) {
                    console.error(err);
                    resultString = 'is not done';
                  }
                  else {
                    console.log(response);
                    resultString = 'is done';
                  }
                  const speechOutput = 'Silencing the phone ' + resultString;
                  outerContext.emit(':tellWithCard', speechOutput, 'Phone Controller', speechOutput);
              });
            }else{
              const speechOutput = 'Could Not find user in database' ;
              outerContext.emit(':tellWithCard', speechOutput, 'Phone Controller', speechOutput);
            }
          });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {



    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = constantValues;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
