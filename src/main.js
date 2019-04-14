require('./JSON-decycle.js')
const scenegraph = require("scenegraph");

/*
	Author: Jaroslav Bereza - https://bereza.cz/ps
	License: MIT
*/

let textarea, h1, h2;

function setName(items) {
	var item = items[0];
	if (items.length < 1) {
		h1.textContent = "PLEASE SELECT LAYER ";
		h2.textContent = "";
	} else {
		var itemType = item.constructor.name;
		h1.textContent = item.name;
		h2.textContent = `[${itemType}]`;
	}
}

function see(items) {
	if (items.length < 1) {
		return ("")
	}

	var item = items[0];

	var output;
	var props = getAllProperties(item).sort();

	props.forEach((value) => {
		const propType = typeof item[value];
		if (propType === "function") {
			output += value + "()\n";
		} else {
			output += value + ": " + print(item[value]) + "\n";
		}
	})

	return output;

	function print(model) {
		return JSON.stringify(JSON.decycle(model), null, 3)
	}

	// https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
	function getAllProperties(obj) {
		var allProps = [],
			curr = obj
		do {
			var props = Object.getOwnPropertyNames(curr)
			props.forEach(function (prop) {
				if (allProps.indexOf(prop) === -1)
					allProps.push(prop)
			})
		} while (curr = Object.getPrototypeOf(curr))
		return allProps
	}
}

function seeMeInPanel() {
	textarea.value = see(scenegraph.selection.items);
	setName(scenegraph.selection.items)
}

function createPanel(event) {
	let pluginAreaWrapper = document.createElement("div");
	pluginAreaWrapper.className = "pluginAreaWrapper";

	h1 = document.createElement("h1");
	h1.className = "h1";

	h2 = document.createElement("h2");
	h2.className = "color-blue";

	let pluginArea = document.createElement("div");
	pluginArea.className = "pluginArea";
	var css = `
	* { 

	}
	.pluginArea {
		display:flex;
		flex-direction:column;
		flex-grow:1;
	}
	.pluginAreaWrapper {
		height:3000px;
		display:flex;
	}
	.code {
		display:flex;
		flex-grow:1;
		font-family: monospace;
	}
	`;

	const style = document.createElement('style');
	style.appendChild(document.createTextNode(css));
	pluginArea.appendChild(style);


	textarea = document.createElement("textarea");
	textarea.setAttribute("autofocus", false);
	textarea.className = "code";

	pluginArea.appendChild(h2);
	pluginArea.appendChild(h1);
	pluginArea.appendChild(textarea);

	pluginAreaWrapper.appendChild(pluginArea);
	seeMeInPanel();

	return pluginAreaWrapper;
}

module.exports = {
	panels: {
		seeMe: {
			show(event) {
				let panel = createPanel(event);
				event.node.appendChild(panel);
			},
			hide(event) {
				event.node.firstChild.remove();
			},
			update() {
				seeMeInPanel();
			}
		}
	}
};