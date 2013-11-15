//====================================================================================
// File   : script-toc.js
// Author : Kevin Chen                                          Copyright(c) 2011 K4SM 
//------------------------------------------------------------------------------------
// Decription:
//   This files contains functions designed to create a dynamically expandable and 
//  collapsible table of contents with animation incorporating tree construction 
//  algorithms.
//
// Features:
//   - Generates a dynamic TOC given a set of modules and correct sets of headings
//   - Automatically creates anchors given the index number supplied following
//     the header element, ie. <a name="1.2.1"></a> is produced given a header
//     <h3>1.2.1 Introductory Statement</h3>.
//   - Builds a expandable/contractable TOC
//   - Automates linking to anchors in content
//   - Adjustable speed of animation for expanding/contracting TOC subtrees
//   - Detects end of section and creates a link to top of the module
//   - Detects WIP sections located in the content and inserts an image as a flag
// 
//====================================================================================
var MAX_HEADINGS = 6;

//====================================================================================
// Builds the table of contents from headings found in the modules
//====================================================================================
function createTOC () {
  var headings = [];
  
  createGlossary ();
  
  // retrieve all headings
  for (var i=1; i<=MAX_HEADINGS; i+=1) {
    $(".module h" + i).each (function () {
      var s = $(this).text();
      headings.push (s);
    });
  } headings.sort (); // sort headings
  
  // begin constructing TOC by defining the root
  $('#toc').append ("<ol class='toc-root''></ol>");
  
  // build subtrees
  function build (prefix, level, tree) {
    var code = "";
    for (var i=0; i<tree.length; i++) {
      if (getDepth(tree[i]) == level && getPrefix(tree[i], level) == prefix) {
        code = code + "<li class='toc-parent'>" + tree[i] + "</li>";
        code = code + "<ol class='toc-child'>";
        for (var j=0;j<40;j++) {
          code = code + build(prefix + "." + j, level+1, tree);
        }
        code = code + "</ol>";
      }
    }
    return code;
  }
  
  // get the module headings
  var num_modules = 0;
  for (var i=0; i<headings.length; i++) {
    if (getDepth(headings[i]) == 1) {
      num_modules++;
    }
  }
  
  // build subtrees for all modules
  var code = "";
  for (var i=0; i<num_modules; i++) {
    code = code + build (i, 1, headings);
  }
  
  $(".toc-root").append (code);
  
  // change parents with empty subtrees to leaves
  $(".toc-parent").each (function (key, val) {
    if ($.trim($(this).next().text()) == "") {
      $(this).removeClass ("toc-parent");
      $(this).addClass ("toc-leaf");
    }
  });

  initializeModules();
  linker ();
  detectEmptySections ();
  createButtons ();
  toggleTOCSections ();
  scrollToTopAnimation ();
  openModuleClickTOC ();
}

//====================================================================================
// Create Glossary
//====================================================================================
function createGlossary () {
  var module = getMajor($("#glossary").prev().text());
  var alpha = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i=0;i<alpha.length;i++) {
    var s = "<h2>" + module + "." + (i+1) + " " + alpha[i] + "</h2>";
    if (alpha[i] == "#") {s = s + "<div id='glossary_NUM'></div>";}
    else {s = s + "<div id='glossary_" + alpha[i] +"'></div>";}
    $("#glossary").append (s);
  }
  
}

//====================================================================================
// Insert Glossary Items
//====================================================================================
function insertGlossaryItems (obj) {
  var nums = "012346789";
  for (var i=0; i<obj.length; i++) {
    var c = obj[i].Term.substr(0,1);
    $("#glossary_" + c).append ("<p><b>" + obj[i].Term + "</b>: " + obj[i].Definition + "</p>");
  }
}

//====================================================================================
// Sets the inital module to be opened on page load.
//====================================================================================
function initializeModules () {
  $(".module").each (function (n) {
    $(this).css ("display","none");
    if (n == 0) {
      $(this).css ("display", "block");
    }
  });
}

