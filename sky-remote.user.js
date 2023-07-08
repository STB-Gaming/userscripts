

// ==UserScript==
// @name         STBG Sky Remote
// @namespace    https://stb-gaming.github.io
// @version      1.1.0
// @description  Creates fucntions to press sky remote buttons
// @author       tumble199
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @match        https://stb-gaming.github.io/*
// @match        https://beehive-bedlam.com/*
// @match        http://localhost:4000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// @require https://github.com/STB-Gaming/userscripts/raw/master/beehive-bedlam.user.js
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (typeof uWindow.SkyRemote !== "undefined") return;

	let heldButtons = [];
	let remote = {
		"sky": 27,
		"tv-guide": 65,
		"box-office": 83,
		"services": 68,
		"interactive": 70,
		"i": 71,
		"up": 73,
		"left": 74,
		"down": 75,
		"right": 76,
		"select": 13,
		"channel-up": 33,
		"channel-down": 34,
		"backup": 8,
		"help": 84,
		"red": 81,
		"green": 87,
		"yellow": 69,
		"blue": 82,
		"0": 48,
		"1": 49,
		"2": 50,
		"3": 51,
		"4": 52,
		"5": 53,
		"6": 54,
		"7": 55,
		"8": 56,
		"9": 57,
	};
	function triggerEvent(event, key) {
		document.dispatchEvent(new KeyboardEvent(event, {
			keyCode: key,
			bubbles: true,
			cancelable: true,
			composed: true
		}));
	};
	let SkyRemote = {
		listButtons() {
			return Object.keys(remote);
		},
		holdButton(btn) {
			if (this.listButtons().includes(btn)) {
				let keyCode = remote[btn];
				heldButtons[keyCode] = true;
				triggerEvent("keydown", keyCode);
			}
		},
		releaseButton(btn) {
			let keyCode = remote[btn];
			if (heldButtons[keyCode]) {
				triggerEvent("keyup", keyCode);
				heldButtons[keyCode] = false;


				let fnName = "press" + btn.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
				if (uWindow[fnName])
					uWindow[fnName].call();
				if (typeof BeehiveBedlam !== "undefined" && typeof BeehiveBedlam[fnName] !== "undefined") {
					BeehiveBedlam[fnName].call();
				}
			}
		},
		pressButton(btn) {
			this.holdButton(btn);
			setTimeout(() => this.releaseButton(btn), 500);
		}
	};

	uWindow.SkyRemote = SkyRemote;
})();
