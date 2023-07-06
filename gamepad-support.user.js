// ==UserScript==
// @name         STBG Controller Support Script
// @namespace    https://stb-gaming.github.io
// @version      0.1.2
// @description  A script that uses the JS Gamepad API to add controller support to Denki's online Sky Games
// @author       cobaltgit
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// @require      https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
// ==/UserScript==


(function () {
	'use strict';
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

    let
        gamepads,
        start,
        buttonNumbers = [12, 13, 15, 14, 9, 0, 1, 2, 3, 8, 11]

    function mainLoop() {
        gamepads = navigator.getGamepads();
        if (!gamepads) return;

        const gamepad = gamepads[0];
        const buttons = gamepad.buttons;

        if (buttons[12].pressed) {
            SkyRemote.holdButton("up"); // d-pad up
        } 
        if (buttons[13].pressed) {
            SkyRemote.holdButton("down"); // d-pad down
        }
        if (buttons[15].pressed) {
            SkyRemote.holdButton("right"); // d-pad right
        }
        if (buttons[14].pressed) {
            SkyRemote.holdButton("left"); // d-pad left
        }
        if (buttons[9].pressed) {
            SkyRemote.pressButton("backup"); // start (back up)
        }
        if (buttons[0].pressed) {
            SkyRemote.pressButton("select"); // A (select)
        }
        if (buttons[1].pressed) {
            SkyRemote.pressButton("red"); // B (red)
        }
        if (buttons[2].pressed) {
            SkyRemote.pressButton("blue"); // X (blue)
        }
        if (buttons[3].pressed) {
            SkyRemote.pressButton("yellow"); // Y (yellow)
        }
        if (buttons[8].pressed) {
            SkyRemote.pressButton("green"); // select (green)
        }
        if (buttons[11].pressed) {
            SkyRemote.pressButton("help"); // right stick down (help)
        }
        if (!buttonNumbers.some(index => buttons[index].pressed)) {
            SkyRemote.listButtons().forEach(button => SkyRemote.releaseButton(button));
        }
        

        start = uWindow.requestAnimationFrame(mainLoop)
    }

    uWindow.addEventListener("gamepadconnected", event => {
        mainLoop();
    });

    uWindow.addEventListener("gamepaddisconnected", event => {
        uWindow.cancelAnimationFrame(start);
    });
})();
