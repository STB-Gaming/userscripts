// ==UserScript==
// @name         STBG Sky Remote API
// @namespace    https://stb-gaming.github.io
// @version      1.1.1
// @description  The ultimate Sky Remote API (hopefully) containing everything to simulate a sky remote in your browser
// @author       Tumble
// @run-at       document-start
// @match        *://*.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stb-gaming.github.io
// @require      https://github.com/STB-Gaming/userscripts/raw/master/beehive-bedlam.user.js
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	// Allow multiple things to load this script and it to not be a problem
	if (typeof uWindow.SkyRemote != 'undefined') return;

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


	let controls = [
		{
			title: "sky",
			keys: ["Esc"],
			function: "pressSky"
		},
		{
			title: "tv-guide",
			keys: ["a"],
			function: "pressTvGuide"
		},
		{
			title: "box-office",
			keys: ["s"],
			function: "pressBoxOffice"
		},
		{
			title: "services",
			keys: ["d"],
			function: "pressServices"
		},
		{
			title: "interactive",
			keys: ["f"],
			function: "pressInteractive"
		},
		{
			title: "i",
			keys: ["g"],
			function: "pressI"
		},
		{
			title: "up",
			keys: ["ArrowUp", "i"],
			function: "pressUp"
		},
		{
			title: "down",
			keys: ["ArrowDown", "k"],
			function: "pressDown"
		},
		{
			title: "left",
			keys: ["ArrowLeft", "j"],
			function: "pressLeft"
		},
		{
			title: "right",
			keys: ["ArrowRight", "l"],
			function: "pressRight"
		},
		{
			title: "select",
			keys: [" ", "Enter"],
			function: "pressSelect"
		},
		{
			title: "back",
			keys: ["Backspace"],
			function: "pressBack"
		},
		{
			title: "red",
			keys: ["q"],
			function: "pressRed"
		},
		{
			title: "green",
			keys: ["w"],
			function: "pressGreen"
		},
		{
			title: "yellow",
			keys: ["e"],
			function: "pressYellow"
		},
		{
			title: "blue",
			keys: ["r"],
			function: "pressBlue"
		},
		{
			title: "help",
			keys: ["t"],
			function: "pressHelp"
		}
	];

	function SkyRemote() {
		if (!new.target) return console.error("Use 'new' with this function");
	}


	SkyRemote.prototype.listButtons = function () {
		return Object.keys(remote);
	};
	SkyRemote.prototype.holdButton - function (btn) {
		if (this.listButtons().includes(btn)) {
			let keyCode = remote[btn];
			heldButtons[keyCode] = true;
			triggerEvent("keydown", keyCode);
		}
	};
	SkyRemote.prototype.releaseButton = function (btn) {
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
	};
	SkyRemote.prototype.pressButton = function (btn) {
		this.holdButton(btn);
		setTimeout(() => this.releaseButton(btn), 500);
	};


	SkyRemote.prototype.createSkyRemote = function (funcs) {
		document.addEventListener("keyup", event => {
			for (const control of controls)
				if (control.keys.includes(event.key) && control.function && funcs[control.function])
					funcs[control.function]();
		});
	};

	uWindow.SkyRemote = new SkyRemote();
})();
