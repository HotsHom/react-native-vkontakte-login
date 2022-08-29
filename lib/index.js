// tslint:disable:no-submodule-imports
import { NativeModules } from 'react-native';
/**
 * @hidden
 */
const VKLogin = NativeModules.VkontakteManager;
/**
 * React-native wrapper around vk-ios-sdk and vk-android-sdk
 * Provides login and share functionality
 */
export class VK {
    /**
     * Initializes VK SDK from JS code.
     * You only need to call this once before you call login or logout.
     * You can skip this call if you've added your VK App ID to your Android's resources or iOS's info.plist.
     * @param {number|string} vkAppId Your VK app id
     */
    static initialize(vkAppId) {
        VKLogin.initialize(typeof vkAppId === 'number' ? vkAppId : Number(vkAppId));
    }
    /**
     * Opens VK login dialog either via VK mobile app or via WebView (if app is not installed on the device).
     * If the user is already logged in and has all the requested permissions, then the promise is resolved
     * straight away, without VK dialog.
     * @param {string[]} scopesArray array which contains VK access permissions as strings,
     * e.g. `['friends', 'photos', 'email']`
     * List of available permissions can be found <a href="https://new.vk.com/dev/permissions">here</a>
     * @returns {Promise<VKLoginResult>} Promise will be resolved with VKLoginResult object
     */
    static login(scopesArray) {
        return VKLogin.login(scopesArray);
    }
    /**
     * Performs the logout
     * @returns {Promise} empty promise
     */
    static logout() {
        return VKLogin.logout();
    }
    /**
     * Checks if user is already logged in
     * @returns {Promise<boolean>} Promise that resolves with boolean value
     */
    static isLoggedIn() {
        return VKLogin.isLoggedIn();
    }
    static getAccessToken() {
        return VKLogin.getAccessToken();
    }
}
export default VK;
//# sourceMappingURL=index.js.map