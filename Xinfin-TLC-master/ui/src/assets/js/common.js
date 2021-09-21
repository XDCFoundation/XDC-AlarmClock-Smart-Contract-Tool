/**
 * Common utilities library
 */
import Noty from 'noty';

/**
 * Notify success message 
 * 
 * @param {*} message - Text to be displayed
 */
function notifySuccess(message) {
    new Noty({
        text: message,
        theme: 'metroui',
        type: 'success',
        layout: 'topCenter',
        timeout: 10000,
        progressBar: true
    }).show();
}

/**
 * Notify error message 
 * 
 * @param {*} message 
 */
function notifyError(message) {
    new Noty({
        text: message,
        theme: 'metroui',
        type: 'error',
        layout: 'topCenter',
        timeout: 10000,
        progressBar: true
    }).show();
}

/**
 * Export all the functions
 */
export default {
    notifySuccess,
    notifyError
}