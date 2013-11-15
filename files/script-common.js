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
  createProjectEntry ();
});

//====================================================================================
// Appends a debug print statement to the top of the HTML body
//====================================================================================
function dprt (s) {
  $('body').before (s + "<br>");
}

//====================================================================================
// Creates project entry
//====================================================================================
function createProjectEntry () {
    
    $(".proj-content").hover (function () {
      if ($(this).find(".proj-hidden").is (":hidden")) {
        // hide all
        $(".proj-content").animate ({
          opacity: 0.7,
          height: "295px",
          width: "300px"
        }, 500);
        $(".proj-content").find(".proj-hidden").slideUp (500);
        
        // show clicked
        $(this).animate ({
          opacity: 1.0,
          height: "525px",
          width: "500px"
        }, 500);
        $(this).find(".proj-hidden").fadeIn (500);
      }
      else {
        // hide clicked
        $(this).animate ({
          opacity: 0.7,
          height: "295px",
          width: "300px"
        }, 500);
        $(this).find(".proj-hidden").slideUp (500);
      }
    });
}

//====================================================================================
// Returns code to generate a glasspane with content
//====================================================================================
function generateGlasspane (contentId, width, height) {
  var ret = "";
  
  if (width != "auto") {
    ret += "<div class='glasspane' style='height:" + height + "px; width:" + width + "px;'></div>";
  } else {
    ret += "<div class='glasspane' style='height:" + height + "px;'></div>";
  }
  $("#" + contentId).before (ret);
  
  $("#" + contentId).addClass ("glasspane-content");
  $("#" + contentId).css ("top", "-" + height + "px");
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