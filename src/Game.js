export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  init(data) {
    // Receive data from HomeScene
    this.currentAngel = data.currentAngel || 0;
    this.score = data.score || 0;
    this.highScore = data.highScore || 0;
    this.soundOn = data.soundOn !== false;
    this.selectedBackground = data.selectedBackground || "bg_3";
  }

  create() {
    this.cameras.main.fadeIn(1000);
    const loader = document.querySelector("#loader");
    if (loader) {
      loader.style.display = "none";
    }

    this.scoreText2 = this.add
      .text(400, 200, this.score, {
        fontFamily: "MyLocalFont",
        stroke: "#000000",
        fontSize: "100px",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(-2)
      .setVisible(false);

    this.canJump = true;

    // Start the game directly
    this.variables();
    this.addBackground();
    this.addSounds();
    this.addScores();
    this.start();
  }

  variables() {
    this.lastPipe = null;
    this.charecterSelectionDone = false;
    this.angels = ["a11", "a21", "a31"];
    this.angelAnimations = ["a1Animation", "a2Animation", "a3Animation"];
    this.angelFallAnimations = ["michaelDown", "gabrielDown", "raphaelDown"];
    this.flames = this.physics.add.group();
    this.power = this.currentAngel;
    this.monsterCollide = false;
  }

  addBackground() {
    const bgKey = this.selectedBackground || "bg_3";
    this.gameBg = this.add
      .tileSprite(400, 700, 800, 1400, bgKey)
      .setDepth(2)
      .setAlpha(0.7);
    this.gameBg.setScrollFactor(0);
  }

  addSounds() {
    this.jumpSound = this.sound.add("jump");
    this.productSound = this.sound.add("product");
    this.lostSound = this.sound.add("lost");
    this.explosionSound = this.sound.add("explosion");
    this.hoopSound = this.sound.add("woosh");
  }

  addScores() {
    this.score = 0;
    this.scoreText2 = this.add
      .text(400, 150, this.score, {
        fontFamily: "MyLocalFont",
        stroke: "#822d13ff",
        fontSize: "80px",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(Infinity);
    this.scoreText2.setVisible(false);
  }

  start() {
    this.cameras.main.fadeIn(300);
    this.playing = true;
    this.power = this.currentAngel;
    this.devils = [];
    this.devilCollides = [];
    this.products = [];
    this.productCollides = [];
    this.devilsAndProductY = 400;
    this.pointTimes = 500;
    this.scoreText2.setVisible(true);
    this.createPlayer();
    this.createControls();
    this.createTouchControls();
    this.addDevilsAndProducts();
  }

  createPlayer() {
    this.dove = this.physics.add
      .sprite(60, 60, "dove1")
      .setScale(0.22)
      .setDepth(4)
      .setScrollFactor(0)
      .toggleFlipX()
      .setAngle(20);
    this.dove.play("dove");
    this.player = this.physics.add
      .sprite(600, 450, this.angels[this.currentAngel])
      .setScale(0.25)
      .setDepth(5);
    this.player.body
      .setCircle(this.player.width / 5)
      .setOffset(
        this.player.width * 1 -
          this.player.width * this.currentAngel ** 2 * 0.14,
        this.player.height * 0.5,
      );

    this.player.speed = 300;
    this.powerOfAngel();

    this.player.moveDirection = {
      right: false,
    };

    this.player.flying = false;
    this.player.lost = false;
    this.player.ended = false;

    this.player.body.setGravityY(2000);
    this.cameras.main.startFollow(this.player);
    this.player.body.onWorldBounds = true;
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (body.gameObject === this.player) {
        this.player.lost = true;
      }
    });

    this.cameras.main.setBounds(0, 0, 800, 1200, true);

    this.leftWall = this.physics.add
      .image(0, 700, null)
      .setSize(1, 1200)
      .setVisible(false)
      .setVelocityX(this.player.speed);

    this.player.setVelocityY(-650);
  }

  powerOfAngel() {
    if (this.power == 0) {
      this.swardTip = this.physics.add
        .image(
          this.player.x + 60,
          this.player.y + 200,
          this.angels[this.currentAngel],
        )
        .setScale(0.1)
        .setAlpha(0.01)
        .setDepth(-1)
        .setSize(250, 250);
      this.player.play("michaelAttack");
    } else if (this.power == 1) {
      if (!this.player.lost) {
        this.player.play("gabrielAttack");
        this.flameTimer = this.time.addEvent({
          delay: 800,
          loop: true,
          callback: () => {
            let arrowFlame = this.physics.add
              .image(this.player.x + 20, this.player.y - 40, "arrowFlame")
              .setDepth(4)
              .setCircle(30, 400, 30)
              .setScale(0.25);
            this.flames.add(arrowFlame);
            this.flames.setVelocityX(1500);
            setTimeout(() => {
              if (arrowFlame) {
                arrowFlame.destroy();
              }
            }, 2000);
          },
        });
      } else {
        if (this.flameTimer) {
          this.flameTimer.remove();
        }
      }
    } else if (this.power == 2) {
      if (!this.player.lost) {
        this.player.play("raphaelAttack");
        this.flameTimer = this.time.addEvent({
          delay: 1000,
          loop: true,
          callback: () => {
            let arrowFlame = this.physics.add
              .image(this.player.x + 40, this.player.y - 40, "distinctFlame")
              .setDepth(4)
              .setCircle(50, 400, 40)
              .setScale(0.25);
            this.time.addEvent({
              delay: 100,
              callback: () => {
                arrowFlame.toggleFlipY();
              },
              loop: true,
            });
            this.flames.add(arrowFlame);
            this.flames.setVelocityX(700);
            setTimeout(() => {
              if (arrowFlame) {
                arrowFlame.destroy();
              }
            }, 2000);
          },
        });
      } else {
        if (this.flameTimer) {
          this.flameTimer.remove();
        }
      }
    }
  }

  updateWapon() {
    if (this.power == 0) {
      this.swardTip.x = this.player.x + 100;
      this.swardTip.y = this.player.y + 30;
    }
  }

  createControls() {
    this.player.moveDirection.right = true;
    this.input.keyboard.on("keydown", (event) => {
      if (event.key === " " && this.canJump && !this.player.lost) {
        this.canJump = true;
        this.jump();
        setTimeout(() => {
          this.canJump = true;
        }, 800);
      }
    });

    this.input.keyboard.on("keyup", (event) => {
      if (event.key === " ") {
        this.player.moveDirection.right = false;
      }
    });
  }

  createTouchControls() {
    this.touchLeft = this.add
      .rectangle(200, 600, 400, 1400, 0xffffff)
      .setDepth(5)
      .setScrollFactor(0)
      .setAlpha(0.001)
      .setInteractive();

    this.touchRight = this.add
      .rectangle(600, 600, 400, 1400, 0xffffff)
      .setDepth(5)
      .setScrollFactor(0)
      .setAlpha(0.001)
      .setInteractive();

    this.touchLeft.on("pointerdown", () => {
      this.jump();
    });

    this.touchRight.on("pointerdown", () => {
      this.jump();
    });
  }

  jump() {
    if (!this.player.lost) {
      this.player.setVelocityY(-650);
      this.tweens.add({
        targets: this.player,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: this.player,
            duration: 200,
            onComplete: () => {},
          });
        },
      });

      if (this.soundOn) {
        this.jumpSound.play();
      }
    }
  }

  addDevilsAndProducts() {
    if (this.player.speed < 250) {
      this.player.speed += 10;
    }
    this.updatePlayerControls();
    this.generatePipeAndCoin();
  }

  generatePipeAndCoin() {
    this.pipes = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.obstacles = this.physics.add.group();
    this.hearts = this.physics.add.group();

    if (this.currentAngel !== 0) {
      this.physics.add.overlap(
        this.flames,
        this.pipes,
        (flame, monster) => {
          flame.destroy();
          if (this.currentAngel == 1) {
            monster.life--;
          } else {
            monster.life = 0;
          }
          if (monster.life <= 0) {
            this.destroyMonster(monster);
            this.score += 1;
            this.updateScore();
          }
        },
        null,
        this,
      );
    }
    this.spawn();

    this.physics.add.collider(
      this.player,
      this.pipes,
      (player, pipe) => {
        if (!this.monsterCollide) {
          this.monsterCollide = true;
          this.pipes.setVelocity(0, 0);
          this.coins.setVelocity(0, 0);
          if (pipe.anims) {
            if (pipe.monsterType === "minotaur") {
              pipe.anims.play("minotaurSmashing", true);
            } else if (pipe.monsterType === "dragon") {
              pipe.anims.play("dragonAttack", true);
            }
          }
          this.player.lost = true;
        }
      },
      null,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.obstacles,
      (player, obstacle) => {
        if (!this.monsterCollide) {
          this.monsterCollide = true;
          this.pipes.setVelocity(0, 0);
          this.coins.setVelocity(0, 0);
          this.obstacles.setVelocity(0, 0);

          this.player.lost = true;
        }
      },
      null,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      (player, coin) => {
        if (!this.monsterCollide) {
          this.monsterCollide = true;
          this.pipes.setVelocity(0, 0);
          this.coins.setVelocity(0, 0);
          if (coin.anims) {
            coin.anims.play("cloudAttack", true);
          }
          this.player.lost = true;
        }
      },
      null,
      this,
    );
  }

  spawn() {
    if (this.player.speed < 250) {
      this.player.speed += 5;
    }
    this.updatePlayerControls();

    const x = this.player.x + 800;
    const y = this.getRandomY();

    this.spawnPipes(x, y);
    this.spawnCoin(x, y);

    this.time.delayedCall(2000, this.spawn, [], this);
  }

  getRandomY() {
    return Phaser.Math.Between(200, 1050);
  }

  spawnPipes(x, y) {
    // Randomly choose between minotaur (0) or dragon attack (1)
    const monsterType = Phaser.Math.Between(0, 1);

    let monster;
    if (monsterType === 1) {
      // Dragon attack monster
      monster = this.pipes.create(x, y, "dragonAttack1");
      monster.play("dragonAttack");
      monster.setScale(0.3).setDepth(4);
      monster.body
        .setSize(monster.width * 0.2, monster.height * 0.6)
        .setOffset(monster.width * 0.4, monster.height * 0.3);
      monster.life = 3;
      monster.monsterType = "dragon";

      // Add fireball shooting timer for dragon
      monster.fireballTimer = this.time.addEvent({
        delay: 750,
        loop: true,
        callback: () => {
          if (monster.active && !this.player.lost) {
            this.spawnDragonFireball(monster.x, monster.y);
          }
        },
      });
    } else {
      // Minotaur monster
      monster = this.pipes.create(x, y, "monster");
      monster.play("minotaurWalking");
      monster.setScale(0.2).setDepth(4);
      monster.body
        .setSize(monster.width * 0.2, monster.height * 0.6)
        .setOffset(monster.width * 0.4, monster.height * 0.3);
      monster.life = 2;
      monster.monsterType = "minotaur";
    }

    if (this.currentAngel == 0) {
      this.physics.add.collider(
        this.swardTip,
        monster,
        () => {
          this.destroyMonster(monster);
          this.score += 1;
          this.updateScore();
        },
        null,
        this,
      );
    }
    this.lastPipe = monster;
  }

  spawnDragonFireball(x, y) {
    let fireball = this.physics.add
      .sprite(x - 50, y, "dragonFireball1")
      .setDepth(4)
      .setScale(0.17);

    fireball.play("dragonFireball");
    fireball.body.setSize(fireball.width * 0.25, fireball.height * 0.35);
    fireball.body.allowGravity = false;

    // Add to flames group for collision detection
    this.obstacles.add(fireball);

    // Set velocity towards left (towards player) - set after adding to group
    this.obstacles.setVelocityX(-1200);

    // Destroy fireball after 3 seconds
    this.time.delayedCall(3000, () => {
      if (fireball.active) {
        fireball.destroy();
      }
    });
  }

  spawnCoin(x, y) {
    let y2 = this.getRandomY();
    let img = "cloudReposo1";
    let coin = this.coins.create(x + 300, y2, img);
    coin.play("cloudReposo");
    coin.toggleFlipX();
    coin.setScale(0.2).setDepth(4);
    coin.body
      .setSize(coin.width * 0.3, coin.height * 0.6)
      .setOffset(coin.width * 0.4, coin.height * 0.2);
  }

  spawnObstacles1(x, y) {
    let y2 = -20;
    let coin = this.coins
      .create(x + Math.floor(Math.random() * 200), y2, "locket")
      .setScale(0.27, 0.27)
      .setDepth(4)
      .setOrigin(0.5, 0);
    coin.body
      .setSize(coin.width * 0.5, coin.height * 0.6)
      .setOffset(coin.width * 0.25, coin.height * 0.2);
    this.tweens.add({
      targets: coin,
      angle: { from: -10, to: 10 },
      duration: 1100,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  spawnObstacles2(x, y) {
    let y2 = 1200;
    let coin = this.obstacles
      .create(x + Math.floor(Math.random() * 200), y2, "stone2")
      .setScale(0.3, 0.28)
      .setDepth(4);
    coin.body
      .setSize(coin.width * 0.5, coin.height * 0.6)
      .setOffset(coin.width * 0.25, coin.height * 0.2);
  }

  collectCoin(bird, coin) {
    coin.disableBody(true, true);
    if (this.soundOn) {
      this.productSound.play();
    }
    this.score += 1;
  }

  destroyMonster(monster) {
    // Stop fireball timer if it's a dragon
    if (monster.fireballTimer) {
      monster.fireballTimer.remove();
    }

    let x = monster.x;
    let y = monster.y;
    monster.destroy();
    console.log(x, y);
    this.spawnHearts(x, y);
  }

  spawnHearts(x, y) {
    let heartCount = 1;
    for (let i = 0; i < heartCount; i++) {
      let heart = this.hearts.create(x, y, "heart1");
      heart.play("heart");
      heart.setDepth(4);
      heart.setScale(0.3);
      heart.body
        .setSize(heart.width * 0.5, heart.height * 0.6)
        .setOffset(heart.width * 0.25, heart.height * 0.2);

      heart.setVelocity(
        Phaser.Math.Between(300, 800),
        Phaser.Math.Between(-500, 500),
      );
      heart.setDrag(300, 300);
      heart.setDamping(false);
      this.time.addEvent({
        delay: 50,
        loop: true,
        callback: () => {
          if (!heart) {
            if (heart.body.speed < 5) {
              heart.setVelocity(0, 0);
              heart.body.allowGravity = false;
            }
          }
        },
      });

      this.tweens.add({
        targets: heart,
        alpha: 0.5,
        duration: 200,
        yoyo: true,
        repeat: -1,
      });

      this.physics.add.overlap(
        this.player,
        heart,
        this.collectHeart,
        null,
        this,
      );
      this.time.delayedCall(8000, () => {
        if (heart.active) heart.destroy();
      });
    }
  }

  collectHeart(player, heart) {
    heart.destroy();
    this.score += 5;
    this.updateScore();
  }

  randomBetween(min, max) {
    return Phaser.Math.Between(min, max);
  }

  update() {
    if (this.playing) {
      this.gameBg.tilePositionX = this.cameras.main.scrollX * 0.5;
      this.updateWapon();
      this.updateCameraBounds();
      this.checkPlayerLost();
    }
  }

  updatePlayerControls() {
    if (!this.player.lost) {
      this.player.setVelocityX(this.player.speed);
      this.leftWall.setVelocityX(this.player.speed);
    }
  }

  updateCameraBounds() {
    if (this.player) {
      if (!this.player.lost) {
        this.cameraBound = this.player.x - 220;
        this.cameras.main.setBounds(this.cameraBound, 0, 1200, 0, true);
      }
    }
  }

  checkPlayerLost() {
    if (this.player && !this.player.lost) {
      if (this.player.y > 1350 || this.player.y < 0) {
        this.player.lost = true;
        this.player.setVelocity(0, 0);
        this.player.body.setGravityY(0);
      }
    }

    if (this.player && this.player.lost && !this.player.ended) {
      this.player.ended = true;
      this.player.body.setGravityY(0);
      this.player.setVelocity(0, 0);
      this.time.addEvent({
        delay: 800,
        callback: () => {
          this.player.setVelocity(0, 650);
          this.player.play(this.angelFallAnimations[this.currentAngel]);
          this.player.setVelocityX(0);
          this.sound.stopAll();

          if (this.soundOn) {
            this.explosionSound.play({
              rate: 1.5,
              volume: 0.7,
            });
          }

          this.time.addEvent({
            delay: 100,
            callback: () => {
              this.cameras.main.fadeOut(500);
              this.time.addEvent({
                delay: 1000,
                callback: () => {
                  this.tempHighScore = this.highScore;

                  if (this.score > this.highScore) {
                    this.highScore = this.score;
                  }

                  localStorage.setItem("setHighScore", this.highScore);
                  localStorage.setItem("setScore", this.score);

                  this.playing = false;
                  // Navigate to RestartScene instead of restarting
                  this.scene.start("RestartScene", {
                    score: this.score,
                    highScore: this.highScore,
                    selectedBackground: this.selectedBackground,
                  });
                },
              });
            },
          });
        },
      });
    }
  }

  updateScore() {
    if (this.scoreText2) {
      this.scoreText2.setText(this.score);
    }
  }
}
