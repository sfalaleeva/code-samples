
 let canvas;    // DOM object corresponding to the canvas
    let graphics;  // 2D graphics context for drawing on the canvas
    let spaceship_x = 550;  // keeps track of spaceship x-coord
    let spaceship_y = 550;  //keeps track of spaceship y-coord
    let shots = [];  // keeps track of shots fired by the spaceship 
    let lives = 3;  // keeps track of lives

    // keeps track of whether key is pressed or released 
    let rightPressed = false; 
    let leftPressed = false;
    let sPressed = false;
    let mutePressed = false;

    let score = 0;    // keeps track of the score
    let checkTime = 0; 

    // sounds 
    let sound = new Audio("background.mp3"); // buffers automatically when created
    let shoot_s = new Audio("shoot.wav");
    let explosion_s = new Audio("explosion.wav");

    // Asteroid will have a radius of 10px
    let asteroidRadius = 40;

    // Asteroid start off point
    let asteroidX = 600;
    let asteroidY = 0;

    // Alien will have a radius of 10px
    let alienRadius = 40;

    // Alien start off point
    let alienX = 300;
    let alienY = 0;

    // And when the asteroid moves, we'll shift 5px at a time
    let ast_dx = 5;
    let ast_dy = 5;

    // And when the alien moves, we'll shift 5px at a time
    let alien_dx = 5;
    let alien_dy = 5;

    // bullet coordinates and status 
    let bullet_on_screen = false;
    let bulletY = 0;
    let bulletX = 0;

    // place holder for collision coordinates
    let explosionX;
    let explosionY;
    let explosionTime = -1;
    let explosionSize = 60;

    // variables to keep track of the state of the shield. 0=no shield,
    //1=red shield, 2=green shield
    let shield = 2;

    // variable to control movement of shield power up. move 2px at a time
    let powerupX = 400;
    let powerupY = 0;
    let powerup_dy = 5;
    let powerup_dx = 0;
    let backoff = Math.floor(Math.random() * 1000);
    let drawing = false;

    // Are you already playing the game?
    let playing = false;

    // Add event listeners for keydown and keyup events.
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    /* -------------------------------------------------
    Handlers for keydown events
    -------------------------------------------------- */
    function keyDownHandler(e) {

      // e.keyCode == 39 (right arrow key)
      // e.keyCode == 37 (left arrow key)
      // e.keyCode == 83 (s key)
      // e.keyCode == 89 (y key)

      if (e.keyCode == 39) {
        rightPressed = true;
      } else if (e.keyCode == 37) {
        leftPressed = true;
      } else if (e.keyCode == 83) {
        let currentTime = new Date();
        if((currentTime.getTime() - checkTime) > 100){
          sPressed = true;
          checkTime =currentTime.getTime();
        }
      } else if (e.keyCode == 89 && !playing) {
        playing = true;
      } else if (e.keyCode == 77){
        mutePressed = true;
      }
    }

    /* -------------------------------------------------
    Handler for released keys --> updates keypressed values to false
    -------------------------------------------------- */
    function keyUpHandler(e) {
      if (e.keyCode == 39) {
        rightPressed = false;
      } else if (e.keyCode == 37) {
        leftPressed = false;
      } else if (e.keyCode == 83) {
        sPressed = false;
      } else if (e.keyCode == 89) {
        drawBackstory();
      } else if (e.keyCode == 77){
        mutePressed = false;
      }
    }

    /* -------------------------------------------------
    Draw the start message
    -------------------------------------------------- */
    function drawStart(){
      graphics.font = "60px Arial";
      graphics.fillStyle = "red";
      graphics.fillText("Press y to start",100,300);
    }

    /* --------------------------------------------------
    Draw the backstory, then start the game
    --------------------------------------------------- */
    function drawBackstory() {
      console.log("backstory");
      graphics.clearRect(0, 0, canvas.width, canvas.height);
      graphics.font = "20px Ariel";
      graphics.fillText("The year is 2050 and the human race has spread out across the stars.", 10, 50);
      graphics.fillText("Human settlements, sometimes separated by several billion lightyears,", 10, 70);
      graphics.fillText(" rely on advanced space stations to communicate.", 10, 90);
      graphics.fillText("Although humanity has made peace with most of the alien species it has", 10, 110);
      graphics.fillText("encountered, a gang of rogue Crouser aliens has recently attacked", 10, 130);
      graphics.fillText("these vital space stations. They have corrupted several vital snippets", 10, 150);
      graphics.fillText("of code contained in the space station mainframes, completely disrupting", 10, 170);
      graphics.fillText("humanity's ability to communicate. It is up to you, the Galactic Order's", 10, 190);
      graphics.fillText("top coding expert, to fly to these space stations and fix the corrupted code.", 10, 210);
      setTimeout(draw, 5000);
    }

    /*
    let backstory = ["The year is 2050 and the human race has spread out across the stars.", "Human settlements, sometimes separated by several billion lightyears, rely on advanced space stations to communicate.", "Although humanity has made peace with most of the alien species it has encountered, a gang of rogue Crouser aliens has recently attacked these vital space stations.", "They have coruppted several vital snippets of code contained in the space station mainframes, completely disrupting humanity's ability to communicate.", "It is up to you, the Galactic Order's top coding expert, to fly to these space stations and fix the corrupted code."];
    let speed = 40;
    let message = "";
    function drawBackstory(j, k){
      for (j;j<backstory.length;j++) {
        if (k < backstory[j].length) {
          //console.log(k);
          message += backstory[j].charAt(k);
          k++;
          graphics.fillText(message, 10, 50 + (j*10));
          setTimeout(drawBackstory(j,k), speed);
        }
        k = 0;
      }
    }*/


    /* -------------------------------------------------
    Draw the spaceship image at x, y
    -------------------------------------------------- */
    function drawSpaceship(x, y){
      graphics.drawImage(spaceship, x, y, 50, 50);
    }

    /* -----------------------------------------------------------------
    Draw the shield image at x, y. red if shield==1, green if shield==2
    -------------------------------------------------------------------- */
    function drawShield(x, y){
      if (shield == 1) {
        graphics.drawImage(redshield, x, y, 50, 50);
      } else if (shield == 2) {
        graphics.drawImage(greenshield, x, y, 50, 50);
      }
    }

    /* -------------------------------------------------
    Draw lines representing the shots at x, y
    -------------------------------------------------- */
     function drawShooting(x, y){
       graphics.fillRect(x, y, 10, 5);
       graphics.fillStyle = "Red";
      //graphics.fillRect(225, 480, 15, 15);
      //graphics.fillRect(x, y, 15, 15);
    }

    /* -------------------------------------------------
    Draw the lives in the upper left hand corner
    -------------------------------------------------- */
    function drawLives(){
      for (i=0; i<lives; i++){
        graphics.drawImage(spaceship, 5+(i*35), 35, 25,25);
      }
    }

    /* -------------------------------------------------
    Draw an asteroid image on the canvas
    ------------------------------------------------- */
    function drawAsteroid() {
      //graphics.beginPath();
      //graphics.arc(asteroidX, asteroidY, asteroidRadius, 0, Math.PI*2);
      //graphics.fill();
      //graphics.closePath();
      graphics.drawImage(asteroid, asteroidX, asteroidY, 70, 70);
    }

    /* -------------------------------------------------
    Draw an alien image on the canvas
    ------------------------------------------------- */
    function drawAlien() {
      //graphics.beginPath();
      //graphics.arc(alienX, alienY, alienRadius, 0, Math.PI*2);
      //graphics.fill();
      //graphics.closePath();
      graphics.drawImage(alien, alienX, alienY, 70, 70);
    }

     /* -------------------------------------------------
    Draw an alien bullets on the canvas
    ------------------------------------------------- */
    function drawAlienShoot() {
       graphics.drawImage(bullet, bulletX, bulletY + 35, 50, 50);
    }


    /* -------------------------------------------------
    Draw shield powerup image on the canvas
    ------------------------------------------------- */
    function drawPowerup() {
      //console.log(powerupX, powerupY);
      graphics.drawImage(greenshield, powerupX, powerupY, 60, 60);
    }

    /* -------------------------------------------------
    Draw the score in the upper lefthand corner above lives
    -------------------------------------------------- */
    function drawScore() {
    WebFontConfig = {
      google: {
        families: ['Dosis Semi-Bold']
      }
    };
    graphics.font = "25px Dosis"
    graphics.fillText("Score: "+score, 500, 25);
    }

    /* -------------------------------------------------
    Draw the message that appears when you lose
    -------------------------------------------------- */
    function drawLose() {
      graphics.font = "60px Arial";
      graphics.fillStyle = "red";
      graphics.fillText("GAME OVER :(",100,300);
    }

    /* -------------------------------------------------
    Draw the mute instruction
    -------------------------------------------------- */
    function drawMute() {
     WebFontConfig = {
      google: {
        families: ['Dosis Semi-Bold']
      }
    };
    graphics.font = "25px Dosis";
    graphics.fillText("Press m to mute", 8, 25);
    }

    /* -------------------------------------------------
    Returns a random number between min and max 
    -------------------------------------------------- */
    function getRandomInt(min, max) {
      return Math.random() * (max - min) + min;
    }


    /* -------------------------------------------------
    Draw all elements on the canvas
    -------------------------------------------------- */
    function draw(){
      // clear the canvas
      graphics.clearRect(0, 0, canvas.width, canvas.height);
      // If spaceship should be moving right, and is not at the right wall
      if (rightPressed && spaceship_x <canvas.width-15){
        spaceship_x += 5;
      }
      // If spaceship should be moving left and is not at the left wall
      else if (leftPressed && spaceship_x > 0){
        spaceship_x -= 5;
      }
      // check for pressed shoot and mute keys
      if (sPressed){
        if (shots.length < 20){
          let new_shoot = [spaceship_x+20, spaceship_y];
          shots.push(new_shoot);
          shoot_s.play();
        }
      }
      if (mutePressed) {
        if ((sound.muted) && (shoot_s.muted) && (explosion_s)){
           sound.muted = false;
           shoot_s.muted = false;
           explosion_s.muted = false;
     } else {
        sound.muted = true;
        shoot_s.muted = true;
        explosion_s.muted = true;
     }
     }

      drawExplosion();
      drawSpaceship(spaceship_x, spaceship_y);
      drawShield(spaceship_x, spaceship_y);
      drawLives();

      // Draw shooting
      for (i = 0; i < shots.length; i++) {
        drawShooting(shots[i][0], shots[i][1]);
        shots[i][1] -= 5;
        if(shots[i][1] + 5 < 10) {
          shots.splice(i, 1);
        }
      }
      // Draw various game components
      drawScore();
      drawMute();
      drawAsteroid();
      drawAlien();
      drawScore();

      collisionDetection();
      // If the asteroid hits the LEFT/RIGHT WALL,
      // switch horizontal travel direction
      if(asteroidX > canvas.width + asteroidRadius){
        asteroidX = canvas.width;
        asteroidY = 0;
        ast_dx = -2
      }
      if(asteroidX < -asteroidRadius){
        asteroidX = 0;
        asteroidY = 0;
        ast_dx = 2;
      }

      // If the asteroid hits the LOWER WALL
      // switch vertical travel direction
      if(asteroidY > canvas.height + asteroidRadius) {
        asteroidY = 0;
      }

      // Move the asteroid
      asteroidX += ast_dx;
      asteroidY += ast_dy;

      // Move the alien
      alienX += alien_dx;
      alienY += alien_dy;

      // Different trajectories for alien movement
      if (alienX >= 0 && alienX < canvas.width/3){
        if (alienX + alienRadius > canvas.width/3 || alienX < 0){
          alien_dx = alien_dx * -1;
        }
      }

      if (alienX >= canvas.width/3  && alienX < 2*(canvas.width/3)){
        if (alienX + alienRadius > (canvas.width/3)*2 || alienX < canvas.width/3){
          alien_dx = alien_dx * -1;
        }
      }
      if (alienX >= (canvas.width/3)*2  && alienX < canvas.width){
        if (alienX + alienRadius > canvas.width || alienX < (canvas.width/3)*2){
          alien_dx = alien_dx * -1;
        }
      }

      // if alien goes off screen, pick a random x-coord, start again from the top 
      if(alienY > canvas.height + alienRadius) {
          alienY = 0;
          alienX = getRandomInt(0, canvas.width);
      }

      // 
      if (bullet_on_screen == false) {
          let bullet_rand = getRandomInt(0, 100);
          if ((bullet_rand >= 10) && (bullet_rand <= 90)) {
              console.log(bullet_rand);
              bullet_on_screen = true;
              bulletY = alienY;
              bulletX = alienX;
              drawAlienShoot();
             }
      } else {
          bulletY += 15;
          drawAlienShoot();
      }
      if (bulletY > canvas.height + 70) {
           bullet_on_screen = false;
      }


      // If shield == 0 and you are not already drawing a shield, decrement backoff
      // Otherwise if shield == 0 and backoff == 0, draw the powerup
      if (shield == 0 && backoff != 0 && drawing == false) {
        backoff -= 1;
        console.log(backoff);
      } else if (shield == 0 && backoff == 0) {
        drawPowerup();
        powerupY += powerup_dy;
        drawing = true;
      }



      // Tell JS to animate frame by recursively calling
      requestAnimationFrame(draw);
    }

    /* -------------------------------------------------
    Draw explosion
    -------------------------------------------------- */
    function drawExplosion() {
      explosionTime -= 1;
      if (explosionTime > 0) {
        graphics.drawImage(explosion, explosionX, explosionY, explosionSize, explosionSize);
      }
    }

    /* -------------------------------------------------
    Set up explosion 
    -------------------------------------------------- */
    function startExplosion(x, y) {
      explosionX = x;
      explosionY = y;
      explosionTime = 15;
    }


    /* -------------------------------------------------
    Detects collisions 
    -------------------------------------------------- */
    function collisionDetection() {


    // if spaceship hits asteroid
      if (((asteroidX + 25 >= spaceship_x - 15) && (asteroidX - 25 <= spaceship_x + 15)
        && (asteroidY + 25 >= spaceship_y - 15) && (asteroidY - 25 <= spaceship_y + 15))) {
        explosionX = asteroidX;
        explosionY = asteroidY+10;
        explosion_s.play();
        startExplosion(explosionX, explosionY);
        if (lives == 0) {
          drawLose();
          cancelAnimationFrame();
        }
        // Update the state of the shield
        if (shield == 2) {
          shield = 1;
        } else if (shield == 1) {
          shield = 0;
        } else {
          lives = lives - 1;
        }
        //lives = lives - 1;
        asteroidX = getRandomInt(0, canvas.width);
        asteroidY = 0;
      }

    // if spaceship hits alien
    else if ((alienX + 15 >= spaceship_x - 15) && (alienX - 25 <= spaceship_x + 15)
        && (alienY + 25 >= spaceship_y - 15) && (alienY - 25 <= spaceship_y + 15)) {
        explosionX = alienX;
        explosionY = alienY+10;
        explosion_s.play();
        startExplosion(explosionX, explosionY);
        if (lives == 0) {
          drawLose();
          cancelAnimationFrame();
        }
        // Update the state of the shield
        if (shield == 2) {
          shield = 1;
        } else if (shield == 1) {
          shield = 0;
        } else {
          lives = lives - 1;
        }
        //lives = lives - 1;
        alienX = getRandomInt(0, canvas.width);
        alienY = 0;
    }

    // if spaceship hits bullet
    else if ((bulletX + 15 >= spaceship_x - 15) && (bulletX - 15 <= spaceship_x + 15)
        && (bulletY + 15 >= spaceship_y - 15) && (bulletY - 15 <= spaceship_y + 15)) {
        explosionX = bulletX;
        explosionY = bulletY+10;
        explosion_s.play();
        startExplosion(explosionX, explosionY);
        if (lives == 0) {
          drawLose();
          cancelAnimationFrame();
        }
        // Update the state of the shield
        if (shield == 2) {
          shield = 1;
        } else if (shield == 1) {
          shield = 0;
        } else {
          lives = lives - 1;
        }
        //lives = lives - 1;
        bulletY = canvas.width + 70;
        bullet_on_screen = false;
    }

    // If the powerup collides with you, set new backoff, new random x,
    // set y = 0, set drawing = false, set shield == 2
    // If it collides with the bottom of the screen, set new backoff, new random x,
    // set y = 0, set drawing = false
    if ((powerupX + 25 >= spaceship_x - 15) && (powerupX - 25 <= spaceship_x + 15)
    && (powerupY + 25 >= spaceship_y - 15) && (powerupY - 25 <= spaceship_y + 15)) {
      console.log("collision");
      backoff = Math.floor(Math.random() * 1000);
      powerupX = getRandomInt(0, canvas.width);
      powerupY = 0;
      drawing = false;
      shield = 2;
    }
    if ((powerupY  + 25 >= canvas.height)) {
      console.log("bottom");
      backoff = Math.floor(Math.random() * 1000);
      powerupX = getRandomInt(0, canvas.width);
      powerupY = 0;
      drawing = false;
    }

    // when you shoot and hit asteroid/alien, your score goes up
    for (i = 0; i < shots.length; i++) {
      if ((asteroidX + 35 >= shots[i][0] - 5) && (asteroidX - 35 <= shots[i][0] + 5)
      && (asteroidY + 35 >= shots[i][1] - 5) && (asteroidY - 35 <= shots[i][1] + 5)) {
        explosionX = asteroidX;
        explosionY = asteroidY+10;
        explosion_s.play();
        startExplosion(explosionX, explosionY);
        asteroidX = getRandomInt(0, canvas.width);
        asteroidY = 0;
        score += 1;

        if (score > 10){
        cancelAnimationFrame();
        }
      }

      else if ((alienX + 33 >= shots[i][0] - 5) && (alienX - 33 <= shots[i][0] + 5)
      && (alienY + 33 >= shots[i][1] - 5) && (alienY - 33 <= shots[i][1] + 5)) {
        explosionX = alienX;
        explosionY = alienY+10;
        explosion_s.play();
        startExplosion(explosionX, explosionY);
        alienX = getRandomInt(0, canvas.width);
        alienY = 0;
        score += 1;

        if (score > 10){
        cancelAnimationFrame();
        }
      }
    }
  }

    /* -------------------------------------------------
    Set up the canvas and its elements 
    -------------------------------------------------- */
    function init() {
        canvas = document.getElementById("theCanvas");
        graphics = canvas.getContext("2d");
        let spaceship = document.getElementById("spaceship");
        let asteroid = document.getElementById("asteroid");
        let alien = document.getElementById("alien");
        sound.play();
        drawStart();
        //draw();  // draw something on the canvas
    }


    /* -------------------------------------------------
    Splits the screen in half and moves the game div to the left
    -------------------------------------------------- */
    function MoveOver(){
      document.getElementById("game").setAttribute("class", "leftSide");
      document.getElementById("challenge").setAttribute("class", "rightSide");
      document.getElementById("button1").innerHTML = "Back to the game";
      document.getElementById("button1").setAttribute("onclick", "javascript: MoveBack();");
    }

    /* -------------------------------------------------
    The screen returns to its original position  
    -------------------------------------------------- */
    function MoveBack(){
      document.getElementById("game").setAttribute("class", "game");
      document.getElementById("challenge").setAttribute("class", "challenge");
      document.getElementById("button1").innerHTML = "Show question";
      document.getElementById("button1").setAttribute("onclick", "javascript: MoveOver();");

    }

    /* -------------------------------------------------
    Submits the answer

    Still needs work: 
      - currently evaluates the input field and displays the result in
      question field, just for testing 
      - supposed to record and submit the answer choice for multiple choice answers 
      then change color to green/red is correct/incorrect
      - for free-response questions, embed Ace editor 

    -------------------------------------------------- */
    function Submit(){
      var input = document.getElementById("input").textContent;
      console.log(input);
      input = input.replace("<br>", "\n");
      var output = eval(input);
      document.getElementById("question").innerHTML = output;
    }

    /* -------------------------------------------------
    For free response questions response field prompt disappears, 
    changes color to black and removes the listener 
    -------------------------------------------------- */
    function PromptHandler(e){
      e.target.style.color = "black";
      e.target.innerHTML = "";
      e.target.removeEventListener(e.type, arguments.callee);
    }

    function chosen(choice){

    }

    
    

