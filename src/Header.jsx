import React, { useContext } from 'react';
import Responsive from 'react-responsive';

import CookiePolicyBanner from '@edx/frontend-component-cookie-policy-banner';
import { getLocale, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import {
  APP_CONFIG_INITIALIZED,
  ensureConfig,
  mergeConfig,
  getConfig,
  subscribe,
} from '@edx/frontend-platform';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

import messages from './Header.messages';

const showGamification = process.env.ENABLE_RG_GAMIFICATION ? process.env.ENABLE_RG_GAMIFICATION.toLowerCase() === 'true' : null;

ensureConfig([
  'LMS_BASE_URL',
  'LOGOUT_URL',
  'LOGIN_URL',
  'SITE_NAME',
  'LOGO_URL',
  'ORDER_HISTORY_URL',
], 'Header component');

subscribe(APP_CONFIG_INITIALIZED, () => {
  mergeConfig({
    AUTHN_MINIMAL_HEADER: !!process.env.AUTHN_MINIMAL_HEADER,
  }, 'Header additional config');
});

const Header = ({ intl }) => {
  const { authenticatedUser, config } = useContext(AppContext);

  const mainMenu = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.links.courses']),
    },
  ];

  const gamificationItems = [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/gamma_dashboard/dashboard`,
      content: intl.formatMessage(messages['header.menu.performance.label']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/gamma_dashboard/leaderboard`,
      content: intl.formatMessage(messages['header.menu.leaderboard.label']),
    },
  ];

  const orderHistoryItem = {
    type: 'item',
    href: config.ORDER_HISTORY_URL,
    content: intl.formatMessage(messages['header.user.menu.order.history']),
  };

  const userMenu = authenticatedUser === null ? [] : [
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/dashboard`,
      content: intl.formatMessage(messages['header.user.menu.dashboard']),
    },
    {
      type: 'item',
      href: `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`,
      content: intl.formatMessage(messages['header.user.menu.profile']),
    },
    {
      type: 'item',
      href: config.ACCOUNT_SETTINGS_URL,
      content: intl.formatMessage(messages['header.user.menu.account.settings']),
    },
    {
      type: 'item',
      href: config.LOGOUT_URL,
      content: intl.formatMessage(messages['header.user.menu.logout']),
    },
  ];

  // Users should see gamification links only if it enabled.
  if (showGamification) {
    userMenu.splice(1, 0, ...gamificationItems);
  }

  // Users should only see Order History if have a ORDER_HISTORY_URL define in the environment.
  if (config.ORDER_HISTORY_URL) {
    userMenu.splice(-1, 0, orderHistoryItem);
  }

  const loggedOutItems = [
    {
      type: 'item',
      href: config.LOGIN_URL,
      content: intl.formatMessage(messages['header.user.menu.login']),
    },
    {
      type: 'item',
      href: `${config.LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['header.user.menu.register']),
    },
  ];

  const props = {
    logo: config.LOGO_URL,
    logoAltText: config.SITE_NAME,
    logoDestination: `${config.LMS_BASE_URL}/dashboard`,
    loggedIn: authenticatedUser !== null,
    username: authenticatedUser !== null ? authenticatedUser.username : null,
    avatar: authenticatedUser !== null ? authenticatedUser.avatar : null,
    mainMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : mainMenu,
    userMenu: getConfig().AUTHN_MINIMAL_HEADER ? [] : userMenu,
    loggedOutItems: getConfig().AUTHN_MINIMAL_HEADER ? [] : loggedOutItems,
  };

  const ENABLE_COOKIE_POLICY_BANNER = getConfig().ENABLE_COOKIE_POLICY_BANNER !== undefined
    ? getConfig().ENABLE_COOKIE_POLICY_BANNER
    : true;

  return (
    <>
      {ENABLE_COOKIE_POLICY_BANNER ? <CookiePolicyBanner languageCode={getLocale()} /> : null}
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </>
  );
};

Header.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Header);
