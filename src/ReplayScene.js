export default class ReplayScene extends Phaser.Scene {
  constructor() {
    super({ key: "ReplayScene" });
  }

  init(data) {
    this.score = data.score || 0;
    this.tempHighScore = data.highScore || 0;
    this.selectedBackground = data.selectedBackground || "bg_3";
  }

  create() {
    // Use the selected background
    const bgKey = this.selectedBackground || "bg_3";
    this.background = this.add
      .image(400, 600, bgKey)
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(0);

    this.homeIcon = this.add
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
              this.scene.start("HomeScene");
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
      if (!this.playBtnClicked) {
        this.playBtnClicked = true;
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
                this.playBtnClicked = false;
                this.scene.start("HomeScene");
              },
            });
          },
        });
      }
    });
  }
}
