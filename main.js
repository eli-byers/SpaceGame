// ------------------------------------------------------------
// ------------------------- CANVASES -------------------------
// ------------------------------------------------------------
var space = {
  canvas : document.getElementById("space"),
  start : function(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

var game = {
  canvas : document.getElementById("game"),
  start : function(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

// ------------------------------------------------------------
// -------------------------- GAME ----------------------------
// ------------------------------------------------------------
function startGame (){
  var spaceGame = new SpaceGame(space, game);
  spaceGame.init();
}

// ------------------------------------------------------------
// ------------------------- CLASSES --------------------------
// ------------------------------------------------------------

function SpaceGame(space, game){
  var _this = this;
  this.time = 0;
  this.space = space;
  this.game = game;
  this.ship = null;
  this.keys = [];
  this.components = [];
  this.init = function(){
    this.space.start();
    this.game.start();
    this.ship = new Ship("Python", 1, 500, 300, 100, this.game);
    window.addEventListener('keydown', function(e){
      _this.keys = (_this.keys || []);
      _this.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e){
      _this.keys[e.keyCode] = false;
    });
    this.interval = setInterval(this.updateGameArea, 20);
  };
  this.updateGameArea = function(){
    this.time += 1/50;
    _this.game.clear();
    _this.space.clear();

    // key presses
    if (_this.keys){
      if (_this.keys[37] || _this.keys[65]){ // left
        _this.ship.left();
      }
      if (_this.keys[38] || _this.keys[87]){ // up
        _this.ship.forward();
      }
      if (_this.keys[39] || _this.keys[68]){ // right
        _this.ship.right();
      }
      if (_this.keys[40] || _this.keys[83]){ // down
        _this.ship.reverse();
      }
      if (_this.keys[88] || _this.keys[190]){ // spin right
        if (_this.ship.v.r < 10 ){ _this.ship.v.r++; }
      }
      if (_this.keys[90] || _this.keys[188]){ // spin left
        if (_this.ship.v.r > -10){ _this.ship.v.r--; }
      }
    }

    // update
    _this.ship.update();
    for (var i in _this.components){
      _this.components[i].update();
    }
  };
}

function System(name){
  this.name = name;
  this.planets = [];
}

function Planet(name, id, x, y, r, mass){
  this.name = name;
  this.id = id;
  this.x = x;
  this.r = r;
  this.mass = mass;
  this.draw = function(){
    var ctx = this.game.context;
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
  };
}

function Ship(name, id, x, y, mass, game){
  this.game = game;
  this.name = name;
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = 0;
  this.v = {
    x: 0,
    y: 0,
    r: 0
  };
  this.mass = mass;
  this.draw = function(){
    var ctx = this.game.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r*Math.PI/180);

    ctx.fillStyle = 'white';
    // nose
    ctx.beginPath();
    ctx.moveTo(34,-10);
    ctx.lineTo(70,0);
    ctx.lineTo(34,10);
    ctx.fill();

    //body
    ctx.fillRect(-35, -10, 70, 20);

    // fins
    ctx.beginPath();
    ctx.moveTo(-35,-9);
    ctx.lineTo(-45,-25);
    ctx.lineTo(-25,-25);
    ctx.lineTo(-5,-9);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-35,9);
    ctx.lineTo(-45,25);
    ctx.lineTo(-25,25);
    ctx.lineTo(-5,9);
    ctx.fill();

    // jet
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(-35,0);
    ctx.lineTo(-45,-8);
    ctx.lineTo(-45,8);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-45,0);
    ctx.lineTo(-55,-8);
    ctx.lineTo(-55,8);
    ctx.fill();

    ctx.restore();
  };
  this.update = function(){

    // apply acceleration
    this.x += this.v.x;
    this.y += this.v.y;
    this.r += this.v.r;

    // wrap rotation
    if (this.r > 360 || this.r < -360){ this.r = 0; }

    // draw
    this.draw();
  };
  this.thrust = function(rad){
    this.v.x += Math.cos(rad);
    this.v.y += Math.sin(rad);
  };
  this.forward = function(){
    var rad = this.r * Math.PI / 180;
    this.thrust(rad);
  };
  this.left = function(){
    var rad = this.r-90 * Math.PI / 180;
    this.thrust(rad);
  };
  this.right = function(){
    var rad = this.r+90 * Math.PI / 180;
    this.thrust(rad);
  };
  this.reverse = function(){
    var rad = this.r * Math.PI / 180;
    if (this.v.x > -10){ this.v.x -= Math.cos(rad); }
    if (this.v.y > -10){ this.v.y -= Math.sin(rad); }
  };
}
