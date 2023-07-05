# STB Gaming Userscripts
Userscripts to make Denki's online Sky Games ports more accessible to a range of devices
---

## Installation

### PC
1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Click the link to the userscript you want to install
3. Tampermonkey should open a new tab with the userscript. Click _Install_ and confirm
### Mobile
> tba
### FireTV
> tba

## Sky Remote
> [sky remote.user.js](https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js)

A userscript that displays a graphical Sky remote, allowing the user to send inputs by pressing the buttons  
Available to use on Denki's Sky Games ports

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
