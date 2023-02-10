//Francesco Angelini
//15 January 2023
//MA Computational Arts // WCC1 Final Project

//Autonomous Pixels
//A coding tool that gives shape and motion to image pixels

//VARIABLE DECLARATION//---------------------------------------------------------------------------
let pixJump, pixSize;

//source image
let src;
let srcR, srcG, srcB, srcA;
let srcRGBA = [];
let pg0;

//pointillism
let numPoints = 240000;
let little_points = [];
let big_points = [];
let pg1, pg2;

//RGBA colours of the images fed to random filter
let pg0R, pg0G, pg0B, pg0A;
let pg1R, pg1G, pg1B, pg1A;
let pg2R, pg2G, pg2B, pg2A;
let pg0RGBA = [];
let pg1RGBA = [];
let pg2RGBA = [];

let randomFilter; //filter selector
let pgFinal; //final pointillist painting

//particles
let numMoss;
let numMarbles;
let moss = [];
let marbles = [];

//booleans for key pressed function
let b_spread = false;
let b_taw = false;

function preload() {
  src = loadImage("assets/col5.jpg");
}

function setup() {
  //ORIGINAL//--------------------------------------------------------------------------------------
  src.resize(600, 600);

  createCanvas(src.width, src.height);
  pg0 = createGraphics(600, 600);

  pixJump = 1; //"gap" of pixels to leave when looping through the pixel array
  pixSize = pixJump * 2; //size of new pixels drawn to buffer object

  src.loadPixels();

  for (let y = 0; y < src.height; y += pixJump) {
    for (let x = 0; x < src.width; x += pixJump) {
      let idx = (x + y * src.width) * 4; //each pixel packs four values (rgba)

      srcR = src.pixels[idx + 0];
      srcG = src.pixels[idx + 1];
      srcB = src.pixels[idx + 2];
      srcA = src.pixels[idx + 3];
      srcRGBA = [srcR, srcG, srcB, srcA]; //create colour array to redraw original image

      pg0.noStroke();
      pg0.fill(srcRGBA);
      pg0.ellipse(x, y, pixSize, pixSize); //draw image to buffer object
    }
  }

  //PONTILLISM//-------------------------------------------------------------------------------------
  pg1 = createGraphics(600, 600);
  pg2 = createGraphics(600, 600);
  pg1.background(0);
  pg2.background(0);

  for (let i = 0; i < numPoints; i++) {
    //pointillist texture 1
    little_points[i] = new Point(
      random(width), //x
      random(height), //y
      random(2), //radius
      colourPicker(src) //colour
    );

    big_points[i] = new Point(
      //pointillist texture 2
      random(width), //x
      random(height), //y
      random(4), //radius
      colourPicker(src) //colour
    );
  }

  for (let i = 0; i < little_points.length; i++) {
    little_points[i].paint(pg1); //feed buffer object 1 to draw to
    big_points[i].paint(pg2); //feed buffer object 2 to draw to
  }

  //IMAGE SYNTHESIS//----------------------------------------------------------------------------------
  randomFilter = floor(random(4)); //randomly pick an image filter
  pgFinal = createGraphics(600, 600);

  pg0.loadPixels();
  pg1.loadPixels();
  pg2.loadPixels();

  for (let y = 0; y < pg0.height; y += pixJump) {
    for (let x = 0; x < pg0.width; x += pixJump) {
      let idx = (x + y * pg0.width) * 4;

      pg0R = pg0.pixels[idx + 0];
      pg0G = pg0.pixels[idx + 1];
      pg0B = pg0.pixels[idx + 2];
      pg0A = pg0.pixels[idx + 3];
      pg0RGBA = [pg0R, pg0G, pg0B, pg0A]; //pixel array of original image

      pg1R = pg1.pixels[idx + 0];
      pg1G = pg1.pixels[idx + 1];
      pg1B = pg1.pixels[idx + 2];
      pg1A = pg1.pixels[idx + 3];
      pg1RGBA = [pg1R, pg1G, pg1B, pg1A]; //pixel array of texture 1 image (little points)

      pg2R = pg2.pixels[idx + 0];
      pg2G = pg2.pixels[idx + 1];
      pg2B = pg2.pixels[idx + 2];
      pg2A = pg2.pixels[idx + 3];
      pg2RGBA = [pg2R, pg2G, pg2B, pg2A]; //pixel array of texture 2 image (big points)

      //IMAGE FILTERING//-------------------------------------------------------------------------------
      if (randomFilter == 0) {
        //higher colour value gets drawn
        let strongR = strongest(pg0R, pg1R, pg2R);
        let strongG = strongest(pg0G, pg1G, pg2G);
        let strongB = strongest(pg0B, pg1B, pg2B);

        pgFinal.fill(strongR, strongG, strongB, 127);
        pgFinal.noStroke();
        pgFinal.ellipse(x, y, pixSize, pixSize);
      } else if (randomFilter == 1) {
        //lower colour value gets drawn
        let darkR = darkest(pg0R, pg1R, pg2R);
        let darkG = darkest(pg0G, pg1G, pg2G);
        let darkB = darkest(pg0B, pg1B, pg2B);

        pgFinal.fill(darkR, darkG, darkB, 127);
        pgFinal.noStroke();
        pgFinal.ellipse(x, y, pixSize, pixSize);
      } else if (randomFilter == 2) {
        //middle colour value gets drawn
        let midR = middle(pg0R, pg1R, pg2R);
        let midG = middle(pg0G, pg1G, pg2G);
        let midB = middle(pg0B, pg1B, pg2B);

        pgFinal.fill(midR, midG, midB, 127);
        pgFinal.noStroke();
        pgFinal.ellipse(x, y, pixSize, pixSize);
      } else if (randomFilter == 3) {
        //average colour value gets drawn
        let avgR = average(pg0R, pg1R, pg2R);
        let avgG = average(pg0G, pg1G, pg2G);
        let avgB = average(pg0B, pg1B, pg2B);

        pgFinal.fill(avgR, avgG, avgB, 127);
        pgFinal.noStroke();
        pgFinal.ellipse(x, y, pixSize, pixSize);
      }
    }
  }

  image(pgFinal, 0, 0); //final buffer object displayed as background to allow particles to animate on top

  //PARTICLE SETUP//------------------------------------------------------------------------------------
  numMoss = floor(random(500, 2000));
  //moss-like texture
  for (let i = 0; i < numMoss; i++) {
    moss[i] = new Particle(
      random(width), //x
      random(height), //y
      random(1), //radius
      colourPicker(pgFinal) //colour
    );
  }

  numMarbles = floor(random(5, 20));
  //marbles-like texture
  for (let i = 0; i < numMarbles; i++) {
    marbles[i] = new Particle(
      random(width), //x
      random(height), //y
      random(3, 6), //radius
      colourPicker(pgFinal) //colour
    );
  }
}

