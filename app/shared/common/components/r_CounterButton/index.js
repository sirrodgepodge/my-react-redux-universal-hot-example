import React, {Component, PropTypes} from 'react';
import {connectMultireducer} from 'multireducer';
import {increment} from 'shared/redux/reducers/counter';


@connectMultireducer(
  (key, store) => ({
    count: store.multireducer[key].count
  }),
  {increment}
)
export default class CounterButton extends Component {
  static propTypes = {
    count: PropTypes.number,
    increment: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  props = {
    className: ''
  }

  render() {
    const { className,
            count,
            increment } = this.props; // eslint-disable-line no-shadow

    return (
      <button className={`${className} btn btn-default`} onClick={increment}>
        You have clicked me {count} time{count === 1 ? '' : 's'}.
      </button>
    );
  }
}
