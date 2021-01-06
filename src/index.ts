require('app-module-path').addPath(__dirname);
require('source-map-support').install();

import { Debug, LogTag } from '00_Utils/debugger';

import SlackBot from 'slackbots';

const dotenv = require('dotenv');
dotenv.config();

Debug.log(process.env.SLACK_BOT_TOKEN);

const bot = new SlackBot({
  token: process.env.SLACK_BOT_TOKEN,
  name: 'Kubernetes'
});


const { exec } = require('child_process');

async function terminal(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
	    reject(err);
	  } else if (stderr) {
        reject(err);
	  } else {
        resolve(stdout);
	  }
	});
  });
}

bot.on('start', () => {
  Debug.log(LogTag.NOWAY, 'SLACK BOT STARTED!');
});

bot.on('error', (err) => {
  console.log(err);
});

bot.on('message', async (data) => {
  if (data.type !== 'message' || data.user === undefined) {
    return;
  }
  let message: string = '';
  try {
    message = await terminal(data.text);
  } catch(err) {
    message = err.message;
  }
  bot.postMessage(
    data.channel,
	message
  );
});
