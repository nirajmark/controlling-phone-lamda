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

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const constantValues = require('./config')

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'SilentPhoneIntent': function () {
        this.emit('SilentPhone');
    },
    'SilentPhone': function () {
        var resultString ='';
        //calling api to silent the phone

        console.log('this.t.API_KEY = '+this.t('API_KEY'));
        var sender = new gcm.Sender(this.t('API_KEY'));

        // Prepare a message to be sent
        var message = new gcm.Message({
            data: { action: 'silent' }
        });

        // Specify which registration IDs to deliver the message to
        console.log('this.t.registrationTokens = '+this.t('registrationToken'));
        var regTokens = [this.t('registrationToken')];
        const outerContext = this;

        // Actually send the message
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if (err) {
              console.error(err);
              resultString = 'is not done';
            }
            else{
              console.log(response);
              resultString = 'is done';
            }

            // Create speech output
            // console.log("this.t('SKILL_NAME') = " +this.t('SKILL_NAME'));
            // console.log("this.t(resultString) = " +this.t(resultString));
            const speechOutput = 'Silencing the phone ' + resultString;
            outerContext.emit(':tellWithCard', speechOutput, 'Phone Controller', speechOutput);
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
