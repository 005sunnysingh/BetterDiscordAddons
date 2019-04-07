window.onload = function () {
	window.parent.postMessage({origin:"DiscordPreview",reason:"OnLoad"},"*");
};
window.onkeyup = function (e) {
	var which = e.which;
	window.parent.postMessage({origin:"DiscordPreview",reason:"KeyUp",which},"*");
};
window.onmessage = function (e) {
	if (typeof e.data === "object" && (e.data.origin == "PluginRepo" || e.data.origin == "ThemeRepo")) {
		switch (e.data.reason) {
			case "OnLoad":
				document.body.innerHTML = document.body.innerHTML.replace(/\t|\n|\r/g, "");
				if (e.data.username) {
					document.body.innerHTML = document.body.innerHTML.replace(/REPLACE_USERNAMESMALL/gi, e.data.username.toLowerCase());
					document.body.innerHTML = document.body.innerHTML.replace(/REPLACE_USERNAME/gi, e.data.username);
				}
				if (e.data.id) document.body.innerHTML = document.body.innerHTML.replace(/REPLACE_USERID/gi, e.data.id);
				if (e.data.avatar) document.body.innerHTML = document.body.innerHTML.replace(/REPLACE_AVATAR/gi, "url(" + e.data.avatar.split('"').join('') + ")");
				if (e.data.discriminator) document.body.innerHTML = document.body.innerHTML.replace(/REPLACE_DISCRIMINATOR/gi, e.data.discriminator);
				if (e.data.nativecss) {
					var theme = document.createElement("link");
					theme.classList.add(e.data.reason);
					theme.rel = "stylesheet";
					theme.href = e.data.nativecss;
					document.head.appendChild(theme);
				}
				document.body.firstElementChild.style.removeProperty("display");
				break;
			case "Eval":
				if (e.data.jsstring) eval(`(() => {${e.data.jsstring}})()`);
				window.parent.postMessage({origin:"DiscordPreview",reason:"EvalResult",result:window.evalResult},"*");
				break;
			case "NewTheme":
			case "CustomCSS":
			case "ThemeFixer":
				document.querySelectorAll("style." + e.data.reason).forEach(theme => theme.remove());
				if (e.data.checked) {
					var theme = document.createElement("style");
					theme.classList.add(e.data.reason);
					theme.innerText = e.data.css;
					document.head.appendChild(theme);
				}
				break;
			case "DarkLight":
				if (e.data.checked) document.body.innerHTML = document.body.innerHTML.replace(new RegExp(e.data.dark, "g"), e.data.light);
				else document.body.innerHTML = document.body.innerHTML.replace(new RegExp(e.data.light, "g"), e.data.dark);
				break;
			case "Normalize":
				var oldhtml = document.body.innerHTML.split('class="');
				var newhtml = oldhtml.shift();
				for (let html of oldhtml) {
					html = html.split('"');
					newhtml += 'class="' + (e.data.checked ? html[0].replace(/([A-z0-9]+?)-([A-z0-9_-]{6})/g, "$1-$2 da-$1") : html[0].split(" ").filter(n => n.indexOf("da-") != 0).join(" ")) + '"' + html.slice(1).join('"');
				}
				document.body.innerHTML = newhtml;
				break;
		}
	}
};
window.getString = function (obj) {
	var string = "";
	if (typeof obj == "string") string = obj;
	else if (obj && obj.props) {
		if (typeof obj.props.children == "string") string = obj.props.children;
		else if (Array.isArray(obj.props.children)) for (let c of obj.props.children) string += typeof c == "string" ? c : getString(c);
	}
	return string;
};
window.WebModulesFind = function (filter) {
	const id = "PluginRepo-WebModules";
	const req = typeof(global.window.webpackJsonp) == "function" ? global.window.webpackJsonp([], {[id]: (module, exports, req) => exports.default = req}, [id]).default : global.window.webpackJsonp.push([[], {[id]: (module, exports, req) => module.exports = req}, [[id]]]);
	delete req.m[id];
	delete req.c[id];
	for (let m in req.c) {
		if (req.c.hasOwnProperty(m)) {
			var module = req.c[m].exports;
			if (module && module.__esModule && module.default && filter(module.default)) return module.default;
			if (module && filter(module)) return module;
		}
	}
};
window.WebModulesFindByProperties = function (properties) {
	properties = Array.isArray(properties) ? properties : Array.from(arguments);
	var module = WebModulesFind(module => properties.every(prop => module[prop] !== undefined));
	if (!module) {
		module = {};
		for (let property of properties) module[property] = property;
	}
	return module;
};
window.WebModulesFindByName = function (name) {
	return WebModulesFind(module => module.displayName === name);
};
window.BDV2 = {};
window.BDV2.react = window.React;
window.BDV2.reactDom = window.ReactDOM;
window.BDV2.WebpackModules = {};
window.BDV2.WebpackModules.find = window.WebModulesFind;
window.BDV2.WebpackModules.findByUniqueProperties = window.WebModulesFindByProperties;
window.BDV2.WebpackModules.findByDisplayName = window.WebModulesFindByName;
window.BdApi = {};
window.BdApi.React = window.React;
window.BdApi.ReactDOM = window.ReactDOM;
window.BdApi.findModule = window.WebModulesFind;
window.BdApi.findModuleByProps = window.WebModulesFindByProperties;