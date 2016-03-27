/*\
title: $:/core/modules/utils/dom/keyboard.js
type: application/javascript
module-type: utils

Keyboard utilities

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var namedKeys = {
	"backspace": 8,
	"tab": 9,
	"enter": 13,
	"escape": 27,
	"space": 32,
	"pgup": 33,
	"pgdown": 34,
	"end": 35,
	"home": 36,
	"left": 37,
	"up": 38,
	"right": 39,
	"down": 40,
	"insert": 45,
	"delete": 46,
	"mult": 106,
	"plus": 107,
	"minus": 109,
	"div": 111,
	"f1": 112,
	"f2": 113,
	"f3": 114,
	"f4": 115,
	"f5": 116,
	"f6": 117,
	"f7": 118,
	"f8": 119,
	"f9": 120,
	"f10": 121,
	"f11": 122,
	"f12": 123
};

/*
Parses a key descriptor into the structure:
{
	keyCode: numeric keycode
	shiftKey: boolean
	altKey: boolean
	ctrlKey: boolean
}
Key descriptors have the following format:
	ctrl+enter
	ctrl+shift+alt+A
*/
exports.parseKeyDescriptor = function(keyDescriptor) {
	var components = keyDescriptor.split("+"),
		info = {
			keyCode: 0,
			shiftKey: false,
			altKey: false,
			ctrlKey: false
		};
	for(var t=0; t<components.length; t++) {
		var s = components[t].toLowerCase();
		// Look for modifier keys
		if(s === "ctrl") {
			info.ctrlKey = true;
		} else if(s === "shift") {
			info.shiftKey = true;
		} else if(s === "alt") {
			info.altKey = true;
		} else if(s === "meta") {
			info.metaKey = true;
		} else if(namedKeys[s]) {
			info.keyCode = namedKeys[s];
		} else if(s.length === 1) {
			info.keyCode = s.toUpperCase().charCodeAt(0);
		} else {
			throw "invalid key descriptor component " + components[t];
		}
	}
	return info;
};

exports.checkKeyDescriptor = function(event,keyInfo) {
	var metaKeyStatus = !!keyInfo.metaKey; // Using a temporary variable to keep JSHint happy
	return event.keyCode === keyInfo.keyCode && 
			event.shiftKey === keyInfo.shiftKey && 
			event.altKey === keyInfo.altKey && 
			event.ctrlKey === keyInfo.ctrlKey && 
			event.metaKey === metaKeyStatus;	
};

})();
