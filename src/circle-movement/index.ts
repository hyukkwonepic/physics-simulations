import P5 from 'p5';
import Circle from './circle';

const rootElement = document.getElementById('root') as HTMLElement;

export const sketch = new P5(() => null, rootElement);

const drawCanvas = () => {
  sketch.createCanvas(800, 800);
};

const circle = new Circle(400, 400, 48, 48);
const controlTargetCircle = circle;

sketch.setup = () => {
  drawCanvas();
};

sketch.draw = () => {
  sketch.background('#111827');
  sketch.stroke('#FFFFFF');
  sketch.strokeWeight(1);
  sketch.noFill();
  sketch.rect(0, 0, 800, 800);

  if (upArrowKeyIsPressed) {
    controlTargetCircle.acceleration.y = -1;
  }

  if (downArrowKeyIsPressed) {
    controlTargetCircle.acceleration.y = 1;
  }

  if (leftArrowKeyIsPressed) {
    controlTargetCircle.acceleration.x = -1;
  }

  if (rightArrowKeyIsPressed) {
    controlTargetCircle.acceleration.x = 1;
  }

  if (!upArrowKeyIsPressed && !downArrowKeyIsPressed) {
    controlTargetCircle.acceleration.y = 0;
  }

  if (!leftArrowKeyIsPressed && !rightArrowKeyIsPressed) {
    controlTargetCircle.acceleration.x = 0;
  }

  circle.drawCircle();
  circle.drawRepositionedCircle();
  circle.drawVelocityGuide();
  circle.drawAccelerationGuide();
};

const UP_KEY_CODE = 87;
const UP_ARROW_KEY_CODE = 38;
const DOWN_KEY_CODE = 83;
const DOWN_ARROW_KEY_CODE = 40;
const LEFT_KEY_CODE = 65;
const LEFT_ARROW_KEY_CODE = 37;
const RIGHT_KEY_CODE = 68;
const RIGHT_ARROW_KEY_CODE = 39;

let upArrowKeyIsPressed = false;
let downArrowKeyIsPressed = false;
let leftArrowKeyIsPressed = false;
let rightArrowKeyIsPressed = false;

sketch.keyPressed = () => {
  const { keyCode } = sketch;
  if (keyCode === UP_KEY_CODE || keyCode === UP_ARROW_KEY_CODE) {
    upArrowKeyIsPressed = true;
  }

  if (keyCode === DOWN_KEY_CODE || keyCode === DOWN_ARROW_KEY_CODE) {
    downArrowKeyIsPressed = true;
  }

  if (keyCode === LEFT_KEY_CODE || keyCode === LEFT_ARROW_KEY_CODE) {
    leftArrowKeyIsPressed = true;
  }

  if (keyCode === RIGHT_KEY_CODE || keyCode === RIGHT_ARROW_KEY_CODE) {
    rightArrowKeyIsPressed = true;
  }
};

sketch.keyReleased = () => {
  const { keyCode } = sketch;

  if (keyCode === UP_KEY_CODE || keyCode === UP_ARROW_KEY_CODE) {
    upArrowKeyIsPressed = false;
  }

  if (keyCode === DOWN_KEY_CODE || keyCode === DOWN_ARROW_KEY_CODE) {
    downArrowKeyIsPressed = false;
  }

  if (keyCode === LEFT_KEY_CODE || keyCode === LEFT_ARROW_KEY_CODE) {
    leftArrowKeyIsPressed = false;
  }

  if (keyCode === RIGHT_KEY_CODE || keyCode === RIGHT_ARROW_KEY_CODE) {
    rightArrowKeyIsPressed = false;
  }
};
