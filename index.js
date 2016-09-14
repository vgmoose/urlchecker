function isURLReal(fullyQualifiedURL, isFinal) {
     var URL = encodeURIComponent(fullyQualifiedURL),
     dfd = $.Deferred(),
     checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json&diagnostics=true');
             
     checkURLPromise
     .done(function(response) {
           var repcode;
           try
           {
           repcode = response.query.diagnostics.url[0]["http-status-message"];
           }
           catch(err)
           {
           repcode = "Probably Enough";
           }
           // results should be null if the page 404s or the domain doesn't work
           if (response.query.results || repcode != "Not Found") {
           dfd.resolve(true, isFinal);
           } else {
           dfd.reject(false, URL, isFinal);
           }
           })
     .fail(function() {
           dfd.reject('failed');
           });
     
     return dfd.promise();
}

var subs;
var TotalCount = 0;

function checkURL()
{
    subs = document.getElementById('subs').value;
    subs = subs.replace(/\,/g, '\n');
    subs = subs.split('\n');
	
	// replace internal spaces with dashes
	if (document.getElementById("usedelim").checked)
		for (var x=0; x<subs.length; x++)
			subs[x] = subs[x].trim().replace(/ /g, "-");
    
    TotalCount = 0;
    
    document.getElementById('go').disabled = true;
    document.getElementById('go').style.opacity = .5;
    document.getElementById('go').style.cursor = "default";

    
    var domain = document.getElementById('domain').value;
    
    var checking = "<br><font color=\"blue\">checking...";
    var exist = "<br><font color=\"red\">all exist</font>";
    
    document.getElementById('available').innerHTML = document.getElementById('available').innerHTML.replace(exist, '');
    document.getElementById('available').innerHTML+= checking;

    
    for (var x=0; x<subs.length; x++)
    {
        var thissub = subs[x].toLowerCase().replace(/ /g, '');
        final = subs.length;
        
        if (thissub == '')
        {
            TotalCount++;
            if (final == TotalCount)
            {
            document.getElementById('available').innerHTML = document.getElementById('available').innerHTML.replace(checking, '');
                document.getElementById('go').disabled = false;
                document.getElementById('go').style.opacity = 1;
                document.getElementById('go').style.cursor = "pointer";


            }

            continue;
        }
        
        isURLReal('http://'+thissub+'.'+domain, final).done(function(result, fin) {
            document.getElementById('available').innerHTML = document.getElementById('available').innerHTML.replace(checking, '');
            
            TotalCount++;
            
            if (final != TotalCount)
            document.getElementById('available').innerHTML+= checking;
            else
                                                            {
                                                            if (document.getElementById('available').innerHTML == '')
                                                            document.getElementById('available').innerHTML = exist;
                                                            
                                                            document.getElementById('go').disabled = false;
                                                            document.getElementById('go').style.opacity = 1;
                                                            document.getElementById('go').style.cursor = "pointer";

                                                            }
        
    })
    .fail(function(result, url, fin) {
          
          if (typeof url !== 'undefined')
          {
          var nottaken = '<br><a target=\"_blank\" href=\"'+decodeURIComponent(url)+'\">'+decodeURIComponent(url).replace("http://", "")+'</a>'+" <font color=\"green\">does not exist</font>";
          
          if (document.getElementById('available').innerHTML.indexOf(nottaken) < 0)
                document.getElementById('available').innerHTML += nottaken;
          }

          
          document.getElementById('available').innerHTML = document.getElementById('available').innerHTML.replace(checking, '');
          
          TotalCount++;
          
          if (final != TotalCount)
          document.getElementById('available').innerHTML+= checking;
          else{
          if (document.getElementById('available').innerHTML == '')
            document.getElementById('available').innerHTML = exist;
          document.getElementById('go').disabled = false;
          document.getElementById('go').style.opacity = 1;
          document.getElementById('go').style.cursor = "pointer";

          }

          });
    
}
}