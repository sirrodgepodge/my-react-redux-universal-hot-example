import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import cx from 'classnames';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';

// redux
import * as widgetsActions from 'shared/redux/reducers/widgets';
const {
  isLoaded,
  load: loadWidgets
  // ...otherActions
} = widgetsActions;

// components
import WidgetForm from './r_WidgetForm';


@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadWidgets());
    }
  }
}])
@connect(
  store => ({
    widgets: store.widgets.data,
    editing: store.widgets.editing,
    error: store.widgets.error,
    loading: store.widgets.loading
  }),
  {
    ...widgetsActions,
    initializeWithKey
  })
export default class Widgets extends Component {
  static propTypes = {
    widgets: PropTypes.array,
    error: PropTypes.any,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    const { widgets,
            editStart,
            error,
            editing,
            loading,
            load } = this.props;
    const handleEdit = widget => () => editStart(widget._id);

    const styles = require('./style.scss');
    return (
      <div className={`${styles.widgets} container`}>
        <h1>
          Widgets
          <button className={`btn btn-success ${styles.refreshBtn}`} onClick={load}>
            <i className={cx('fa fa-refresh', {'fa-spin': loading})}/> {' '} Reload Widgets
          </button>
        </h1>
        <Helmet title='Widgets'/>
        <p>
          If you hit refresh on your browser, the data loading will take place on the server before the page is returned.
          If you navigated here from another page, the data was fetched from the client after the route transition.
          This uses the decorator method <code>@asyncConnect</code> with the <code>deferred: true</code> flag. To block
          a route transition until some data is loaded, remove the <code>deffered: true</code> flag.
          To always render before loading data, even on the server, use <code>componentDidMount</code>.
        </p>
        <p>
          This widgets are stored in your session, so feel free to edit it and refresh.
        </p>
        {
          error &&
          <div className='alert alert-danger' role='alert'>
            <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>
            {' '}
            {error}
          </div>
        }
        {
          widgets && widgets.length &&
          <table className='table table-striped'>
            <thead>
              <tr>
                <th className={styles.idCol}>ID</th>
                <th className={styles.colorCol}>Color</th>
                <th className={styles.sprocketsCol}>Sprockets</th>
                <th className={styles.ownerCol}>Owner</th>
                <th className={styles.buttonCol}></th>
              </tr>
            </thead>
            <tbody>
            {
              widgets.map(widget => editing[widget._id] ?
                <WidgetForm formKey={widget._id} key={widget._id} initialValues={widget}/> :
                <tr key={widget._id}>
                  <td className={styles.idCol}>{widget._id}</td>
                  <td className={styles.colorCol}>{widget.color}</td>
                  <td className={styles.sprocketsCol}>{widget.sprocketCount}</td>
                  <td className={styles.ownerCol}>{widget.owner}</td>
                  <td className={styles.buttonCol}>
                    <button className='btn btn-primary' onClick={handleEdit(widget)}>
                      <i className='fa fa-pencil'/> Edit
                    </button>
                  </td>
                </tr>)
            }
            </tbody>
          </table>
        }
      </div>
    );
  }
}
