
'use strict';

const Homescreen = (function() {
  var mgmt = navigator.mozApps.mgmt;
  var page = document.getElementById('landing-page');
  var HVGA = document.documentElement.clientWidth < 480;
  var mainColor = {r:255, g:255, b:255};
  
  var tileSize = 142;
  var tileClass = 'app-tile'
  //   ['<div class="app-tile">',
  //     '<label>APP NAME</label>',
  //     '</div>'];
      
  var req = mgmt.getAll();
  req.onsuccess = function(e) {
    var apps = req.result;
    getPaintingColor(function(color) {
      mainColor = color;
      for (var i=0, l=apps.length; i<l; i++) {
        renderIcon(apps[i]);
      }
    });
    
    setInterval(makeBlink, 3000);
  }

  var getPaintingColor = function(cb) {
    var color = navigator.mozSettings.createLock().get('gaia.ui.menutext');
    color.onsuccess = function() {
      cb(hexToRgb(this.result['gaia.ui.menutext']));
    }
  }
  
  function getIconURI(app) {
    var manifest = app.manifest;
    var icons = manifest.icons;
    if (!icons) {
      return null;
    }

    var origin = app.manifestURL.replace('manifest.webapp', '');
    var sizes = Object.keys(icons).map(function parse(str) {
      return parseInt(str, 10);
    });

    sizes.sort(function(x, y) { return y - x; });

    var index = sizes[(HVGA) ? sizes.length - 1 : 0];
    var iconPath = icons[index];

    if (iconPath.indexOf('data:') !== 0) {
      iconPath = origin + iconPath;
    }

    return iconPath;
  }
  
  var renderIcon = function(app) {
    if (HIDDEN_APPS.indexOf(app.manifestURL) != -1)
      return;
      
    var tile = document.createElement('div');
    var label = document.createElement('label');
    tile.classList.add(tileClass);
    label.textContent = app.manifest.name;
    transformIcon(getIconURI(app), function(icon){
      tile.style.backgroundImage = 'url(' + icon +')';
    });
    
    tile.classList.add('tr'+~~(Math.random()*3));
    
    tile.appendChild(label);
    tile.addEventListener('click', (function(application) {
      return function(){ 
        page.addEventListener('transitionend', function runAppTrans(){
          application.launch();
          page.removeEventListener('transitionend', runAppTrans);
          setTimeout(function() {
            page.classList.remove('show');
          }, 500);
        });
        page.classList.add('show');
      }
    })(app));
    page.appendChild(tile);
  }
  
  var makeBlink = function(){
    var randomChild = page.childNodes[~~(Math.random()*page.childNodes.length)];
    if (randomChild) {
      randomChild.addEventListener("animationend", function listener(){
        randomChild.classList.remove('animate');
        randomChild.removeEventListener("animationend", listener);
      });
      randomChild.classList.add('animate');
    }
  }
  var transformIcon = function(icon, callback) {
    if (icon === null || icon.indexOf('blank') > -1) 
      return;
      
    var img = new Image();
    
    img.onload = function(){
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
    
      canvas.width =  img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var imageData = ctx.getImageData(0, 0, img.width, img.height);
      var pixels = imageData.data;
      for (var i = 0, l = pixels.length; i < l; i += 4) {
        var light = rgbToHslL(pixels[i], pixels[i+1], pixels[i+2]);
        if (light < 0.5) {
          pixels[i+3] = 0;
        } else {
          pixels[i] = mainColor.r;
          pixels[i+1] = mainColor.g;
          pixels[i+2] = mainColor.b;
          pixels[i+3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      callback(canvas.toDataURL());
    }
    console.log('--', icon);
    if (icon.indexOf('app') !== -1) {
      console.log('----weszlo 1');
      img.src = '/style/icons/' + icon.split('/').pop();
    } else {
      console.log('----weszlo 2');
      img.src = icon;
    }
  }
  
  function rgbToHslL(r, g, b){
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0; // achromatic
      }else{
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return l;
  }
  
  function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  // window.addEventListener('home', function(){
  //   console.log('elo');
  //   page.classList.add('show');
  // });
  // page.addEventListener('transitionend', function(){
  //   page.classList.remove('show');
  // });
  
})();

