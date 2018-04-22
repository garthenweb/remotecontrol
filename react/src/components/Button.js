import React from 'react';
import cx from 'classnames';

export default ({ content, isActive, theme, ...props }) => {
  const themeClassName = theme ? `btn-${theme}` : null;
  return (
    <button className={cx('btn', { 'is-active': isActive }, themeClassName)} {...props}>
      {content}
    </button>
  );
};
