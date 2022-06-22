// tslint:disable:no-submodule-imports
import { NativeModules, Platform } from 'react-native';

/**
 * @hidden
 */
const VKLogin: any = NativeModules.VkontakteManager;

/**
 * Response from login method
 */
export interface VKLoginResult {
  /**
   * String token for use in request parameters
   */
  access_token: string | null;
  /**
   * User email, or null, if permission was not given
   */
  email: string | null;
  /**
   * **Android only** If user sets "Always use HTTPS" setting in his profile, it will be true
   */
  https_required?: boolean;
  /**
   * User secret to sign requests (if nohttps used)
   */
  secret: string | null;
  /**
   * Current user id for this token
   */
  user_id: string | null;
  /**
   * Time when token expires
   */
  expires_in?: number;
}

/**
 * Share dialog options
 */
export interface VKShareOptions {
  /**
   * Shared link name
   */
  linkText?: string;
  /**
   * Shared link URL
   */
  linkUrl?: string;
  /**
   * Shared text message
   */
  description?: string;
  /**
   * Shared image, local file resource, i.e. require('path/to/your/image.png')
   */
  image?: number;
}

export const enum VKError {
  E_NOT_INITIALIZED = 'E_NOT_INITIALIZED',
  E_VK_UNKNOWN = 'E_VK_UNKNOWN',
  E_VK_API_ERROR = 'E_VK_API_ERROR',
  E_VK_CANCELED = 'E_VK_CANCELED',
  E_VK_REQUEST_NOT_PREPARED = 'E_VK_REQUEST_NOT_PREPARED',
  E_VK_RESPONSE_STRING_PARSING_ERROR = 'E_VK_RESPONSE_STRING_PARSING_ERROR', // ios
  E_VK_AUTHORIZE_CONTROLLER_CANCEL = 'E_VK_AUTHORIZE_CONTROLLER_CANCEL', // ios
  E_VK_JSON_FAILED = 'E_VK_JSON_FAILED', // android
  E_VK_REQUEST_HTTP_FAILED = 'E_VK_REQUEST_HTTP_FAILED', // android
  E_ACTIVITY_DOES_NOT_EXIST = 'E_ACTIVITY_DOES_NOT_EXIST', // android
  E_FINGERPRINTS_ERROR = 'E_FINGERPRINTS_ERROR', // android
}

/**
 * React-native wrapper around vk-ios-sdk and vk-android-sdk
 * Provides login and share functionality
 */
export class VK {
  /**
   * Opens VK login dialog either via VK mobile app or via WebView (if app is not installed on the device).
   * If the user is already logged in and has all the requested permissions, then the promise is resolved
   * straight away, without VK dialog.
   * @param {string[]} scopesArray array which contains VK access permissions as strings,
   * e.g. `['friends', 'photos', 'email']`
   * List of available permissions can be found <a href="https://new.vk.com/dev/permissions">here</a>
   * @returns {Promise<VKLoginResult>} Promise will be resolved with VKLoginResult object
   */
  static login(scopesArray: string[]): Promise<VKLoginResult> {
    return VKLogin.login(scopesArray);
  }

  /**
   * Performs the logout
   * @returns {Promise} empty promise
   */
  static logout(): Promise<void> {
    return VKLogin.logout();
  }

  /**
   * Checks if user is already logged in
   * @returns {Promise<boolean>} Promise that resolves with boolean value
   */
  static isLoggedIn(): Promise<boolean> {
    return VKLogin.isLoggedIn();
  }

  static getAccessToken(): Promise<VKLoginResult | null> {
    return VKLogin.getAccessToken();
  }
}

export default VK;