//DRAWING ANIMATION//-----------------------------------------------------------------------------------
function draw() {
  for (let i = 0; i < marbles.length; i++) {
    if (b_taw) {
      //key pressed toggles marbles animation
      marbles[i].display();
      marbles[i].move();
      marbles[i].update(colourPicker(pgFinal)); //randomly update colour values fed from final image
    }
  }

  for (let i = 0; i < moss.length; i++) {
    if (b_spread) {
      //key pressed toggles moss animation
      moss[i].display();
      moss[i].move();
    }
  }
}

//CLASSES//----------------------------------------------------------------------------------------------
class Point {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.colour = c;
  }

  paint(fbo) {
    //pass buffer object
    fbo.noStroke();
    fbo.fill(this.colour);
    fbo.ellipse(this.x, this.y, this.r, this.r);
  }
}

class Particle {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.colour = c;
  }

  display() {
    noStroke();
    fill(this.colour);
    ellipse(this.x, this.y, this.r, this.r);
  }

  move() {
    this.x += random(-3, 3);
    this.y += random(-3, 3);
  }

  update(newColour) {
    this.colour = newColour;
  }
}

//CUSTOM FUNCTIONS//-------------------------------------------------------------------------------------
function colourPicker(loadedImage) {
  //pass image to get pixel array from
  let randomValX = floor(random(loadedImage.width));
  let randomValY = floor(random(loadedImage.height));
  let imgColour = loadedImage.get(randomValX, randomValY);
  return imgColour; //returns rgba colour array
}

function strongest(a, b, c) {
  if ((a > b) & (a > c)) {
    return a;
  } else if ((b > a) & (b > c)) {
    return b;
  } else if ((c > a) & (c > b)) {
    return c;
  }
}

function darkest(a, b, c) {
  if ((a < b) & (a < c)) {
    return a;
  } else if ((b < a) & (b < c)) {
    return b;
  } else if ((c < a) & (c < b)) {
    return c;
  }
}

function middle(a, b, c) {
  if ((a < b) & (a > c) || (a < c) & (a > b)) {
    return a;
  } else if ((b < a) & (b > c) || (b < c) & (b > a)) {
    return b;
  } else if ((c < a) & (c > b) || (c < b) & (c > a)) {
    return c;
  }
}

function average(a, b, c) {
  let avg = (a + b + c) / 3;
  return avg;
}

//KEYBOARD INTERACTION//----------------------------------------------------------------------------------
function keyPressed() {
  if (key === "s") {
    save("pixel.png");
  }

  if (key === "m") {
    b_spread = !b_spread;
  }

  if (key === "b") {
    b_taw = !b_taw;
  }
}
