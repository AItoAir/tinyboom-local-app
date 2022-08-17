module.exports = {

  friendlyName: 'Listen inference result',

  exits: {
    success: {
      description: 'The requesting socket is now subscribed to socket broadcasts about inference result.',
    },
  },

  fn: async function ({}) {
    if (!this.req.isSocket) {
      throw new Error('This action is designed for use with the virtual request interpreter (over sockets, not traditional HTTP).');
    }

    const roomName = `inference-result-${_.deburr(this.req.sessionID)}`;
    sails.sockets.join(this.req, roomName);
  }

};
