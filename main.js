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
  padding : 20,
  barHeight : 0,
  iconY : 0,
  start : function(){
    this.canvas.width = 500;
    this.canvas.height = 300;

    this.barHeight = this.canvas.height-(this.padding*2)-35;
    this.iconY = this.canvas.height-(this.padding*2)-5;

    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    this.init();
  },
  // init
  init : function(){
    ctx = this.context;
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = "orange";

    this.setupBoxes();
    this.boostIcon();
    this.fuelIcon();
    this.shieldIcon();
    this.hullIcon();
    this.shipIcon();
  },
  setupBoxes : function(){
    for (var i = 0; i < 4; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeRect(this.padding+(20*i*2), this.padding, 20, this.barHeight);
    }
  },
  boostIcon : function(){
    // boost icon
    var x = this.padding + 10;
    ctx.beginPath();
    ctx.moveTo(x,this.iconY);
    ctx.lineTo(x-10,this.iconY+15);
    ctx.lineTo(x+10,this.iconY+15);
    ctx.fill();
    ctx.moveTo(x,this.iconY+12);
    ctx.lineTo(x-10,this.iconY+27);
    ctx.lineTo(x+10,this.iconY+27);
    ctx.fill();
  },
  fuelIcon : function(){
    var x = this.padding + 50;
    ctx.beginPath();
    ctx.moveTo(x,this.iconY);
    ctx.lineTo(x-9,this.iconY+14);
    ctx.lineTo(x+9,this.iconY+14);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x,this.iconY+18, 10,0,2*Math.PI);
    ctx.fill();
  },
  shieldIcon : function(){
    var x = this.padding + 90;
    ctx.beginPath();
    ctx.arc(x,this.iconY+10, 10,Math.PI,0);
    ctx.arc(x,this.iconY+18, 10,0,Math.PI);
    ctx.lineTo(x-10,this.iconY+10);
    ctx.stroke();
  },
  hullIcon : function(){
    var x = this.padding + 130;
    ctx.beginPath();
    ctx.moveTo(x,this.iconY);
    ctx.quadraticCurveTo(x,this.iconY+10,x+10,this.iconY+8);
    ctx.quadraticCurveTo(x+8,this.iconY+30,x,this.iconY+30);
    ctx.fill();
    ctx.quadraticCurveTo(x-8,this.iconY+30,x-10,this.iconY+8);
    ctx.quadraticCurveTo(x,this.iconY+10,x,this.iconY);
    ctx.stroke();
  },
  shipIcon : function(){
    var ctx = this.context;
    ctx.fillStyle = 'orange';
    // nose
    var x = this.canvas.width-100;
    var y = 50;

    ctx.beginPath();
    ctx.moveTo(x,y);
    y += 50;
    ctx.lineTo(x+15,y);
    ctx.lineTo(x-15,y);
    ctx.fill();

    //body
    ctx.fillRect(x-15, y, 30, 120);
    y += 70;
    // fins
    ctx.beginPath();
    ctx.moveTo(x-14,y);
    ctx.lineTo(x-44,y+30);
    ctx.lineTo(x-44,y+70);
    ctx.lineTo(x-14,y+50);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x+14,y);
    ctx.lineTo(x+44,y+30);
    ctx.lineTo(x+44,y+70);
    ctx.lineTo(x+14,y+50);
    ctx.fill();
  },
  // hud.clear
  clear : function(){
    this.clearBoost();
    this.clearFuel();
    this.clearShield();
    this.clearHull();
  },
  clearBoost : function(){
    this.context.clearRect(this.padding, this.padding, 20, this.barHeight);
  },
  clearFuel : function(){
    x = this.padding+40;
    this.context.clearRect(x, this.padding, 20, this.barHeight);
  },
  clearShield : function(){
    x = this.padding+80;
    this.context.clearRect(x, this.padding, 20, this.barHeight);
  },
  clearHull : function(){
    x = this.padding+120;
    this.context.clearRect(x, this.padding, 20, this.barHeight);
  },
  clearShip : function(){
    this.context.clearRect(this.canvas.width - 180, this.padding, 160, this.barHeight);
  },
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
  var self = this;
  this.time = 0;
  this.space = space;
  this.game = game;
  this.hud = hud;
  this.ship = null;
  this.keys = [];
  this.components = [];
  this.init = function(){
    // init canvases
    this.space.start();
    this.game.start();
    this.hud.start();
    // make player ship
    this.ship = new Ship("Python", 1, window.innerWidth/2, window.innerHeight * 0.75, 100, 100, 100);
    // init hud
    this.draw.initBars();
    // set up key listeners
    window.addEventListener('keydown', function(e){
      self.keys = (self.keys || []);
      self.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e){
      self.keys[e.keyCode] = false;
    });
    // start game l
    this.interval = setInterval(this.updateGameArea, 20);
  };
  this.updateGameArea = function(){
    this.time += 1/50;

    self.game.clear();
    self.space.clear();

    self.keys();

    // ship
    self.ship.update();
    self.draw.ship();
    self.draw.hud();

    // components
    for (var i in self.components){ self.components[i].update(); }
  };
  this.keys = function(){
    if (self.keys){
      // turn
      if      (self.keys[88] || self.keys[190]) { self.ship.rotate.left();   }
      else if (self.keys[90] || self.keys[188]) { self.ship.rotate.right();  }
      else                                { self.ship.rotate.arrest(); }
      // thrust
      if (self.keys[37] || self.keys[65]) { self.ship.thrust.left();     }
      if (self.keys[38] || self.keys[87]) { self.ship.thrust.forward();  }
      if (self.keys[39] || self.keys[68]) { self.ship.thrust.right();    }
      if (self.keys[40] || self.keys[83]) { self.ship.thrust.reverse();  }
      if (self.keys[16])               { self.ship.thrust.arrest(); }
      // boost
      if (self.keys[32]) { self.ship.boost.charge(); }
      else            { self.ship.boost.activate(); }
    }
  };
  this.draw = {
    ship : function(){
      var ctx = self.game.context;
      ctx.save();
      ctx.translate(self.ship.pos.x, self.ship.pos.y);
      ctx.rotate(self.ship.pos.r*Math.PI/180);

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
      if ((self.keys[38] || self.keys[87]) && Math.abs(self.ship.v.y) < self.ship.v.yLimit){
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
      }


      ctx.restore();
    },
    hud : function(){
      this.boost();
      this.vVector();
      this.vRotation();
      this.accRotation();
    },
    // init base values
    initBars : function(){
      this.fuel();
      this.shield();
      this.hull();
    },
    // hud bars
    boost : function(){
      self.hud.clearBoost();
      var power = self.ship.boost.power;
      var ctx = self.hud.context;
      if      (power == 50){ ctx.fillStyle = 'green';   }
      else if (power >  34){ ctx.fillStyle = 'yellow';  }
      else if (power >  17){ ctx.fillStyle = 'orange';  }
      else                 { ctx.fillStyle = 'red';     }

      var height =  power * (self.hud.barHeight / self.ship.boost.powerLimit);
      var width = 20;

      var x = 20;
      var y = self.hud.canvas.height-55-height;
      ctx.fillRect(x, y, width, height);
    },
    fuel : function(){
      self.hud.clearFuel();
      var fuel = self.ship.fuel.reserve;
      var ctx = self.hud.context;
      switch (self.ship.fuel.type) {
        case 'blue':   ctx.fillStyle = 'blue';    break;
        case 'red':    ctx.fillStyle = 'red';     break;
        case 'green':  ctx.fillStyle = 'green';   break;
        case 'purple': ctx.fillStyle = 'purple';  break;
        case 'yellow': ctx.fillStyle = 'yellow';  break;
        default: break;
      }
      var height =  fuel * (self.hud.barHeight / self.ship.fuel.tank);
      var width = 20;

      var x = 60;
      var y = self.hud.canvas.height-55-height;
      ctx.fillRect(x, y, width, height);
    },
    shield : function(){
      self.hud.clearShield();
      var shield = self.ship.shield.health;
      var ctx = self.hud.context;
      switch (self.ship.shield.type) {
        case 'blue':   ctx.fillStyle = 'blue';    break;
        case 'red':    ctx.fillStyle = 'red';     break;
        case 'green':  ctx.fillStyle = 'green';   break;
        case 'purple': ctx.fillStyle = 'purple';  break;
        case 'yellow': ctx.fillStyle = 'yellow';  break;
        default: break;
      }
      var height =  shield * (self.hud.barHeight / self.ship.shield.strength);
      var width = 20;

      var x = 100;
      var y = self.hud.canvas.height-55-height;
      ctx.fillRect(x, y, width, height);
    },
    hull : function(){
      self.hud.clearHull();
      var hull = self.ship.hull.health;
      var ctx = self.hud.context;
      ctx.fillStyle = 'orange';
      var height =  hull * (self.hud.barHeight / self.ship.hull.strength);
      var width = 20;

      var x = 140;
      var y = self.hud.canvas.height-55-height;
      ctx.fillRect(x, y, width, height);
    },
    // motion
    vVector : function(){
      self.hud.clearShip();
      self.hud.shipIcon();

      var x = self.hud.canvas.width-100;
      var y = 150;
      var rad = Math.atan2(self.ship.v.y*10, self.ship.v.x*10) - (self.ship.pos.r * (Math.PI/180) - (Math.PI) ); // In radians
      var length = self.ship.v.total > 0.1 ? 70 : 0;

      var ctx = self.hud.context;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.fillRect(-3,0, 6, length);
      if (length) {
        ctx.moveTo(0, length+5);
        ctx.lineTo(-10,length-10);
        ctx.lineTo(10,length-10);
        ctx.fill();
      }
      ctx.restore();
    },
    vRotation : function(){
      var rot = self.ship.v.r;
      var ctx = self.hud.context;
      var x = self.hud.canvas.width-100;
      var y = 80;
      var start, end;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      if (rot > 0){
        end = (Math.PI*1.5) + (rot/3);
        start = Math.PI*1.5;
      } else if (rot < 0){
        end = Math.PI*1.5;
        start = (Math.PI*1.5) + (rot/3);
      }
      ctx.arc(x, y, 40, start, end);
      ctx.stroke();

      // console.log(rot);
    },
    accRotation : function(){
      var acc = self.ship.acc.r;
      console.log(acc);

      var ctx = self.hud.context;
      var x = self.hud.canvas.width-100;
      var y = 80;
      var start, end;
      ctx.strokeStyle = 'teal';
      ctx.lineWidth = '6';
      ctx.beginPath();
      if (acc > 0){
        end = (Math.PI*1.5) + (acc*17);
        start = Math.PI*1.5;
      } else if (acc < 0){
        end = Math.PI*1.5;
        start = (Math.PI*1.5) + (acc*17);
      }
      ctx.arc(x, y, 30, start, end);
      ctx.stroke();

    },
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

function Ship(name, id, x, y, mass, shield, hull){
  var self = this;
  this.id = id;
  this.name = name;
  this.mass = 2000;
  this.fuel = {
    tank    : 1000,
    reserve : 500,
    type    : 'blue',
  } ;
  this.shield = {
    strength  : shield,
    health    : shield,
    type      : 'green',
  };
  this.hull = {
    strength  : hull,
    health    : hull,
  };
  this.engines = {
    health : 100,
    thrust : 100, // 100 units of mass per frame
  };
  this.fa = {
    r : false,
    x : false,
    y : false,
  };

  // positin - velocity - acceleration
  this.pos = {
    x : x,
    y : y,
    r : -90,
  };
  this.v = {
    // base
    x : 0,
    y : 0,
    r : 0,

    // used for arrest
    rHalf : 0,
    rArrest : false,

    // limits
    xLimit  : 25,
    yLimit  : 25,
    rLimit  : 5,
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

    // total
    total : 0,
    setTotal : function(){
      var startV = this.total;
      this.total = Math.abs(this.x)+Math.abs(this.y);
      var endV = this.total;
    }
  };
  this.acc = {
    x : 0,
    y : 0,
    r : 0,

    xLimit : 0.1,
    yLimit : 0.1,
    rLimit : 0.1,

    limit : function(){
      // x
      if (this.x >  this.xLimit) { this.x =  this.xLimit; }
      if (this.x < -this.xLimit) { this.x = -this.xLimit; }
      // y
      if (this.y >  this.yLimit) { this.y =  this.yLimit; }
      if (this.y < -this.yLimit) { this.y = -this.yLimit; }
      // r
      if (this.r >  this.rLimit) { this.r =  this.rLimit; }
      if (this.r < -this.rLimit) { this.r = -this.rLimit; }
    }
  };
  // used: v += 1/accRate => higher numbers slow down acceleratino
  this.accRate = this.mass/this.engines.thrust;

  // movement
  this.thrust = {
    left     : function(){
      rad = (self.pos.r-90) * Math.PI / 180;
      self.v.x += Math.cos(rad)/self.accRate;
      self.v.y += Math.sin(rad)/self.accRate;
    },
    right    : function(){
      rad = (self.pos.r+90) * Math.PI / 180;
      self.v.x += Math.cos(rad)/self.accRate;
      self.v.y += Math.sin(rad)/self.accRate;
    },
    forward  : function(){
      rad = self.pos.r * Math.PI / 180;
      self.v.x += Math.cos(rad)/self.accRate;
      self.v.y += Math.sin(rad)/self.accRate;
    },
    reverse  : function(){
      rad = self.pos.r * Math.PI / 180;
      self.v.x -= Math.cos(rad)/self.accRate;
      self.v.y -= Math.sin(rad)/self.accRate;
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
    rate : 1/(self.accRate*20),
    left    : function(){
      self.v.rArrest = false;
      self.acc.r += this.rate;
    },
    right   : function(){
      self.v.rArrest = false;
      self.acc.r -= this.rate;
    },
    arrest  : function(){
      if (!self.v.rArrest){
        self.v.rArrest = true;
        self.v.rHalf = self.v.r / 2;
        self.acc.r = 0;
      } else {
        if ( self.v.r > 1 || self.v.r < -1){
          if      (self.v.r > self.v.rHalf)  { self.acc.r -= this.rate; }
          else if (self.v.r < self.v.rHalf) { self.acc.r += this.rate; }
        } else {
          self.v.r = 0;
          self.acc.r = 0;
        }
      }
    }
  };
  this.boost = {
    power : 0,
    powerLimit : 50,
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

  // methods
  this.update = function(){

    this.applyAcceleration();   // adds acc to v
    this.v.limit();             // keeps v within vLimits
    this.v.setTotal();          // sets current v.total
    this.pos.x += this.v.x;     // applys v to pos
    this.pos.y += this.v.y;
    this.pos.r += this.v.r;
    // wrap rotation
    if (this.pos.r > 360 || this.pos.r < -360){ this.pos.r = 0; }

    // DEBUG
    this.worldWrap();
  };
  this.applyAcceleration = function(){
    this.acc.limit();
    this.v.x += this.acc.x;
    this.v.y += this.acc.y;
    this.v.r += this.acc.r;
    this.v.limit();
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
