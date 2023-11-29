const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 780,
  pixelArt: true,
  transparent: true,
  scene: {
    preload: preload,
    create: create,
    update: update, // Agregamos la función update para manejar la entrada del teclado
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
function preload() {
  this.load.image("background", "./assets/background.jpg");
}

function create() {
  const background = this.add.image(200, 350, "background");
  background.setScale(0.8);
  this.input.on(
    "pointerup",
    function (pointer) {
      // Iniciar la animación de fundido a negro
      this.cameras.main.fade(1000, 0, 0, 0, false, function (camera, progress) {
        if (progress === 1) {
          // Cambiar a la escena Scene2 después de que la animación de fundido a negro esté completa
          this.scene.start("GameMenu");
        }
      });
    },
    this
  );
}

function update() {}

class GameMenu extends Phaser.Scene {
  constructor() {
    super({ key: "GameMenu" });
  }

  preload() {
    this.load.image("gameMenu1", "./assets/gameMenu1.jpg");
  }

  create() {
    const gameMenu1 = this.add.image(200, 350, "gameMenu1");
    gameMenu1.setScale(0.8);

    this.input.on(
      "pointerup",
      function (pointer) {
        // Iniciar la animación de fundido a negro
        this.cameras.main.fade(
          1000,
          0,
          0,
          0,
          false,
          function (camera, progress) {
            if (progress === 1) {
              // Cambiar a la escena Scene2 después de que la animación de fundido a negro esté completa
              this.scene.start("GameNumberOne");
            }
          }
        );
      },
      this
    );
  }

  update() {
    // Puedes agregar lógica de actualización aquí si es necesario
  }
}

// Agrega la nueva escena al juego
game.scene.add("GameMenu", GameMenu);

class GameNumberOne extends Phaser.Scene {
  constructor() {
    super({ key: "GameNumberOne" });
    this.ship;
    this.evilShips;
    this.bullets;
  }

  preload() {
    this.load.image("backgroundMain", "./assets/backgroundMain.jpg");
    this.load.image("ship", "./assets/ship.png");
    this.load.image("evilShip", "./assets/evilShip.png");
    this.load.image("bullet", "./assets/bullet.png");
  }

  create() {
    // Fondo
    this.add.image(240, 320, "backgroundMain").setOrigin(0.5, 0.5);

    // Jugador
    this.ship = this.physics.add
      .sprite(240, 500, "ship")
      .setOrigin(0.5, 0.5)
      .setCollideWorldBounds(true);

    // Grupos
    this.evilShips = this.physics.add.group();
    this.bullets = this.physics.add.group();

    // Crear naves enemigas
    this.createEvilShips();

    // Configurar controles táctiles
    this.input.on("pointerup", this.handleTap, this);
  }

  update() {
    // Movimiento del jugador
    const speed = 5;
    if (this.input.activePointer.x < this.sys.game.config.width / 2) {
      this.ship.setVelocityX(-speed * 60);
    } else {
      this.ship.setVelocityX(speed * 60);
    }

    // Colisiones
    this.physics.overlap(
      this.ship,
      this.evilShips,
      this.handleCollision,
      null,
      this
    );
    this.physics.overlap(
      this.bullets,
      this.evilShips,
      this.handleBulletEvilShipCollision,
      null,
      this
    );

    // Verificar si no hay naves enemigas y cambiar de escena
    if (this.evilShips.countActive() === 0) {
      this.scene.start("GameMenu2");
    }
  }

  createEvilShips() {
    // Crear filas de naves enemigas
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const evilShip = this.physics.add
          .sprite(50 + j * 70, 50 + i * 50, "evilShip")
          .setOrigin(0.5, 0.5);

        // Ajustar el tamaño de la nave enemiga
        evilShip.setScale(0.5); // Puedes ajustar el valor según tus necesidades

        this.evilShips.add(evilShip);
      }
    }

    // Configurar movimiento de las naves enemigas
    this.tweens.add({
      targets: this.evilShips.getChildren(),
      x: "+=10",
      y: "+=0",
      ease: "Linear",
      duration: 1000,
      repeat: -1,
      yoyo: true,
    });
  }

  handleTap(pointer) {
    // Disparar
    const bullet = this.physics.add
      .sprite(this.ship.x, this.ship.y - 20, "bullet")
      .setOrigin(0.5, 0.5);
    this.bullets.add(bullet);

    // Configurar la gravedad de la bala a false
    bullet.body.setVelocityY(-300);
    bullet.body.setAllowGravity(false);
  }

  handleCollision(ship, evilShip) {
    // Reiniciar posición del jugador y naves enemigas al colisionar
    this.ship.setPosition(240, 500);
    this.evilShips.children.iterate((child) => {
      child.y += 20;
    });
  }

  handleBulletEvilShipCollision(bullet, evilShip) {
    // Eliminar bala y nave enemiga al colisionar
    bullet.destroy();
    evilShip.destroy();
  }
}
game.scene.add("GameNumberOne", GameNumberOne);

