import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import CookiePolicyBanner from '@edx/frontend-component-cookie-policy-banner';
import { getConfig } from '@edx/frontend-platform';
import { getLocale, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

// eslint-disable-next-line import/no-unresolved
import { logoHeader } from '@edx/brand';
import AnonymousUserMenu from './AnonymousUserMenu';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import messages from './messages';

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

const LearningHeader = ({
  courseOrg, courseNumber, courseTitle, intl, showUserDropdown,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  const headerLogo = (
    <LinkedLogo
      className="logo"
      href={`${getConfig().LMS_BASE_URL}/dashboard`}
      src={logoHeader}
      alt={getConfig().SITE_NAME}
    />
  );

  const ENABLE_COOKIE_POLICY_BANNER = getConfig().ENABLE_COOKIE_POLICY_BANNER !== undefined
    ? getConfig().ENABLE_COOKIE_POLICY_BANNER
    : true;

  return (
    <>
      {ENABLE_COOKIE_POLICY_BANNER ? <CookiePolicyBanner languageCode={getLocale()} /> : null}
      <header className="learning-header">
        <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
        <div className="container-fluid d-flex align-items-center">
          {headerLogo}
          <div className="flex-grow-1 course-title-lockup" style={{ lineHeight: 1 }}>
            <span className="d-block small m-0">{courseOrg} {courseNumber}</span>
            <span className="d-block m-0 font-weight-bold course-title">{courseTitle}</span>
          </div>
          {showUserDropdown && authenticatedUser && (
            <AuthenticatedUserDropdown
              username={authenticatedUser.username}
            />
          )}
          {showUserDropdown && !authenticatedUser && (
            <AnonymousUserMenu />
          )}
        </div>
      </header>
    </>
  );
};

LearningHeader.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  intl: intlShape.isRequired,
  showUserDropdown: PropTypes.bool,
};

LearningHeader.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default injectIntl(LearningHeader);
