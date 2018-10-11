

// PLEASE DON'T MODIFY sizmek.js , if any questions, feel free to ask me (tanvir@willow.studio)


// ------------------------------------------------------------- variable needed for 

// var localPreview = true;
// localPreview = document.location === top.location;


var creativeId = "HTMLResponsiveRichMediaBanner";
var creativeVersion = "1.1.0";
var lastModified = "2018-01-10";
var lastUploaded = "2018-01-10";
var templateVersion = "1.0.01";
var scrollPos = {x:undefined, y:undefined};
var adId, rnd, uid, versionID;
var listenerQueue;
var creativeIFrameId;

var isMobile = (/Mobi/i).test(navigator.userAgent);
var isIOS = (/iPhone|iPad|iPod/i).test(navigator.userAgent);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
// -------------------------------------------------------------


var templateName = "cf_deluxe_banner_mobile_flex_xl_1x1_" + creativeVersion + "_6266"; // cf_[format_name]_[template_name]_[wxh]_version_BlockID


function initializeLocalPreview() {
	console.log(" initiate preview mode");
    window.EB._adConfig = {
        adId: 00000000,
        rnd: Math.random().toString().substring(2),
        uid: adId + "_" + rnd
    };

    window.EB.clickthrough = function()			{console.log("EB.clickthrough: ", arguments);};
    window.EB.userActionCounter = function()	{console.log("EB.userActionCounter: ", arguments);};
}



function addCustomScriptEventListener(eventName, callback, interAd) {
    listenerQueue = listenerQueue || {};
    var data = {
        uid             : uid,
        listenerId      : Math.ceil(Math.random() * 1000000000),
        eventName       : eventName,
        interAd         : !!(interAd),
        creativeIFrameId: creativeIFrameId
    };
    sendMessage("addCustomScriptEventListener", data);
    data.callback = callback;
    listenerQueue[data.listenerId] = data;
    return data.listenerId;
}

function dispatchCustomScriptEvent(eventName, params) {
    params                  = params || {};
    params.uid              = uid;
    params.eventName        = eventName;
    params.creativeIFrameId = creativeIFrameId;
    sendMessage("dispatchCustomScriptEvent", params);
}

function removeCustomScriptEventListener(listenerId) {
	var params = {
		uid: uid,
		listenerId: listenerId,
		creativeIFrameId: creativeIFrameId
	};

	sendMessage("removeCustomScriptEventListener", params);
	if (listenerQueue[listenerId])
		delete listenerQueue[listenerId];
}

function eventManager(event) {

	var msg;
	if (typeof event == "object" && event.data) {
		msg = JSON.parse(event.data);

	} else {
		// this is safe frame.
		msg = {
			type: event.type,
			data: event
		};
	}
	if (msg.type && msg.data && (!uid || (msg.data.uid && msg.data.uid == uid))) {
		switch (msg.type) {
			case "sendCreativeId":
				creativeIFrameId = msg.data.creativeIFrameId;
				addCustomScriptEventListener('pageScroll', onPageScroll);
				addCustomScriptEventListener('creativeResize', sizeContentArea);
				sendMessage("dispatchScrollPos", {
					uid: uid
				});
				if (creativeContainerReady)
					creativeContainerReady();
				break;
			case "eventCallback": // Handle Callback
				var list = msg.data.listenerIds;
				var length = list.length;
				for (var i = 0; i < length; i++) {
					try {
						var t = listenerQueue[list[i]];
						if (!t) continue;
						t.callback(msg.data);
					} catch (e) {}
				}
				break;
		}
	}
}


function sendMessage(type, data) {
	console.group("send-message");
	//console.log("type: ", type);
	//console.log("data object: ", data);
	console.groupEnd();

	if (!data.type) data.type = type;
	EB._sendMessage(type, data);
}


function setCreativeVersion() {
	sendMessage("setCreativeVersion", {
		creativeId: creativeId + " - " + templateName,
		creativeVersion: creativeVersion,
		creativeLastModified: lastModified,
		uid: uid
	});
}

function onPageScroll(event) {
    scrollPos.x = event.scrollXPercent;
    scrollPos.y = event.scrollYPercent;
}


function initializeGlobalVariables() {
    try {adId = EB._adConfig.adId;} catch (Error) {}
    try {rnd = EB._adConfig.rnd;} catch (Error) {}
    try { uid = EB._adConfig.uid;} catch (Error) {}
}


function checkIfAdKitReady(event) {
	try{
		if (window.localPreview) {
                adkit.onReady(function(){
					window.initializeLocalPreview(); // In localPreview.js
					USE_RESIZE_LISTENER = true;
                    initializeCreative();
            });
			return;
		}
	}catch(e){}

    adkit.onReady(initializeCreative);
}


function initializeCreative(event) {
	//console.log("initialize creative");
	var viewportMeta = document.querySelector('meta[name="viewport"]');
	viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0");

	window.setTimeout(function(e) {viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0");}, 500);

	typeof Modernizr == "object" && (Modernizr.touch = Modernizr.touch || "ontouchstart" in window);

	EBG.pm.bind("sendCreativeId", function() {eventManager.apply(this, arguments);}, this);
	EBG.pm.bind("eventCallback", function() {eventManager.apply(this, arguments);}, this);

	initializeGlobalVariables();
	init(this);
	setCreativeVersion();
}




window.addEventListener("message", function() {try {eventManager.apply(this, arguments);} catch (e) {}}, false);
window.addEventListener("load", checkIfAdKitReady);
  

/*----------------------------------*/
/*-----> END OF WILLOW CODES  <-----*/
/*----------------------------------*/