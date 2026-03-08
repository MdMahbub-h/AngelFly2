export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: "LeaderboardScene" });
  }

  init(data) {
    this.score = data?.score || 0;
    this.highScore = data?.highScore || 0;
    this.selectedBackground = data?.selectedBackground || "bg_3";
  }

  create() {
    // Use the selected background
    const bgKey = this.selectedBackground || "bg_3";
    this.background = this.add
      .image(400, 700, bgKey)
      .setScale(1.4)
      .setScrollFactor(0)
      .setDepth(0)
      .setAlpha(0.8);

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
              this.scene.start("HomeScene");
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
            ${index < 3 ? `<img class="scoreImage" src="assets/positions/${index + 1}.png"/>` : `<div class="scoreText"> ${index + 1}. </div>`}
          </div>
          <div class="${user.username === this.username ? "scoreTitlePlus" : "scoreTitle"}">
            ${user.username}
          </div>
          <div class="${user.username === this.username ? "scoreValuePlus" : "scoreValue"}">
            ${user.score}
          </div>
        </div>
      `;
    });
  }
}
