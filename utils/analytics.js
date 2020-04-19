/* eslint-disable */
import ReactGA from 'react-ga';
export const initGA = () => {
  console.log('initGA with id ', process.env.GA_TRACKING_ID);
  ReactGA.initialize(process.env.GA_TRACKING_ID);
};
export const logPageView = () => {
  console.log('logging page view');

  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
export const logEvent = (action, mailtoHref) => {
  console.log('logging event' + action + ' for href ' + mailtoHref);
  if (mailtoHref) {
    ReactGA.event({ category: 'button-click', action, label: mailtoHref });
    return;
  }
  ReactGA.event({ category: 'button-click', action });
};
export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
