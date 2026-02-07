const images = {};

const imageSources = {
  UIBackground: "assets/backgrounds/background.jpg",
  background: "assets/backgrounds/background.jpg",
  logo: "assets/UI/background-logo.png",
  star: "assets/angel/flame.png",
  heart1: "assets/angel/heart1.png",
  heart2: "assets/angel/heart2.png",
  heart3: "assets/angel/heart3.png",
  stone: "assets/angel/stone.png",
  stone2: "assets/angel/stone2.png",
  locket: "assets/angel/locket.png",
  home: "assets/UI/home-icon.png",
  angelArrow: "assets/angel/arrow.png",
  angelSward: "assets/angel/sward.png",
  angelDistinct: "assets/angel/distinct.png",
  arrowFlame: "assets/angel/arrowFlame.png",
  distinctFlame: "assets/angel/distinctFlame.png",
  monster: "assets/angel/monster.png",
  addToLeaderboard: "assets/flappyBird/add-to-leaderboard.png",
  goToLeaderboard: "assets/flappyBird/go-to-leaderboard.png",
  leaderboardIcon: "assets/UI/leaderboard-icon.png",
  restart: "assets/flappyBird/restart.png",
  title: "assets/flappyBird/title.png",
  playBtn: "assets/UI/playBtn.png",
};

for (let i = 1; i <= 1; i++)
  imageSources[`bb${i}`] = `assets/flappyBird/b${i}.png`;

const audioSources = {
  jump: "assets/sounds/jump.mp3",
  lost: "assets/sounds/lost.mp3",
  enemy: "assets/sounds/enemy.mp3",
  product: "assets/sounds/product.mp3",
  woosh: "assets/sounds/Woosh.mp3",
  explosion: "assets/sounds/explosion.mp3",
};

let loadedCount = 0;
const totalAssets = Object.keys(imageSources).length;

let height = window.innerHeight;
// Load Images
for (const key in imageSources) {
  images[key] = new Image();
  images[key].src = imageSources[key];
  images[key].onload = checkLoaded;
}

function checkLoaded() {
  loadedCount++;
  if (loadedCount === totalAssets) startPhaserGame();
}

