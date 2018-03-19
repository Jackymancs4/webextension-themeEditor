"use strict";

const themes = {
  'default': {
    images: {
      headerURL: '',
    },

    colors: {
      accentcolor: 'white',
      textcolor: 'white',
      toolbar: 'white',
      toolbar_text: 'white',
      toolbar_field: 'white',
      toolbar_field_text: 'white',
      toolbar_top_separator: 'white',
      toolbar_bottom_separator: 'white',
      toolbar_vertical_separator: 'white'
    }
  }
};

// Save default options to storage
chrome.storage.sync.get('defaultTheme', function() {
  chrome.storage.sync.set({
    defaultTheme: themes.default,
  });
});

// Morning, Afternoon or Night
var currentTheme = '';
async function setTheme(theme) {

  currentTheme = theme;
  // Theme each window with the appropriate theme (morning/afternoon/night/dawn/private)
  browser.windows.getAll().then(wins => wins.forEach(themeWindow));
}

browser.windows.onCreated.addListener(themeWindow);

function themeWindow(window) {
  // Check if the window is in private browsing
  if (window.incognito) {
    browser.theme.update(window.id, themes['privatebrowsing']);
  } else {
    browser.theme.update(window.id, themes[currentTheme]);
  }
}

function checkTime() {
  let date = new Date();
  let hours = date.getHours();
  // zomg change
  if ((hours >= 6) && (hours <= 12)) {
    setTheme('morning');
  } else if ((hours >= 13) && (hours <= 18)) {
    setTheme('afternoon');
  } else if ((hours >= 19) || (hours <= 4)) {
    setTheme('night');
  } else {
    setTheme('dawn');
  }
}

/**
 * Listen for messages from the background script.
 * Call "beastify()" or "reset()".
 */
browser.runtime.onMessage.addListener((message) => {
  if (message.command === "setAttrValue") {
    themes['temp'] = themes['current']
    themes.temp.colors[message.attr] = message.value
    setTheme('temp');
  }

  if (message.command === "saveAttrValue") {
    themes.current.colors[message.attr] = message.value
    setTheme('current');

    chrome.storage.sync.set({
      currentTheme: themes.current
    });
  }


  if (message.command === "resetAttrValue") {
    themes['temp'] = themes['current']
    setTheme('current');
  }
});

chrome.storage.sync.get(['currentTheme', 'defaultTheme'], function(storage) {

  console.log(storage)

  themes.current = Object.assign(storage.defaultTheme, storage.currentTheme);
  setTheme('current');
});
