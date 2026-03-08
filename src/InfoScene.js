export default class InfoScene extends Phaser.Scene {
  constructor() {
    super({ key: "InfoScene" });
  }

  create() {
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
              this.scene.start("HomeScene");
            },
          });
        },
      });
    });

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
}
