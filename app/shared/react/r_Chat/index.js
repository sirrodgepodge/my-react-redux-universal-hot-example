import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';


@connect(
  store => ({
    user: store.auth.user
  })
)
export default class Chat extends Component {

  static propTypes = {
    user: PropTypes.object
  };

  state = {
    message: '',
    messages: []
  };

  componentDidMount() {
    if (socket) {
      socket.on('msg', this.onMessageReceived);
      setTimeout(() => {
        socket.emit('history', {offset: 0, length: 100});
      }, 100);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('msg', this.onMessageReceived);
    }
  }

  onMessageReceived = (data) => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({messages});
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const msg = this.state.message;

    this.setState({message: ''});

    socket.emit('msg', {
      from: this.props.user.name,
      text: msg
    });
  }

  render() {
    const style = require('./style.scss');
    const {user} = this.props;

    return (
      <div className={`${style.chat} container`}>
        <h1 className={style}>Chat</h1>
        {
          user &&
          <div>
            <ul>
            {
              this.state.messages.map(msg =>
                <li key={`chat.msg.${msg.id}`}>
                  {msg.from}: {msg.text}
                </li>)
            }
            </ul>
            <form className='login-form' onSubmit={this.handleSubmit}>
              <input type='text' ref='message' placeholder='Enter your message'
               value={this.state.message}
               onChange={event => this.setState({message: event.target.value})}/>
              <button className='btn' onClick={this.handleSubmit}>Send</button>
            </form>
          </div>
        }
      </div>
    );
  }
}
