import P5, { Vector } from 'p5';
import Circle from './circle';
import { JERK } from './constants';

const rootElement = document.getElementById('root') as HTMLElement;

export const sketch = new P5(() => null, rootElement);

const drawCanvas = () => {
  sketch.createCanvas(800, 800);
};

const detectColllision = (c1: Circle, c2: Circle) => {
  return c1.radius + c2.radius >= Vector.sub(c2.position, c1.position).mag();
};

const getInvertedMass = (mass: number) => {
  return mass === 0 ? 0 : 1 / mass;
};

const resolvePenetration = (c1: Circle, c2: Circle) => {
  const distance = Vector.sub(c1.position, c2.position);
  const depth = c1.radius + c2.radius - distance.mag();

  const invertedC1Mass = getInvertedMass(c1.mass);
  const invertedC2Mass = getInvertedMass(c2.mass);

  const resolution = distance
    .copy()
    .normalize()
    .mult(depth / (invertedC1Mass + invertedC2Mass));

  c1.position.add(resolution.mult(invertedC1Mass));
  c2.position.add(resolution.mult(-1 * invertedC2Mass));
};

const resolveCollision = (c1: Circle, c2: Circle) => {
  const collisionNormal = Vector.sub(c1.position, c2.position).normalize();
  const relativeVelocity = Vector.sub(c1.velocity, c2.velocity);
  const separatingVelociyScalar = Vector.dot(relativeVelocity, collisionNormal);
  const newSeparatingVelociyScalar =
    separatingVelociyScalar * -1 * Math.min(c1.elasticity, c2.elasticity);

  const separatingVelocityScalarDiff =
    newSeparatingVelociyScalar - separatingVelociyScalar;

  const invertedC1Mass = getInvertedMass(c1.mass);
  const invertedC2Mass = getInvertedMass(c2.mass);
  const impulse =
    separatingVelocityScalarDiff / (invertedC1Mass + invertedC2Mass);
  const impulseVec = Vector.mult(collisionNormal, impulse);

  c1.velocity.add(Vector.mult(impulseVec, invertedC1Mass));
  c2.velocity.add(Vector.mult(impulseVec, invertedC2Mass * -1));
};

const circles = [
  new Circle(400, 400, 48, 48, '#FBCFE8'),
  new Circle(160, 160, 24, 24),
  new Circle(240, 240, 24, 24),
  new Circle(320, 320, 24, 24),
  new Circle(480, 480, 24, 24),
  new Circle(560, 560, 24, 24),
  new Circle(640, 640, 24, 24),
  new Circle(640, 160, 24, 24),
  new Circle(560, 240, 24, 24),
  new Circle(480, 320, 24, 24),
  new Circle(320, 480, 24, 24),
  new Circle(240, 560, 24, 24),
  new Circle(160, 640, 24, 24),
  new Circle(287, 400, 24, 24),
  new Circle(513, 400, 24, 24),
  new Circle(400, 287, 24, 24),
  new Circle(400, 513, 24, 24),
  new Circle(174, 400, 24, 24),
  new Circle(626, 400, 24, 24),
  new Circle(400, 174, 24, 24),
  new Circle(400, 626, 24, 24),
  new Circle(61, 400, 24, 24),
  new Circle(739, 400, 24, 24),
  new Circle(400, 61, 24, 24),
  new Circle(400, 739, 24, 24),
];

const controlTargetCircle = circles[0];

sketch.setup = () => {
  drawCanvas();
};

sketch.draw = () => {
  sketch.background('#DB2777');

  if (upArrowKeyIsPressed) {
    controlTargetCircle.accelerate('y', JERK * -1);
  }

  if (downArrowKeyIsPressed) {
    controlTargetCircle.accelerate('y', JERK);
  }

  if (leftArrowKeyIsPressed) {
    controlTargetCircle.accelerate('x', JERK * -1);
  }

  if (rightArrowKeyIsPressed) {
    controlTargetCircle.accelerate('x', 1);
  }

  if (!upArrowKeyIsPressed && !downArrowKeyIsPressed) {
    controlTargetCircle.accelerate('y', 0);
  }

  if (!leftArrowKeyIsPressed && !rightArrowKeyIsPressed) {
    controlTargetCircle.accelerate('x', 0);
  }

  circles.forEach((circle, index) => {
    circle.drawCircle();
    circle.drawRepositionedCircle();
    circle.drawVelocityGuide();
    circle.drawAccelerationGuide();

    for (let i = index + 1; i < circles.length; i += 1) {
      const targetCircle = circles[i];
      const isColliding = detectColllision(circle, targetCircle);
      if (isColliding) {
        resolvePenetration(circle, targetCircle);
        resolveCollision(circle, targetCircle);
      }
    }
  });
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
  console.log(keyCode);

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
