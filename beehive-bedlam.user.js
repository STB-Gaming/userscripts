// ==UserScript==
// @name         STBG Beehive Bedlam
// @namespace    https://stb-gaming.github.io
// @version      0.0.1
// @description  A userscript that makes the online Beehive Bedlam remake compatible with STBG's standardised controls
// @author       tumble1999
// @run-at       document-start
// @match        https://beehive-bedlam.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beehive-bedlam.com/
// @require      https://raw.githubusercontent.com/stb-gaming/userscripts/master/create-sky-remote.js
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	let canvas, bounds,
		positions = {
			startGame: { x: .5, y: .5 },
			menu: {
				game: { x: .33, y: .70 },
				//selectLevel: { x: .33, y: .76 }, // too big of a menu to implement
				options: { x: .33, y: .82 }
			}, options: {
				back: { x: .33, y: .58 },
				music: { x: .33, y: .62 },
				fullscreen: { x: .33, y: .68 },
				colors: { x: .33, y: .73 },
			}
		}, menuPos = 0, currentAngle = 0, state = 0, lastMousePos = { x: .5, y: .5 };

	function sendMouseEvent(event, { x, y } = {}) {
		if (void 0 == x || void 0 == y) {
			x = lastMousePos.x;
			y = lastMousePos.y;
		};
		bounds = canvas.getBoundingClientRect();
		canvas.dispatchEvent(new MouseEvent(event, {
			clientX: bounds.left + x * bounds.width,
			clientY: bounds.top + y * bounds.height
		}));
		lastMousePos = { x, y };
	}

	function mouseDown({ x, y } = {}) {
		console.log("pressing mouse at", { x, y });
		sendMouseEvent("mousedown", { x, y });
	}
	function mouseUp({ x, y } = {}) {
		console.log("releasing mouse at", { x, y });
		sendMouseEvent("mouseup", { x, y });
	}
	function mouseMove({ x, y } = {}) {
		console.log("moving mouse to", { x, y });
		sendMouseEvent("mousemove", { x, y });
	}


	function click({ x, y } = {}) {
		mouseDown({ x, y });
		return new Promise((res, rej) => {
			setTimeout(() => {
				mouseUp({ x, y });
				res();
			}, 100);
		});
	}

	function collectPos() {
		canvas.addEventListener("mousemove", e => {
			bounds = canvas.getBoundingClientRect();
			console.log({
				x: (e.clientX - bounds.left) / bounds.width,
				y: (e.clientY - bounds.top) / bounds.height,
			});
		});
	}

	function gotoGamePos(pos) {
		bounds = canvas.getBoundingClientRect();
		let origin = { x: .66, y: .67 },
			radius = {
				x: .14 * bounds.width,
				y: .53 * bounds.height
			},
			unit = {
				x: Math.sin(pos * Math.PI / 2),
				y: -Math.cos(pos * Math.PI / 2)
			};
		mouseMove({
			x: origin.x + unit.x * radius.x / bounds.width,
			y: origin.y + unit.y * radius.y / bounds.height
		});
	}

	function moveGamePos(degDeta) {
		gotoGamePos(currentAngle += degDeta);
	}

	function startGame() {
		console.log("Starting Game");
		currentAngle = 0;
		mouseDown({ x: .5, y: .5 });
		gotoGamePos(0);
	}

	async function skipToGame() {
		await click(positions.startGame);
		await click(positions.menu.startGame);
		startGame();
	}

	function updateMenuPos() {
		if (!["menu", "options"].includes(state)) return;
		let menuOptions = Object.values(positions[state]);
		if (menuPos < 0) {
			menuPos = 0;
		}
		if (menuPos >= menuOptions.length) {
			menuPos = menuOptions.length - 1;
		}
		mouseMove(menuOptions[menuPos]);
	}

	function up() {
		switch (state) {
			case "menu":
			case "options":
				menuPos--;
				updateMenuPos();
				break;
		}

	}

	function down() {
		switch (state) {
			case "menu":
			case "options":
				menuPos++;
				updateMenuPos();
				break;
		}

	}

	function left() {
		if (state == "game") {
			moveGamePos(-.05);
		}
	}

	function right() {
		if (state == "game") {
			moveGamePos(.05);
		}
	}

	async function select() {
		switch (state) {
			case "menu":
			case "options":
				let keys = Object.keys(positions[state]),
					values = Object.values(positions[state]);
				await click(values[menuPos]);
				if (state == "menu") {
					state = keys[menuPos];
				}
				if (state == "options" && keys[menuPos] == "back") {
					state = "menu";
				}
				menuPos = 0;

				if (state == "game") {
					startGame();
				} else {
					updateMenuPos();
				}

				break;
			case "game":
				mouseUp();
				setTimeout(() => {
					mouseDown();
					gotoGamePos(currentAngle);
				}, 1000);
				break;
			default:
				await click(positions.startGame);
				state = "menu";
				updateMenuPos();
				break;
		}

	}

	function backup() {

	}



	uWindow.addEventListener("load", () => {
		setTimeout(() => {
			canvas = document.querySelector("canvas");
			console.log("Collected canvas");
		}, 2000);
		console.log("Setting up sky remote");
		createSkyRemote({
			pressUp: up,
			pressDown: down,
			pressLeft: left,
			pressRight: right,
			pressSelect: select,
			pressBack: backup
		});

	});

	let BeehiveBedlam = {
		positions,
		mouseDown,
		mouseUp,
		click,
		collectPos,
		startGame,
		mouseMove,
		gotoGamePos,
		moveGamePos,
		skipToGame,
		left, right, up, down, select, backup, state
	};

	if (!uWindow.BeehiveBedlam) uWindow.BeehiveBedlam = BeehiveBedlam;
})();
