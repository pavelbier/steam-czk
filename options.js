function displayVersion(version) {
	var text = '';
	if (version=="euro") {
		text = "v €";
	} else if (version=="euro_czk") {
		text = "v € i Kč";
	} else {
		text = "v Kč";
	}
    document.getElementById('displayedVersion').innerHTML = text;
}

function setVersion(version) {
    chrome.extension.sendRequest({setDisplayedVersion : version});
    displayVersion(version);
}

function getVersion() {
    chrome.extension.sendRequest({getDisplayedVersion : true}, function (response) {
        displayVersion(response);
    });
}

var versionsList = document.getElementById('versionsList');
versionsList.addEventListener('click', function () {
    setVersion(versionsList.options[versionsList.selectedIndex].value);
});

getVersion();