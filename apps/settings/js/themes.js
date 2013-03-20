var Themes = {

  inputElements: null,

  init: function() {
    console.log('themes inited!');
    var colorPickerCallback = function(color) {
      this.style.backgroundColor = this.innerHTML = color;
      //more actions with colors here?
      var setting = {};
      setting['gaia.ui.' + this.dataset.uiKey] = color;
      navigator.mozSettings.createLock().set(setting);
    }

    this.inputElements = document.querySelectorAll('.color-input');
    [].forEach.call(this.inputElements, function(element) {
      var color = navigator.mozSettings.createLock().get(
        'gaia.ui.' + element.dataset.uiKey
      );

      // I'm not sure if closure like this is a smartest way to
      // get all the settings.
      color.onsuccess = function(currentElement, currentColor) {
        return function() {
          currentElement.style.backgroundColor =
            currentElement.innerHTML =
              currentColor.result['gaia.ui.' + currentElement.dataset.uiKey];
        }
      }(element, color);

      element.addEventListener('click', function() {
        ColorPicker.show(element.innerHTML, colorPickerCallback.bind(element));
      });
    });

  }
};

Themes.init();
