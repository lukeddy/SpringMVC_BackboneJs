
(function ($) {
  var ns = 'http://www.w3.org/2000/svg';
  var svgTest = function() {
    
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == ns;
  };

  var svgFLAG = svgTest();

  var makeSVG = function (tag, attrs) {
    var el= document.createElementNS(ns, tag);
    for (var k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  };

  var krutilka = function (el, options) {
    el.data('initialized', true);

    var svg = $(makeSVG('svg', {width: options.size, height: options.size, style: 'background: '+ options.background +''})).appendTo(el);
    var g = makeSVG('g', {fill: 'none', stroke: options.color, 'stroke-width': options.petalWidth});
    var $g = $(g).appendTo(svg);

    var x = options.size / 2;
    var y = options.size / 2;

    
    for (var _i = 0; _i < options.petals; _i++) {
     
      var a = 360 / options.petals * (options.petals - _i);
    
      var opacity = Math.max(1 - 1 / options.petals * _i, .25);
      
      $(makeSVG('line', {x1: options.size / 2, y1: options.petalOffset, x2: options.size / 2, y2: options.petalOffset + options.petalLength, transform: 'rotate('+ a + ' ' + x + ' ' + y + ')', opacity: opacity})).appendTo($g);
    }

  
    var frame = 0;
    var animationInterval;
    var animation = function () {
      var a = 360 / options.petals * frame;
      g.setAttribute('transform', 'rotate('+ a + ' ' + x + ' ' + y + ')');

      frame++;
      if (frame >= options.petals) {
        frame = 0;
      }
    };

    el.bind('show', function(e, time){
      
      el.stop().fadeTo('fast', 1);
      clearInterval(animationInterval);
      animation();
      animationInterval = setInterval(animation, (time ? time : options.time) / options.petals);
    });

    el.bind('hide', function(){
     
      el.stop().fadeTo('fast', 0, function(){
        clearInterval(animationInterval);
      });
    });

    el.trigger('show');
  };

  $.fn.krutilka = function (o) {
    var options = {
      size: 32, 
      petals: 15, 
      petalWidth: 2, 
      petalLength: 8, 
      petalOffset: 1, 
      time: 1000, 
      color: '#808080', 
      background: 'none'
    };

    $.extend(options, o);

    this.each(function () {
      var el = $(this);
      if (!el.data('initialized') && svgFLAG) {
       
        krutilka(el, options);
      }
    });

    
    return this;
  };
})(jQuery);