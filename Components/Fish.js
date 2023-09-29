class Fish {
  tailFlappingSpeed;
  #tailFlappingSpeedScale;

  #bodyColor = vec4(1, 0, 0, 1);
  #headColor = vec4(0.5, 0.5, 0.5, 1);
  #eyeColor = vec4(0, 0, 0, 1);
  #pupilColor = vec4(1, 1, 1, 1);

  constructor({ tailFlappingSpeed }) {
    this.tailFlappingSpeed = tailFlappingSpeed;
    this.#tailFlappingSpeedScale = tailFlappingSpeed / 250;
  }

  draw(dt, timestamp) {
    gPush();
    this.#drawBody(timestamp);
    gPop();
  }

  #drawBody(timestamp) {
    {
      gPush();
      gTranslate(0, 0, -1);
      gRotate(180, 1, 0, 0);
      gScale(1, 1, 3);
      setColor(this.#bodyColor);
      drawCone();
      gPop();
    }
    {
      gPush();
      this.#drawHead();
      gPop();
    }
    {
      gPush();
      gTranslate(0, 0, -2);
      gRotate(180, 0, 1, 0);
      gScale(0.5, 0.5, 0.5);
      this.#drawTail(timestamp);
      gPop();
    }
  }

  #drawHead() {
    gTranslate(0, 0, 3 / 4);
    gScale(1, 1, 1 / 2);
    setColor(this.#headColor);
    drawCone();
    {
      gPush();
      gTranslate(1 / 3, 1 / 3, 1 / 3);
      gScale(1 / 4, 1 / 4, 1 / 4);
      this.#drawEye();
      gPop();
    }
    {
      gPush();
      gTranslate(-1 / 3, 1 / 3, 1 / 3);
      gScale(1 / 4, 1 / 4, 1 / 4);
      this.#drawEye();
      gPop();
    }
  }

  #drawEye() {
    setColor(this.#eyeColor);
    drawSphere();
    {
      gPush();
      gTranslate(0, 0, 1);
      gScale(0.4, 0.4, 0.4);
      setColor(this.#pupilColor);
      drawSphere();
      gPop();
    }
  }

  #drawTail(timestamp) {
    gRotate(Math.cos(timestamp * this.#tailFlappingSpeedScale) * 30, 0, 1, 0);
    {
      gPush();
      gRotate(45, 1, 0, 0);
      gTranslate(0, 0, 1.5);
      gScale(1, 1, 2);
      setColor(this.#bodyColor);
      drawCone();
      gPop();
    }
    {
      gPush();
      gRotate(45, -1, 0, 0);
      gTranslate(0, 0, 2.5);
      gScale(1, 1, 4);
      setColor(this.#bodyColor);
      drawCone();
      gPop();
    }
  }
}
