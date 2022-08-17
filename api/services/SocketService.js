
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

function sendInferenceResult(data, req) {
  const utfData = data.toString('utf8');
  const jsonData = JSON.parse(utfData);
  console.log("sendInferenceResult: data received:", utfData, jsonData);
  if (req) {
    const roomName = `inference-result-${_.deburr(this.req.sessionID)}`;
    sails.sockets.broadcast(roomName, 'inference', { data: jsonData }, req);
  } else {
    console.log("sendInferenceResult: Missing req parameter");
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