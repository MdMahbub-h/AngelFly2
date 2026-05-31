export default class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: "HomeScene" });
  }

  create() {
    this.configure();

    this.cameras.main.fadeIn(1000);

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

    this.variables();
    this.createAnimations();
    this.addBackground();
    this.addSounds();
    this.addScores();
    this.charecterSelection();
    this.addBackgroundSelector();
  }

  configure() {
    this.screen = "home";
    this.charecterSelectionDone = false;
    this.isBgTransitioning = false;
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

    // Load saved background preference
    this.selectedBackground =
      localStorage.getItem("selectedBackground") || "bg_3";
  }

  variables() {
    this.lastPipe = null;
    this.charecterSelectionDone = false;
    this.angels = ["a11", "a21", "a31"];
    this.angelAnimations = ["a1Animation", "a2Animation", "a3Animation"];
    this.angelFallAnimations = ["michaelDown", "gabrielDown", "raphaelDown"];
    this.flames = this.physics.add.group();
    this.currentAngel = 0;
    this.power = this.currentAngel;
    this.monsterCollide = false;
  }

  createAnimations() {
    const ANIMATIONS = {
      birdAnimation: { prefix: "b", frames: 2, fps: 15, repeat: -1 },
      a1Animation: { prefix: "a1", frames: 25, fps: 12, repeat: -1 },
      a2Animation: { prefix: "a2", frames: 28, fps: 12, repeat: -1 },
      a3Animation: { prefix: "a3", frames: 20, fps: 12, repeat: -1 },
      cloudAttack: {
        prefix: "cloudAttack",
        frames: 14,
        fps: 12,
        repeat: 0,
      },
      cloudReposo: {
        prefix: "cloudReposo",
        frames: 25,
        fps: 12,
        repeat: -1,
      },
      dove: { prefix: "dove", frames: 5, fps: 12, repeat: -1 },
      heart: { prefix: "heart", frames: 25, fps: 12, repeat: 0 },
      minotaurWalking: {
        prefix: "minotaurWalking",
        frames: 14,
        fps: 12,
        repeat: -1,
      },
      minotaurSmashing: {
        prefix: "minotaurSmashing",
        frames: 14,
        fps: 12,
        repeat: 0,
      },
      michaelAttack: {
        prefix: "michaelAttack",
        frames: 12,
        fps: 12,
        repeat: -1,
      },
      michaelDown: {
        prefix: "michaelDown",
        frames: 30,
        fps: 12,
        repeat: -1,
      },
      michaelLeft: {
        prefix: "michaelLeft",
        frames: 30,
        fps: 12,
        repeat: -1,
      },
      michaelRepose: {
        prefix: "michaelRepose",
        frames: 26,
        fps: 12,
        repeat: -1,
      },
      michaelRight: {
        prefix: "michaelRight",
        frames: 22,
        fps: 12,
        repeat: -1,
      },
      michaelUp: { prefix: "michaelUp", frames: 36, fps: 12, repeat: 0 },
      gabrielAttack: {
        prefix: "gabrielAttack",
        frames: 17,
        fps: 12,
        repeat: -1,
      },
      gabrielDown: {
        prefix: "gabrielDown",
        frames: 27,
        fps: 12,
        repeat: -1,
      },
      gabrielLeft: {
        prefix: "gabrielLeft",
        frames: 29,
        fps: 12,
        repeat: -1,
      },
      gabrielRepose: {
        prefix: "gabrielRepose",
        frames: 30,
        fps: 12,
        repeat: -1,
      },
      gabrielRight: {
        prefix: "gabrielRight",
        frames: 29,
        fps: 12,
        repeat: -1,
      },
      gabrielUp: { prefix: "gabrielUp", frames: 32, fps: 12, repeat: 0 },
      raphaelAttack: {
        prefix: "raphaelAttack",
        frames: 23,
        fps: 12,
        repeat: -1,
      },
      raphaelDown: {
        prefix: "raphaelDown",
        frames: 27,
        fps: 12,
        repeat: -1,
      },
      raphaelLeft: {
        prefix: "raphaelLeft",
        frames: 29,
        fps: 12,
        repeat: -1,
      },
      raphaelRepose: {
        prefix: "raphaelRepose",
        frames: 26,
        fps: 12,
        repeat: -1,
      },
      raphaelRight: {
        prefix: "raphaelRight",
        frames: 29,
        fps: 12,
        repeat: -1,
      },
      raphaelUp: { prefix: "raphaelUp", frames: 34, fps: 12, repeat: -1 },
      dragonAnimation: { prefix: "dragon", frames: 7, fps: 12, repeat: -1 },
      fireballAnimation: { prefix: "fireball", frames: 6, fps: 12, repeat: -1 },
      dragonAttack: { prefix: "dragonAttack", frames: 11, fps: 12, repeat: -1 },
      dragonFireball: {
        prefix: "dragonFireball",
        frames: 6,
        fps: 12,
        repeat: -1,
      },
    };

    Object.entries(ANIMATIONS).forEach(([key, cfg]) => {
      const frames = [];
      for (let i = 1; i <= cfg.frames; i++) {
        frames.push({ key: `${cfg.prefix}${i}` });
      }
      this.anims.create({
        key,
        frames,
        frameRate: cfg.fps,
        repeat: cfg.repeat,
      });
    });
  }

  addBackground() {
    // Use the selected background or default
    const bgKey = this.selectedBackground || "bg_3";
    this.gameBg = this.add
      .tileSprite(400, 700, 800, 1400, bgKey)
      .setDepth(2)
      .setAlpha(0.7);
    this.gameBg.setScrollFactor(0);
  }

  addBackgroundSelector() {
    // Background selection data
    this.backgrounds = [
      { key: "bg_3", name: "Blue" },
      { key: "bg_459", name: "Space" },
      { key: "bg_10713", name: "Nature" },
      { key: "bg_10714", name: "Sunset" },
      { key: "bg_13179", name: "Forest" },
      { key: "bg_47784", name: "Night" },
      { key: "bg_main", name: "Classic" },
    ];

    this.currentBgIndex = this.backgrounds.findIndex(
      (bg) => bg.key === this.selectedBackground,
    );
    if (this.currentBgIndex === -1) this.currentBgIndex = 0;

    // Background selector container
    const selectorY = 1200;
    const selectorHeight = 170;

    // Background selector background
    this.bgSelectorBg = this.add
      .graphics()
      .fillStyle(0x000000, 0.5)
      .fillRoundedRect(40, selectorY - 30, 720, selectorHeight, 15)
      .setDepth(3);

    // Title text
    this.add
      .text(400, selectorY, "Select Background", {
        fontFamily: "MyLocalFont",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(4);

    // Create background thumbnails
    this.bgThumbnails = [];
    this.bgBorders = [];
    const thumbWidth = 80;
    const thumbHeight = 80;
    const startX = 100;
    const spacing = 100;

    this.backgrounds.forEach((bg, index) => {
      const thumb = this.add
        .sprite(startX + index * spacing, selectorY + 70, bg.key)
        .setDisplaySize(thumbWidth, thumbHeight)
        .setDepth(4)
        .setInteractive({ useHandCursor: true });

      // Add selection border using graphics
      const border = this.add.graphics().setDepth(3);

      if (bg.key === this.selectedBackground) {
        border.lineStyle(3, 0xffd700, 1);
        border.strokeRoundedRect(
          startX + index * spacing - thumbWidth / 2 - 3,
          selectorY + 70 - thumbHeight / 2 - 3,
          thumbWidth + 6,
          thumbHeight + 6,
          5,
        );
      }

      thumb.on("pointerdown", () => {
        this.selectBackground(index);
      });

      this.bgThumbnails.push(thumb);
      this.bgBorders.push(border);
    });
  }

  selectBackground(index) {
    if (this.isBgTransitioning) return;
    if (index === this.currentBgIndex) return;

    this.isBgTransitioning = true;

    const selectedBg = this.backgrounds[index];
    const newKey = selectedBg.key;
    const direction = index > this.currentBgIndex ? 1 : -1; // 1: new from right, -1: new from left

    // Create new background sprite off-screen
    const startX = 400 + 800 * direction;
    const newBg = this.add
      .tileSprite(startX, 700, 800, 1400, newKey)
      .setDepth(3) // Above old bg
      .setAlpha(0);

    // Animate old bg out
    this.tweens.add({
      targets: this.gameBg,
      x: `-=${800 * direction}`,
      alpha: 0,
      duration: 500,
      ease: "Power2",
    });

    // Animate new bg in
    this.tweens.add({
      targets: newBg,
      x: 400,
      alpha: 0.7,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        // Replace old with new
        this.gameBg.destroy();
        this.gameBg = newBg;
        this.gameBg.setDepth(2); // Reset depth
        this.selectedBackground = newKey;
        this.currentBgIndex = index;

        // Save and update UI
        localStorage.setItem("selectedBackground", newKey);

        const thumbWidth = 80;
        const thumbHeight = 80;
        const startX = 100;
        const spacing = 100;
        const selectorY = 1220;

        this.bgBorders.forEach((border, i) => {
          border.clear();
          if (i === index) {
            border.lineStyle(3, 0xffd700, 1);
            border.strokeRoundedRect(
              startX + i * spacing - thumbWidth / 2 - 3,
              selectorY + 50 - thumbHeight / 2 - 3,
              thumbWidth + 6,
              thumbHeight + 6,
              5,
            );
          }
        });

        this.isBgTransitioning = false;
      },
    });
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

  charecterSelection() {
    if (this.charecterSelectionDone) {
      this.start();
      return;
    }

    this.angelNames = ["Michael", "Gabriel", "Raphael"];

    this.playerImg = this.physics.add
      .sprite(400, 550, this.angels[this.currentAngel])
      .setScale(0.55)
      .setDepth(4);
    this.playerImg.play(this.angelAnimations[this.currentAngel]);

    this.particles = this.add.particles(400, 600, "particle", {
      x: 0,
      y: 0,
      speed: { min: 3, max: 8 },
      angle: { min: 0, max: 180 },
      alpha: { start: 1, end: 0.2 },
      scale: { start: 0.3, end: 2.5 },
      lifespan: 1300,
      frequency: 80,
      blendMode: "ADD",
    });

    this.nameText = this.add
      .text(
        this.playerImg.x,
        this.playerImg.y + 300,
        this.angelNames[this.currentAngel],
        {
          fontFamily: "MyLocalFont",
          fontSize: "60px",
          color: "#ffffff",
          stroke: "#758500",
          strokeThickness: 5,
        },
      )
      .setOrigin(0.5)
      .setDepth(5);

    this.tweens.add({
      targets: [this.playerImg],
      y: "+=30",
      duration: 1000,
      ease: "Sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    this.title = this.physics.add
      .sprite(400, 200, "title")
      .setScale(1.15)
      .setDepth(5);

    this.leftArrow = this.add
      .text(50, 580, "<", {
        fontFamily: "MyLocalFont",
        stroke: "#ff4545",
        fontSize: "80px",
        strokeThickness: 2,
        fontStyle: "bold",
      })
      .setDepth(3)
      .setScale(1, 2.5)
      .setInteractive({ useHandCursor: true });

    this.rightArrow = this.add
      .text(750, 580, ">", {
        fontFamily: "MyLocalFont",
        stroke: "#ff4545",
        fontSize: "80px",
        strokeThickness: 2,
        fontStyle: "bold",
      })
      .setDepth(3)
      .setScale(1, 2.5)
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    this.arrowVisibility();

    this.leftArrow.on("pointerdown", () => {
      this.currentAngel--;
      if (this.currentAngel < 0) this.currentAngel = this.angels.length - 1;
      this.arrowVisibility();
      this.tweens.add({
        targets: [this.playerImg, this.nameText, this.particles],
        x: "+=150",
        alpha: 0,
        duration: 200,
        ease: "Power2",
        onComplete: () => {
          this.playerImg.setTexture(this.angels[this.currentAngel]);
          this.playerImg.play(this.angelAnimations[this.currentAngel]);
          this.nameText.setText(this.angelNames[this.currentAngel]);
          this.playerImg.x -= 300;
          this.nameText.x -= 300;
          this.particles.x -= 300;
          this.tweens.add({
            targets: [this.playerImg, this.nameText, this.particles],
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
      if (this.currentAngel >= this.angels.length) this.currentAngel = 0;
      this.arrowVisibility();
      this.tweens.add({
        targets: [this.playerImg, this.nameText, this.particles],
        x: "-=150",
        alpha: 0,
        duration: 200,
        ease: "Power2",
        onComplete: () => {
          this.playerImg.setTexture(this.angels[this.currentAngel]);
          this.playerImg.play(this.angelAnimations[this.currentAngel]);
          this.nameText.setText(this.angelNames[this.currentAngel]);
          this.playerImg.x += 300;
          this.nameText.x += 300;
          this.particles.x += 300;
          this.tweens.add({
            targets: [this.playerImg, this.nameText, this.particles],
            x: 400,
            alpha: 1,
            duration: 300,
            ease: "Power2",
          });
        },
      });
    });

    document.fonts.load("32px MyLocalFont").then(() => {
      this.playText = this.add
        .image(400, 1000, "playBtn")
        .setOrigin(0.5)
        .setDepth(5)
        .setScale(1)
        .setInteractive({ useHandCursor: true });

      this.playText.on("pointerdown", () => {
        if (this.playBtnClicked) return;
        this.playBtnClicked = true;
        this.tweens.add({
          targets: this.playText,
          scale: 0.8,
          duration: 100,
          onComplete: () => {
            this.tweens.add({
              targets: this.playText,
              scale: 1,
              duration: 100,
              onComplete: () => {
                this.start();
                this.playBtnClicked = false;
              },
            });
          },
        });
      });
    });

    this.option1 = this.add
      .image(400, 1100, "goToLeaderboard")
      .setDepth(5)
      .setScale(0.6)
      .setInteractive();

    this.option1.on("pointerdown", () => {
      if (this.playBtnClicked) return;
      this.playBtnClicked = true;
      this.tweens.add({
        targets: this.option1,
        scale: 0.6,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: this.option1,
            scale: 0.7,
            duration: 100,
            onComplete: () => {
              this.playBtnClicked = false;
              this.scene.start("LeaderboardScene");
            },
          });
        },
      });
    });
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

    // Pass the selected angel and background to the Game scene
    this.scene.start("Game", {
      currentAngel: this.currentAngel,
      score: this.score,
      highScore: this.highScore,
      soundOn: this.soundOn,
      selectedBackground: this.selectedBackground,
    });
  }
}
