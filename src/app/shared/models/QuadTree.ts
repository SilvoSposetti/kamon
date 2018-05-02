// x and y parameters for rectangles always represent the top-left corner;
class Boundary {
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

}


