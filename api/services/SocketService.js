
let bIsSocketConnected = false;
let oSocketClient;

function setSocketConnected(isConnected) {
  bIsSocketConnected = isConnected;
}

function isSocketConnected() {
  return bIsSocketConnected;
}

function setSocketClient(client) {
  oSocketClient = client;
}

function sendInferenceResult(data) {
  const utfData = data.toString('utf8').replace('\x00','');
  try {
    const roomName = `inference-result`;
    sails.sockets.broadcast(roomName, 'inference', { data: JSON.parse(utfData) });
  } catch (e) {
    console.log("sendInferenceResult:e", utfData, e);
  }
}

function sendImageData(base64Image) {
  if (oSocketClient) {
    oSocketClient.write(JSON.stringify({'data': base64Image}));
  } else {
    console.log("sendImageData: called without live socket client.");
  }
}

module.exports = {
  setSocketConnected,
  isSocketConnected,
  sendInferenceResult,
  setSocketClient,
  sendImageData
};