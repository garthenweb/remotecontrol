import React from 'react';
import cx from 'classnames';

export default ({ content, isActive, ...props }) => (
  <button className={cx('btn', { 'is-active': isActive })} {...props}>{content}</button>
);
