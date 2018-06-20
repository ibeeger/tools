/*
 * @Author: ibeeger 
 * @Date: 2017-10-31 10:06:00 
 * @Last Modified by:   ibeeger
 * @Last Modified time: 2017-11-03 20:38:40
 */
'use strict'
const packager = require("electron-packager");
packager({
    name:"成绩单",
    dir: __dirname + "/../",
    out:__dirname+"/../dist/",
    appVersion: "0.1.2",
    arch: "x64",
    asar: true,
    buildVersion:"1.0.1",
    electronVersion: "1.7.9",
    // icon: __dirname + "/../icon.ico",
    icon: __dirname + "/../icon.icns",
    // ignore: ["/dist/*", "/tool/*"],
    overwrite: true,
    // platform: "win32",
    platform: "darwin",
    appCopyright:"Huitong Edu Copyright",
    quiet: true,
    win32metadata: {
        CompanyName:"会课教学",
        FileDescription:"会通教育平台技术支持",
        ProductName:"课堂观察",
        InternalName:"课堂观察",
        'requested-execution-level':"highestAvailable",
        // 'application-manifest':__dirname+"/appmanifast.xml"
    }
}).then((filepath) => {
     console.log(filepath);
})