class GameMenu2 extends Phaser.Scene {
  constructor() {
    super({ key: "GameMenu2" });
  }
  preload() {
    this.load.image("GameMenu2", "./assets/GameMenu2.jpg");
  }
  create() {
    const GameMenu2 = this.add.image(200, 350, "GameMenu2");
    GameMenu2.setScale(0.8);

    this.input.on(
      "pointerup",
      function (pointer) {
        // Iniciar la animación de fundido a negro
        this.cameras.main.fade(
          1000,
          0,
          0,
          0,
          false,
          function (camera, progress) {
            if (progress === 1) {
              // Cambiar a la escena Scene2 después de que la animación de fundido a negro esté completa
              this.scene.start("GameNumberTwo");
            }
          }
        );
      },
      this
    );
  }
}

game.scene.add("GameMenu2", GameMenu2);
//this.load.image("obstacle1", "./assets/obstacle.png");
//  this.load.image("obstacle2", "./assets/cactuses_small_1.png");

class GameNumberTwo extends Phaser.Scene {
  constructor() {
    super({ key: "GameNumberTwo" });
    this.player;
    this.obstacles;
    this.floor;
    this.obstaclesJumped = 0; // Nuevo contador
    this.obstaclesJumpedText; // Texto para mostrar el contador
  }

  preload() {
    // Carga de imágenes para el fondo, el jugador y los obstáculos
    this.load.image("backgroundMain", "./assets/backgroundMain.jpg");
    this.load.image("player", "./assets/player.png");
    this.load.image("obstacle", "./assets/cactuses_small_1.png");
    this.load.image("floor", "./assets/floor.png"); // Nuevo asset para el suelo
    this.load.image("realFloor", "./assets/realFloor.png");
    this.load.image("evilShipObstacle", "./assets/evilShipObstacle.png");
  }

  create() {
    // Fondo
    this.add.image(0, 0, "backgroundMain").setOrigin(0, 0);

    //counter
    this.obstaclesJumpedText = this.add.text(20, 130, "0/20", {
      fontSize: "30px",
      fill: "#fff",
    });

    // Suelo
    this.floor = this.physics.add
      .sprite(
        this.sys.game.config.width / 2,
        this.sys.game.config.height - 60,
        "floor"
      )
      .setOrigin(0.5, 1);
    this.floor.setImmovable(true); // Hacer el suelo estático
    this.floor.body.allowGravity = false;

    //real Floor
    const realFloor = this.add.image(200, 620, "realFloor");
    realFloor.setScale(0.5);

    // Jugador
    this.player = this.physics.add
      .sprite(50, this.sys.game.config.height - 340, "player")
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true);
    this.player.setGravityY(300);

    // Obstáculos
    this.obstacles = this.physics.add.group();

    // Configurar controles táctiles
    this.input.on("pointerup", this.handleTap, this);

    // Crear obstáculos de forma continua
    this.time.addEvent({
      delay: 1500, // Intervalo entre la creación de obstáculos en milisegundos
      callback: this.createObstacle,
      callbackScope: this,
      loop: true,
    });

    // Colisiones
    this.physics.add.collider(this.player, this.floor); // Colisión con el suelo
    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.handleCollision,
      null,
      this
    );
  }

  update() {
    // Mover automáticamente al jugador hacia la izquierda
    this.player.setVelocityX(-200);
  }

  handleTap(pointer) {
    // Salto del jugador al tocar la pantalla y estando en contacto con el suelo
    if (this.player.body.onFloor()) {
      this.player.setVelocityY(-500);
      this.obstaclesJumped++;

      if (this.obstaclesJumped === 20) {
        this.cameras.main.fade(
          1000,
          0,
          0,
          0,
          false,
          function (camera, progress) {
            if (progress === 1) {
              // Cambiar a la escena Scene2 después de que la animación de fundido a negro esté completa
              this.scene.start("GameMenu3");
            }
          }
        );
      }

      this.obstaclesJumpedText.setText(this.obstaclesJumped + "/20");
    }
  }

  createObstacle() {
    // Elegir aleatoriamente entre los dos tipos de obstáculos
    const obstacleType = Phaser.Math.RND.pick(["obstacle", "evilShipObstacle"]);

    // Crear obstáculo en el lado derecho de la pantalla
    const obstacle = this.obstacles
      .create(this.sys.game.config.width + 50, 500, obstacleType)
      .setOrigin(0.5, 0.5);
    obstacle.body.allowGravity = false;

    // Configurar velocidad del obstáculo
    obstacle.setVelocityX(-200);

    // Eliminar el obstáculo cuando está fuera de la pantalla
    obstacle.checkWorldBounds = true;
    obstacle.outOfBoundsKill = true;
  }

  handleCollision(player, obstacle) {
    // Reiniciar el juego al colisionar con un obstáculo
    this.obstaclesJumped = 0;
    this.scene.restart();
  }
}

game.scene.add("GameNumberTwo", GameNumberTwo);

class GameMenu3 extends Phaser.Scene {
  constructor() {
    super({ key: "GameMenu3" });
  }

