var Themes = {

  inputElements: null,
  
  defaults: {
    "gaia.ui.menu": "#ff8004",
    "gaia.ui.menutext": "#ffffff",
    "gaia.ui.appworkspace": "#262626",
    "gaia.ui.infobackground": "#f5f5b5",
    "gaia.ui.buttonface": "#ece7e2",
    "gaia.ui.window": "#3b3b3b",
    "gaia.ui.windowtext": "#FAFAFA",
    "gaia.ui.highlight": "#fad184"
  },
  
  init: function() {
    var colorPickerCallback = function(color) {
      this.style.backgroundColor = this.innerHTML = color;
      //more actions with colors here?
      var setting = {};
      setting['gaia.ui.' + this.dataset.uiKey] = color;
      navigator.mozSettings.createLock().set(setting);
    }

    this.inputElements = document.querySelectorAll('.color-input');
    
    var updateUI = function(element) {
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
    };
    
    [].forEach.call(this.inputElements, function(element) {
      updateUI(element);
      element.addEventListener('click', function() {
        ColorPicker.show(element.innerHTML, colorPickerCallback.bind(element));
      });
    });
    
    document.getElementById('colors-reset').addEventListener('click', function(){
      navigator.mozSettings.createLock().set(this.defaults);
      [].forEach.call(this.inputElements, function(element) {
        updateUI(element);
      });
    }.bind(this));
    
  }
};

Themes.init();
