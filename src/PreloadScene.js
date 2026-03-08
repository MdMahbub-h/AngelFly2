export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Show loading text
    this.add
      .text(400, 680, "Loading...", {
        fontFamily: "MyLocalFont",
        fontSize: "50px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Create loading bar background
    const barWidth = 500;
    const barHeight = 50;
    const barX = (800 - barWidth) / 2;
    const barY = 730;

    // Background bar
    this.loadingBarBg = this.add.graphics();
    this.loadingBarBg.fillStyle(0x222222, 1);
    this.loadingBarBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);
    // Stroke border
    this.loadingBarBg.lineStyle(4, 0xffffff, 1);
    this.loadingBarBg.strokeRoundedRect(barX, barY, barWidth, barHeight, 10);
    this.loadingBarBg.setDepth(1);

    // Progress bar (initially width 0)
    this.loadingBar = this.add.graphics();
    this.loadingBar.setDepth(2);

    // Loading percentage text
    this.loadingText = this.add
      .text(400, barY + barHeight / 2, "0%", {
        fontFamily: "MyLocalFont",
        fontSize: "30px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(3);

    // Track loading progress
    this.load.on("progress", (value) => {
      const percent = Math.floor(value * 100);
      this.loadingText.setText(percent + "%");

      // Update progress bar
      this.loadingBar.clear();
      this.loadingBar.fillStyle(0xce0000, 1);
      this.loadingBar.fillRoundedRect(
        barX + 2,
        barY + 2,
        barWidth * value - 4,
        barHeight - 4,
        10,
      );
    });

    // Load all assets
    this.loadAssets();
  }

  loadAssets() {
    // Backgrounds
    const backgrounds = [
      { key: "bg_3", path: "assets/backgrounds/background3.jpg" },
      { key: "bg_459", path: "assets/backgrounds/459.jpg" },
      { key: "bg_10713", path: "assets/backgrounds/10713.jpg" },
      { key: "bg_10714", path: "assets/backgrounds/10714.jpg" },
      { key: "bg_13179", path: "assets/backgrounds/13179.jpg" },
      { key: "bg_47784", path: "assets/backgrounds/47784.jpg" },
      { key: "bg_main", path: "assets/backgrounds/background.jpg" },
    ];

    // Load all backgrounds
    backgrounds.forEach((bg) => {
      this.load.image(bg.key, bg.path);
    });

    // Load images
    const imageSources = {
      background2: "assets/backgrounds/background3.jpg",
      heart1: "assets/angel/heart1.png",
      heart2: "assets/angel/heart2.png",
      heart3: "assets/angel/heart3.png",
      locket: "assets/angel/locket.png",
      home: "assets/UI/home-icon.png",
      arrowFlame: "assets/angel/arrowFlame.png",
      distinctFlame: "assets/angel/distinctFlame.png",
      addToLeaderboard: "assets/flappyBird/add-to-leaderboard.png",
      goToLeaderboard: "assets/flappyBird/go-to-leaderboard.png",
      leaderboardIcon: "assets/UI/leaderboard-icon.png",
      restart: "assets/flappyBird/restart.png",
      title: "assets/flappyBird/title.png",
      playBtn: "assets/UI/playBtn.png",
    };

    // Character selectors
    for (let i = 1; i <= 25; i++) {
      imageSources[`a1${i}`] =
        `assets/angel/characterSelector/michael/a_(${i}).png`;
    }
    for (let i = 1; i <= 25; i++) {
      imageSources[`a2${i}`] =
        `assets/angel/characterSelector/gabriel/b_(${i}).png`;
    }
    for (let i = 1; i <= 20; i++) {
      imageSources[`a3${i}`] =
        `assets/angel/characterSelector/raphael/c_(${i}).png`;
    }

    // Cloud animations
    for (let i = 1; i <= 14; i++) {
      imageSources[`cloudAttack${i}`] =
        `assets/angel/cloud/attack/a_(${i}).png`;
    }
    for (let i = 1; i <= 25; i++) {
      imageSources[`cloudReposo${i}`] =
        `assets/angel/cloud/reposo/a_(${i}).png`;
    }

    // Dove and heart
    for (let i = 1; i <= 5; i++) {
      imageSources[`dove${i}`] = `assets/angel/dove/a_(${i}).png`;
    }
    for (let i = 1; i <= 25; i++) {
      imageSources[`heart${i}`] = `assets/angel/heart/a_(${i}).png`;
    }

    // Minotaur
    for (let i = 1; i <= 14; i++) {
      imageSources[`minotaurWalking${i}`] =
        `assets/angel/walkingMinotaur/a_(${i}).png`;
    }
    for (let i = 1; i <= 14; i++) {
      imageSources[`minotaurSmashing${i}`] =
        `assets/angel/smashingMinotaur/a_(${i}).png`;
    }

    // Michael movements
    for (let i = 1; i <= 12; i++) {
      imageSources[`michaelAttack${i}`] =
        `assets/angel/michaelMovements/attack/a_(${i}).png`;
    }
    for (let i = 1; i <= 30; i++) {
      imageSources[`michaelDown${i}`] =
        `assets/angel/michaelMovements/down/a_(${i}).png`;
    }
    for (let i = 1; i <= 30; i++) {
      imageSources[`michaelLeft${i}`] =
        `assets/angel/michaelMovements/left/a_(${i}).png`;
    }
    for (let i = 1; i <= 26; i++) {
      imageSources[`michaelRepose${i}`] =
        `assets/angel/michaelMovements/repose/a_(${i}).png`;
    }
    for (let i = 1; i <= 22; i++) {
      imageSources[`michaelRight${i}`] =
        `assets/angel/michaelMovements/rigth/a_(${i}).png`;
    }
    for (let i = 1; i <= 36; i++) {
      imageSources[`michaelUp${i}`] =
        `assets/angel/michaelMovements/up/a_(${i}).png`;
    }

    // Gabriel movements
    for (let i = 1; i <= 17; i++) {
      imageSources[`gabrielAttack${i}`] =
        `assets/angel/gabrielMovements/attack/a_(${i}).png`;
    }
    for (let i = 1; i <= 27; i++) {
      imageSources[`gabrielDown${i}`] =
        `assets/angel/gabrielMovements/down/a_(${i}).png`;
    }
    for (let i = 1; i <= 29; i++) {
      imageSources[`gabrielLeft${i}`] =
        `assets/angel/gabrielMovements/left/a_(${i}).png`;
    }
    for (let i = 1; i <= 30; i++) {
      imageSources[`gabrielRepose${i}`] =
        `assets/angel/gabrielMovements/repose/a_(${i}).png`;
    }
    for (let i = 1; i <= 29; i++) {
      imageSources[`gabrielRight${i}`] =
        `assets/angel/gabrielMovements/right/a_(${i}).png`;
    }
    for (let i = 1; i <= 32; i++) {
      imageSources[`gabrielUp${i}`] =
        `assets/angel/gabrielMovements/up/a_(${i}).png`;
    }

    // Raphael movements
    for (let i = 1; i <= 23; i++) {
      imageSources[`raphaelAttack${i}`] =
        `assets/angel/raphaelMovements/attack/a_(${i}).png`;
    }
    for (let i = 1; i <= 27; i++) {
      imageSources[`raphaelDown${i}`] =
        `assets/angel/raphaelMovements/down/a_(${i}).png`;
    }
    for (let i = 1; i <= 29; i++) {
      imageSources[`raphaelLeft${i}`] =
        `assets/angel/raphaelMovements/left/a_(${i}).png`;
    }
    for (let i = 1; i <= 26; i++) {
      imageSources[`raphaelRepose${i}`] =
        `assets/angel/raphaelMovements/repose/a_(${i}).png`;
    }
    for (let i = 1; i <= 29; i++) {
      imageSources[`raphaelRight${i}`] =
        `assets/angel/raphaelMovements/rigth/a_(${i}).png`;
    }
    for (let i = 1; i <= 34; i++) {
      imageSources[`raphaelUp${i}`] =
        `assets/angel/raphaelMovements/up/a_(${i}).png`;
    }

    // Dragon attack animation (11 frames)
    for (let i = 0; i < 11; i++) {
      const frameNum = i.toString().padStart(5, "0");
      imageSources[`dragonAttack${i + 1}`] =
        `assets/angel/attack/dragon attack_${frameNum}.png`;
    }

    // Dragon fireball animation (6 frames)
    for (let i = 0; i < 6; i++) {
      const frameNum = i.toString().padStart(5, "0");
      imageSources[`dragonFireball${i + 1}`] =
        `assets/angel/fire ball/cometa de fuego_${frameNum}.png`;
    }

    // Load all images
    for (const key in imageSources) {
      this.load.image(key, imageSources[key]);
    }

    // Load audio
    const audioSources = {
      jump: "assets/sounds/jump.mp3",
      lost: "assets/sounds/lost.mp3",
      enemy: "assets/sounds/enemy.mp3",
      product: "assets/sounds/product.mp3",
      woosh: "assets/sounds/Woosh.mp3",
      explosion: "assets/sounds/explosion.mp3",
    };

    for (const key in audioSources) {
      this.load.audio(key, audioSources[key]);
    }

    // Load video
    this.load.video(
      "UIBackground",
      "assets/backgrounds/background1.mp4",
      "loadeddata",
      false,
      true,
    );
  }

  create() {
    // Hide the HTML loader
    const loader = document.querySelector("#loader");
    if (loader) {
      loader.style.display = "none";
    }

    // Transition to Game scene
    this.cameras.main.fadeOut(500);
    this.time.delayedCall(500, () => {
      this.scene.start("HomeScene");
    });
  }
}
