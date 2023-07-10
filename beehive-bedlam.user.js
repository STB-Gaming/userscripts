// ==UserScript==
// @name         STBG Beehive Bedlam
// @namespace    https://stb-gaming.github.io
// @version      0.1.5
// @description  A userscript that makes the online Beehive Bedlam remake compatible with STBG's standardised controls
// @author       tumble1999
// @run-at       document-start
// @match        https://beehive-bedlam.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beehive-bedlam.com/
// @require      https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	if (typeof uWindow.BeehiveBedlam !== "undefined" || location.href !== "https://beehive-bedlam.com/") return;

	let canvas, bounds,
		positions = {
			startGame: { x: .5, y: .5 },
			menu: {
				game: { x: 0.24, y: 0.69, width: 0.22, height: 0.04 },
				//selectLevel:{x: 0.24, y: 0.74, width: 0.22, height: 0.04}, // too big of a menu to implement
				options: { x: 0.24, y: 0.79, width: 0.22, height: 0.04 }
			}, options: {
				back: { x: 0.24, y: 0.56, width: 0.22, height: 0.04 },
				music: { x: 0.24, y: 0.61, width: 0.22, height: 0.04 },
				fullscreen: { x: 0.24, y: 0.66, width: 0.22, height: 0.04 },
				colors: { x: 0.24, y: 0.71, width: 0.22, height: 0.04 },
			},
			game: {
				pause: { x: 0.06, y: 0.83, width: 0.21, height: 0.04 }
			},
			pause: {
				game: { x: 0.54, y: 0.45, width: 0.21, height: 0.04 },
				menu: { x: 0.54, y: 0.5, width: 0.21, height: 0.05 },
			}
		}, menuPos = 0, currentAngle = 0, state, lastMousePos = { x: .5, y: .5 };

	function sendMouseEvent(event, { x, y } = lastMousePos) {
		if (void 0 == x || void 0 == y) {
			x = lastMousePos.x;
			y = lastMousePos.y;
		};
		if (typeof canvas == "undefined") {
			console.log("Not ready yet");
			return;
		}
		bounds = canvas.getBoundingClientRect();
		canvas.dispatchEvent(new MouseEvent(event, {
			clientX: bounds.left + x * bounds.width,
			clientY: bounds.top + y * bounds.height
		}));
		lastMousePos = { x, y };
	}

	function mouseDown({ x, y } = lastMousePos) {
		console.log("pressing mouse at", { x, y });
		sendMouseEvent("mousedown", { x, y });
	}
	function mouseUp({ x, y } = lastMousePos) {
		console.log("releasing mouse at", { x, y });
		sendMouseEvent("mouseup", { x, y });
	}
	function mouseMove({ x, y } = {}) {
		console.log("moving mouse to", { x, y });
		sendMouseEvent("mousemove", { x, y });
	}


	function click({ x, y } = lastMousePos) {
		mouseDown({ x, y });
		return new Promise((res, rej) => {
			setTimeout(() => {
				mouseUp({ x, y });
				res();
			}, 100);
		});
	}

	function collectPos() {
		let pos, collected = {}, props = ["x", "y", "width", "height"], p = 0;
		if (typeof canvas == 'undefined') return;

		function updateBounds(update) {
			if (update) {
				if (props[p] == "width") {
					collected[props[p]] = pos.x - collected.x;
				} else if (props[p] == "height") {
					collected[props[p]] = pos.y - collected.y;
				} else {
					collected[props[p]] = pos[props[p]];
				}
				collected[props[p]] = Math.round(collected[props[p]] * 100) / 100;
				p++;
				console.log(collected);
				if (p >= props.length) {
					p = 0;
					collected = {};
				}
			}
			console.log(`next get ${props[p]}`);
		}

		canvas.addEventListener("mousemove", e => {
			bounds = canvas.getBoundingClientRect();
			pos = {
				x: (e.clientX - bounds.left) / bounds.width,
				y: (e.clientY - bounds.top) / bounds.height,
			};
			//console.log(pos);
		});
		uWindow.addEventListener("keyup", e => {
			console.log(e.key);
			if (e.key == "b") updateBounds(true);
		});
		updateBounds();
	}

	function gotoGamePos(pos) {
		if (typeof canvas == 'undefined') return;
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
		console.log("new state", state);
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
		console.log("new state", state);
		if (!["menu", "options", "pause"].includes(state)) return;
		let menuOptions = Object.values(positions[state]);
		if (menuPos < 0) {
			menuPos = 0;
		}
		if (menuPos >= menuOptions.length) {
			menuPos = menuOptions.length - 1;
		}
		let menuPosBounds = menuOptions[menuPos];
		let pos = {
			x: menuPosBounds.x + menuPosBounds.width / 2,
			y: menuPosBounds.y + menuPosBounds.height / 2
		};
		mouseMove(pos);
	}

	function pressUp() {
		switch (state) {
			case "menu":
			case "options":
			case "pause":
				menuPos--;
				updateMenuPos();
				break;
		}

	}

	function pressDown() {
		switch (state) {
			case "menu":
			case "options":
			case "pause":
				menuPos++;
				updateMenuPos();
				break;
		}

	}

	function pressLeft() {
		if (state == "game") {
			moveGamePos(-.05);
		}
	}

	function pressRight() {
		if (state == "game") {
			moveGamePos(.05);
		}
	}

	async function pressSelect() {

		if (state == "game") {

			mouseUp();
			setTimeout(() => {
				mouseDown();
				gotoGamePos(currentAngle);
			}, 500);
		} else {
			click();
		}
		// switch (state) {
		// 	case "menu":
		// 	case "options":
		// 	case "pause":
		// 		let chosenItem = Object.keys(positions[state])[menuPos];
		// 		if (["menu", "pause"].includes(state)) {

		// 			click();
		// 		}
		// 		if (state == "options" && chosenItem == "back") {
		// 			click();
		// 		}
		// 		menuPos = 0;
		// 		break;
		// 	case "game":
		// 		mouseUp();
		// 		setTimeout(() => {
		// 			mouseDown();
		// 			gotoGamePos(currentAngle);
		// 		}, 500);
		// 		break;
		// 	default:
		// 		await click(positions.startGame);
		// 		break;
		// }

	}

	async function pressBack() {
		if (state == "game") {
			mouseUp();
			await click(positions.game.pause);
		}
	}



	uWindow.addEventListener("load", () => {
		setTimeout(() => {
			canvas = document.querySelector("canvas");
			if (typeof canvas == 'undefined') return;
			console.log("Collected canvas");

			canvas.addEventListener("mouseup", e => {
				if (!state) {
					state = "menu";
					updateMenuPos();
					return;
				}


				bounds = canvas.getBoundingClientRect();
				let mouse = {
					x: (e.clientX - bounds.left) / bounds.width,
					y: (e.clientY - bounds.top) / bounds.height,
				};

				let menu = positions[state];
				for (let option in menu) {
					let pos = menu[option];
					console.log(mouse, "vs", pos);
					if (
						mouse.x > pos.x && mouse.x < pos.x + pos.width &&
						mouse.y > pos.y && mouse.y < pos.y + pos.height
					) {
						switch (state) {
							case "menu":
							case "pause":
							case "game":
								state = option;
								menuPos = 0;
								break;
							case "options":
								if (option == "back") {
									state = "menu";
								}
								menuPos = 0;
								break;
						}
						if (state == "game")
							startGame();
						else
							updateMenuPos();
						break;
					}
				}
			});
		}, 2000);
		if (typeof SkyRemote === "undefined") {
			console.log("Sky Remote API is required");
		} else {
			console.log("Setting up sky remote");
			SkyRemote.onReleaseButton("up", pressUp);
			SkyRemote.onReleaseButton("down", pressDown);
			SkyRemote.onReleaseButton("left", pressLeft);
			SkyRemote.onReleaseButton("right", pressRight);
			SkyRemote.onReleaseButton("select", pressSelect);
			SkyRemote.onReleaseButton("backup", pressBack);
		}

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
		pressLeft, pressRight, pressUp, pressDown, pressSelect, pressBack, state
	};

	uWindow.BeehiveBedlam = BeehiveBedlam;
})();
