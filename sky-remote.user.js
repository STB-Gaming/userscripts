// ==UserScript==
// @name         STBG Sky Remote API
// @namespace    https://stb-gaming.github.io
// @version      1.3.16
// @description  The ultimate Sky Remote API (hopefully) containing everything to simulate a sky remote in your browser
// @author       Tumble
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @match        https://stb-gaming.github.io/*
// @match        https://beehive-bedlam.com/*
// @match        http://localhost:4000/*
// @match        *://*
// @icon         https://stb-gaming.github.io/assets/img/stb-logo.webp
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
					codes: [],
					keyCodes: []
				};
				bindings.push(binding);
			}
			if (e.key == "End") {
				b++;
				b %= SkyRemote.buttons.length;
				console.log("[SKY REMOTE] Progress:", bindings,JSON.stringify(bindings));
				console.log("[SKY REMOTE] Next Button:", SkyRemote.buttons[b]);

			} else {
				console.log("[SKY REMOTE] Adding new binding for " + button + ":", e.key, e.keyCode);
				binding.keys.push(e.key);
				binding.codes.push(e.code);
				binding.keyCodes.push(e.keyCode);
			}
		});
	};

	SkyRemote.createKeyboardEventOptions = function (binding) {
		if (!binding) {
			console.error("[SKY REMOTE] No binding was provided");
			return;
		}
		const key = code = binding.keys[0],
			keyCode = binding.keyCodes[0];
			if(binding.codes&& !!binding.codes.length) {
				code = binding.codes[0]
			}

		return {
			code,
			key,
			keyCode,
			which:keyCode,
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
Version: ${this.version.join(".")} (${IS_THIS_USERSCRIPT_DEV ? "Development" : IS_THIS_USERSCRIPT ? "Userscript" : IS_USERSCRIPT ? "Userscript @require" : "Website <script>"})`);
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
				"0",
				"0"
			],
			"codes": [
				"Digit0",
				"Numpad0"
			],
			"keyCodes": [
				48,
				96
			]
		},
		{
			"button": "1",
			"keys": [
				"1",
				"1"
			],
			"codes": [
				"Digit1",
				"Numpad1"
			],
			"keyCodes": [
				49,
				97
			]
		},
		{
			"button": "2",
			"keys": [
				"2",
				"2"
			],
			"codes": [
				"Digit2",
				"Numpad2"
			],
			"keyCodes": [
				50,
				98
			]
		},
		{
			"button": "3",
			"keys": [
				"3",
				"3"
			],
			"codes": [
				"Digit3",
				"Numpad3"
			],
			"keyCodes": [
				51,
				99
			]
		},
		{
			"button": "4",
			"keys": [
				"4",
				"4"
			],
			"codes": [
				"Digit4",
				"Numpad4"
			],
			"keyCodes": [
				52,
				100
			]
		},
		{
			"button": "5",
			"keys": [
				"5",
				"5"
			],
			"codes": [
				"Digit5",
				"Numpad5"
			],
			"keyCodes": [
				53,
				101
			]
		},
		{
			"button": "6",
			"keys": [
				"6",
				"6"
			],
			"codes": [
				"Digit6",
				"Numpad6"
			],
			"keyCodes": [
				54,
				102
			]
		},
		{
			"button": "7",
			"keys": [
				"7",
				"7"
			],
			"codes": [
				"Digit7",
				"Numpad7"
			],
			"keyCodes": [
				55,
				103
			]
		},
		{
			"button": "8",
			"keys": [
				"8",
				"8"
			],
			"codes": [
				"Digit8",
				"Numpad8"
			],
			"keyCodes": [
				56,
				104
			]
		},
		{
			"button": "9",
			"keys": [
				"9",
				"9"
			],
			"codes": [
				"Digit9",
				"Numpad9"
			],
			"keyCodes": [
				57,
				105
			]
		},
		{
			"button": "sky",
			"keys": [
				"Escape"
			],
			"codes": [
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
			"codes": [
				"KeyA"
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
			"codes": [
				"KeyS"
			],
			"keyCodes": [
				83
			]
		},
		{
			"button": "services",
			"keys": [
				"d"
			],
			"codes": [
				"KeyD"
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
			"codes": [
				"KeyF"
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
			"codes": [
				"KeyG"
			],
			"keyCodes": [
				71
			]
		},
		{
			"button": "up",
			"keys": [
				"ArrowUp",
				"i"
			],
			"codes": [
				"ArrowUp",
				"KeyI"
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
			"codes": [
				"ArrowLeft",
				"KeyJ"
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
			"codes": [
				"ArrowDown",
				"KeyK"
			],
			"keyCodes": [
				40,
				75
			]
		},
		{
			"button": "right",
			"keys": [
				"ArrowRight",
				"l"
			],
			"codes": [
				"ArrowRight",
				"KeyL"
			],
			"keyCodes": [
				39,
				76
			]
		},
		{
			"button": "select",
			"keys": [
				" ",
				"Enter"
			],
			"codes": [
				"Space",
				"Enter"
			],
			"keyCodes": [
				32,
				13
			]
		},
		{
			"button": "channel-up",
			"keys": [
				"PageUp"
			],
			"codes": [
				"PageUp"
			],
			"keyCodes": [
				33
			]
		},
		{
			"button": "channel-down",
			"keys": [
				"PageDown"
			],
			"codes": [
				"PageDown"
			],
			"keyCodes": [
				34
			]
		},
		{
			"button": "backup",
			"keys": [
				"Backspace"
			],
			"codes": [
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
			"codes": [
				"KeyT"
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
			"codes": [
				"KeyQ"
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
			"codes": [
				"KeyW"
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
			"codes": [
				"KeyE"
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
			"codes": [
				"KeyR"
			],
			"keyCodes": [
				82
			]
		}
	]);
})();
