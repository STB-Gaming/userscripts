// ==UserScript==
// @name         STBG Controller Support Script
// @namespace    https://stb-gaming.github.io
// @version      0.2.0
// @description  A script that uses the JS Gamepad API to add controller support to Denki's online Sky Games
// @author       cobaltgit
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// @require      https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
// ==/UserScript==


(function () {
	'use strict';
	const 
        uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window,
        buttonMapping = {
            12: "up",
            13: "down",
            14: "left",
            15: "right",
            9: "backup",
            0: "select",
            1: "red",
            2: "blue",
            3: "yellow",
            8: "green",
            11: "help"
        }

    let start, gamepad;

    function mainLoop() { // todo: non-linear input handling?
        let gamepads = navigator.getGamepads();
        if (!gamepads) return;
        gamepad = gamepads[0];

        for (const index of Object.keys(buttonMapping)) {
            if (gamepad.buttons[index].pressed) {
                SkyRemote.holdButton(buttonMapping[index]);
                break;
            } else {
                SkyRemote.releaseButton(buttonMapping[index]);
            }
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
