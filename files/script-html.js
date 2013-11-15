//====================================================================================
// File   : script-html.js
// Author : Kevin Chen                                          Copyright(c) 2011 K4SM 
//------------------------------------------------------------------------------------
// Decription:
//   This files contains functions that generate common parts of the html on page
// load without explicity writing the html in the file.
// 
//====================================================================================
$(document).ready (function () {
  banner ();
  navbar ();
  footer ();
});

//====================================================================================
// Generates code for banner
//====================================================================================
function banner () {
  $("#banner").attr ("onclick","location.href='../home/home.html'");
  $("#banner").append (function (){
    var s = "";
    s += "<h1>K4SM Games Studio</h1>";
    s += "<h2>Truly Groundbreaking Games</h2>";
    return s;
  });
}

//====================================================================================
// Generates code for navbar
//====================================================================================
function navbar () {
  $("#navbar").append (function () {
    var s = "";
    s += "<ul>";
    s += "<li><a href='../home/home.html'>home</a></li>";
    s += "<li><a href='../about/about.html'>about</a></li>";
    s += "<li><a href='../projects/projects.html'>projects</a></li>";
    s += "<li><a href='../contact/contact.html'>contact</a></li>";
    s += "</ul>";
    return s;
  });
}

//====================================================================================
// Generates code for footer
//====================================================================================
function footer () {
  $("#footer").append (function (){
    return "<p>Copyright &copy; 2011 K4SM Games Studio Ltd. | All rights reserved | Web Design by Kevin Chen</p>";
  });
}