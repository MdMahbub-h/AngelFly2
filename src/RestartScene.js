export default class RestartScene extends Phaser.Scene {
  constructor() {
    super({ key: "RestartScene" });
  }

  init(data) {
    this.score = data.score || 0;
    this.highScore = data.highScore || 0;
    this.selectedBackground = data.selectedBackground || "bg_3";
  }

  create() {
    // Use the selected background
    const bgKey = this.selectedBackground || "bg_3";
    this.UIBackground2 = this.add.image(400, 700, bgKey).setScale(1.4);

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
    this.usernameInput = this.add
      .dom(400, 960)
      .createElement(
        "input",
        `outline: none; border: none; padding: 0px 30px; width: 440px; height: 70px; font-size: 30px; font-weight: bold; background: #ebf4f5; border-radius: 0px; stroke: 6px solid #d95300`,
      );

    this.usernameInput.node.setAttribute("placeholder", "Name");
    this.usernameInput.node.setAttribute("maxLength", "15");

    this.option1 = this.add
      .image(400, 1060, "addToLeaderboard")
      .setDepth(5)
      .setScrollFactor(0)
      .setAlpha(1)
      .setScale(0.65);
    this.option1.setInteractive();

    this.option1Text = this.add
      .text(400, 840, "OR", {
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
      if (!this.playBtnClicked) {
        this.playBtnClicked = true;
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
                this.playBtnClicked = false;
                const username = this.usernameInput.node.value.trim();
                if (username === "") {
                  this.notify(1);
                  return;
                }
                if (this.score > 0) {
                  this.addScoreToLeaderboard(username, this.score);
                }
                this.scene.start("LeaderboardScene", {
                  score: this.score,
                  highScore: this.highScore,
                  selectedBackground: this.selectedBackground,
                });
              },
            });
          },
        });
      }
    });

    this.option2.on("pointerdown", () => {
      if (!this.playBtnClicked) {
        this.playBtnClicked = true;
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
                this.playBtnClicked = false;
                this.scene.start("HomeScene");
              },
            });
          },
        });
      }
    });

    this.termsText = this.add
      .text(
        400,
        1330,
        "Developed by Md Mahabub. By playing this game\nyou accept these Terms & policies.",
        {
          fontFamily: "RakeslyRG",
          fontSize: "20px",
          color: "#252525",
          align: "center",
        },
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
  }

  notify(code) {
    let message, x, y;

    if (code === 1) {
      message = "Enter your username!";
      x = 400;
      y = 100;
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
    const leaderboardData = localStorage.getItem("axa-bird-game-leaderboard");
    let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : [];

    const existingIndex = leaderboard.findIndex(
      (user) => user.username === username,
    );

    if (existingIndex !== -1) {
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = score;
      }
    } else {
      leaderboard.push({ username, score });
    }

    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem(
      "axa-bird-game-leaderboard",
      JSON.stringify(leaderboard),
    );
  }
}
