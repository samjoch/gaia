var Wallpaper = {

    thumbnail: { width: (window.innerWidth-2)/3, height: 159 }

  , crop: function wallpapers_crop(el){

      // Ratio of el (suppose to be an image element)
      var r = el.width / el.height;

      // Compute both possibilies
      var w1 = this.thumbnail.width
      ,   h1 = this.thumbnail.width / r
      ,   w2 = r * this.thumbnail.height
      ,   h2 = this.thumbnail.height;

      // Set el dimension
      if ( w2 > this.thumbnail.width ) {
        el.width = Math.floor(w2);
        el.height = Math.floor(h2);
      } else {
        el.width = Math.floor(w1);
        el.height = Math.floor(h1);
      }

      // Set el position
      var left = Math.floor((this.thumbnail.width - el.width) / 2)
      ,   top = Math.floor((this.thumbnail.height - el.height) / 2);

      el.style.left = left + 'px';
      el.style.top  = top + 'px';
    }

  , init: function wallpapers_init(){
      this.wallpapers = document.querySelectorAll('.wallpaper');
      for(var i = 0; i < this.wallpapers.length; i++){
        this.crop(this.wallpapers[i].firstChild);
      }
      var el = document.getElementById('wallpapers');
      if(el) { el.style.height = 'auto'; };
    }

};

window.onload = function() {

  Wallpaper.init();

  navigator.mozSetMessageHandler && navigator.mozSetMessageHandler('activity', function handler(activityRequest) {
    var activityName = activityRequest.source.name;
    if (activityName !== 'pick')
      return;
    startPick(activityRequest);
  });

  var cancelButton = document.getElementById('cancel');
  var wallpapers = document.getElementById('wallpapers');
  var pickActivity;

  function startPick(request) {
    pickActivity = request;
    wallpapers.addEventListener('click', pickWallpaper);
    cancelButton.addEventListener('click', cancelPick);
  }

  function pickWallpaper(e) {
    // Ignore clicks that are not on one of the images
    if (!(e.target instanceof HTMLImageElement))
      return;

    if(!pickActivity) { return; }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = pickActivity.source.data.width;
    canvas.height = pickActivity.source.data.height;
    context.drawImage(e.target, 0, 0);

    canvas.toBlob(function(blob) {
      pickActivity.postResult({
        type: 'image/png',
        blob: blob
      }, 'image/png');

      endPick();
    }, pickActivity.source.data.type);
  }

  function cancelPick() {
    pickActivity.postError('cancelled');
    endPick();
  }

  function endPick() {
    pickActivity = null;
    cancelButton.removeEventListener('click', cancelPick);
    wallpapers.removeEventListener('click', pickWallpaper);
  }

};