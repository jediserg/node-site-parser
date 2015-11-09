var logger = require('winston');

if(process.argv.length < 3) {
	logger.error("No site specified");	
	process.exit(1);
}

var parser = require('cheerio')
var Crawler = require("simplecrawler");

var site = process.argv[2];

logger.info("Start parsing '%s'", site);

var myCrawler = new Crawler(site);

myCrawler.downloadUnsupported = false;
myCrawler.parseHTMLComments = false;
myCrawler.parseScriptTags = false;
myCrawler.supportedMimeTypes = [new RegExp("text/html")];

var results = [];

myCrawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    logger.info("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    logger.info("It was a resource of type %s", response.headers['content-type']);

    var result = {}

    result.url = queueItem.url;

    var $ = parser.load(responseBuffer);

    var h1 = $('h1');
    var h2 = $('h2');
    var h3 = $('h3');

    var title = $('title').text();

    result.title = title;
    result.h1 = [];
    result.h2 = [];
    result.h3 = [];

    h1.each(function(o, o1) {
    	result.h1.push($(this).text())
    })

    h2.each(function(o, o1) {
    	result.h2.push($(this).text())
    })

    h3.each(function(o, o1) {
    	result.h3.push($(this).text())
    })

 	logger.info(result);
    results.push(result)
});

myCrawler.start();
