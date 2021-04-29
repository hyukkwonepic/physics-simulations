import { Vector } from 'p5';
import { FRICTION, JERK } from './constants';
import { sketch } from './index';

class Circle {
  public elasticity: number;

  public position: Vector;
  public velocity: Vector;
  public acceleration: Vector;

  constructor(
    x: number,
    y: number,
    public radius: number,
    public mass: number,
    private color = '#F472B6',
  ) {
    this.elasticity = 1;

    this.radius = radius;
    this.mass = mass;
    this.color = color;

    this.position = sketch.createVector(x, y);
    this.velocity = sketch.createVector(0, 0);
    this.acceleration = sketch.createVector(0, 0);
  }

  accelerate(direction: 'x' | 'y', amount: number) {
    switch (direction) {
      case 'x': {
        this.acceleration.x = amount;
        break;
      }
      case 'y': {
        this.acceleration.y = amount;
        break;
      }
    }
  }

  drawCircle() {
    sketch.push();
    sketch.fill(this.color);
    sketch.noStroke();
    sketch.circle(this.position.x, this.position.y, this.radius * 2);
    sketch.pop();
  }

  drawRepositionedCircle() {
    this.acceleration.normalize().mult(JERK);
    this.velocity.add(this.acceleration);
    this.velocity.mult(1 - FRICTION);
    this.position.add(this.velocity);
  }

  drawAccelerationGuide() {
    sketch.push();
    sketch.stroke('#BE185D');
    sketch.strokeWeight(2);
    sketch.line(
      this.position.x,
      this.position.y,
      this.position.x + this.acceleration.x * 100,
      this.position.y + this.acceleration.y * 100,
    );
    sketch.pop();
  }

  drawVelocityGuide() {
    sketch.push();
    sketch.stroke('#9D174D');
    sketch.strokeWeight(2);
    sketch.line(
      this.position.x,
      this.position.y,
      this.position.x + this.velocity.x * 10,
      this.position.y + this.velocity.y * 10,
    );
    sketch.pop();
  }
}

export default Circle;
