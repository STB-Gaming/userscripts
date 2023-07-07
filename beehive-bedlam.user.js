// ==UserScript==
// @name         STBG Beehive Bedlam
// @namespace    https://stb-gaming.github.io
// @version      0.0.1
// @description  A userscript that makes the online Beehive Bedlam remake compatible with STBG's standardised controls
// @author       tumble1999, cobaltgit
// @run-at       document-start
// @match        https://beehive-bedlam.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beehive-bedlam.com/
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	let canvas, bounds,
		positions = {
			startGame: { x: .5, y: .5 },
			menu: {
				startGame: { x: .33, y: .70 },
				selectLevel: { x: .33, y: .76 },
				options: { x: .33, y: .82 }
			}, options: {
				back: { x: .33, y: .58 },
				music: { x: .33, y: .62 },
				fullscreen: { x: .33, y: .68 },
				colors: { x: .33, y: .73 },
			}
		}, currentAngle = 0;

	uWindow.addEventListener("load", () => {
		setTimeout(() => {
			canvas = document.querySelector("canvas");
			console.log("Collected canvas and bounds");
		}, 2000);
	});

	function sendMouseEvent(event, { x, y }) {
		bounds = canvas.getBoundingClientRect();
		canvas.dispatchEvent(new MouseEvent(event, {
			clientX: bounds.left + x * bounds.width,
			clientY: bounds.top + y * bounds.height
		}));
	}

	function mouseDown({ x, y }) {
		console.log("pressing mouse at", { x, y });
		sendMouseEvent("mousedown", { x, y });
	}
	function mouseUp({ x, y }) {
		console.log("releasing mouse at", { x, y });
		sendMouseEvent("mouseup", { x, y });
	}
	function mouseMove({ x, y }) {
		console.log("moving mouse to", { x, y });
		sendMouseEvent("mousemove", { x, y });
	}


	function click({ x, y }) {
		mouseDown({ x, y });
		setTimeout(() => mouseUp({ x, y }), 100);
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

	function gotoGamePos(deg) {
		let origin = { x: .66, y: .67 },
			radius = 15;
		mouseMove({
			x: origin.x + radius * Math.sin(deg),
			y: origin.y + radius * Math.abs(Math.cos(deg))
		});
	}

	function moveGamePos(degDeta) {
		gotoGamePos(currentAngle += degDeta);
	}

	function startGame() {
		console.log("Starting Game");
		currentAngle = 0;
		mouseDown({ x: .5, y: .5 });
		// setInterval(() => {
		// 	moveGamePos(.1);
		// }, 100);
	}

	function skipToGame() {
		click(positions.startGame);
		setTimeout(() => click(positions.menu.startGame), 500);
		setTimeout(() => startGame(), 1000);
	}

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
		skipToGame
	};

	if (!uWindow.BeehiveBedlam) uWindow.BeehiveBedlam = BeehiveBedlam;
})();
