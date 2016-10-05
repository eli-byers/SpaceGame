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

var hud = {
  canvas : document.getElementById("hud"),
  start : function(){
    this.canvas.width = 500;
    this.canvas.height = 300;
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
  var spaceGame = new SpaceGame(space, game, hud);
  spaceGame.init();
}

// ------------------------------------------------------------
// ------------------------- CLASSES --------------------------
// ------------------------------------------------------------

function SpaceGame(space, game, hud){
  var t = this;
  this.time = 0;
  this.space = space;
  this.game = game;
  this.hud = hud;
  this.ship = null;
  this.keys = [];
  this.components = [];
  this.init = function(){
    this.space.start();
    this.game.start();
    this.hud.start();
    this.ship = new Ship("Python", 1, window.innerWidth/2, window.innerHeight *0.75, 100);
    window.addEventListener('keydown', function(e){
      t.keys = (t.keys || []);
      t.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e){
      t.keys[e.keyCode] = false;
    });
    this.interval = setInterval(this.updateGameArea, 20);
  };
  this.updateGameArea = function(){
    this.time += 1/50;

    t.hud.clear();
    t.game.clear();
    t.space.clear();

    t.keys();

    // ship
    t.ship.update();
    t.draw.ship();

    // components
    for (var i in t.components){ t.components[i].update(); }
  };
  this.keys = function(){
    if (t.keys){
      // turn
      if      (t.keys[88] || t.keys[190]) { t.ship.rotate.left();   }
      else if (t.keys[90] || t.keys[188]) { t.ship.rotate.right();  }
      else                                { t.ship.rotate.arrest(); }
      // thrust
      if (t.keys[37] || t.keys[65]) { t.ship.thrust.left();     }
      if (t.keys[38] || t.keys[87]) { t.ship.thrust.forward();  }
      if (t.keys[39] || t.keys[68]) { t.ship.thrust.right();    }
      if (t.keys[40] || t.keys[83]) { t.ship.thrust.reverse();  }
      if (t.keys[16])               { t.ship.thrust.arrest(); }
      // boost
      if (t.keys[32]) { t.ship.boost.charge(); }
      else            { t.ship.boost.activate(); }
    }
  };
  this.draw = {
    ship : function(){
      var ctx = t.game.context;
      ctx.save();
      ctx.translate(t.ship.pos.x, t.ship.pos.y);
      ctx.rotate(t.ship.pos.r*Math.PI/180);

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
    },
    hud : function(){
      // draw hud
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

function Ship(name, id, x, y, mass){
  var self = this;
  this.name = name;
  this.id = id;
  this.pos = {
    x : x,
    y : y,
    r : -90
  };
  this.v = {
    x : 0,
    y : 0,
    r : 0,

    xLimit  : 25,
    yLimit  : 25,
    rLimit  : 10,
    limit   : function(){
      // x
      if (this.x >  this.xLimit) { this.x =  this.xLimit; }
      if (this.x < -this.xLimit) { this.x = -this.xLimit; }
      // y
      if (this.y >  this.yLimit) { this.y =  this.yLimit; }
      if (this.y < -this.yLimit) { this.y = -this.yLimit; }
      // r
      if (this.r >  this.rLimit) { this.r =  this.rLimit; }
      if (this.r < -this.rLimit) { this.r = -this.rLimit; }
    },

    total : 0,
    setTotal : function(){
      var startV = this.total;
      this.total = Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.r);
      var endV = this.total;
      console.log(parseInt(this.total), (startV - endV) );
      return this.total;
    }
  };
  this.acc = {
    x       : 10,
    y       : 10,
    r       : 0.1,
  };

  this.update = function(){

    // limits acceleration
    this.v.limit();
    // calculate total acceleration
    this.v.setTotal();

    // apply velocity
    this.pos.x += this.v.x;
    this.pos.y += this.v.y;
    this.pos.r += this.v.r;
    // wrap rotation
    if (this.pos.r > 360 || this.pos.r < -360){ this.pos.r = 0; }

    // DEBUG
    this.worldWrap();
  };

  this.thrust = {
    left     : function(){
      rad = (self.pos.r-90) * Math.PI / 180;
      self.v.x += Math.cos(rad)/self.acc.x;
      self.v.y += Math.sin(rad)/self.acc.y;
    },
    right    : function(){
      rad = (self.pos.r+90) * Math.PI / 180;
      self.v.x += Math.cos(rad)/self.acc.x;
      self.v.y += Math.sin(rad)/self.acc.y;
    },
    forward  : function(){
      rad = self.pos.r * Math.PI / 180;
      self.v.x += Math.cos(rad)/self.acc.x;
      self.v.y += Math.sin(rad)/self.acc.y;
    },
    reverse  : function(){
      rad = self.pos.r * Math.PI / 180;
      self.v.x -= Math.cos(rad)/self.acc.x;
      self.v.y -= Math.sin(rad)/self.acc.y;
    },
    arrest   : function(){
      var rate = 0.1;
      // x
      if        (self.v.x > rate )    { self.v.x -= rate ; }
      else if   (self.v.x < -rate )   { self.v.x += rate ; }
      else                            { self.v.x = 0; }
      // y
      if        (self.v.y > rate )    { self.v.y -= rate ; }
      else if   (self.v.y < -rate )   { self.v.y += rate ; }
      else                            { self.v.y = 0; }
    },
  };
  this.rotate = {
    left    : function(){ self.v.r += self.acc.r; },
    right   : function(){ self.v.r -= self.acc.r; },
    arrest  : function(){
      var rate = 0.2;
      if        (self.v.r >  rate )   { self.v.r -= rate; }
      else if   (self.v.r < -rate )   { self.v.r += rate; }
      else                            { self.v.r = 0; }
    },
  };
  this.boost = {
    power : 0,
    ready : false,

    charge : function(){
      if (!this.ready){
        this.power++;
        if (this.power == 50){
          this.ready = true;
        }
      }
    },
    activate : function(){
      this.power = 0;
      if (this.ready){
        this.ready = false;
        rad = self.pos.r * Math.PI / 180;
        self.v.x = Math.cos(rad)*10;
        self.v.y = Math.sin(rad)*10;
        self.v.r = 0;
      }
    },
  };
  /////////////////////////////  DEBUG  ///////////////////////////////////
  this.worldWrap = function(){
    var border = 70;
    if (this.pos.x < -border){ this.pos.x = window.innerWidth+border; }
    if (this.pos.x > window.innerWidth+border){ this.pos.x = border; }
    if (this.pos.y < -border){ this.pos.y = window.innerHeight+border; }
    if (this.pos.y > window.innerHeight+border){ this.pos.y = border; }
  };
}

// function Laser(x,y,r){
//   this.x = x;
//   this.y = y;
//   this.v = {
//     x: Math.sin(r * )
//   }
// }
