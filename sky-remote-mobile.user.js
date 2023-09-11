// ==UserScript==
// @name         STBG Mobile Interface
// @namespace    https://stb-gaming.github.io
// @version      0.2.0
// @description  A userscript that adds a button layout based on the Sky Gamepad to mobile browsers, adding touch support for mobile devices
// @author       tumble1999
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// @require      https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
// @require      https://stb-gaming.github.io/sky/mobile.js
// @grant        GM_addStyle
// ==/UserScript==




(function () {
	'use strict';

	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	function addHeadStuff() {
		const head = document.getElementsByTagName('head')[0],
			meta = document.createElement('meta'),
			css = document.createElement("link");

		//viewport tag
		meta.name = "viewport";
		meta.content = "width=device-width,initial-scale=1.0,user-scalable=no";

		//css
		css.rel = "stylesheet";
		css.href = "https://stb-gaming.github.io/sky/style.css";


		head.appendChild(meta);
		head.appendChild(css);
	}

	uWindow.addEventListener("load", () => {
		addHeadStuff();
		if (typeof setupTouchEvents != 'undefined') setupTouchEvents();
	});
})();
