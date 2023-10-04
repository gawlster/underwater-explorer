class Bubble {
  #bubbleColor = vec4(1, 1, 1, 1);
  startingTimestamp;
  #headOffset;
  bubbleSpeed;

  constructor({
    startingTimestamp,
    startingCoordinates,
    headOffset,
    bubbleSpeed,
  }) {
    this.startingTimestamp = startingTimestamp;
    this.startingCoordinates = startingCoordinates;
    this.#headOffset = headOffset;
    this.bubbleSpeed = bubbleSpeed;
  }

  draw(timestamp) {
    gPush();
    setColor(this.#bubbleColor);
    gTranslate(
      this.startingCoordinates[0],
      this.startingCoordinates[1] + this.#headOffset,
      this.startingCoordinates[2] + 2,
    );
    gTranslate(
      0,
      ((timestamp - this.startingTimestamp) / 1000) * this.bubbleSpeed,
      0,
    );
    gPush();
    gScale(0.2, 0.2, 0.2);
    drawSphere();
    gPop();
    gPop();
  }
}
