const inquire = require('inquirer');
const shell = require('shelljs');
// Add autocomplete plugin
inquire.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const functions = [
    'ProcessMessageNotificationsFunction',
    'SendEmailSESFunction',
    'SesBouncesFunction',
    'SesComplaintsFunction'
];

const actions = [
    'test:api',
    'test:invoke',
    'test:debug',
    'triage:logs',
    'triage:logs:tail',
    'triage:logs:error'
];

const events = [
    'apiEvent',
    'snsEvent',
    'sqsEvent',
    'snsEmailBounceEvent',
    'snsEmailComplaintEvent'
];

const commands = {
    'test:api': () => shell.exec('sam local start-api'),
    'test:invoke': (functionName, eventFile) =>
        shell.exec(
            `sam local invoke -e src/events/${eventFile}.json --env-vars env.json ${functionName}`
        ),
    'test:debug': (functionName, eventFile) =>
        shell.exec(
            `sam local invoke -d 5858 -e src/events/${eventFile}.json --env-vars env.json ${functionName}`
        ),
    'triage:logs': functionName => shell.exec(`sam logs -n ${functionName} --stack-name sam-app`),
    'triage:logs:tail': functionName =>
        shell.exec(`sam logs -n ${functionName} --stack-name sam-app --tail`),
    'triage:logs:error': functionName =>
        shell.exec(`sam logs -n ${functionName} --stack-name sam-app --filter 'error'`)
};

const chooseFunction = {
    type: 'list',
    name: 'functionPrompt',
    message:
        'Please choose a function to test by typing one or press tab to autocomplete a matched function. Default no function: \n ',
    choices: functions
};

const chooseActions = {
    type: 'list',
    name: 'actionsPrompt',
    message: 'Please choose an action you would like to perform: \n',
    choices: actions
};

const chooseRunWithEvent = {
    type: 'list',
    name: 'chooseRunWithEvent',
    choices: ['Yes', 'No'],
    message: 'Do you wish to use an event on the execution?'
};

const chooseEvent = {
    type: 'list',
    name: 'eventPrompt',
    message: 'Please choose an event to use on the execution: \n',
    choices: events,
    when: function(answers) {
        return answers.chooseRunWithEvent === 'Yes';
    }
};

const prompt = async () => {
    const commandConfiguration = await inquire.prompt([
        chooseFunction,
        chooseActions,
        chooseRunWithEvent,
        chooseEvent
    ]);

    const functionName = commandConfiguration.functionPrompt;
    const actionName = commandConfiguration.actionsPrompt;
    const eventFile = commandConfiguration.eventPrompt ? commandConfiguration.eventPrompt : null;

    console.log(commandConfiguration);

    commands[actionName](functionName, eventFile);
};

prompt();
