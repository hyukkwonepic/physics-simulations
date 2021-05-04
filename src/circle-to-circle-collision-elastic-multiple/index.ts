import P5, { Vector } from 'p5';
import Circle from './circle';
import {
  CANVAS_HEIGHT,
  CANVAS_ORIGIN_X,
  CANVAS_ORIGIN_Y,
  CANVAS_WIDTH,
} from './constants';

const rootElement = document.getElementById('root') as HTMLElement;

export const sketch = new P5(() => null, rootElement);

const drawCanvas = () => {
  sketch.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
};

const detectColllision = (c1: Circle, c2: Circle) => {
  return c1.radius + c2.radius >= Vector.sub(c2.position, c1.position).mag();
};

const resolvePenetration = (c1: Circle, c2: Circle) => {
  const distance = Vector.sub(c1.position, c2.position);
  const depth = c1.radius + c2.radius - distance.mag();
  const resolution = distance.copy().normalize().mult(depth);
  c1.position.add(resolution.mult(1));
  c2.position.add(resolution.mult(-1));
};

const resolveCollision = (c1: Circle, c2: Circle) => {
  const pDiff = Vector.sub(c2.position, c1.position);
  const angle = -Math.atan2(pDiff.y, pDiff.x);

  const m1 = c1.mass;
  const m2 = c2.mass;

  const u1 = c1.velocity.copy().rotate(angle);
  const u2 = c2.velocity.copy().rotate(angle);

  const v1 = sketch.createVector(
    (u1.x * (m1 - m2)) / (m1 + m2) + (2 * m2 * u2.x) / (m1 + m2),
    u1.y,
  );
  const v2 = sketch.createVector(
    (u2.x * (m2 - m1)) / (m1 + m2) + (2 * m1 * u1.x) / (m1 + m2),
    u2.y,
  );

  const newV1 = v1.copy().rotate(-angle);
  const newV2 = v2.copy().rotate(-angle);

  c1.velocity = newV1;
  c2.velocity = newV2;
};

const resolvePenetrationToEdges = (circle: Circle) => {
  if (circle.position.x - circle.radius <= CANVAS_ORIGIN_X) {
    const depth = circle.radius - circle.position.x;
    circle.position.x = circle.position.x + depth;
  }

  if (circle.position.x + circle.radius >= CANVAS_WIDTH) {
    const depth = circle.position.x + circle.radius - CANVAS_WIDTH;
    circle.position.x = circle.position.x - depth;
  }

  if (circle.position.y - circle.radius < CANVAS_ORIGIN_Y) {
    const depth = circle.radius - circle.position.y;
    circle.position.y = circle.position.y + depth;
  }

  if (circle.position.y + circle.radius > CANVAS_HEIGHT) {
    const depth = circle.position.y + circle.radius - CANVAS_HEIGHT;
    circle.position.y = circle.position.y - depth;
  }
};

const resolveCollisionToEdges = (circle: Circle) => {
  if (circle.position.x - circle.radius <= CANVAS_ORIGIN_X) {
    circle.velocity = sketch.createVector(
      circle.velocity.x * -1,
      circle.velocity.y,
    );
  }

  if (circle.position.x + circle.radius >= CANVAS_WIDTH) {
    circle.velocity = sketch.createVector(
      circle.velocity.x * -1,
      circle.velocity.y,
    );
  }

  if (circle.position.y - circle.radius <= CANVAS_ORIGIN_Y) {
    circle.velocity = sketch.createVector(
      circle.velocity.x,
      circle.velocity.y * -1,
    );
  }

  if (circle.position.y + circle.radius >= CANVAS_HEIGHT) {
    circle.velocity = sketch.createVector(
      circle.velocity.x,
      circle.velocity.y * -1,
    );
  }
};

const circles = [
  new Circle(400, 400, 48, 48),
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
  sketch.background('#111827');
  sketch.stroke('#FFFFFF');
  sketch.strokeWeight(1);
  sketch.noFill();
  sketch.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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

  circles.forEach((circle, index) => {
    circle.drawCircle();
    circle.drawRepositionedCircle();
    circle.drawVelocityGuide();
    circle.drawAccelerationGuide();

    resolvePenetrationToEdges(circle);
    resolveCollisionToEdges(circle);

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
