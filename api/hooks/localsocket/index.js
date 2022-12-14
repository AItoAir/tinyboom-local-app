
const net = require('net');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function startPythonSocketService() {
  setTimeout(async () => {
    try {
      const commandString = `LD_LIBRARY_PATH=${sails.config.custom.ldLibPath} ./${sails.config.custom.tbmFile} --socket_path ${sails.config.custom.tbmSocketFile}`;
      console.log("startPythonSocketService:commandString", commandString);
      const { stdout, stderr } = await exec(commandString, { shell: '/bin/bash', cwd: sails.config.custom.tbmCwd });
      console.log("startPythonSocketService:stdout, stderr", stdout, stderr);
    } catch (e) {}
  }, 100);
}

async function startSocketClient() {
  const SOCKET_FILE = path.join(sails.config.custom.tbmCwd, sails.config.custom.tbmSocketFile);
  setTimeout(async () => {
    try {
      const client = net.createConnection(SOCKET_FILE);
      client.on("connect", function() {
        console.log("startSocketClient: Connected!");
        SocketService.setSocketConnected(true);
        SocketService.setSocketClient(client);
      });
      client.on("data", function(data) {
        SocketService.sendInferenceResult(data);
      });
    } catch (e) {}
  }, 1000);
}

module.exports = function (sails) {
  return {
    initialize: async function () {
      sails.log.info('Initializing project hook... (`api/hooks/localsocket/`)');

      await startPythonSocketService();
      await startSocketClient();
    }
  };
};
