var updateCss = function updateCss() {
  var files = ['shared/style/headers.css',
               'shared/style/confirm.css',
               'shared/style_unstable/lists.css'];
  for (var i=0; i < files.length; i++) {
    var style = document.querySelector('link[href*="' + files[i] + '"]');
    console.log('Reload', files[i], style);
    if (style) {
      console.log('Reload true');
      style.href = '/' + files[i] + '?reload=' + new Date().getTime();
    }
  };
}

var els = ['menu', 'menutext', 'appworkspace', 'infobackground',
           'buttonface', 'window', 'windowtext', 'highlight'];
for (var i=0; i < els.length; i++) {
  console.log('Observe to', els[i]);
  window.navigator.mozSettings.addObserver('gaia.ui.'+els[i], updateCss);
};