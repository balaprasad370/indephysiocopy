import {Mixpanel} from 'mixpanel-react-native';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel('307ab8f1e535a257669ab35fffe22d8f', trackAutomaticEvents);  
mixpanel.init();


const trackEvent = (event, obj) => {
  mixpanel.track(event, obj);
};

export const mixPanel = mixpanel;

export default trackEvent;




