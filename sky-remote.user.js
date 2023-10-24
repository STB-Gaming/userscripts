// ==UserScript==
// @name         STBG Sky Remote API
// @namespace    https://stb-gaming.github.io
// @version      1.3.14
// @description  The ultimate Sky Remote API (hopefully) containing everything to simulate a sky remote in your browser
// @author       Tumble
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @match        https://stb-gaming.github.io/*
// @match        https://beehive-bedlam.com/*
// @match        http://localhost:4000/*
// @match        *://*
// @icon         https://stb-gaming.github.io/assets/img/stb-logo.webp
// @require      https://github.com/STB-Gaming/userscripts/raw/master/beehive-bedlam.user.js
// ==/UserScript==

(function () {
	'use strict';

	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	function checkUserscript(name, VERSION, windowObjectName = name) {
		const IS_USERSCRIPT = typeof GM_info != 'undefined',
			IS_THIS_USERSCRIPT = IS_USERSCRIPT ? GM_info.script.name == name : false,
			IS_THIS_USERSCRIPT_DEV = IS_THIS_USERSCRIPT && GM_info.scriptUpdateURL.startsWith("file://"),
			GET_STARTED = !uWindow[windowObjectName];


		if (!GET_STARTED) {
			let comp = (a = [0, 0, 0], b = [0, 0, 0]) => (a < b) - (b < a);
			switch (comp(uWindow[windowObjectName].version, VERSION)) {
				case 1: // this is newer
					console.warn(`There are userscripts that are using an older version of '${name}'.
	Try reinstalling all active userscripts.`);
					break;
				case -1: // this is older
					if (IS_THIS_USERSCRIPT)
						console.warn(` The '${name}' (the userscript) is out of date.
	Update this userscript.`);
					else if (IS_USERSCRIPT)
						console.warn(`'${GM_info.script.name}' using an older version of '${name}'.
	Try reinstalling this mod.`);
					else
						console.warn(`This website using an older version of '${name}'.
	Try refreshing the website. or contact the website owner`);
					break;
			}
		} else {
			uWindow[windowObjectName] = { version: VERSION };
		}

		return {
			IS_USERSCRIPT,
			IS_THIS_USERSCRIPT,
			IS_THIS_USERSCRIPT_DEV,
			GET_STARTED
		};
	}

	const VERSION = [0, 1, 0],
		{ GET_STARTED } = checkUserscript("STBG Check Userscript", VERSION, "checkUserscript");


	if (GET_STARTED) {
		checkUserscript.version = VERSION;
		uWindow.checkUserscript = checkUserscript;
	}

})();


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	const VERSION = [1, 3, 5];

	const { IS_THIS_USERSCRIPT, IS_THIS_USERSCRIPT_DEV, IS_USERSCRIPT, GET_STARTED } = checkUserscript("STBG Sky Remote API", VERSION, "SkyRemote");
	if (!GET_STARTED) return;


	function SkyRemote(bindings) {
		if (!new.target) return console.error("Use 'new' with this function");
		if (!bindings || !bindings.length) {
			throw "[SKY REMOTE] No bindings were provided";
		}

		this.bindings = bindings;
	}



	SkyRemote.buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'sky', 'tv-guide', 'box-office', 'services', 'interactive', 'i', 'up', 'left', 'down', 'right', 'select', 'channel-up', 'channel-down', 'backup', 'help', 'red', 'green', 'yellow', 'blue'];
	SkyRemote.createBindings = function () {
		let bindings = [];
		let b = 0;

		console.log("[SKY REMOTE] First button:", SkyRemote.buttons[b]);

		document.addEventListener("keyup", e => {
			let button = SkyRemote.buttons[b];
			let binding = bindings.find(b => b.button == button);
			if (!binding) {
				console.log("[SKY REMOTE] Setting up new button");
				binding = {
					button,
					keys: [],
					keyCodes: []
				};
				bindings.push(binding);
			}
			if (e.key == "End") {
				b++;
				b %= buttons.length;
				console.log("[SKY REMOTE] Progress:", bindings);
				console.log("[SKY REMOTE] Next Button:", SkyRemote.buttons[b]);

			} else {
				console.log("[SKY REMOTE] Adding new binding for " + button + ":", e.key, e.keyCode);
				binding.keys.push(e.key);
				binding.keyCodes.push(e.keyCode);
			}
		});
	};

	SkyRemote.createKeyboardEventOptions = function (binding) {
		if (!binding) {
			console.error("[SKY REMOTE] No binding was provided");
			return;
		}
		const name = binding.keys[0],
			number = binding.keyCodes[0];

		return {
			code: name,
			key: name,
			keyCode:number,
			which:number,
			bubbles: true,
			cancelable: true,
			composed: true
		};
	};

	SkyRemote.triggerEvent = function (event, options, element = document, destination) {
		if (!event) {
			console.error("[SKY REMOTE] No event was provided");
			return;
		}
		const eventParams = [event, options];
		if (destination) {
			if (typeof destination !== "string") origin = "https://denki.co.uk";
			if (!(element instanceof Window)) element = window.frames[0];
			element.postMessage(eventParams, origin);
		}
		else
			element.dispatchEvent(new KeyboardEvent(...eventParams));
	};

	SkyRemote.prototype.triggerEvent = SkyRemote.triggerEvent;

	SkyRemote.prototype.onTriggerEvent = function (cb) {
		this.triggerEvent = (event, binding, element = document, destination) => {
			let options = SkyRemote.createKeyboardEventOptions(binding);
			cb(event, options, element, destination);
		};
	};

	SkyRemote.prototype.version = VERSION;

	SkyRemote.prototype.printVersionInfo = function () {
		console.log(`[STB Gaming Sky Remote API]
Created by: Tumble
Version: ${SkyRemote.version.join(".")} (${IS_THIS_USERSCRIPT_DEV ? "Development" : IS_THIS_USERSCRIPT ? "Userscript" : IS_USERSCRIPT ? "Userscript @require" : "Website <script>"})`);
	};

	SkyRemote.prototype.listButtons = function () {
		return SkyRemote.buttons;
	};


	SkyRemote.prototype.getBinding = function (btn) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		return this.bindings.find(b => b.button == btn);
	};


	SkyRemote.prototype.holdButton = function (btn, element = document, destination) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (this.listButtons().includes(btn)) {
			const binding = this.getBinding(btn);
			this.triggerEvent("keydown", binding, element, destination);
		}
	};

	SkyRemote.prototype.onHoldButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);
		element.addEventListener("keydown", event => {
			if (event.isTrusted && binding.keys.includes(event.key) || binding.keyCodes.includes(event.keyCode)) {
				func.call(this, event);
			}
		});
	};

	SkyRemote.prototype.releaseButton = function (btn, element = document, destination) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		const binding = this.getBinding(btn);
		this.triggerEvent("keyup", binding, element, destination);
	};


	SkyRemote.prototype.onReleaseButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);
		element.addEventListener("keyup", event => {
			if (event.isTrusted && binding.keys.includes(event.key) || binding.keyCodes.includes(event.keyCode)) {
				func.call(this, event);
			}
		});
	};

	SkyRemote.prototype.pressButton = function (btn, element = document, destination) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		this.holdButton(btn, element, destination);
		setTimeout(() => this.releaseButton(btn, element, destination), 500);
	};

	SkyRemote.prototype.onPressButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);

		let handler = e => {
			if (binding.keys.includes(e.key) || binding.keyCodes.includes(e.keyCode)) {
				func.call(this, e);
			}
		};

		element.addEventListener("keyup", e => {
			if (e.isTrusted && e.key == e.code) { handler(e); }
		});

		element.addEventListener("keypress", e=>{
			if(e.isTrusted)handler(e)
		});
	};


	SkyRemote.prototype.createSkyRemote = function (funcs) {
		console.warn(`[SKY REMOTE] SkyRemote.createSkyRemote will be deprecated for;
- SkyRemote.onHoldButton(btn,function(event){

  })
- SkyRemote.onPressButton(btn,function(event){

  })
- SkyRemote.onReleaseButton(btn,function(event){

  })
Please contact the website owner of this change if you can.`);
		if (!funcs) {
			console.error("[SKY REMOTE] No functions were provided.");
			return;
		}
		let controls = this.bindings;

		for (const control of controls) {
			let func = this.toLegacyFunction(control.button);
			if (func && funcs[func]) {
				this.onPressButton(control.button, funcs[func]);
			}

		}
	};

	/**
	 * Creates a string for the name of the legacy button press event functions (e.g. pressRed, pressUp, etc.)
	 * @param {string} btn
	 * @returns
	 */
	SkyRemote.prototype.toLegacyFunction = function (btn) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		return "press" + btn.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
	};

	uWindow.SkyRemote = new SkyRemote([
		{
			"button": "0",
			"keys": [
				"0"
			],
			"keyCodes": [
				48
			]
		},
		{
			"button": "1",
			"keys": [
				"1"
			],
			"keyCodes": [
				49
			]
		},
		{
			"button": "2",
			"keys": [
				"2"
			],
			"keyCodes": [
				50
			]
		},
		{
			"button": "3",
			"keys": [
				"3"
			],
			"keyCodes": [
				51
			],
			"function": "press3"
		},
		{
			"button": "4",
			"keys": [
				"4"
			],
			"keyCodes": [
				52
			],
			"function": "press4"
		},
		{
			"button": "5",
			"keys": [
				"5"
			],
			"keyCodes": [
				53
			]
		},
		{
			"button": "6",
			"keys": [
				"6"
			],
			"keyCodes": [
				54
			]
		},
		{
			"button": "7",
			"keys": [
				"7"
			],
			"keyCodes": [
				55
			],
			"function": "press7"
		},
		{
			"button": "8",
			"keys": [
				"8"
			],
			"keyCodes": [
				56
			]
		},
		{
			"button": "9",
			"keys": [
				"9"
			],
			"keyCodes": [
				57
			]
		},
		{
			"button": "sky",
			"keys": [
				"Escape"
			],
			"keyCodes": [
				27
			]
		},
		{
			"button": "tv-guide",
			"keys": [
				"a"
			],
			"keyCodes": [
				65
			]
		},
		{
			"button": "box-office",
			"keys": [
				"s"
			],
			"keyCodes": [
				83
			],
		},
		{
			"button": "services",
			"keys": [
				"d"
			],
			"keyCodes": [
				68
			]
		},
		{
			"button": "interactive",
			"keys": [
				"f"
			],
			"keyCodes": [
				70
			]
		},
		{
			"button": "i",
			"keys": [
				"g"
			],
			"keyCodes": [
				71
			],
			"function": "pressI"
		},
		{
			"button": "up",
			"keys": [
				"ArrowUp",
				"i"
			],
			"keyCodes": [
				38,
				73
			]
		},
		{
			"button": "left",
			"keys": [
				"ArrowLeft",
				"j"
			],
			"keyCodes": [
				37,
				74
			]
		},
		{
			"button": "down",
			"keys": [
				"ArrowDown",
				"k"
			],
			"keyCodes": [
				40,
				75
			],
		},
		{
			"button": "right",
			"keys": [
				"ArrowRight",
				"l"
			],
			"keyCodes": [
				39,
				76
			],
		},
		{
			"button": "select",
			"keys": [
				" ",
				"Enter"
			],
			"keyCodes": [
				32,
				13
			],
		},
		{
			"button": "channel-up",
			"keys": [
				"PageUp"
			],
			"keyCodes": [
				33
			],
		},
		{
			"button": "channel-down",
			"keys": [
				"PageDown"
			],
			"keyCodes": [
				34
			],
		},
		{
			"button": "backup",
			"keys": [
				"Backspace"
			],
			"keyCodes": [
				8
			]
		},
		{
			"button": "help",
			"keys": [
				"t"
			],
			"keyCodes": [
				84
			]
		},
		{
			"button": "red",
			"keys": [
				"q"
			],
			"keyCodes": [
				81
			]
		},
		{
			"button": "green",
			"keys": [
				"w"
			],
			"keyCodes": [
				87
			]
		},
		{
			"button": "yellow",
			"keys": [
				"e"
			],
			"keyCodes": [
				69
			]
		},
		{
			"button": "blue",
			"keys": [
				"r"
			],
			"keyCodes": [
				82
			]
		}
	]);
})();