function startPhaserGame() {
  class Game extends Phaser.Scene {
    constructor() {
      super({
        key: "Game",
        physics: {
          default: "arcade",
          arcade: {
            debug: true,
          },
        },
      });

      this.configure();
    }
    configure() {
      this.screen = "home";
      this.charecterSelectionDone = false;
      this.score = localStorage.getItem("setScore");
      if (this.score === null) {
        this.score = 0;
      }
      this.highScore = localStorage.getItem("setHighScore");
      if (this.highScore === null) {
        this.highScore = 0;
      }
      this.soundOn = true;
      this.sounds = {};
    }

    preload() {
      for (const key in images) {
        this.textures.addImage(key, images[key]);
      }
      for (const key in audioSources) {
        this.load.audio(key, audioSources[key]);
      }
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
      this.addUI();
    }

    addUI() {
      if (this.screen === "home") {
        this.startGame();
      } else if (this.screen === "restart") {
        this.addRestartUI();
      } else if (this.screen === "replay") {
        this.addReplayUI();
      } else if (this.screen === "info") {
        this.addInfoUI();
      } else if (this.screen === "leaderboard") {
        this.addLeaderboardUI();
      }
    }

    addRestartUI() {
      this.UIBackground = this.add.image(400, 700, "background").setScale(0.37);
      this.yourScore = this.add
        .text(400, 250, "YOUR SCORE", {
          fontFamily: "MyLocalFont",
          fontSize: "70px",
          color: "#fff",
          align: "center",
          stroke: "#bf4b08",
          strokeThickness: 10,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);
      this.scoreText = this.add
        .text(400, 450, this.score, {
          fontFamily: "MyLocalFont",
          fontSize: "100px",
          color: "#fff",
          align: "center",
          stroke: "#ab4400ff",
          strokeThickness: 7,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);
      this.usernameInput = this.add.dom(400, 900).createElement(
        "input",
        `
      	outline: none;
      	border: none;
      	padding: 0px 30px;
      	width: 440px;
      	height: 70px;
      	font-size: 30px;
      	font-weight: bold;
      	background: #ebf4f5;
      	border-radius: 0px;
        stroke: 6px solid #d95300
      `,
      );

      this.usernameInput.node.setAttribute("placeholder", "Name");

      this.usernameInput.node.setAttribute("maxLength", "15");

      this.option1 = this.add
        .image(400, 1000, "addToLeaderboard")
        .setDepth(5)
        .setScrollFactor(0)
        .setAlpha(1)
        .setScale(0.65);
      this.option1.setInteractive();

      this.option1Text = this.add
        .text(400, 800, "OR", {
          fontFamily: "MyLocalFont",
          fontSize: "70px",
          color: "#fff",
          align: "center",
          stroke: "#bf4b08",
          strokeThickness: 10,
        })
        .setOrigin(0.5)
        .setDepth(6);

      this.option2 = this.add
        .image(400, 700, "restart")
        .setDepth(5)
        .setScrollFactor(0)
        .setInteractive();

      this.option1.on("pointerdown", () => {
        this.tweens.add({
          targets: [this.option1],
          scale: 0.55,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: [this.option1],
              scale: 0.65,
              duration: 100,

              onComplete: () => {
                const username = this.usernameInput.node.value.trim();
                if (username === "") {
                  this.notify(1); // "Enter your username!"
                  return;
                }
                if (this.score > 0) {
                  this.addScoreToLeaderboard(username, this.score);
                  this.screen = "leaderboard";
                }

                this.scene.restart();
              },
            });
          },
        });
      });

      this.option2.on("pointerdown", () => {
        this.tweens.add({
          targets: [this.option2],
          scale: 0.85,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: [this.option2],
              scale: 1,
              duration: 100,

              onComplete: () => {
                this.elements = [
                  this.yourScore,
                  this.UIBackground,
                  this.scoreText,
                  this.option1,
                  this.option1Text,
                  this.option2,
                  this.termsText,
                  this.usernameInput,
                ];

                this.elements.forEach((element) => {
                  element.destroy();
                });
                this.cameras.main.fadeOut(400);
                setTimeout(() => {
                  this.startGame();
                }, 300);
              },
            });
          },
        });
      });

      this.termsText = this.add
        .text(
          400,
          1330,
          "Developed by Md Mahabub. By playing this game\nyou accept these Terms & policies.",
          {
            fontFamily: "RakeslyRG",
            fontSize: "20px",
            color: "#ffffff",
            align: "center",
          },
        )
        .setOrigin(0.5)
        .setInteractive({ cursor: "pointer" });
      this.termsText.on("pointerup", () => {
        // const url = "https://www.proviva.se";
        // window.open(url, "_blank");
      });
    }
    addReplayUI() {
      this.background = this.add
        .image(400, 600, "UIBackground")
        .setScale(1)
        .setScrollFactor(0)
        .setDepth(0);

      this.homeIcon = this.adda
        .image(740, 55, "home")
        .setScale(0.5)
        .setInteractive();

      this.homeIcon.on("pointerdown", () => {
        this.tweens.add({
          targets: this.homeIcon,
          scale: 0.4,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: this.homeIcon,
              scale: 0.5,
              duration: 100,

              onComplete: () => {
                this.screen = "home";

                this.scene.restart();
              },
            });
          },
        });
      });

      this.scoreTitle = this.add
        .text(
          400,
          170,
          this.score > this.tempHighScore ? "New highscore" : "Your score",
          {
            fontFamily: "RakeslyRG",
            fontSize: "40px",
            color: "#000",
            align: "center",
            stroke: "#00139f",
            strokeThickness: 1,
          },
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.scoreBox = this.add
        .rexRoundRectangle(400, 250, 300, 70, 20, 0x4e316e)
        .setDepth(10)
        .setScrollFactor(0);

      this.scoreImage = this.add
        .image(265, 250, "star")
        .setDepth(Infinity)
        .setScrollFactor(0)
        .setScale(0.9);

      this.scoreText = this.add
        .text(400, 250, this.score, {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#fff",
          align: "center",
          stroke: "#fff",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.playButton = this.add
        .image(400, 600, "playBtn")
        .setScale(1.3)
        .setInteractive();

      this.playTitle = this.add
        .text(400, 850, "Play again", {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#000",
          align: "center",
          stroke: "#000",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.playButton.on("pointerdown", () => {
        this.tweens.add({
          targets: this.playButton,
          scale: 1.1,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: this.playButton,
              scale: 1.3,
              duration: 100,

              onComplete: () => {
                this.elements = [
                  this.background,
                  this.homeIcon,
                  this.scoreTitle,
                  this.scoreBox,
                  this.scoreImage,
                  this.scoreText,
                  this.playButton,
                  this.playTitle,
                  this.usernameInput,
                ];

                this.elements.forEach((element) => {
                  element.destroy();
                });

                this.startGame();
              },
            });
          },
        });
      });
    }
    addLeaderboardUI(data) {
      this.background = this.add
        .image(400, 600, "UIBackground")
        .setScale(1)
        .setScrollFactor(0)
        .setDepth(0)
        .setAlpha(0.8);

      if (this.remember) {
        this.userIcon = this.add
          .image(650, 55, "userIcon")
          .setScale(0.5)
          .setInteractive()
          .setScrollFactor(0)
          .setDepth(Infinity);

        this.userIcon.on("pointerdown", () => {
          this.tweens.add({
            targets: this.userIcon,
            scale: 0.4,
            duration: 100,

            onComplete: () => {
              this.tweens.add({
                targets: this.userIcon,
                scale: 0.5,
                duration: 100,

                onComplete: () => {
                  this.userIcon.destroy();

                  this.notify(4);

                  this.username = null;

                  this.email = null;

                  this.remember = false;

                  localStorage.removeItem("axa-bird-game-remember");

                  localStorage.removeItem("axa-bird-game-username");

                  localStorage.removeItem("axa-bird-game-email");
                },
              });
            },
          });
        });
      }

      this.homeIcon = this.add
        .image(740, 55, "home")
        .setScale(0.4)
        .setInteractive();

      this.homeIcon.on("pointerdown", () => {
        this.tweens.add({
          targets: this.homeIcon,
          scale: 0.5,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: this.homeIcon,
              scale: 0.4,
              duration: 100,

              onComplete: () => {
                this.screen = "home";

                this.scene.restart();
              },
            });
          },
        });
      });

      this.leaderboardImage = this.add.image(400, 170, "leaderboardIcon");

      this.leaderboardTitle = this.add
        .text(400, 310, "Leaderboard", {
          fontFamily: "RakeslyRG",
          fontSize: "50px",
          color: "#fff",
          align: "center",
          stroke: "#fff",
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);

      // Get leaderboard from localStorage
      const leaderboardData = localStorage.getItem("axa-bird-game-leaderboard");
      this.scores = leaderboardData ? JSON.parse(leaderboardData) : [];

      this.players = this.add.dom(400, 375, "div");

      this.players.node.style = `
      	margin: 0px 0px 0px -300px;
      	padding: 0px 20px 0px 0px;
      	width: 600px;
      	height: 770px;
      	display: flex;
      	flex-direction: column;
      	align-items: center;
      	justify-content: center;
      	overflow-y: auto;
      `;

      this.players.node.innerHTML = ``;

      this.scores.forEach((user, index) => {
        this.players.node.innerHTML += `
      		<div class="scoreBox">
      			<div class="scoreImageBox">
      				${
                index < 3
                  ? `<img class="scoreImage" src="assets/positions/${
                      index + 1
                    }.png"/>`
                  : `<div class="scoreText"> ${index + 1}. </div>`
              }
      			</div>

      			<div class="${
              user.username === this.username ? "scoreTitlePlus" : "scoreTitle"
            }">
      				${user.username}
      			</div>

      			<div class="${
              user.username === this.username ? "scoreValuePlus" : "scoreValue"
            }">
      				${user.score}
      			</div>
      		</div>
      	`;
      });
    }

    addInfoUI() {
      this.UIBackground = this.add.rectangle(400, 600, 800, 1200, 0xffffff);

      this.homeIcon = this.add
        .image(740, 55, "home")
        .setScale(0.4)
        .setInteractive();

      this.homeIcon.on("pointerdown", () => {
        this.tweens.add({
          targets: this.homeIcon,
          scale: 0.4,
          duration: 100,

          onComplete: () => {
            this.tweens.add({
              targets: this.homeIcon,
              scale: 0.5,
              duration: 100,

              onComplete: () => {
                this.screen = "home";

                this.scene.restart();
              },
            });
          },
        });
      });

      this.infoImage = this.add.image(400, 170, "info").setScale();

      this.infoTitle = this.add
        .text(400, 310, "Information", {
          fontFamily: "RakeslyRG",
          fontSize: "40px",
          color: "#000",
          align: "center",
          stroke: "#000",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);

      this.infoText = this.add
        .text(
          400,
          710,
          "Desktop Controls: Use left and right arrow keys\nto control the ball.\n\nMobile Controls: Touch left and right sides of the\nscreen to control the ball.\n\nSpring: Allows you to jump higher.\n\nJetpack: Gives you flying ability for a few seconds.\n\nProducts: Collect them to win extra points\nand rewards.\n\nMonsters: AVOID! You will lost the game if you\ncollide with them.",
          {
            fontFamily: "RakeslyRG",
            fontSize: "35px",
            color: "#000",
            align: "center",
            stroke: "#000",
            strokeThickness: 0,
          },
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(Infinity);
    }

    startGame() {
      this.cameras.main.fadeIn(300);
      this.variables();
      this.createAnimations();
      this.addBackground();
      this.addSounds();
      this.addScores();
      this.charecterSelection();
    }
    variables() {
      this.lastPipe = null;
      this.charecterSelectionDone = false;
      this.angels = ["angelSward", "angelArrow", "angelDistinct"];
      this.flames = this.physics.add.group();
      this.currentAngel = 0;
      this.power = this.currentAngel;
    }
    createAnimations() {
      const birdFrames = [];
      for (let i = 1; i <= 2; ++i) {
        birdFrames.push({ key: `b${i}` });
      }
      this.anims.create({
        key: "birdAnimation",
        frames: birdFrames,
        frameRate: 15,
        repeat: -1,
      });

      const bombFrames = [];
      for (let i = 1; i <= 1; ++i) {
        bombFrames.push({ key: `bb${i}` });
      }
      this.anims.create({
        key: "bombAnimation",
        frames: bombFrames,
        frameRate: 15,
        repeat: -1,
      });
    }
    addBackground() {
      this.gameBg = this.add
        .tileSprite(400, 750, 800 * 3.8, 1200 * 3.5, "background")
        .setDepth(2)
        .setScale(0.37);
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
      this.scoreText2.setScale();
      this.scoreText2.setVisible(false);
    }
    charecterSelection() {
      if (!this.charecterSelectionDone) {
        this.playerImg = this.physics.add
          .sprite(400, 600, this.angels[this.currentAngel])
          .setScale(0.45)
          .setDepth(4)
          .setCircle(32, 35, 30)
          .setAngle(0);

        this.tweens.add({
          targets: this.playerImg,
          y: "+=50",
          duration: 1000,
          ease: "Sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        this.title = this.physics.add
          .sprite(400, 200, "title")
          .setScale(1.15)
          .setDepth(2);

        this.leftArrow = this.add
          .text(100, 550, "<", {
            fontFamily: "MyLocalFont",
            stroke: "rgb(255, 255, 255)",
            fontSize: "80px",
            strokeThickness: 2,
          })
          .setDepth(3)
          .setScale(1, 2)
          .setInteractive({ useHandCursor: true });
        this.rightArrow = this.add
          .text(700, 550, ">", {
            fontFamily: "MyLocalFont",
            stroke: "rgb(255, 255, 255)",
            fontSize: "80px",
            strokeThickness: 2,
          })
          .setDepth(3)
          .setScale(1, 2)
          .setOrigin(1, 0)
          .setInteractive({ useHandCursor: true });
        this.arrowVisibility();

        this.leftArrow.on("pointerdown", () => {
          this.currentAngel--;
          this.arrowVisibility();
          if (this.currentAngel >= this.angels.length) {
            this.currentAngel = 0;
          }
          this.tweens.add({
            targets: this.playerImg,
            x: this.playerImg.x + 150,
            alpha: 0,
            duration: 200,
            ease: "Power2",
            onComplete: () => {
              this.playerImg.setTexture(this.angels[this.currentAngel]);
              this.playerImg.x -= 300;
              this.tweens.add({
                targets: this.playerImg,
                x: 400,
                alpha: 1,
                duration: 300,
                ease: "Power2",
              });
            },
          });
        });

        this.rightArrow.on("pointerdown", () => {
          this.currentAngel++;
          this.arrowVisibility();
          if (this.currentAngel >= this.angels.length) {
            this.currentAngel = 0;
          }
          this.tweens.add({
            targets: this.playerImg,
            x: this.playerImg.x - 150,
            alpha: 0,
            duration: 300,
            ease: "Power2",
            onComplete: () => {
              this.playerImg.setTexture(this.angels[this.currentAngel]);
              this.playerImg.x += 300;
              this.tweens.add({
                targets: this.playerImg,
                x: 400,
                alpha: 1,
                duration: 200,
                ease: "Power2",
              });
            },
          });
        });

        document.fonts.load("32px MyLocalFont").then(() => {
          this.playText = this.add
            .image(400, 1000, "playBtn", {
              fontFamily: "MyLocalFont",
              stroke: "#9d3303",
              fontSize: "60px",
              strokeThickness: 6,
            })
            .setOrigin(0.5)
            .setDepth(2)
            .setScale(1.2);
          this.playText.setInteractive({ useHandCursor: true });
          this.playText.on("pointerdown", () => {
            this.tweens.add({
              targets: [this.playText],
              scale: 0.8,
              duration: 100,

              onComplete: () => {
                this.tweens.add({
                  targets: [this.playText],
                  scale: 1,
                  duration: 100,
                  onComplete: () => {
                    this.start();
                    this.playText.destroy();
                    this.playerImg.destroy();
                    this.option1.destroy();
                    this.title.destroy();
                    this.leftArrow.destroy();
                    this.rightArrow.destroy();
                  },
                });
              },
            });
          });
        });

        this.option1 = this.add
          .image(400, 1150, "goToLeaderboard")
          .setDepth(5)
          .setScrollFactor(0)
          .setAlpha(1)
          .setScale(0.7);
        this.option1.setInteractive();
        this.option1.on("pointerdown", () => {
          this.tweens.add({
            targets: [this.option1],
            scale: 0.6,
            duration: 100,
            onComplete: () => {
              this.tweens.add({
                targets: [this.option1],
                scale: 0.7,
                duration: 100,
                onComplete: () => {
                  this.screen = "leaderboard";
                  this.scene.restart();
                },
              });
            },
          });
        });
      } else {
        this.start();
      }
    }

    arrowVisibility() {
      if (this.currentAngel == 0) {
        this.leftArrow.setAlpha(0);
      } else if (this.currentAngel == this.angels.length - 1) {
        this.rightArrow.setAlpha(0);
      }
      if (this.currentAngel < this.angels.length - 1) {
        this.rightArrow.setAlpha(1);
      }
      if (this.currentAngel > 0) {
        this.leftArrow.setAlpha(1);
      }
    }

    start() {
      this.cameras.main.fadeOut(300);
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
      this.player = this.physics.add
        .sprite(600, 450, this.angels[this.currentAngel])
        .setScale(0.25)
        .setDepth(5)
        .setSize(300, 600);
      this.player.speed = 200;

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
            this.player.y - 90,
            this.angels[this.currentAngel],
          )
          .setDepth(-1)
          .setSize(50, 50);
      } else if (this.power == 1) {
        if (!this.player.lost) {
          this.flameTimer = this.time.addEvent({
            delay: 700,
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
          this.flameTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
              let arrowFlame = this.physics.add
                .image(this.player.x + 40, this.player.y - 90, "distinctFlame")
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
        this.swardTip.y = this.player.y - 80;
      } else if (this.power == 1) {
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
        } else {
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

      // Colliders
      this.physics.add.collider(
        this.player,
        this.pipes,
        () => {
          this.pipes.setVelocity(0, 0);
          this.coins.setVelocity(0, 0);
          this.player.lost = true;
        },
        null,
        this,
      );
      this.physics.add.overlap(
        this.player,
        this.coins,
        () => {
          this.pipes.setVelocity(0, 0);
          this.coins.setVelocity(0, 0);
          this.player.lost = true;
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

      this.time.delayedCall(3000, this.spawn, [], this);
    }

    getRandomY() {
      return Phaser.Math.Between(200, 1050);
    }

    spawnPipes(x, y) {
      const monster = this.pipes
        .create(x, y, "monster")
        .setScale(0.4)
        .setDepth(4);
      monster.body
        .setSize(monster.width * 0.6, monster.height * 0.8)
        .setOffset(monster.width * 0.2, monster.height * 0.2);
      monster.life = 2;

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

    spawnCoin(x, y) {
      let y2 = this.getRandomY();
      let img = "stone";
      if (Math.floor(Math.random() * 10) > 5) {
        img = "star";
      }
      let coin = this.coins
        .create(x + 300, y2, img)
        .setScale(0.3)
        .setDepth(4);
      coin.body
        .setSize(coin.width * 0.5, coin.height * 0.6)
        .setOffset(coin.width * 0.25, coin.height * 0.2);
      this.time.addEvent({
        delay: 150,
        callback: () => {
          coin.toggleFlipX();
        },
        loop: true,
      });
      // .setDepth(-1);
      if (Math.random() < 0.5) {
        this.spawnObstacles1(x, y);
      } else {
        this.spawnObstacles2(x, y);
      }
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
      let x = monster.x;
      let y = monster.y;

      monster.destroy();

      console.log(x, y);

      this.spawnHearts(x, y);
    }

    spawnHearts(x, y) {
      let heartCount = 3;
      for (let i = 0; i < heartCount; i++) {
        let heart = this.hearts.create(x, y, `heart${i + 1}`);
        heart.setDepth(4);
        heart.setScale(0.3);
        heart.body
          .setSize(heart.width * 0.5, heart.height * 0.6)
          .setOffset(heart.width * 0.25, heart.height * 0.2);

        heart.setVelocity(
          Phaser.Math.Between(-100, 800),
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

        // overlap with player
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

    notify(code) {
      let message, x, y;

      if (code === 1) {
        message = "Enter your username!";

        x = 400;
        y = 100;
      } else if (code === 2) {
        message = "Invalid email!";

        x = 400;
        y = 100;
      } else if (code === 3) {
        message = "Username already taken!";

        x = 400;
        y = 100;
      } else if (code === 4) {
        message = "User removed sucessfully";

        x = 400;
        y = 40;
      } else if (code === 5) {
        message = "Code copied to clipboard";

        x = 400;
        y = 365;
      } else if (code === 6) {
        message = "Code copied to clipboard";

        x = 400;
        y = 890;
      }

      const notificationText = this.add
        .text(x, y, message, {
          fontFamily: "RakeslyRG",
          fontSize: "35px",
          color: "#f20071",
          align: "center",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setAlpha(1)
        .setDepth(Infinity);

      this.tweens.add({
        targets: notificationText,
        alpha: 1,
        duration: 200,

        onComplete: () => {
          this.time.addEvent({
            delay: 1000,

            callback: () => {
              this.tweens.add({
                targets: notificationText,
                alpha: 0,
                duration: 200,

                onComplete: () => {
                  notificationText.destroy();
                },
              });
            },
          });
        },
      });
    }

    addScoreToLeaderboard(username, score) {
      // Get current leaderboard from localStorage
      const leaderboardData = localStorage.getItem("axa-bird-game-leaderboard");
      let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

      // Check if username already exists
      const existingIndex = leaderboard.findIndex(
        (user) => user.username === username,
      );

      if (existingIndex !== -1) {
        // Update score only if new score is higher
        if (score > leaderboard[existingIndex].score) {
          leaderboard[existingIndex].score = score;
        }
      } else {
        // Add new entry
        leaderboard.push({ username, score });
      }

      // Sort by score descending
      leaderboard.sort((a, b) => b.score - a.score);

      // Save back to localStorage
      localStorage.setItem(
        "axa-bird-game-leaderboard",
        JSON.stringify(leaderboard),
      );
    }
    randomBetween(min, max) {
      return Phaser.Math.Between(min, max);
    }

    update() {
      if (this.playing) {
        this.gameBg.tilePositionX = this.cameras.main.scrollX;
        this.updateWapon();
        // this.bg.tilePositionX = this.cameras.main.scrollX * 0.2;
        this.updateScore();
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
          // this.cameraBound = 100;
          this.cameras.main.setBounds(this.cameraBound, 0, 1200, 0, true);
        }
      }
    }
    checkPlayerLost() {
      if (this.player && !this.player.lost) {
        if (this.player.y > 1200 || this.player.y < 0) {
          this.player.lost = true;
          this.player.setVelocity(0, 0);
          this.player.body.setGravityY(0);
        }
      }

      if (this.player && this.player.lost && !this.player.ended) {
        this.player.ended = true;
        this.player.setVelocity(0, 650);
        setTimeout(() => {
          this.player.body.setGravityY(0);
        }, 500);
        this.tweens.add({
          targets: this.player,
          angle: 100,
          duration: 100, // time to reach -30
          ease: "Sine.easeOut",
        });
        this.player.setVelocityX(0);
        this.sound.stopAll();

        if (this.soundOn) {
          this.explosionSound.play({
            rate: 1.5,
            volume: 0.7,
          });

          setTimeout(() => {
            // this.lostSound2.play();
          }, 200);
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

                // console.log(this.remember, this.score);

                this.screen = "restart";
                this.scene.restart();
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

  const game = new Phaser.Game({
    parent: "game",
    type: Phaser.AUTO,
    width: 800,
    height: 1400,
    border: 2,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
      createContainer: true,
    },
    input: {
      activePointers: 3,
    },
    scene: [Game],
  });

  window.oncontextmenu = (event) => {
    event.preventDefault();
  };

  console.warn = () => {
    return false;
  };
}
