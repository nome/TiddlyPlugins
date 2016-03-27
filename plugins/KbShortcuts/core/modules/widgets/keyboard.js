/*\
title: $:/core/modules/widgets/keyboard.js
type: application/javascript
module-type: widget

Keyboard shortcut widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var KeyboardWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
KeyboardWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
KeyboardWidget.prototype.render = function(parent,nextSibling) {
	var self = this;
	// Remember parent
	this.parentDomNode = parent;
	// Compute attributes and execute state
	this.computeAttributes();
	this.execute();
	// Create element
	var domNode = this.document.createElement("div");
	// Assign classes
	var classes = (this["class"] || "").split(" ");
	classes.push("tc-keyboard");
	domNode.className = classes.join(" ");
	// Add a keyboard event handler
	domNode.addEventListener("keydown",function (event) {
		var result;
		$tw.utils.each(self.keyMappings, function(map, idx, data) {
			var keyInfo = map[0],
				message = map[1],
				param = map[2];
			if($tw.utils.checkKeyDescriptor(event,keyInfo)) {
				self.invokeActions(this,event);
				self.dispatchEvent({
					type: message,
					param: param,
					tiddlerTitle: self.getVariable("currentTiddler")
				});
				event.preventDefault();
				event.stopPropagation();
				result = true;
			}
			result = false;
		});
		return result;
	},false);
	// Insert element
	parent.insertBefore(domNode,nextSibling);
	// make sure we receive keyboard events
	domNode.setAttribute("tabindex", "0");
	domNode.focus();
	this.renderChildren(domNode,null);
	this.domNodes.push(domNode);
};

/*
Compute the internal state of the widget
*/
KeyboardWidget.prototype.execute = function() {
	var logger = new $tw.utils.Logger("$keyboard"),
		self = this;
	this.keyMappings = [];

	// evaluate key/message/param attributes (one key binding)
	var key = this.getAttribute("key"),
		message = this.getAttribute("message"),
		param = this.getAttribute("param");
	if (typeof(key) != "undefined" && typeof(message) != "undefined") {
		var keyInfo;
		try {
			keyInfo = $tw.utils.parseKeyDescriptor(key);
			this.keyMappings.push([keyInfo, message, param]);
		} catch(err) {
			logger.alert("[[" + this.getVariable("currentTiddler") + "]]: " + err + " in key=" + key);
		}
	}

	// evaluate mappings attribute (data tiddler containing key bindings)
	this.mappings = this.getAttribute("mappings");
	if (typeof(this.mappings) === "string") {
		$tw.utils.each(this.wiki.getTiddlerData(this.mappings, Object.create(null)), function(value, key, data) {
			var keyInfo, msg_param;
			try {
				keyInfo = $tw.utils.parseKeyDescriptor(key);
				msg_param = value.split(":");
				self.keyMappings.push([keyInfo, msg_param[0], msg_param[1]]);
			} catch(err) {
				logger.alert("[[" + self.mappings + "]]: " + err + " in key=" + key);
			}
		});
	}

	this["class"] = this.getAttribute("class");
	// Make child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
KeyboardWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.message || changedAttributes.param || changedAttributes.key || changedAttributes.mappings || changedAttributes["class"] || changedTiddlers[this.mappings]) {
		this.refreshSelf();
		return true;
	}
	return this.refreshChildren(changedTiddlers);
};

exports.keyboard = KeyboardWidget;

})();
