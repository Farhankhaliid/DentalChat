import moment from 'moment'

export function getDateTimeFromMillis(millis) {
    if (!millis) {
        return ''
    }
    var d = new Date(millis * 1000),	// Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
        ampm = 'AM',
        time;

    // ie: 2013-02-18, 8:35 AM	
    return time = mm + '-' + dd + '-' + yyyy + '  ' + h + ':' + min;
}

export function getDateTimeFromString(date) {
    if (date && date.toString().includes("/")) {
        var datum = Date.parse(date.replace(/-/g, "/"));
        return getDateTimeFromMillis(datum / 1000);
    } else {
        return getDateTimeFromMillis(date);
    }
}

export function getDateTimeForPostToDisplay(date) {
    if (date) {
        if (date.toString().includes("/")) {
            return date
        } else {
            return moment(date * 1000).format("DD/MM/YYYY hh:mm A")
        }
    } else {
        return ''
    }

}