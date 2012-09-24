var JLParty = JLParty || {};
JLParty.MIN = 1000*60;
JLParty.cache = JLParty.cache || {};
JLParty.check_cache = function (filename){
    if(JLParty.cache[filename]){
        return JLParty.cache[filename]['genre'];
    }
    else{
        return null;
    }
}
JLParty.cache_add = function(filename, genre){
    JLParty.cache[filename]={};
    JLParty.cache[filename]['genre']=genre;
    now=new Date();
    JLParty.cache[filename]['time']=now.getTime();
}

JLParty.expire_cache = function(){
    for (file in JLParty.cache){
        today = new Date();
        var now = today.getTime();
        if((now - JLParty.cache[file]['time']) > (20*JLParty.MIN))
            delete JLParty.cache[file];
    }
    if(pollStatus){
        setTimeout(JLParty.expire_cache, 5*JLParty.MIN);
    }
}

function upcoming() { 
    //console.log("running upcoming");
    $.ajax({
               url: 'requests/playlist.json',
               error: function (jqXHR, status, error) {
                   setTimeout(upcoming, 500);
               },
               success: function(data, status, jqHXR){
                   //console.log("in success function");
                   //$('#nextSongs').empty() ;
                   //$('#nextSongs').append("test");
                   //console.log(data);
                   var obj = $.parseJSON(data);
                   var playlist = obj.children[0].children;
                   var current = 0;
                   for ( var i = 0; i < playlist.length; i++){
                       if ("current" in playlist[i] && playlist[i].current == "current"){
                           current = i;
                           break;
                       }
                   }
                   var j = 0;
                   for( var i = current + 1, j = 1; j <= 4 && i < playlist.length ; j++, i++ ){
                       console.log("i=" + i + "; j=" + j);
                       var f = function(){
                           var div_str = "div#comingSong" + j ;
                           //console.log("div_str is " + div_str);
                           var filename = playlist[i].uri.slice(7);
                           var genre = JLParty.check_cache(filename);
                           if (genre){
                               //console.log("found " + filename + " is a " + genre);
                               //console.log("going to change " + div_str);
                               $(div_str).text(genre);
                           }
                           else{
                               var url1="/genre/dance?path=" + filename;
                               //console.log(div_str);
                               $.ajax({
                                          url: url1,
                                          error: function (jqXHR, status, error){
                                              setTimeout(upcoming, 500);
                                          },
                                          success: function(data, status, jqXHR){
                                              //console.log("going to change " + div_str + " to a " + data);
                                              $(div_str).text(data);
                                              JLParty.cache_add(filename,data);
                                              //console.log("added " + filename + " to cache as " +  data);
                                          }
                                      });
                           }
                       }
                       f();
                   }
                   //console.log("j="+j);
                   if (j < 3){
                       for(var i = j; i <= 4 ; i++ ){
                           var div_str = "div#comingSong" + i;
                           $(div_str).text("&nbsp;");
                       }
                   }
                   if(pollStatus){
                       setTimeout(upcoming, 2000);
                   }
               }
           });
}
$(function () {
      upcoming();
      setTimeout(JLParty.expire_cache, 10*JLParty.MIN);
  });
