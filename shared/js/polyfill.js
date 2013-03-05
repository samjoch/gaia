/**
 * This emulates <input type="range"> elements on Gecko until they get
 * supported natively.  To be removed when bug 344618 lands.
 * https://bugzilla.mozilla.org/show_bug.cgi?id=344618
 */

function bug344618_polyfill() {
  var range = document.createElement('input');
  range.type = 'range';
  if (range.type == 'range') {
    console.warn("bug344618 has landed, there's some dead code to remove.");
    return; // <input type="range"> is already supported, early way out.
  }

  /**
   * The JS polyfill transforms this:
   *
   *   <label>
   *     <input type="range" value="60"/>
   *   </label>
   *
   * into this:
   *
   *   <label class="bug344618_polyfill">
   *     <div>
   *       <progress max="100" value="60"></progress>
   *       <button style="left: 60%;" class=""></button>
   *     </div>
   *     <input type="range" value="60" />
   *   </label>
   *
   * JavaScript-wise, two main differences between this polyfill and the
   * standard implementation:
   *   - the `.type' property equals `text' instead of `range';
   *   - the value is a string, not a float.
   */

  var polyfill = function(input) {
    input.dataset.type = 'range';

    var onTouch = {
      // Handle desktop drag & drop
      isDragging: false,
      start: function onTouchStart(e) {
        e.preventDefault();
        onTouch.isDragging = true;
        updatePosition(e);
        notify('touchstart');
        notify('change');
      },
      move: function onTouchMove(e) {
        e.preventDefault();
        if (!onTouch.isDragging) { return; }
        updatePosition(e);
        notify('change');
      },
      end: function onTouchEnd(e) {
        e.preventDefault();
        onTouch.isDragging = false;
        button.classList.remove('active');
        notify('touchend');
      }
    };

    var updateInterval = function updateInterval() {
      interval = max - min;
      progress.max = interval;
    };

    var setMax = function setMax(new_max) {
      max = parseFloat(new_max);
      updateInterval();
      refresh();
    };

    var setMin = function setMin(new_min) {
      min = parseFloat(new_min);
      updateInterval();
      refresh();
    };

    var setValue = function setValue(new_value) {
      input.value = new_value;
      refresh();
    };

    // normalized
    var normalized = function normalized(x, offset, norm) {
      if (x === offset) { offset = 0; }
      var position = (x - offset) / norm;
      position = Math.max(position, 0);
      position = Math.min(position, 1);
      return position;
    };

    // update progress.value, input.value & button.style.left
    var update = function update(normed_value) {
      if (step) {
        var mod = {
          value: normed_value.toFixed(10),
          step: normed_step.toFixed(10)
        };
        mod.mod = mod.value % mod.step;
        mod.n = (mod.value - mod.mod) / mod.step;
        if (mod.mod >= mod.step / 2 && mod.mod < mod.step) {
          mod.n++;
        }
        normed_value = mod.n * normed_step;
      }
      progress.value = normed_value * interval;
      button.style.MozTransform = 'translate(' + (width * normed_value) + 'px)';
      circles.style.MozTransform = 'translate(' + (width * normed_value) + 'px)';
      input.value = normed_value * interval + min;
    };

    // send a 'change' event
    var notify = function notify(type) {
      var evtObject = document.createEvent('Event');
      evtObject.initEvent(type, true, false);
      input.dispatchEvent(evtObject);
    };

    // move the throbber to the proper position, according input.value
    var refresh = function refresh() {
      var pos = normalized(input.value, min, max - min);
      update(pos);
    };

    // move the throbber to the proper position, according to touch events
    var updatePosition = function updatePosition(event) {
      button.classList.add('active');
      var rect = div.getBoundingClientRect();
      var x = event.targetTouches ? event.targetTouches[0].pageX : event.clientX;
      var pos = normalized(x, rect.left, rect.width);
      update(pos);
    };

    var div = document.createElement('div');
    var circles = document.createElement('div');
    var button = document.createElement('span');
    var progress = document.createElement('progress');
    var label = input.parentNode;

    circles.classList.add('circles');
    button.classList.add('handler');

    div.appendChild(progress);
    div.appendChild(button);
    div.appendChild(circles);
    label.insertBefore(div, input);
    label.classList.add('bug344618_polyfill');

    var step = parseFloat(input.step);
    var min = parseFloat(input.min);
    var max = parseFloat(input.max);
    if (step) {
      var normed_step = normalized(step, min, max - min);
    }
    var interval;
    updateInterval();

    var width;
    // Initialize
    setTimeout(function(){
      width = div.getBoundingClientRect().width;
      refresh();
    }, 80);

    button.addEventListener('touchstart', onTouch.start, false);
    button.addEventListener('touchmove', onTouch.move, false);
    button.addEventListener('touchend', onTouch.end, false);

    // Desktop handle
    div.addEventListener('mousedown', onTouch.start, false);
    button.addEventListener('mousedown', onTouch.start, false);
    div.addEventListener('mousemove', onTouch.move, false);
    button.addEventListener('mousemove', onTouch.move, false);
    button.addEventListener('mouseup', onTouch.end, false);
    div.addEventListener('mouseup', onTouch.end, false);

    input.setValue = setValue;
    input.setMax = setMax;
    input.setMin = setMin;
    input.refresh = refresh;
  };

  // apply to all input[type="range"] elements
  var selector = '[role="slider"]:not(.bug344618_polyfill) input[type="range"]';
  var ranges = document.querySelectorAll(selector);
  for (var i = 0; i < ranges.length; i++) {
    polyfill(ranges[i]);
  }
}
