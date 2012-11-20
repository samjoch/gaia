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
    this.span   = this.el.querySelector('span');
  },
  
  update: function screen_timeout_update(){
    this.span.innerHTML = this.select.options[this.select.selectedIndex].innerHTML;
  },
  
  bind: function screen_timeout_bind(){
    var self = this;
    this.button.addEventListener('click', function screen_timeout_onClick(){
      self.select.click();
    });
    this.select.addEventListener('change', function screen_timeout_onChange(){
      self.update();
    });

  }

};

ScreenTimeout.init();