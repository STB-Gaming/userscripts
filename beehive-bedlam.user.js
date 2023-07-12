// ==UserScript==
// @name         STBG Beehive Bedlam
// @namespace    https://stb-gaming.github.io
// @version      0.2.1
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

	const DEG_TO_RAD = 2 * Math.pi / 180,
		E_GAME_STATE = {
			NONE: "0",
			GAME: "1",
			MENU: "2",
			LEVEL_SELECT: "3",
			OPTIONS: "4",
			PAUSE: "5",
		},
		E_CATAPULT_STATE = {
			STILL: 0,
			LEFT: 1,
			RIGHT: 2
		}, positions = {
			[E_GAME_STATE.MENU]: {
				[E_GAME_STATE.GAME]: { x: 0.24, y: 0.69, width: 0.22, height: 0.04 },
				[E_GAME_STATE.LEVEL_SELECT]: { x: 0.24, y: 0.74, width: 0.22, height: 0.04 }, // too big of a menu to implement
				[E_GAME_STATE.OPTIONS]: { x: 0.24, y: 0.79, width: 0.22, height: 0.04 }
			},
			[E_GAME_STATE.LEVEL_SELECT]: {
				[E_GAME_STATE.MENU]: { "x": 0.38, "y": 0.77, "width": 0.21, "height": 0.05 }
			},
			[E_GAME_STATE.OPTIONS]: {
				[E_GAME_STATE.MENU]: { x: 0.24, y: 0.56, width: 0.22, height: 0.04 },
				music: { x: 0.24, y: 0.61, width: 0.22, height: 0.04 },
				fullscreen: { x: 0.24, y: 0.66, width: 0.22, height: 0.04 },
				colors: { x: 0.24, y: 0.71, width: 0.22, height: 0.04 }
			},
			[E_GAME_STATE.GAME]: {
				[E_GAME_STATE.PAUSE]: {
					"x": 0.06,
					"y": 0.83,
					"width": 0.21,
					"height": 0.04
				},
			},
			[E_GAME_STATE.PAUSE]: {
				[E_GAME_STATE.GAME]: { x: 0.54, y: 0.45, width: 0.21, height: 0.04 },
				[E_GAME_STATE.MENU]: { x: 0.54, y: 0.5, width: 0.21, height: 0.05 },
			}
		};

	let canvas, bounds,
		menuPos = 0, gameState = E_GAME_STATE.NONE, lastMousePos = { x: .5, y: .5 },
		catapult = {
			state: E_CATAPULT_STATE.STILL,
			angularVelocity: 0,
			acceleration: 24,
			maxRotationSpeed: 576,
			animationFrame: undefined,
			currentAngle: 0
		};

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

	function setCatapultAngle(deg) {
		if (typeof canvas == 'undefined') return;
		bounds = canvas.getBoundingClientRect();
		let rad = deg * DEG_TO_RAD;
		let origin = { x: .66, y: .67 },
			radius = {
				x: .14 * bounds.width,
				y: .53 * bounds.height
			},
			unit = {
				x: Math.sin(rad * Math.PI / 2),
				y: -Math.cos(rad * Math.PI / 2)
			};
		mouseMove({
			x: origin.x + unit.x * radius.x / bounds.width,
			y: origin.y + unit.y * radius.y / bounds.height
		});
	}

	function setCatapultState(state) {

		catapult.state = state;

		if (catapult.state == E_CATAPULT_STATE.STILL || gameState != E_GAME_STATE.GAME) {
			catapult.state = E_CATAPULT_STATE.STILL;
			cancelAnimationFrame(catapult.animationFrame);
			catapult.animationFrame = null;
			//console.log("no loop");
			return;
		}

		if (catapult.animationFrame) return;


		//console.log("looping");
		let getTime = () => Date.now() / 1000;
		let lastTime = getTime();
		let loop = () => {

			let deltaTime = getTime() - lastTime;
			lastTime += deltaTime;
			console.log("fps", 1 / deltaTime);
			/*
			REFERENCE (credit: Aaron from denki)

				if (psCatapult->eState == CATAPULT_STATE_ROTATE_LEFT || psCatapult->eState == CATAPULT_STATE_ROTATE_RIGHT)
				{
					if (psCatapult->dwAngularVelocity < (int) psCatapult->udwMaxRotationSpeed)
						psCatapult->dwAngularVelocity += psCatapult->udwAcceleration;
				}

				if (psCatapult->eState == CATAPULT_STATE_ROTATE_LEFT)
					Catapult_SetAngle(psCatapult, psCatapult->udwAngle - psCatapult->dwAngularVelocity);
				else
				{
					if (psCatapult->eState == CATAPULT_STATE_ROTATE_RIGHT)
						Catapult_SetAngle(psCatapult, psCatapult->udwAngle + psCatapult->dwAngularVelocity);
				}

			*/
			if (catapult.state == E_CATAPULT_STATE.LEFT || catapult.state == E_CATAPULT_STATE.RIGHT)
				if (catapult.angularVelocity < catapult.maxRotationSpeed)
					catapult.angularVelocity += catapult.acceleration;

			if (catapult.state = E_CATAPULT_STATE.LEFT)
				setCatapultAngle(catapult.currentAngle - catapult.angularVelocity);
			if (catapult.state = E_CATAPULT_STATE.RIGHT)
				setCatapultAngle(catapult.currentAngle + catapult.angularVelocity);

			catapult.animationFrame = requestAnimationFrame(loop);
		};
		loop();
	};

	function startGame() {
		console.log("new state", gameState);
		console.log("Starting Game");
		catapult.state = E_CATAPULT_STATE.STILL;
		catapult.currentAngle = 0;
		mouseDown({ x: .5, y: .5 });
		setCatapultAngle(0);
	}

	function updateMenuPos() {
		console.log("new state", Object.keys(E_GAME_STATE)[Object.values(E_GAME_STATE).findIndex(s => s == gameState)]);
		if (![E_GAME_STATE.MENU, E_GAME_STATE.OPTIONS, E_GAME_STATE.PAUSE, E_GAME_STATE.LEVEL_SELECT].includes(gameState)) return;
		let menuOptions = Object.values(positions[gameState]);
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
		if ([E_GAME_STATE.MENU, E_GAME_STATE.OPTIONS, E_GAME_STATE.PAUSE, E_GAME_STATE.LEVEL_SELECT].includes(gameState)) {
			menuPos--;
			updateMenuPos();
		}

	}

	function pressDown() {
		if ([E_GAME_STATE.MENU, E_GAME_STATE.OPTIONS, E_GAME_STATE.PAUSE, E_GAME_STATE.LEVEL_SELECT].includes(gameState)) {
			menuPos++;
			updateMenuPos();
		}

	}

	function holdLeft() {
		if (gameState == E_GAME_STATE.GAME) {
			setCatapultState(E_CATAPULT_STATE.LEFT);
		}
	}

	function holdRight() {
		if (gameState == E_GAME_STATE.GAME) {
			setCatapultState(E_CATAPULT_STATE.RIGHT);
		}
	}

	async function pressSelect() {
		if (gameState == E_GAME_STATE.GAME) {
			mouseUp();
			setTimeout(() => {
				mouseDown();
				gotoGamePos(currentAngle);
			}, 500);

		} else {
			click();
		}

		// if ([E_GAME_STATE.MENU, E_GAME_STATE.OPTIONS, E_GAME_STATE.PAUSE].includes(gameState)) {
		// 	menuPos = 0;
		// }

	}

	async function pressBack() {
		if (gameState == E_GAME_STATE.GAME) {
			mouseUp();
			await click(positions[gameState][E_GAME_STATE.PAUSE]);
		}
	}



	uWindow.addEventListener("load", () => {
		setTimeout(() => {
			canvas = document.querySelector("canvas");
			if (typeof canvas == 'undefined') return;
			console.log("Collected canvas");

			canvas.addEventListener("mouseup", e => {
				if (gameState == E_GAME_STATE.NONE) {
					gameState = E_GAME_STATE.MENU;
					updateMenuPos();
					return;
				}



				bounds = canvas.getBoundingClientRect();
				let mouse = {
					x: (e.clientX - bounds.left) / bounds.width,
					y: (e.clientY - bounds.top) / bounds.height,
				};

				let menu = positions[gameState];
				for (let option in menu) {
					let pos = menu[option];
					if (
						mouse.x > pos.x && mouse.x < pos.x + pos.width &&
						mouse.y > pos.y && mouse.y < pos.y + pos.height
					) {
						console.log("selectec", option);
						if (Object.values(E_GAME_STATE).includes(option)) {
							gameState = option;
							menuPos = 0;
						}
						if (gameState == E_GAME_STATE.GAME)
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
			SkyRemote.onHoldButton("left", holdLeft);
			SkyRemote.onReleaseButton("left", () => setCatapultState(E_CATAPULT_STATE.STILL));
			SkyRemote.onHoldButton("right", holdRight);
			SkyRemote.onReleaseButton("right", () => setCatapultState(E_CATAPULT_STATE.STILL));
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
		setCatapultAngle,
		pressUp, pressDown, pressSelect, pressBack, gameState
	};

	uWindow.BeehiveBedlam = BeehiveBedlam;
})();
