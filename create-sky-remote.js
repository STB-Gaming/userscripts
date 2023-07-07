let controls = [
	{
		title: "sky",
		keys: ["Esc"],
		function: "pressSky"
	},
	{
		title: "tv-guide",
		keys: ["a"],
		function: "pressTvGuide"
	},
	{
		title: "box-office",
		keys: ["s"],
		function: "pressBoxOffice"
	},
	{
		title: "services",
		keys: ["d"],
		function: "pressServices"
	},
	{
		title: "interactive",
		keys: ["f"],
		function: "pressInteractive"
	},
	{
		title: "i",
		keys: ["g"],
		function: "pressI"
	},
	{
		title: "up",
		keys: ["ArrowUp", "i"],
		function: "pressUp"
	},
	{
		title: "down",
		keys: ["ArrowDown", "k"],
		function: "pressDown"
	},
	{
		title: "left",
		keys: ["ArrowLeft", "j"],
		function: "pressLeft"
	},
	{
		title: "right",
		keys: ["ArrowRight", "l"],
		function: "pressRight"
	},
	{
		title: "select",
		keys: [" ", "Enter"],
		function: "pressSelect"
	},
	{
		title: "back",
		keys: ["Backspace"],
		function: "pressBack"
	},
	{
		title: "red",
		keys: ["q"],
		function: "pressRed"
	},
	{
		title: "green",
		keys: ["w"],
		function: "pressGreen"
	},
	{
		title: "yellow",
		keys: ["e"],
		function: "pressYellow"
	},
	{
		title: "blue",
		keys: ["r"],
		function: "pressBlue"
	},
	{
		title: "help",
		keys: ["t"],
		function: "pressHelp"
	}
];



function createSkyRemote(funcs) {
	document.addEventListener("keyup", event => {
		for (const control of controls)
			if (control.keys.includes(event.key) && control.function && funcs[control.function])
				funcs[control.function]();
	});

}
