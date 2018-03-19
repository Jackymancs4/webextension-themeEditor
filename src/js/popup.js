chrome.storage.sync.get(['currentTheme', 'defaultTheme'], function(storage) {

  let theme = Object.assign(storage.defaultTheme, storage.currentTheme);
  let startColorTheme = theme.colors

  let disabledArray = {}

  for (var colorAttr in startColorTheme) {
    if (startColorTheme.hasOwnProperty(colorAttr)) {

      disabledArray[colorAttr] = false

      let newColorAttribDiv = $('<div>')
      let newColorAttribTextDiv = $('<div>').attr("id", 'toggle' + colorAttr).append(colorAttr).css('background-color', startColorTheme[colorAttr])
      let newColorAttribDisableDiv = $('<div>').attr("id", 'disable' + colorAttr).append('nope')
      // let newColorAttribToggleDiv = $('<div>').attr("id", 'toggle' + colorAttr).append('yep')
      let newColorAttribInput = $('<input>').attr("id", 'input' + colorAttr).attr('type', 'text').attr('name', colorAttr).addClass('color')

      // let newColorAttribDiv = $('<div>').attr("id", colorAttr).append($('<input>').attr("id", 'input'+colorAttr).attr('type', 'text').attr('name', colorAttr).addClass('color'))

      $("#list-container").append(newColorAttribDiv.append(newColorAttribTextDiv).append(newColorAttribDisableDiv).append(newColorAttribInput));

      $('#input' + colorAttr).spectrum({
        color: startColorTheme[colorAttr],
        containerClassName: "awesome",
        appendTo: $('#picker-container'),
        showInput: true,
        move: setBackgroundColor(colorAttr),
        hide: resetBackgroundColor(colorAttr),
        change: saveBackgroundColor(colorAttr)
      });

      $("#btn-toggle").click(function() {
        $("#toggle").spectrum("toggle");
        return false;
      });

      $('#input' + colorAttr + ' .sp-preview-inner').append(colorAttr)


      function disablePicker(colorAttrName) {
        return function() {

          const actualColorAttr = colorAttrName

          if (disabledArray[actualColorAttr]) {
            $('#input' + actualColorAttr).spectrum("enable");
          } else {
            $('#input' + actualColorAttr).spectrum("disable");
          }
          disabledArray[actualColorAttr] = !disabledArray[actualColorAttr];
          return false;
        }
      }

      function togglePicker(colorAttrName) {
        return function() {

          const actualColorAttr = colorAttrName
          if (!disabledArray[actualColorAttr]) {
            $('#input' + actualColorAttr).spectrum("toggle");
          }
          return false;
        }
      }

      function setBackgroundColor(colorAttrName) {
        return function(color) {

          const actualColorAttr = colorAttrName

          $('#toggle' + actualColorAttr).css('background-color', color.toHexString())

          browser.runtime.sendMessage({
            command: "setAttrValue",
            attr: actualColorAttr,
            value: color.toHexString()
          });

          return false
        }
      }

      function resetBackgroundColor(colorAttrName) {
        return function(color) {

          const actualColorAttr = colorAttrName

          $('#toggle' + actualColorAttr).css('background-color', startColorTheme[actualColorAttr])

          browser.runtime.sendMessage({
            command: "resetAttrValue",
            attr: actualColorAttr,
            value: false
          });

          return false
        }
      }

      function saveBackgroundColor(colorAttrName) {
        return function(color) {

          const actualColorAttr = colorAttrName

          $('#toggle' + actualColorAttr).css('background-color', color.toHexString())
          startColorTheme[actualColorAttr] = color.toHexString()

          browser.runtime.sendMessage({
            command: "saveAttrValue",
            attr: actualColorAttr,
            value: color.toHexString()
          });

          return false
        }
      }

      $('#disable' + colorAttr).click(disablePicker(colorAttr));
      $('#toggle' + colorAttr).click(togglePicker(colorAttr));


    }
  }
});
