package com.indephysio

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class JitsiModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        var isJitsiMeetingActive: Boolean = false
    }

    override fun getName(): String {
        return "JitsiModule"
    }

    @ReactMethod
    fun setJitsiMeetingActive(isActive: Boolean) {
        isJitsiMeetingActive = isActive
    }
}
