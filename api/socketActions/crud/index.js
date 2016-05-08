import * as actionTypes from '../../../src/redux/actionTypes';


export default socket => {
  // emit delete to other users
  socket.on(actionTypes.ADD_POST, action => socket.broadcast.emit(actionTypes.ADD_POST, action));

  // emit delete to other users
  socket.on(actionTypes.DELETE_POST, action => socket.broadcast.emit(actionTypes.DELETE_POST, action));

  // emit delete to other users
  socket.on(actionTypes.UPDATE_POST, action => socket.broadcast.emit(actionTypes.UPDATE_POST, action));
};
