//javascript file for the popup page that does the summarization/extraction of the article

//Callback function that is called when the url of the current tab is found. 
//Adopted from https://developer.chrome.com/extensions/getstarted
function getCurrentTabUrl(callback){

//1. Query filter is passed to chrome.tabs.query
	var queryInfo = {
		active: true,
		currentWindow: true
	};
// 2. chrome.tabs.query calls on the callback with the current tab, 
// and the tab.url is available to provide the url, as "activeTab"  permission is declared in the manifest file.
	chrome.tabs.query(queryInfo, function(tabs){
		var tab = tabs[0];
		var url = tab.url; 


		callback(url);
	});
}

// extract the article with AYLIEN TextAPI's extraction API. 
// the function takes in the url of the article as an input 
function extract(myurl){

// jquery.ajax call is made to make a POST request to the API's web server
// the given code from the website was in cURL, which I wrapped around in the ajax call
// dataType is json, and the two input parameters are the "url" of the article and "best_image", boolean affecting the runtime
// headers were set with my ApplicationKey and ApplicationID provided from AYLIEN
// http://docs.aylien.com/docs/extract for more information  

	$.ajax({
	    type: "POST",
	    url: "https://api.aylien.com/api/v1/extract",
	    dataType: 'json',
	    data: {"url": myurl, "best_image": true},
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader("X-AYLIEN-TextAPI-Application-Key", "5e6f18a451ddc09c062209b82d9c1911");
			xhr.setRequestHeader("X-AYLIEN-TextAPI-Application-ID", "3c42db39");
	    }, 
	    success: function(data) {


	    	var author = document.getElementById('author')
	    	author.innerHTML += data.author;

	    	var title = document.getElementById('title')
	    	title.innerHTML += data.title; 

	    	var publishDate = document.getElementById('publishDate')
	    	publishDate.innerHTML += data.publishDate;


	    }
	});
}
// when the function succeeds, the output data is in JSON format, with extracted elements
// since I only want the author name, title, and the publishDate, I only save them into a variable in an HTML format with a ID
// so that I can display them through my popup html file 



// summarize the article with AYLIEN TextAPI's summarization API
// basics behind the code/API is the same as the extract function, 
// except that this time the input parameters are the url and the default sentence numbers for the summarization, which is set to 5
// for further upgrade/exploration, I could include an option page that lets the users select the desired sentence numbers
// http://docs.aylien.com/docs/summarize for more information

function summarize(myurl){

	$.ajax({
	    type: "POST",
	    url: "https://api.aylien.com/api/v1/summarize",
	    dataType: 'json',
	    data: {"url": myurl, "sentences_number": 5},
	    beforeSend: function (xhr) {
	        xhr.setRequestHeader("X-AYLIEN-TextAPI-Application-Key", "5e6f18a451ddc09c062209b82d9c1911");
			xhr.setRequestHeader("X-AYLIEN-TextAPI-Application-ID", "3c42db39");
	    }, 
	    success: function(data) {
	    	var summarizedarticle = data.sentences; 

	    	
	    		for (var i = 0; i< summarizedarticle.length; i++){
	    		var summary = document.getElementById('summary' + i.toString())
	    		summary.innerHTML += summarizedarticle[i];
	    	}
	    		
	    	
	    }
	});
}

// this time the output data has only two elements, original text and the summarized sentences
// I grabbed the sentences elements and then put them into an HTML format again to display them later onto the popup page 

// EventListener is added when the popup icon is clicked, and the functions are called in orders to 
// 1. grab the url 2. extract&summarize the articles and process the outputs

document.addEventListener('DOMContentLoaded', function(){
	getCurrentTabUrl(function(url){
		extract(url);	
		summarize(url);
	});
});

// all the console statements and error messages were deleted after the debugging steps were completed 