  preload() {
    this.load.image("backgrounGameMenu3", "./assets/gameMenu3.jpg");
  }
  create() {
    const background = this.add.image(200, 350, "backgrounGameMenu3");
    background.setScale(0.8);

    this.input.on(
      "pointerup",
      function (pointer) {
        // Iniciar la animación de fundido a negro
        this.cameras.main.fade(
          1000,
          0,
          0,
          0,
          false,
          function (camera, progress) {
            if (progress === 1) {
              // Cambiar a la escena Scene2 después de que la animación de fundido a negro esté completa
              this.scene.start("GameNumberThree");
            }
          }
        );
      },
      this
    );
  }
}

game.scene.add("GameMenu3", GameMenu3);

class GameNumberThree extends Phaser.Scene {
  constructor() {
    super({ key: "GameNumberThree" });
  }

  preload() {
    this.load.image("backgroundNumberThree", "./assets/backgroundMain.jpg");
    this.load.image("backCard", "./assets/backCard.png");
    this.load.image("card1", "./assets/card1.png");
    this.load.image("card2", "./assets/card2.png");
    this.load.image("card3", "./assets/card3.png");
    this.load.image("card4", "./assets/card4.png");
    this.load.image("card5", "./assets/card5.png");
    this.load.image("card6", "./assets/card6.png");
    this.load.image("card7", "./assets/card7.png");
    this.load.image("card8", "./assets/card8.png");
  }

  create() {
    const background = this.add.image(200, 350, "backgroundNumberThree");
    background.setScale(0.8);

    const cardCount = 16; // Cambia a 16 para tener 8 pares
    const columns = 4;
    const rows = 4;

    const cardWidth = 100;
    const cardHeight = 150;
    const scale = 0.9; // Ajusta este valor para cambiar el tamaño de las cartas

    this.cards = this.physics.add.staticGroup();
    this.flippedCards = [];

    const textureIndices = Array.from(
      { length: cardCount / 2 },
      (_, i) => i + 1
    );

    // Duplica los índices para tener pares de cartas
    const allTextureIndices = [...textureIndices, ...textureIndices];

    // Baraja los índices para asignar aleatoriamente las texturas a las cartas
    Phaser.Utils.Array.Shuffle(allTextureIndices);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const card = this.cards.create(
          col * (cardWidth * scale + 10) + 50, // Ajusta el espaciado y la posición inicial según tus necesidades
          row * (cardHeight * scale + 10) + 50,
          "backCard"
        );

        card.setScale(scale);
        card.setInteractive();
        card.setDataEnabled();
        card.data.set("id", index);
        card.data.set("face_up", false);
      }
    }

    // Voltea las cartas después de un breve retraso para que estén boca arriba al principio
    this.time.delayedCall(1000, () => {
      this.cards.children.iterate((card) => {
        card.setTexture("backCard");
      });
    });

    this.input.on("gameobjectdown", this.handleCardClick, this);
  }

  handleCardClick(pointer, card) {
    const id = card.data.get("id");

    if (!card.data.get("face_up")) {
      card.setTexture("card" + ((id % 8) + 1));
      card.setData("face_up", true);
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        this.time.delayedCall(500, this.checkMatch, [], this);
      }
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.texture.key === card2.texture.key) {
      // Las cartas coinciden, desaparecen
      this.flippedCards.forEach((card) => card.destroy());
    } else {
      // Las cartas no coinciden, se vuelven a dar vuelta
      this.flippedCards.forEach((card) => {
        card.setTexture("backCard");
        card.setData("face_up", false);
      });
    }

    this.flippedCards = [];

    // Verificar si todas las cartas han desaparecido
    if (this.cards.countActive() === 0) {
      // Todas las cartas han desaparecido, cambia a la escena FinalScene
      this.cameras.main.fade(1000, 0, 0, 0, false, function (camera, progress) {
        if (progress === 1) {
          // Cambiar a la escena Scene2 después de que la animación de fundido a negro esté completa
          this.scene.start("FinalScene");
        }
      });
    }
  }
}

game.scene.add("GameNumberThree", GameNumberThree);

class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: "FinalScene" });
  }

  preload() {
    this.load.image("backgroundFinal", "./assets/backgroundFinal.jpg");
    this.load.image("clueBox", "./assets/clueBox.png");
    this.load.image("clueBoxComplete", "./assets/clueBoxComplete.png");
    this.load.spritesheet("spinner", "./assets/spinner.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const background = this.add.image(200, 350, "backgroundFinal");
    background.setScale(0.8);

    const clueBox = this.add.image(200, 560, "clueBox");

    // Agrega un temporizador para esperar 4 segundos antes de cambiar la imagen
    this.time.delayedCall(4000, () => {
      // Oculta el spinner si se ha creado
      if (spinner) {
        spinner.destroy();
      }

      // Cambia la imagen de clueBox a clueBoxComplete
      clueBox.setTexture("clueBoxComplete");
    });

    // Muestra un spinner mientras se espera
    const spinner = this.add.sprite(200, 550, "spinner");
    spinner.setScale(2); // Ajusta el tamaño según tus preferencias
    spinner.play({ key: "spin", repeat: -1 });
  }
}

game.scene.add("FinalScene", FinalScene);
