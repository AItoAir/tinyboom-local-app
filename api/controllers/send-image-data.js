module.exports = {

  friendlyName: 'Send image data',

  inputs: {
    data: {
      required: true,
      type: 'string',
    }
  },

  fn: async function ({data}) {
    SocketService.sendImageData(data);
  }

};
