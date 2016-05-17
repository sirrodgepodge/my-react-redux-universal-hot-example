import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import validate, {colors} from './validate';
import * as widgetActions from 'shared/redux/reducers/widgets';
// import _ from 'lodash';


@connect(
  store => ({
    saveError: store.widgets.saveError
  }),
  dispatch => bindActionCreators(widgetActions, dispatch)
)
@reduxForm({
  form: 'widget',
  fields: ['_id', 'color', 'sprocketCount', 'owner'],
  validate: validate
})
export default class WidgetForm extends Component {
  static propTypes = {
    // _id: PropTypes.string,
    fields: PropTypes.object.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const {
      // _id, // for some reason this doesn't come through fields
      editStop,
      fields: {
        _id,
        color,
        sprocketCount,
        owner
      },
      formKey,
      handleSubmit,
      invalid,
      pristine,
      save,
      submitting,
      values,
      saveError: {
        [formKey]: saveError
      }} = this.props;
    const styles = require('../style.scss');
    return (
      <tr className={submitting ? styles.saving : ''}>
        <td className={styles.idCol}>{_id.value}</td>
        <td className={styles.colorCol}>
          <select name='color' className='form-control' {...color}>
            {
              colors.map(valueColor =>
                <option value={valueColor} key={valueColor}>
                  {valueColor}
                </option>
              )
            }
          </select>
          {color.error && color.touched && <div className='text-danger'>{color.error}</div>}
        </td>
        <td className={styles.sprocketsCol}>
          <input type='text' className='form-control' {...sprocketCount}/>
          {sprocketCount.error && sprocketCount.touched && <div className='text-danger'>{sprocketCount.error}</div>}
        </td>
        <td className={styles.ownerCol}>
          <input type='text' className='form-control' {...owner}/>
          {owner.error && owner.touched && <div className='text-danger'>{owner.error}</div>}
        </td>
        <td className={styles.buttonCol}>
          <button className='btn btn-default'
                  onClick={() => editStop(formKey)}
                  disabled={submitting}>
            <i className='fa fa-ban'/> Cancel
          </button>
          <button className='btn btn-success'
                  onClick={
                    handleSubmit(() => save(values)
                      .then(result => result && typeof result.error === 'object' &&
                        Promise.reject(result.error)))
                  }
                  disabled={pristine || invalid || submitting}>
            <i className={`fa ${(submitting ? 'fa-cog fa-spin' : 'fa-cloud')}`}/> Save
          </button>
          {
            saveError &&
            <div className='text-danger'>
              {saveError}
            </div>
          }
        </td>
      </tr>
    );
  }
}
