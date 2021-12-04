exports.inArray = function(arr, val) {
    arr = arr || [];
    var len = arr.length;
    var i;

    for (i = 0; i < len; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
};
