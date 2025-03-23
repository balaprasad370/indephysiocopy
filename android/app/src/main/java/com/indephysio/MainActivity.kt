package com.inde.physio
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.core.content.ContextCompat
import android.app.Activity
import com.google.android.material.snackbar.Snackbar
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions

import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.InstallStateUpdatedListener
import androidx.activity.result.contract.ActivityResultContracts
import org.devio.rn.splashscreen.SplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.android.play.core.install.model.AppUpdateType

import com.oney.WebRTCModule.WebRTCModuleOptions;

import com.rnfs.RNFSPackage;

class MainActivity : ReactActivity() {
        private lateinit var appUpdateManager:AppUpdateManager
        override fun onCreate(savedInstanceState: Bundle?) {
            setContentView(R.layout.launch_screen) 
            SplashScreen.show(this, R.style.SplashTheme, true)
            super.onCreate(savedInstanceState)

            // Initialize the WebRTC module options.
            val options = WebRTCModuleOptions.getInstance()
            options.enableMediaProjectionService = true


            appUpdateManager = AppUpdateManagerFactory.create(this)
            checkUpdates()
        }

        private fun checkUpdates(){
            val appUpdateManager = AppUpdateManagerFactory.create(getApplicationContext())

            // Returns an intent object that you use to check for an update.
            val appUpdateInfoTask = appUpdateManager.appUpdateInfo

            // Checks that the platform will allow the specified type of update.
            appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
                if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                    // This example applies an immediate update. To apply a flexible update
                    // instead, pass in AppUpdateType.FLEXIBLE
                    && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)
                ) {
                    // Request the update.
                    appUpdateManager.startUpdateFlowForResult(
                    // Pass the intent that is returned by 'getAppUpdateInfo()'.
                    appUpdateInfo,
                    // an activity result launcher registered via registerForActivityResult
                    activityResultLauncher,
                    // Or pass 'AppUpdateType.FLEXIBLE' to newBuilder() for
                    // flexible updates.
                    AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build())
                }
            }
        }

        private val listener = InstallStateUpdatedListener{state ->
            if(state.installStatus() == InstallStatus.DOWNLOADED){
                popupSnackbarForCompleteUpdate()
            }
        }

        private val activityResultLauncher = registerForActivityResult(
                ActivityResultContracts.StartIntentSenderForResult()
        ){
            result: ActivityResult ->
            if(result.resultCode != RESULT_OK){
                Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show()
            }
        }

        override fun onDestroy(){
            super.onDestroy()
            appUpdateManager.unregisterListener(listener)
        }
        override fun onResume(){
            super.onResume()
            appUpdateManager.appUpdateInfo.addOnSuccessListener{appUpdateInfo ->
                if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                    popupSnackbarForCompleteUpdate()
                }
            }
        }


        fun popupSnackbarForCompleteUpdate() {
            Snackbar.make(
                    findViewById(R.id.activity_main_layout),  // Use an actual view ID here
                    "An update has just been downloaded.",
                    Snackbar.LENGTH_INDEFINITE
            ).apply {
                setAction("INSTALL") { appUpdateManager.completeUpdate() }
                setActionTextColor(ContextCompat.getColor(this@MainActivity, android.R.color.holo_blue_dark))
                show()
            }
        }

        override fun getMainComponentName(): String = "indephysio"
    override fun createReactActivityDelegate(): ReactActivityDelegate = DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
