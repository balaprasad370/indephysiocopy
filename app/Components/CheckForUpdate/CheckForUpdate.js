import {SpInAppUpdates} from 'sp-react-native-in-app-updates';

import {Platform} from 'react-native';

export const checkforUpdate = async () => {
  const inAppUpdates = new SpInAppUpdates(true);
  try {
    // const result = await inAppUpdates.checkNeedsUpdate();
    const result = await inAppUpdates.checkNeedsUpdate();
    result.shouldUpdate = true; // Override for testing

    // console.log(result.shouldUpdate);
    console.log('result', result);
    if (result.shouldUpdate) {
      let updateOptions = {};

      if (Platform.OS === 'ios') {
        updateOptions = {
          title: 'Update available',
          message:
            'There is a new version of the app available on the App Store, do you want to update it?',
          buttonUpgradeText: 'Update',
          buttonCancelText: 'Cancel',
        };
      }

      inAppUpdates.addStatusUpdateListener(downloadStatus => {
        console.log('download status', downloadStatus);
        if (
          downloadStatus.status === SpInAppUpdates.IAUInstallStatus.DOWNLOADED
        ) {
          console.log('downloaded');
          inAppUpdates.installUpdate();
          inAppUpdates.removeStatusUpdateListener(finalStatus => {
            console.log('final status', finalStatus);
          });
        }
      });

      inAppUpdates.startUpdate(updateOptions);
    }
  } catch (error) {
    console.log('error', error);
  }
};
