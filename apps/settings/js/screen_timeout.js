'use script';

var ScreenTimeout = {

  init: function screen_timeout_init(){
    this.getAllElements();
    this.update();
    this.bind();
  },
  
  getAllElements: function screen_timeout_fetchElements(){
    this.el = document.getElementById('screen-timeout');
    this.select = this.el.querySelector('select');
    this.button = this.el.querySelector('button');
  },
  
  update: function screen_timeout_update(){
    this.button.innerHTML = this.select.options[this.select.selectedIndex].innerHTML;
  },
  
  bind: function screen_timeout_bind(){
    var self = this;
    this.select.addEventListener('change', function screen_timeout_onChange(){
      self.update();
    });
  }

};

ScreenTimeout.init();