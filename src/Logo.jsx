import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { logoHeader } from '@edx/brand';

const Logo = ({ alt, ...attributes }) => (
  <img src={logoHeader} alt={alt} {...attributes} />
);

Logo.propTypes = {
  alt: PropTypes.string.isRequired,
};

const LinkedLogo = ({
  href,
  alt,
  ...attributes
}) => (
  <a href={href} {...attributes}>
    <img className="d-block" src={logoHeader} alt={alt} />
  </a>
);

LinkedLogo.propTypes = {
  href: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export { LinkedLogo, Logo };
export default Logo;
