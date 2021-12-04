module.exports = {
    camelToLineThroughName: camelToLineThroughName,
    lineThroughToCamelName: lineThroughToCamelName,
    spaceToCamelName: spaceToCamelName,
    camelToUnderLineName: camelToUnderLineName,
    lowerFirstWorld: lowerFirstWorld,
    upperFirstWorld: upperFirstWorld
};
/**
 * 将驼峰式命名的字符串转换为中划线方式。如果转换前的驼峰式命名的字符串为空，则返回空字符串。
 * 例如：helloWorld->hello-world
 * @param name 转换前的驼峰式命名的字符串
 * @return 转换后中划线方式命名的字符串
 */
function camelToLineThroughName(name) {
    name = name.replace(/([A-Z])/g,"-$1").toLowerCase();
    return name;
}

/**
 * 将驼峰式命名的字符串转换为下划线方式。如果转换前的驼峰式命名的字符串为空，则返回空字符串。
 * 例如：helloWorld->hello_world
 * @param name 转换前的驼峰式命名的字符串
 * @return 转换后下划线方式命名的字符串
 */
function camelToUnderLineName(name) {
    name = name.replace(/([A-Z])/g,"_$1").toLowerCase();
    return name;
}

/**
 * 首字母小写
 * 例如：HelloWorld->helloWorld
 * @param name 转换前的字符串
 * @return 转换后的字符串
 */
function lowerFirstWorld(name) {
    return name.substring(0,1).toLowerCase() + name.substring(1);
}

/**
 * 首字母大写
 * @param  {String} name 传入的单词
 * @return {String}      [description]
 */
function upperFirstWorld(name) {
    return name.substring(0,1).toUpperCase() + name.substring(1);
}

/**
 * 将中划线方式命名的字符串转换为驼峰式。
 * hello-world->helloWorld
 * @param name 转换前的中划线方式命名的字符串
 * @return 转换后的驼峰式命名的字符串
 */
function lineThroughToCamelName(name) {
    var arr = name.split("-");
    for (var i = 1; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
    }
    return arr.join("");
}

/**
 * 将中划线方式命名的字符串转换为驼峰式。
 * hello world->helloWorld
 * @param name 转换前的中划线方式命名的字符串
 * @return 转换后的驼峰式命名的字符串
 */
function spaceToCamelName(name) {
    var arr = name.split(" ");
    for (var i = 1; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
    }
    return arr.join("");
}
