package camp.kuznetsov.rn.vkontakte;

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.vk.api.sdk.VK
import com.vk.api.sdk.VKPreferencesKeyValueStorage
import com.vk.api.sdk.VKTokenExpiredHandler
import com.vk.api.sdk.auth.VKAccessToken
import com.vk.api.sdk.auth.VKAuthCallback
import com.vk.api.sdk.auth.VKScope
import com.vk.api.sdk.exceptions.VKAuthException
import java.util.logging.Logger


@ReactModule(name = "VKAuthModule")
class VKAuthModule(
    reactContext: ReactApplicationContext
): ReactContextBaseJavaModule(
    reactContext
), ActivityEventListener {
    override fun getName(): String = "VkontakteManager"

    private val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
    private val E_LOGIN_FATAL = "E_LOGIN_FATAL"
    private val E_AUTH_FAILED = "E_AUTH_FAILED"

    private val ACCESS_TOKEN = "access_token"
    private val EXPIRES_IN = "expires_in"
    private val USER_ID = "user_id"
    private val SECRET = "secret"
    private val HTTPS_REQUIRED = "https_required"
    private val CREATED = "created"
    private val VK_ACCESS_TOKEN_KEY = "vk_access_token"
    private val EMAIL = "email"
    private val PHONE = "phone"
    private val PHONE_ACCESS_KEY = "phone_access_key"

    private var vkAuthToken: VKAccessToken? = null
    private var authPromise: Promise? = null

    private val tokenTracker = object: VKTokenExpiredHandler {
        override fun onTokenExpired() {
            Logger.getGlobal().warning("VK Auth // AuthToken is Expired")
        }
    }

    init {
        reactContext.addActivityEventListener(this)
        VK.addTokenExpiredHandler(tokenTracker)
    }

    @ReactMethod
    fun login(scope: ReadableArray?, promise: Promise ) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist")
            return
        }

        if (authPromise != null)
            authPromise = null

        val scopeSize = scope?.size() ?: 0
        val scopeArray: MutableList<VKScope> = mutableListOf()
        for (i in 0 until scopeSize) {
            scopeArray.add(VKScope.valueOf(scope?.getString(i) ?: continue))
        }

        if (VK.isLoggedIn()) {
            val token = VKAccessToken.restore(
                VKPreferencesKeyValueStorage(context = reactApplicationContext)
            )
            Log.i("VK", "token=$token")
            promise.resolve(serializeAccessToken(token))
            return
        }

        try {
            authPromise = promise
            reactApplicationContext.currentActivity?.let { VK.login(it, scopeArray) }
        } catch (e: Exception) {
            promise.reject(E_LOGIN_FATAL, "Error login process with message: ${e.localizedMessage}")
        }
    }

    @ReactMethod
    fun logout(promise: Promise) {
        VK.logout()
        promise.resolve(null)
    }

    @ReactMethod
    fun getAccessToken(promise: Promise) {
        promise.resolve(serializeAccessToken(VKAccessToken.restore(
            VKPreferencesKeyValueStorage(context = reactApplicationContext)
        )))
    }

    @ReactMethod
    fun isLoggedIn(promise: Promise) {
        promise.resolve(VK.isLoggedIn())
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        val vkCallback = object: VKAuthCallback {
            override fun onLogin(token: VKAccessToken) {
                vkAuthToken = token
                Logger.getGlobal().warning("Vk auth result: ${token.toString()}")
                authPromise?.resolve(serializeAccessToken(token))
            }

            override fun onLoginFailed(authException: VKAuthException) {
                Logger.getGlobal().warning("Error vk auth with code error: ${authException.localizedMessage}")
                authPromise?.reject(E_AUTH_FAILED, authException.localizedMessage)
            }

        }

        VK.onActivityResult(requestCode, resultCode, data, vkCallback)
    }

    private fun serializeAccessToken(accessToken: VKAccessToken?): WritableMap? {
        if (accessToken == null) return null

        return Arguments.createMap().apply {
            putString(ACCESS_TOKEN, accessToken.accessToken)
            putString(USER_ID, accessToken.userId.toString())
            putString(SECRET, accessToken.secret)
            putString(EMAIL, accessToken.email)
        }
    }

    override fun onNewIntent(intent: Intent?) {}
}
