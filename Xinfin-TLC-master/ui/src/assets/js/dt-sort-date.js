import $ from 'jquery'
import moment from 'moment';

/**
 * Function to sort date columns in JQuery datatable
 */
$.extend( $.fn.dataTableExt.oSort, {
    "date-tlc-pre": function ( a ) {
        if(!a) {
            return 1;
        }
        const momentObject = moment(a, "DD-MMM-YYYY HH:mm:ss");
        return momentObject.unix();
    },

    "date-tlc-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-tlc-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );