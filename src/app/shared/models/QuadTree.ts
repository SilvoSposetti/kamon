// x and y parameters for rectangles always represent the top-left corner;
export class Boundary {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public contains(x: number, y: number) {
    return x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height;
  }

  // intersection with another boundary
  public intersectsBoundary(range: Boundary): boolean {
    return (this.x < range.x + range.width && this.x + this.width > range.x) &&
      (this.y < range.y + range.height && this.y + this.height > range.y);
  }

  // intersection with circle:
  public intersectsCircle(x: number, y: number, radius: number): boolean {
    let halfWidth = this.width / 2;
    let halfHeight = this.height / 2;
    let circleDistanceX = Math.abs(x - this.x - halfWidth);
    let circleDistanceY = Math.abs(y - this.y - halfHeight);

    // if x and y outside the square and outside the "radius band" outside the square:
    if (circleDistanceX > halfWidth + radius) return false;
    if (circleDistanceY > halfHeight + radius) return false;

    // if x and y inside the the square:
    if (circleDistanceX <= halfWidth) return true;
    if (circleDistanceY <= halfHeight) return true;

    let cornerDistanceX = circleDistanceX - halfWidth;
    let cornerDistanceY = circleDistanceY - halfHeight;
    let cornerDistanceSquared = cornerDistanceX * cornerDistanceX + cornerDistanceY * cornerDistanceY;

    return cornerDistanceSquared <= radius * radius;
  }
}

export class QuadTree {
  public boundary: Boundary;
  public isDivided: boolean;
  public capacity: number;
  public points: number[][] = [];

  public northWest: QuadTree;
  public northEast: QuadTree;
  public southWest: QuadTree;
  public southEast: QuadTree;

  constructor(x: number, y: number, width: number, height: number, capacity: number) {
    this.isDivided = false;
    this.capacity = capacity;
    this.boundary = new Boundary(x, y, width, height);
  }

  public insertPoint(x: number, y: number) {
    if (!this.boundary.contains(x, y)) { // If the point is not in the boundary, get outta here :)
      return;
    }
    else if (this.points.length < this.capacity) { // Point is in the boundary, and there is space.
      this.points.push([x, y]);
    }
    else if (!this.isDivided) { // Point is in the boundary, but there is no space anymore => subdivide.
      this.isDivided = true;
      let halfWidth = this.boundary.width / 2;
      let halfHeight = this.boundary.height / 2;
      // create internal quadTrees:
      this.northWest = new QuadTree(this.boundary.x, this.boundary.y, halfWidth, halfHeight, this.capacity);
      this.northEast = new QuadTree(this.boundary.x + halfWidth, this.boundary.y, halfWidth, halfHeight, this.capacity);
      this.southWest = new QuadTree(this.boundary.x, this.boundary.y + halfHeight, halfWidth, halfHeight, this.capacity);
      this.southEast = new QuadTree(this.boundary.x + halfWidth, this.boundary.y + halfHeight, halfWidth, halfHeight, this.capacity);

      this.northWest.insertPoint(x, y);
      this.northEast.insertPoint(x, y);
      this.southWest.insertPoint(x, y);
      this.southEast.insertPoint(x, y);

    }
    else { // Point is in the boundary, there is no space and the quadTree is already subdivided.
      this.northWest.insertPoint(x, y);
      this.northEast.insertPoint(x, y);
      this.southWest.insertPoint(x, y);
      this.southEast.insertPoint(x, y);
    }
  }

  // Returns all points inside the rectangle defined by boundary
  public queryRect(range: Boundary): number[][] {
    let pointsFound: number[][] = [];
    this.recursiveQueryRect(range, pointsFound);
    return pointsFound;
  }

  private recursiveQueryRect(range: Boundary, found: number[][]): void {
    if (!this.boundary.intersectsBoundary(range)) {
      return;
    }
    else {
      for (let p of this.points) {
        if (range.contains(p[0], p[1])) {
          found.push([p[0], p[1]]);
        }
      }
      if (this.isDivided) {
        this.northWest.recursiveQueryRect(range, found);
        this.northEast.recursiveQueryRect(range, found);
        this.southWest.recursiveQueryRect(range, found);
        this.southEast.recursiveQueryRect(range, found);
      }
    }
  }

  public queryCircle(x: number, y: number, radius: number): number[][] {
    let pointsFound: number[][] = [];
    this.recursiveQueryCircle(x, y, radius, pointsFound);
    return pointsFound;

  }

  private recursiveQueryCircle(x: number, y: number, radius: number, found: number [][]): void {
    if (!this.boundary.intersectsCircle(x, y, radius)) {
      //console.log('intersects circle' + new Date().toString());
      return;
    }
    else {
      for (let p of this.points) {
        if (this.pointIsInCircle(x, y, radius, p[0], p[1])) {
          found.push([p[0], p[1]]);
        }
      }
      if (this.isDivided) {
        this.northWest.recursiveQueryCircle(x, y, radius, found);
        this.northEast.recursiveQueryCircle(x, y, radius, found);
        this.southWest.recursiveQueryCircle(x, y, radius, found);
        this.southEast.recursiveQueryCircle(x, y, radius, found);
      }
    }
  }

  private pointIsInCircle(circleX: number, circleY: number, radius: number, pointX: number, pointY: number): boolean {
    let distanceX = pointX - circleX;
    let distanceY = pointY - circleY;
    return distanceX * distanceX + distanceY * distanceY < radius * radius;
  }
}
