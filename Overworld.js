class Overworld {
  constructor(config){
    this.overworld = null;
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
  }

  gameLoopStepWork(delta){
    // Clear Off The Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Establish the camera person
    const cameraPerson = this.map.gameObjects.hero;

    // Update all objects
    Object.values(this.map.gameObjects)
      .sort((a, b) => a.y - b.y)
      .forEach(object => {
        object.update({
          delta,
          arrow: this.directionInput.direction,
          map: this.map
        });
      });

    // Draw Lower Layer
    this.map.drawLowerImage(this.ctx, cameraPerson);

    // Draw Game Objects
    Object.values(this.map.gameObjects).forEach(object => {
      object.sprite.draw(this.ctx, cameraPerson);
    });

    // Draw Upper Layer
    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  startGameLoop(){
    let previousMs;
    const step = 1 / 60;

    const stepFn = (timestampMs) => {
      if (this.map.isPaused){
        return;
      }

      if (previousMs === undefined){
        previousMs = timestampMs;
      }

      let delta = (timestampMs - previousMs) / 1000;

      while (delta >= step){
        this.gameLoopStepWork(delta);
        delta -= step;
      }

      previousMs = timestampMs - delta * 1000;

      // Business as usual tick
      requestAnimationFrame(stepFn);
    };

    // First kickoff tick
    requestAnimationFrame(stepFn);
  }

  bindActionInput(){
    new KeyPressListener("Enter", () => {
      // Is there any person to talk to?
      this.map.checkForActionCutscene();
    });

    new KeyPressListener("Escape", () => {
      if (!this.map.isCutscenePlaying){
        this.map.startCutscene([
          { type: "pause" }
        ]);
      }
    });
  }

  bindHeroPositionCheck(){
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero"){
        // Hero position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  initMobileControls() {
    let touchTimer = null;

    document.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();

      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const hero = this.map.gameObjects.hero;

      // Те же координаты камеры, что и в отрисовке
      const cameraX = utils.withGrid(10.5);
      const cameraY = utils.withGrid(6);

      // Перевод экрана в мировые координаты
      const worldX = hero.x + (x - cameraX);
      const worldY = hero.y + (y - cameraY);

      // Поиск объекта по хитбоксу
      const tappedObject = Object.values(this.map.gameObjects).find(obj => {
        if (obj === hero) return false;

        const hitboxWidth = 20;
        const hitboxHeight = 24;

        return (
          worldX >= obj.x - hitboxWidth / 2 &&
          worldX <= obj.x + hitboxWidth / 2 &&
          worldY >= obj.y - hitboxHeight &&
          worldY <= obj.y + 8
        );
      });

      // Если нажали на NPC / объект
      if (tappedObject) {
        const dx = tappedObject.x - hero.x;
        const dy = tappedObject.y - hero.y;

        if (Math.abs(dx) > Math.abs(dy)) {
          hero.direction = dx > 0 ? "right" : "left";
        } else {
          hero.direction = dy > 0 ? "down" : "up";
        }

        this.map.checkForActionCutscene();
        return;
      }

      // Движение относительно реальной позиции героя на экране
      const heroScreenX = cameraX;
      const heroScreenY = cameraY;

      const dx = x - heroScreenX;
      const dy = y - heroScreenY;

      let direction = null;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else {
        direction = dy > 0 ? "down" : "up";
      }

      this.directionInput.heldDirections = direction ? [direction] : [];

      touchTimer = setTimeout(() => {
        this.map.checkForActionCutscene();
      }, 400);
    });

    document.addEventListener("touchend", () => {
      this.directionInput.heldDirections = [];

      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
    });
  }

resizeGame() {
  const safeWidth = 370;
  const safeHeight = 265;

  const availableWidth = window.innerWidth - 24;
  const availableHeight = window.innerHeight - 24;

  const scaleX = availableWidth / safeWidth;
  const scaleY = availableHeight / safeHeight;

  let scale = Math.min(scaleX, scaleY);

  // Умеренный запас, без сильного ужатия
  if (window.innerWidth <= 900) {
    scale *= 1.10;
  }

  if (window.innerWidth <= 600) {
    scale *= 1;
  }

  if (window.innerWidth <= 420) {
    scale *= 0.99;
  }

  if (window.innerWidth <= 400) {
    scale *= 0.72;
  }

  document.documentElement.style.setProperty("--game-scale", scale);

  console.log("SAFE FIT", {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    scale
  });
}

  startMap(mapConfig, heroInitialState = null){
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;

    this.map.mountObjects();

    if (heroInitialState){
      const { hero } = this.map.gameObjects;

      hero.x = heroInitialState.x;
      hero.y = heroInitialState.y;
      hero.direction = heroInitialState.direction || "down";
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  }

  async init() {
    const container = document.querySelector(".game-container");

    // Create a new progress tracker
    this.progress = new Progress();

    // Show the title screen
    this.titleScreen = new TitleScreen({
      progress: this.progress
    });

    const useSaveFile = await this.titleScreen.init(container);

    // Potentially load saved data
    let heroInitialState = null;

    if (useSaveFile){
      this.progress.load();
      heroInitialState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection
      };
    }

    // Load the HUD
    this.hud = new Hud();
    this.hud.init(container);

    // Start the first map
    this.startMap(window.OverworldMaps[this.progress.mapId], heroInitialState);

    // Create controls
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.initMobileControls();

    this.resizeGame();
    window.addEventListener("resize", () => this.resizeGame());

    // Kick off the game
    this.startGameLoop();
  }
}