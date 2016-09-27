
const fs = require('fs');
const Horseman = require('node-horseman');
var horseman = new Horseman();

var recipient = '';
var message = '';
var credentials = null;

if (!process.env.RECIPIENT || 
    !process.env.MESSAGE || 
    !process.env.NM_USER ||
    !process.env.NM_PASS) {
  
  fs.readFile('local_var.json', 'utf8', function(error, data) {

    if (error) {
      console.log(error);
    } else {
      var localVars = JSON.parse(data);
      
      recipient = localVars.recipient;
      message = localVars.message;
      credentials =
        { user: localVars.nm_user
        , pass: localVars.nm_pass
        };

      startHorseman();
    }
  });

} else {
  recipient = process.env.RECIPIENT;
  message = process.env.MESSAGE;
  credentials =
    { user: process.env.NM_USER
    , pass: process.env.NM_PASS
    };

  startHorseman();
}

function startHorseman() {
horseman
  // Don't need?
  // .userAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25')

  // Login
  .open('https://www.neonmob.com/login')
  .type('input[id="field-username"]', credentials.user)
  .type('input[id="field-password"]', credentials.pass)
  .click('button#signin-btn.btn.full.ng-scope')
  .waitForNextPage()
  
  
  .exists('a.sett-card--name.text-prominent.ng-binding')
  .then((exists) => {
    console.log((exists) ? blue('Logged in') : red('Login failed'));
  })
   

  // Navigate to user profile
  .open('https://www.neonmob.com/' + recipient)
  
  
  // Log profile name to console 
  .text('h1.profile-bio--name')
  .then((text) => {
    console.log('Profile of:', text);
  })
  

  // Wait for message button, then click it
  .waitForSelector('span.btn-with-tip.btn.subdued.small.tip.ng-scope.ng-isolate-scope')
  .click('span.btn-with-tip.btn.subdued.small.tip.ng-scope.ng-isolate-scope')  

  // Wait for the textarea to show up
  .waitForSelector('textarea.comments--field--entry')

  // Type message into comments field
  .type('textarea.comments--field--entry', message)

  // Click on 'Post Message' button
  .mouseEvent('mousedown', 50, 270)

  .close();
}

// MARK: Color console text
function blue(s) {
  return '\033[0;34m' + s + '\033[0;0m'
}

function red(s) {
  return '\033[0;31m' + s + '\033[0;0m'
}