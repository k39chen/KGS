//====================================================================================
// File   : script-common.js
// Author : Kevin Chen                                          Copyright(c) 2011 K4SM 
//------------------------------------------------------------------------------------
// Decription:
//   This files contains functions that provide assistance in completing simple and 
// common tasks.
// 
//====================================================================================
$(document).ready (function () {
  checkEmptyContent ();
  createCaption ();
});

//====================================================================================
// Appends a debug print statement to the top of the HTML body
//====================================================================================
function dprt (s) {
  $('body').before ("<span style='color:white;font-family:Ubuntu'>" + s + "</span><br>");
}

//====================================================================================
// Appends an image to a gallery from repository source
//====================================================================================
function getImage (id, project, type, filelist) {
  var src = "http://subversion.assembla.com/svn/k4sm-repo/trunk/projects/";
  var code;
  var filename;
  for (var i=0; i<filelist.length; i++) {
    code = "";
    filename = filelist[i];
    
    code = code + "<img style='opacity:0.5;' height=150 alt='" + filename + "' class='image-preview' src='" + src; 
    code = code + project + "/art/" + type + "/" + filename + "'>";
    $('#' + id).append (code);
  }
}

//====================================================================================
// Has an image caption on mouseover of image
//====================================================================================
function createCaption () {
  var currWidth, currHeight;
  $(".image-preview").hover (function (event) {
    currWidth = $(this).width();
    currHeight = $(this).height();
    
    $(this).css ("cursor", "pointer");
    $(this).animate ({opacity: 1.0, width: (currWidth * 1.5), height: (currHeight * 1.5)}, 500);
    
    $("body").append ("<span id='temp' style='font-family:Tangerine;font-size:50px;'>"+$(this).attr("alt")+"</span>");
    $("#temp").offset ({top: event.screenY, left: event.screenX});
  },
  function () {
    $("#temp").remove ();
    $(this).animate ({opacity:0.5, width: currWidth, height: currHeight}, 300);
  });
}

//====================================================================================
// Checks if content is empty, and if it is, then put under construction image
//====================================================================================
function checkEmptyContent () {
  var s = $('#content').text();
  var img = "<img style='width:50%' src='http://blueblooder.com/wp-content/uploads/2009/03/under-construction.png'>";
  if ($.trim(s) == "") {
    $('#content').append ("<center>" + img + "</center>");
  }
}

//====================================================================================
// Gets the depth of a section number
//====================================================================================
function getDepth (s) {
  s = s.substr(0,s.indexOf(" "));
  var len = 0;
  // handle major section case
  if (s[s.length-2] + s[s.length - 1] == ".0") {
    return 1;
  }
  for (var i=0; i<s.length; i++) {
    if (s[i] == ".") {
      len += 1;
    }
  }
  return len + 1;
}

//====================================================================================
// Returns the string with the section number.
//====================================================================================
function getSection (s) {
  return s.substr (0,s.indexOf(" "));
}

//====================================================================================
// Returns the major number of a section
//====================================================================================
function getMajor (s) {
  return s.substr (0,s.indexOf("."));
}

//====================================================================================
// Gets minor section number (remainder of number after first period).
//====================================================================================
function getMinor (s) {
  return s.substr (s.indexOf(".")+1);
}

//====================================================================================
// Replaces every instance of c1 in s to c2.
//====================================================================================
function replaceChar (s,c1,c2) {
  var ss = "";
  for (var i=0;i<s.length;i++) {
    if (s[i] == c1) {ss += c2;}
    else {ss += s[i];}
  }
  return ss;
}

//====================================================================================
// Returns the prefix of a section number given a specified depth.
//====================================================================================
function getPrefix (tok, depth) {
  var s = "";
  if (getDepth (tok) == depth) {
    return getSection (tok);
  }      
  for (var i=0;i<depth;i++) {
    s = s + "." + getMajor(tok);
    tok = getMinor(tok);
  }
  return s.substr(1);
}