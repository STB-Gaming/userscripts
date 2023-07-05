

// ==UserScript==
// @name         STBG Sky Remote
// @namespace    https://stb-gaming.github.io
// @version      1.0.0
// @description  Creates fucntions to press sky remote buttons
// @author       tumble199
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	let heldButton = "";
	let remote = {
		"sky": 27,
		"tv-guide": 65,
		"box-office": 83,
		"services": 68,
		"interactive": 70,
		"i": 71,
		"Up": 73,
		"Left": 74,
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
		window.dispatchEvent(new KeyboardEvent(event, {
			keyCode: key
		}));
	}

	uWindow.SkyRemote = {
		listButtons() {
			return Object.keys(remote);
		},
		holdButton(key) {
			if (this.listButtons().includes(key)) {
				heldButton = key;
				triggerEvent("keydown", remote[key]);
			}
		},
		releaseButton(key) {
			if (heldButton === key) {
				triggerEvent("keyup", remote[key]);
				heldButton = "";
			}
		},
		pressButton(key) {
			this.holdButton(key);
			setTimeout(() => this.releaseButton(key), 500);
		}
	};
})();
