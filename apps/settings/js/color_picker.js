'use strict';

var ColorPicker = (function() {

  var screen = null;
  var dialog = null;
  var yes = null;
  var colorPalette = null;
  var pickedColor = null;
  var basicColorCheckbox = null;
  var canvas = null;
  var ctx = null;
  var canvasBoundingClientRect = null;
  var callback = null;

  var init = function() {

    colorPalette = new Image();
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvasBoundingClientRect = canvas.getBoundingClientRect();
    colorPalette.onload = prepareCanvas;
    colorPalette.src = 'style/images/colors.jpg';
    colorPalette.id = 'palette';

    screen = document.getElementById('color-picker-tab');
    //screen.setAttribute('role', 'region');
    //screen.id = 'dialog-screen';

    dialog = document.createElement('div');
    dialog.id = 'dialog-dialog';
    dialog.setAttribute('role', 'dialog');
    screen.appendChild(dialog);

    // var bc_checkboxLabel = document.createElement('label');
    // basicColorCheckbox = document.createElement('input');
    // var bc_checkboxSpan = document.createElement('span');
    //
    // basicColorCheckbox.type = "checkbox";
    // basicColorCheckbox.dataset.type = "switch";
    // bc_checkboxLabel.appendChild(basicColorCheckbox);
    // bc_checkboxLabel.appendChild(bc_checkboxSpan);
    // dialog.appendChild(bc_checkboxLabel);

    var gd = new GestureDetector(colorPalette);
    gd.startDetecting();

    colorPalette.addEventListener('tap', onClickEvent);
    colorPalette.addEventListener('pan', onClickEvent);
    dialog.appendChild(colorPalette);

    pickedColor = document.createElement('div');
    pickedColor.id = 'picked-color';
    dialog.appendChild(pickedColor);

    var menu = document.createElement('menu');
    menu.dataset['items'] = 1;

    yes = document.createElement('button');
    var yesText = document.createTextNode('OK');
    yes.appendChild(yesText);
    yes.id = 'dialog-yes';
    yes.addEventListener('click', hide);
    menu.appendChild(yes);
    dialog.appendChild(menu);
  }

  var prepareCanvas = function() {
    canvas.width = colorPalette.width;
    canvas.height = colorPalette.height;
    ctx.drawImage(colorPalette, 0, 0);
  }

  var getColorOnPosition = function(x, y) {
    var imgData = ctx.getImageData(x, y, 1, 1).data;
    // convert rgb to hex
    return ((1 << 24) + (imgData[0] << 16) + (imgData[1] << 8) + imgData[2])
      .toString(16).substr(1);
  }

  var onClickEvent = function(evt) {
    var x, y;
    switch (evt.type) {
      case 'pan':
        x = evt.detail.position.screenX - canvasBoundingClientRect.left;
        y = evt.detail.position.screenY - canvasBoundingClientRect.top;
        break;
      case 'tap':
        x = evt.detail.screenX - canvasBoundingClientRect.left;
        y = evt.detail.screenY - canvasBoundingClientRect.top;
    }

    renderColor('#' + getColorOnPosition(x, y));

  }

  var renderColor = function(color) {
    pickedColor.style.backgroundColor = pickedColor.innerHTML = color;
  }

  var hide = function() {
    if (typeof callback === 'function') {
      callback(pickedColor.innerHTML);
    }

    window.location.hash = '#color-themes';
  }

  init();

  return {
    hide: hide,

    show: function dialog_show(color, cb) {
        callback = cb;
        renderColor(color);
        window.location.hash = '#color-picker-tab';
    }
  };
}());

