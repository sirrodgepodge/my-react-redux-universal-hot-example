import React, { PropTypes } from 'react';


export default function ModalX(props) {
  const styles = require('./style.scss');

  const {
    className,
    style: {
      fill,
      color,
      ...otherStyle
    },
    ...otherProps
  } = props;

  return (
    <svg className={`modal-x ${className} ${styles.modalX}`} style={otherStyle} width='15px' height='14px' viewBox='0 0 15 14' version='1.1' xmlns='http://www.w3.org/2000/svg' {...otherProps}>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <g transform='translate(-841.000000, -153.000000)' fill={fill || color || '#9B9B9B'}>
                <polygon points='855.750958 165.6 854.275862 167 848.375479 161.4 842.475096 167 841 165.6 846.900383 160 841 154.4 842.475096 153 848.375479 158.6 854.275862 153 855.750958 154.4 849.850575 160'></polygon>
            </g>
        </g>
    </svg>
  );
}

ModalX.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object
};

ModalX.defaultProps = {
  style: {}
};
