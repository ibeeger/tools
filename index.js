/*
 * @Author: willclass
 * @Date:   2018-05-30 10:52:12
 * @Last Modified by:   ibeeger
 * @Last Modified time: 2018-06-20 15:52:10
 */

'use strict';
const {
	app,
	BrowserWindow,
	MenuItem,
	Menu,
	dialog,
	ipcMain,
	shell
} = require('electron');
const path = require('path');
const url = require('url');
const http = require("http");
const mtpl = require("./menutpl.js");
let win;

const menu =  Menu.buildFromTemplate(mtpl);

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y)
  })
})

ipcMain.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

function createWindow() {
	Menu.setApplicationMenu(menu)
	win = new BrowserWindow({
		width: 800,
		height: 600,
		maxWidth: 800,
		maxHeight: 600
	});
	// 加载应用的 index.html。
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// 打开开发者工具。
	// win.webContents.openDevTools();

	ipcMain.on('tools', function(event, result) {
		let alltm = Date.now();
		let i = 0,
			min = 50000,
			max = 0;
		let data = []

		function getImg() {
			let tms = Date.now();
			let url = result.url.indexOf("http:") != -1 ? result.url : "http://" + result.url;
			http.get(url, function() {
				let _x = Date.now() - tms;
				data.push(_x);
				min = Math.min(min, _x);
				max = Math.max(max, _x);
				i++;
				if (!win) {
					return;
				}
				if (i >= result.times) {
					win.webContents.send("result", {
							times: i,
							avg: (Date.now() - alltm) / i,
							min: min,
							max: max,
							data: data
						})
						// http.get("http://api.ibeeger.com?url="+result.url+"&times="+i+"&avg="+(Date.now()-alltm) / i+"&min="+min+"&max="+max);
				} else {
					win.webContents.send("process", {
						times: i
					})
					getImg();
				}
			}).on('error', (e) => {
				win.webContents.send("error", {
					e: e
				});
			});
		};
		getImg();
	})
	win.on('closed', () => {
		win = null;
	})
}
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// 在这文件，你可以续写应用剩下主进程代码。
	// 也可以拆分成几个文件，然后用 require 导入。
	if (win === null) {
		createWindow()
	}
})