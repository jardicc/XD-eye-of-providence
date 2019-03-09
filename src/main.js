require('./JSON-decycle.js')

/*
	Author: Jaroslav Bereza - https://bereza.cz/ps
	License: MIT
*/

function see(items) {

	if(items.length < 1){
		return ("//////////////////////////////////////////\n"+
		" PLEASE SELECT LAYER \n"+
		"//////////////////////////////////////////\n")
	}
	var item = items[0];

	var itemType = item.constructor.name;
	var output = ""

	output+="//////////////////////////////////////////\n";
	output+=item.name+" ("+itemType+")\n";
	output+="//////////////////////////////////////////\n";
	var props = getAllProperties(item).sort();

	props.forEach((value) => {
		const propType = typeof item[value];
		if (propType === "function") {
			output+=value + "()\n";
		} else {
			output+=value + ": " + print(item[value]) +"\n";
		}
	})

	output+="//////////////////////////////////////////\n";

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

function seeMeInConsole(selection) {
	
	console.log(see(selection.items));
}

async function seeMeInModal(selection) {

	let dialog = document.createElement("dialog");
	let pluginArea = document.createElement("div");
	Object.assign(pluginArea.style, {
		display: "flex",
		width: "800",
		minHeight: "700px",
		flexDirection: "column",
		alignItems: "stretch",
		justifyContent: "space-between"
	  });

	let textarea = document.createElement("textarea");
	textarea.setAttribute("autofocus", false);
	textarea.readOnly = true;
	Object.assign(textarea.style, {
		display: "flex",
		flexGrow:1
	  });
	textarea.value=see(selection.items);
	pluginArea.appendChild(textarea);

	let closeButton = document.createElement("button");
	closeButton.setAttribute("uxp-variant", "cta");
	closeButton.setAttribute("autofocus", true);
	closeButton.textContent = "Close";
	closeButton.addEventListener("click", (ev)=> {
		dialog.close();
		ev.preventDefault();
	});
	pluginArea.appendChild(closeButton);

	//  add our container to it
	dialog.appendChild(pluginArea);

	//  add the dialog to the main document
	document.body.appendChild(dialog);
	//  show the dialog
	dialog.showModal();
}

module.exports = {
	commands: {
		seeMeInModal: seeMeInModal,
		seeMeInConsole: seeMeInConsole,
	}
};