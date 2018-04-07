// Unitemplate - JS \\
// Copyright (C) 2017 0x22fe \\

const UNI_NAME = "SafeDragon";
const UNI_TITLE = UNI_NAME;
const UNI_FONT = "https://fonts.googleapis.com/css?family=Montserrat";
//"./assets/Montserrat-Regular.woff";

const UNI_COLOR_MAIN = "#5bdb95";
const UNI_COLOR_ACCENT = "#5bff95";
const UNI_COLOR_STANDARD = "#5b9b95";

var UNI_MENU_ACTIVE = "";
var UNI_SOCKET;

window.onload = function() {
  document.title = UNI_TITLE;
  document.getElementById("uni_font").href = UNI_FONT;
  document.getElementById("uni_header").innerHTML = UNI_NAME;

  window.GV_Menu = [];
  window.GV_Active = 0;

  window.GV_Menu[0] = MenuOption("Dash", "fas fa-tachometer-alt");
  window.GV_Menu[1] = MenuOption("Chat", "fas fa-comments");
  window.GV_Menu[2] = MenuOption("Users", "fas fa-users");
  window.GV_Menu[3] = MenuOption("Help", "fas fa-book");
  window.GV_Menu[4] = MenuOption("Options", "fas fa-cogs");

  //setMenuOption("Dash");
  // document.getElementById("menu_Dash").focus();
};

function setMenuOption(name) {
  if (window.GV_Active ==
      ArrayFind(window.GV_Menu, "menu_" + name.toLowerCase()))
    return;

  document.getElementById("uni_header").innerHTML = name;
  document.getElementById("uni_frame").src = name.toLowerCase() + ".html";

  for (var i = 0; i < window.GV_Menu.length; i++) {
    document.getElementById(window.GV_Menu[i]).style.color = UNI_COLOR_STANDARD;
    document.getElementById(window.GV_Menu[i]).style.backgroundColor =
        UNI_COLOR_MAIN;
  }

  document.getElementById("menu_" + name.toLowerCase()).style.color =
      UNI_COLOR_MAIN;
  document.getElementById("menu_" + name.toLowerCase()).style.backgroundColor =
      UNI_COLOR_STANDARD;

  window.GV_Active = ArrayFind(window.GV_Menu, "menu_" + name.toLowerCase());
}

function MenuOption(name, icon) {
  var opt_html = '<div id="menu_' + name.toLowerCase() +
      '" class="menu" onclick="setMenuOption(\'' + name + '\')"><i class="' +
      icon + '" aria-hidden="true"></i><br>' + name + "</div>";
  document.getElementById("uni_footer")
      .insertAdjacentHTML("beforeend", opt_html);

  return "menu_" + name.toLowerCase();
}

function ArrayFind(array, value) {
  for (var i = 0; i < array.length; i++)
    if (array[i] === value) return i;
}

/*
 * Swipe Detector
 * https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
 */

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) return;

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
      if (window.GV_Active + 1 <= window.GV_Menu.length)
        setMenuOption(window.GV_Active + 1);
    } else {
      /* right swipe */
      if (window.GV_Active - 1 >= 0) setMenuOption(window.GV_Active - 1);
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}