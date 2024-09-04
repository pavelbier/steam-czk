(function(window,document,sessionStorage){

	if (!sessionStorage) return false;

	var pricesRe = /[0-9, ]+-*€/gi;	
	var exchangeRate = null;

	var loadActualExchangeRate = function(fnc) {
		if (sessionStorage.actualExchangeRateEuroToCzk) {
			exchangeRate = sessionStorage.actualExchangeRateEuroToCzk;
			fnc(exchangeRate);
			return true;
		}
		var xhr = new XMLHttpRequest();
		//xhr.open( "GET", "https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt", true );
		xhr.open( "GET", "https://epj.cz/pavelbier/kc.php", true );
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200) {
				sessionStorage.actualExchangeRateEuroToCzk = parseFloat(xhr.responseText);
				fnc(parseFloat(xhr.responseText));
			}
		};
		xhr.send();
		return true;
	}

	var replacePrice = function(elem,exchangeRate) {
	    
		if (!exchangeRate) {
			console.log('Nepodarilo se nacist aktualni kurz z cnb.cz');
			return false;
		}

	    var filter = function (node) {
	        var match = node.textContent.match(pricesRe);
	        var result = (match) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	        return result;
	    }

	    var walker = document.createTreeWalker(elem, NodeFilter.SHOW_TEXT, {acceptNode : filter}, false);
	    var matches = null,price = null, cleanEuro = null, newPrice = null, showVersion = null;
		chrome.extension.sendRequest({getDisplayedVersion : true}, function (response) {

			if (response=='euro') return true;
        	
			while (walker.nextNode()) {
				matches = walker.currentNode.nodeValue.match(pricesRe);
				cleanEuro = matches[0].replace(/,/,'.').replace(/[^0-9\.]/ig,'');
				price = exchangeRate * cleanEuro;

				if (response=='euro_czk') newPrice = parseInt(price,10) + ' Kč ('+matches[0].replace(' ','')+')';
				else newPrice = parseInt(price,10) + ' Kč';

			    walker.currentNode.nodeValue = walker.currentNode.nodeValue.replace(pricesRe, newPrice);
			}

    	});


	}

	var replacePrices = function(exchangeRate){
		if (!exchangeRate) {
			console.log('Nepodarilo se nacist aktualni kurz z cnb.cz');
			return false;
		}		
		replacePrice(document.body,exchangeRate);

		var observer = new WebKitMutationObserver(function (mutations) {
		    for (i in mutations) {
		        for (j = 0, l = mutations[i].addedNodes.length; j < l; j++) {
		            replacePrice(mutations[i].addedNodes[j],exchangeRate);
		        }
		    }
		});
		observer.observe(document.body, {childList : true, subtree : true});		
	}

	loadActualExchangeRate(replacePrices);

})(window,document,sessionStorage);