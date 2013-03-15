var Themes = {
  inputElements: null,
  
  init: function() {
    console.log('themes inited!');
    var colorPickerCallback = function(color) {
      this.style.backgroundColor = this.innerHTML = color;
      //more actions with colors here?
    }
    
    this.inputElements = document.querySelectorAll('.color-input');
    console.log('ile?', this.inputElements.length);
    [].forEach.call(this.inputElements, function(element) {
      console.log('ELEMENT', element);
      element.addEventListener('click', function(){
        console.log('clicked!');
        ColorPicker.show(element.innerHTML, colorPickerCallback.bind(element));
      });
    });
    
  }
}

Themes.init();