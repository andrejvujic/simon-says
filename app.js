var blocks = [];

document.addEventListener("DOMContentLoaded", (e) => {
  let all_blocks = document.getElementsByClassName("block");

  for (let block of all_blocks) {
    blocks.push(new Block(block));
  }
  set_colors();

  let restart_button = document.getElementsByClassName("restart-button")[0];
  restart_button.addEventListener("click", () => {
    location.reload();
  });

  let start_button = document.getElementsByClassName("start-button")[0];
  start_button.addEventListener("click", (e) => {
    let target = e.target;

    target.classList.add("no-click");
    target.classList.add("no-display");
    document
      .getElementsByClassName("computer-turn")[0]
      .classList.remove("no-display");

    moves.add_new();
    moves.play();
  });
  moves = new Moves();

  user_moves = new UserMoves();
  score = new Score();
});

set_colors = () => {
  let colors = ["gold", "blue", "red", "green"];
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].set_color(colors[i]);
  }
};

Score = function () {
  this.current = 0;
  this.dom = document.getElementsByClassName("score")[0];

  this.update = () => {
    this.current++;
    this.dom.innerText = `Score: ${this.current}`;
  };
};

Moves = function () {
  this.list = [];

  this.add_new = () => {
    this.list.push(blocks[Math.floor(Math.random() * (blocks.length + 1))]);
  };

  this.play = () => {
    for (let i = 0; i < this.list.length; i++) {
      setTimeout(() => {
        this.list[i].animate();
      }, 1500 * i);

      setTimeout(() => {
        user_moves.add_listeners();
      }, 1500 * this.list.length);
    }
  };
};

UserMoves = function () {
  this.list = [];
  this.clicks = 0;

  this.add_listeners = () => {
    document
      .getElementsByClassName("your-turn")[0]
      .classList.remove("no-display");
    document
      .getElementsByClassName("computer-turn")[0]
      .classList.add("no-display");
    for (let block of blocks) {
      block.dom.addEventListener("click", block.clicked);
    }
  };

  this.remove_listeners = () => {
    document.getElementsByClassName("your-turn")[0].classList.add("no-display");
    document
      .getElementsByClassName("computer-turn")[0]
      .classList.remove("no-display");
    for (let block of blocks) {
      block.dom.removeEventListener("click", block.clicked);
    }

    this.list = [];
    this.clicks = 0;
    moves.add_new();
    moves.play();
  };

  this.disable_clicks = () => {
    for (let block of blocks) {
      block.dom.classList.add("no-click");
    }
  };
};

Block = function (element) {
  this.dom = element;
  this.animation_duration = 1000;
  this.set_color = (color) => {
    this.color = color;
    this.dom.style.background = color;
  };

  this.animate = () => {
    this.dom.style.animation = `blink ${this.animation_duration}ms 1`;
    setTimeout(() => {
      this.remove_animation();
    }, this.animation_duration);
  };

  this.remove_animation = () => {
    this.dom.style.animation = "";
  };

  this.fadeout = () => {
    this.dom.style.opacity = "0.5";
  };

  this.clicked = () => {
    this.animate();
    user_moves.clicks++;
    user_moves.list.push(this);

    if (
      user_moves.list[user_moves.clicks - 1] ==
      moves.list[user_moves.clicks - 1]
    ) {
      if (user_moves.clicks == moves.list.length) {
        this.correct_click();
      }
    } else {
      this.incorrect_click();
    }
  };

  this.correct_click = () => {
    setTimeout(() => {
      user_moves.remove_listeners();
    }, 2500);
    score.update();
  };

  this.incorrect_click = () => {
    this.remove_animation();
    user_moves.disable_clicks();
    for (let block of blocks) {
      block.fadeout();
    }
    document
      .getElementsByClassName("lost-game")[0]
      .classList.toggle("no-display");
    document.getElementsByClassName("your-turn")[0].classList.add("no-display");
    document
      .getElementsByClassName("computer-turn")[0]
      .classList.add("no-display");
  };
};
