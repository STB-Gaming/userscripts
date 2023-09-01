# STB Gaming Userscripts
Userscripts to make Denki's online Sky Games ports more accessible to a range of devices

---

[Compatability Matrix](https://docs.google.com/spreadsheets/d/1HnZB-g4U8niy6Czyebj7p1Khgdf2e0OugheU_ZX6uvM/edit?usp=sharing)

## Installation

### PC
[Instructions](https://github.com/stb-gaming/.github/wiki/Windows,Mac,Linux)
### Android
[Instructions](https://github.com/stb-gaming/.github/wiki/Android)
### iOS
[Instructions](https://github.com/stb-gaming/.github/wiki/iOS)
### FireTV
[Instructions](https://github.com/stb-gaming/.github/wiki/FireTV)

## Controller Support
> [gamepad-support.user.js](https://github.com/STB-Gaming/userscripts/raw/master/gamepad-support.user.js)

A userscript that adds controller support to Denki's online Sky Games ports, using the Javascript Gamepad API.

### Button Mappings

Below are the default controls for the Xbox 360 controller, translated to Sky remote buttons

* A: Select
* B: Red
* X: Blue
* Y: Yellow
* Select: Green
* Start: Back Up
* Right Stick: Help

## Mobile Gamepad
> [sky-remote-mobile.user.js](https://github.com/STB-Gaming/userscripts/raw/master/sky-remote-mobile.user.js)

A userscript that adds a virtual Sky Gamepad button layout to mobile browsers, with touch support for mobile devices
![](screenshots/mobile-gamepad.png)



## Beehive Bedlam
> [beehive-bedlam.user.js](https://github.com/STB-Gaming/userscripts/raw/master/beehive-bedlam.user.js)

Adds programmatic functions to https://beehive-bedlam.com/
if installed standalone it adds keyboard support.

```js
// @require https://github.com/STB-Gaming/userscripts/raw/master/beehive-bedlam.user.js
```

## Sky Remote
> [sky-remote.user.js](https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js)

A userscript that adds functions to press Sky remote buttons


### Usage
how to include it in other use scripts
```
// @require https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
```

### SkyRemote.listButtons()
lists the names of the buttons on the sky remote

### SkyRemote.pressButton(buttonName)
Presses and releases a button

### SkyRemote.holdButton(buttonName)
Presses and holds a button

### SkyRemote.releaseButton(buttonName)
Releases a pressed button.