//====================================================================================
// Generate links to important sections in modules.
//====================================================================================
function linker () {
  // create anchors for h1 links in major sections
  $(".section").prepend (function(){
    var s = $(this).prev("h1").text();
    s = getMajor(s) + "_0";
    return "<a id='" + s + "' style='font-size:0px;'>"+s+"</a>";
  });
  
  // create anchors for h(2,3,...,MAX_HEADINGS) in minor sections
  for (var i=2; i<=MAX_HEADINGS; i+=1) {
    $(".module h" + i).prepend (function (n,html) {
      var s = html.substr (0,html.indexOf(" "));
      s = replaceChar (s, ".", "_");
      return "<a id='" + s + "'></a>";
    });
  }
  
  // create links in TOC to anchors created in sections
  $("#toc li").wrapInner (function () {
    var s = $(this).html().substr(0,$(this).html().indexOf(" "));
    s = replaceChar(s,".","_");
    return "<a href='#"+ s + "'></a>";
  });
  
  // create links to go to top of section (located at end of every section)
  for (var i=2;i<=MAX_HEADINGS;i++) {
    $(".section h" + i).next().after (function(){
      var s = $(this).prev().text();
      s = s[0];
      s = $.trim(s);
      return "<a href='#" + s + "_0' class='scroll'>[top]</a>";
    });
  }
}

//====================================================================================
// Detects WIP sections in modules and sections.
//====================================================================================
function detectEmptySections () {
  var gloss_mod = getMajor ($("#glossary").prev().text());
  for (var i=1; i<=MAX_HEADINGS; i+=1) {
    $(".section h" + i).next().append (function(){
        var s = getMajor ($(this).prev().text());
        if (s == gloss_mod) {
          return "";
        }
        if ($.trim($(this).html()) == "") {
          if (i == 1) {
            return "<center><img src='https://www.smfm.org/images09/Under%20Construction.png' style='margin:0;padding:0'></center>";
          }
          else {
            return "<img src='https://www.smfm.org/images09/Under%20Construction.png' style='margin:0;padding:0'>";
          }
        }
    });
  }
}

//====================================================================================
// Create toc expand/contract buttons.
//====================================================================================
function createButtons () {
  $(".toc-parent").prepend ("<button>+</button>");
  $(".toc-leaf").prepend ("<button>.</button>");
}

//====================================================================================
// Expand/contract a toc-parent object.
//====================================================================================
function toggleTOCSections () {
  $(".toc-parent").each (function () {
    var parent = $(this);
    $(this).find('button').click (function (){
      if (parent.next().is (":hidden")){
        // show subtree
        parent.next().show('slow');
        $(this).text("-");
      } else {
        // hide subtree 
        parent.next().hide('slow');
        $(this).text("+");
      }
    });
  });
}

//====================================================================================
// Create scroll animation.
//====================================================================================
function scrollToTopAnimation () { 
  $(".scroll").click(function(event){   
    event.preventDefault();
    $('.section').animate({scrollTop:$(this.hash).offset().top}, 500);
  });
}

//====================================================================================
// Opens module when link clicked on in TOC.
//====================================================================================
function openModuleClickTOC () {
  $("#toc li").click (function () {
    var s = $(this).text().substr(1);
    s = s.substr (0,s.indexOf("."));
    openModule (s);
  });
}

//====================================================================================
// Opens module when link clicked on in content section.
//====================================================================================
function openModule (section) {
  // checks if module is already open
  var exists = 0;
  $(".module").each (function () {
    var ss = $(this).find('h1').text();
    ss = ss.substr (0,ss.indexOf ("."));
    if (section == ss) {
      if ($(this).is(":visible")) {exists = 1;}
    }
  });
  // opens module
  if (exists == 0) {
    $(".module").each (function () {
      $(this).css ('display','none');
      var ss = $(this).find('h1').text();
      ss = ss.substr (0,ss.indexOf ("."));
      if (section == ss) {
        $(this).fadeIn ('slow');
      }
    });
  }
}