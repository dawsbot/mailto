/* eslint-disable */
import ReactGA from 'react-ga';
export const initGA = () => {
  console.log('GA init');
  ReactGA.initialize('UA-xxxxxxxxx-1');
};
export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`);
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
export const logEvent = action => {
  if (action) {
    ReactGA.event({ category: 'button-click', action });
  }
};
export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
