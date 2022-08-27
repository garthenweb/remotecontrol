import React from 'react';
import cx from 'classnames';

export default ({ content, isActive, theme, primary, meta, ...props }) => {
  const themeClassName = theme ? `btn-${theme}` : null;
  const primaryClass = primary ? `btn-primary` : null;
  return (
    <button
      className={cx(
        'btn',
        primaryClass,
        { 'is-active': isActive },
        themeClassName,
      )}
      {...props}
    >
      {content}
      {meta && <span className="btn-meta">{meta}</span>}
    </button>
  );
};
