function store() {
	if (!document.formNotes.notes.validity.valueMissing) {
		t = document.formNotes.notes.value;
		t=t.replace(/\n+/g, "<br/>");
		escapedHTML=t.split("&").join("&amp;").split( "<").join("&lt;").split(">").join("&gt;");
		escapedHTML=escapedHTML.split("&lt;br/&gt;").join("<br/>");
		chrome.extension.getBackgroundPage().store(escapedHTML);
		document.getElementById('notification').innerHTML = "Note added successfully";
		document.formNotes.reset();
	} else {
		document.getElementById('notification').innerHTML = "Please enter some text into the note field";
		document.formNotes.notes.autufocus = true;
	}
}

function notes() {
	clearNotification();
	document.getElementById("list").className = "attivo";
	document.getElementById("new").className = "";
	chrome.tabs.getSelected(null, function(tab) {
		chrome.extension.getBackgroundPage().listNotes(tab.id);
	});
	chrome.extension.onRequest.addListener( function(request) {
		document.getElementById("listNotes").innerHTML = request.notes;
	});
	document.getElementById('listNotes').style.zIndex = "1";
	document.getElementById('add').style.zIndex = "-1";

}

function add() {
	clearNotification();
	document.getElementById('new').className = "attivo";
	document.getElementById('list').className = "";
	document.getElementById('listNotes').style.zIndex = "-1";
	document.getElementById('add').style.zIndex = "1";
}

function deleteNote(id) {
	if (navigator.platform.indexOf("Win")>-1) {
		var answer = confirm("Are you sure?");
	}
	if (navigator.platform.indexOf("Win")>-1 && answer) {
		chrome.tabs.getSelected(null,
			function(tab) {
				var a = chrome.extension.getBackgroundPage().deleteNote(tab.id, id);
					});
			document.getElementById('notification').innerHTML = "Note deleted successfully";
			chrome.extension.onRequest.addListener( function(request) {
				document.getElementById("listNotes").innerHTML = request.notes;
			});
		}	
}

function clearNotification() {
	document.getElementById('notification').innerHTML = "";
}

function modifyNote(id) {
	clearNotification();
	link = document.getElementsByName("modify" + id)[0].text;
	if (link == "Modify") {
		var message = document.getElementById(id).innerHTML.replace(/<(br|a).*>/i, '');
		document.getElementsByName("modify" + id)[0].innerHTML = "Save";
		var txt = document.createElement('textarea');
		old = document.getElementById(id).firstChild;
		document.getElementById(id).insertBefore(txt, old);
		document.getElementById(id).removeChild(old);
		document.getElementById(id).firstChild.value = message;
		document.getElementById(id).firstChild.cols = 35;
		document.getElementById(id).firstChild.rows = 5;
		document.getElementById(id).firstChild.focus();
	} else {
		document.getElementsByName("modify" + id)[0].innerHTML = "Modify";
		var temp = document.getElementById(id).firstChild.value;
		chrome.tabs.getSelected(null, function(tab) {
			chrome.extension.getBackgroundPage().updateNote(tab.id, temp, id);
		});
		document.getElementById('notification').innerHTML = "Note modified successfully";
	}

}
