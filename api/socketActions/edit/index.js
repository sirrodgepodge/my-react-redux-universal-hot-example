import * as actionTypes from '../../../src/shared/redux/actionTypes';


export default socket => {
  // join "room"
  socket.on('joinChannel', channelName => socket.join(channelName));

  // leave "room"
  socket.on('leaveChannel', channelName => socket.leave(channelName));

  // emit edit to same user logged in elsewhere (done by using a 'channel' based off email)
  socket.on(actionTypes.EDIT_POST, action => socket.broadcast.to(action.post.email).emit(actionTypes.EDIT_POST, action));
};
