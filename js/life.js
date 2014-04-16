// Life.js 
// by Peter Parnes 
// Contact: peter@parnes.com 
// Copyright Peter Parnes 
// Created: 2014-01-10

function getLife() {
    $.ajax({
        url: "https://narrativeapp.com/api/v2/moments/?limit=20", 
        beforeSend: function (request)
        {
            // request.setRequestHeader("Authorization:", "Bearer 1234");
        }
    })
    .done(function( data ) {
        if ( console && console.log ) {
            updateMoments(data);
        }})
    .fail(function(error) {
        alert(error);
    });
}

function getMoment(first, url, divid) {
    // console.log("getMoment: " + url);
    $.ajax({
        url: url,
        beforeSend: function (request)
        {
            // request.setRequestHeader("Authorization:", "Bearer 1234");
        }
    })
    .done(function( data ) {
        if ( console && console.log ) {
            updateMoment(first,data,divid);
        }})
    .fail(function(error) {
        alert(error);
    });
}

function updateMoments(data) {
    for(var i = 0; i < data.results.length; i++) { // XXX
        // for(var i = 0; i < 1; i++) {
        moment = data.results[i];
        $("#life").append("<P>Moment (" + moment.photo_count + " photos) : " + "<BR>");
        var tmpdiv = "momentphotos" + i;
        $("#life").append("<img onclick=getMoment(" + true + ",'" + moment.photos_url + "'," + tmpdiv + ") src=" + moment.keyframe.renders.smartphone.url + "></a>" +
                          "<div id='" + tmpdiv + "'></p>");
    }
}

function downloadAll(divholder) {
    $(divholder).find("a").each(function() {
        var link = document.createElement("a");
        link.href = $(this).context.href;
        //urlparts = link.href.split("/");
        //link.download=urlparts[urlparts.length-1];
        link.download = $(this).context.download;
        link.style.display = "none";
        var evt = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": true
        });
        
        document.body.appendChild(link);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
        
    });
}

function updateMoment(first, data, divholder) {
    // console.log("updateMoment ");
    
    downloadallDivId = divholder.id + "download";
    
    if(first) {
        $(divholder).append("<a onclick=\"downloadAll(" + downloadallDivId + ")\">Download all</a>");
        $(divholder).append("<div id='" + downloadallDivId + "'></div>");
    }
    for(var i = 0; i < data.results.length; i++) {
        photo = data.results[i];
        $(divholder).append("<a class=fancybox title=\"Quality Score: " + photo.quality_score + "\" href=\"" + photo.renders["g1.hd"].url + "\" data-fancybox-group=gallery title=><img src=" + photo.renders.g1_thumb_square.url + "></a>&nbsp");
        $("#" + downloadallDivId).append("<a href='" + photo.renders["g1.hd"].url + "' download=\"" + getDownloadName(photo.taken_at_local) + "\">");
    }
    if(data.next) {
        getMoment(false, data.next, divholder);
    }
}

function getDownloadName(taken) {
    parts = taken.split("+");
    return "narrative-" + parts[0];
}

$(document).ready(function () {
    $(".fancybox").fancybox();
    getLife();
});