import P5, { Vector } from 'p5';
import Circle from './circle';

const rootElement = document.getElementById('root') as HTMLElement;

export const sketch = new P5(() => null, rootElement);

const drawCanvas = () => {
  sketch.createCanvas(800, 800);
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
  if (circle.position.x - circle.radius <= 0) {
    const depth = circle.radius - circle.position.x;
    circle.position.x = circle.position.x + depth;
  }

  if (circle.position.x + circle.radius >= 800) {
    const depth = circle.position.x + circle.radius - 800;
    circle.position.x = circle.position.x - depth;
  }
};

const resolveCollisionToEdges = (circle: Circle) => {
  if (circle.position.x - circle.radius <= 0) {
    circle.velocity = sketch.createVector(
      circle.velocity.x * -1,
      circle.velocity.y,
    );
  }

  if (circle.position.x + circle.radius >= 800) {
    circle.velocity = sketch.createVector(
      circle.velocity.x * -1,
      circle.velocity.y,
    );
  }
};

const circles = [new Circle(200, 400, 80, 80), new Circle(400, 400, 24, 24)];
const controlTargetCircle = circles[0];

sketch.setup = () => {
  drawCanvas();
};

sketch.draw = () => {
  sketch.background('#111827');
  sketch.stroke('#FFFFFF');
  sketch.strokeWeight(1);
  sketch.noFill();
  sketch.rect(0, 0, 800, 800);
  sketch.line(0, 400, 800, 400);

  if (leftArrowKeyIsPressed) {
    controlTargetCircle.acceleration.x = -1;
  }

  if (rightArrowKeyIsPressed) {
    controlTargetCircle.acceleration.x = 1;
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

const LEFT_KEY_CODE = 65;
const LEFT_ARROW_KEY_CODE = 37;
const RIGHT_KEY_CODE = 68;
const RIGHT_ARROW_KEY_CODE = 39;

let leftArrowKeyIsPressed = false;
let rightArrowKeyIsPressed = false;

sketch.keyPressed = () => {
  const { keyCode } = sketch;

  if (keyCode === LEFT_KEY_CODE || keyCode === LEFT_ARROW_KEY_CODE) {
    leftArrowKeyIsPressed = true;
  }

  if (keyCode === RIGHT_KEY_CODE || keyCode === RIGHT_ARROW_KEY_CODE) {
    rightArrowKeyIsPressed = true;
  }
};

sketch.keyReleased = () => {
  const { keyCode } = sketch;

  if (keyCode === LEFT_KEY_CODE || keyCode === LEFT_ARROW_KEY_CODE) {
    leftArrowKeyIsPressed = false;
  }

  if (keyCode === RIGHT_KEY_CODE || keyCode === RIGHT_ARROW_KEY_CODE) {
    rightArrowKeyIsPressed = false;
  }
};
