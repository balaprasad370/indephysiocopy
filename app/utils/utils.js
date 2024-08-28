import {Dimensions} from 'react-native';

let screenWidth = 375;
let {height, width} = Dimensions.get('window');
export default function (units = 1) {
  return (width / screenWidth) * units;
}

export const consoleLog = (
  screen = 'DefaultScreen',
  method = 'DefaultMethod',
  title = 'DefaultTitle',
  message = '',
) => {
  if (AppConfig.APP_ENV() !== AppConfig.Environments.prod) {
    const dateTime = new Date();
    console.log(
      dateTime.toString() +
        '  ' +
        '[' +
        screen +
        ']->[' +
        method +
        ']:  ' +
        title +
        ': ',
      message,
    );
    NativeModules.NativeBridge.nativeLog(
      '[' +
        screen +
        ']->[' +
        method +
        ']:  ' +
        title +
        ': ' +
        JSON.stringify(message),
    );
  }
};
