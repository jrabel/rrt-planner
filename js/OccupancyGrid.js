class OccupancyGrid {
    constructor(width, height, cellSize, startCell, goalCell) {
        this.columns = width;
        this.rows = height;
        this.cellSize = cellSize;

        this.startCell = startCell;
        this.goalCell = goalCell;

        this.obstacleColor = 0xFF0000;

        this.initGrid();

        var density = 0.1;
        this.addObstacles(density);

        this.obstaclesArray = [];
        this.createObstacleMeshes();
    }

    initGrid() {
        this.grid = new Array(this.rows);
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(this.columns);
            for (var j = 0; j < this.grid[i].length; j++) {
                if ((i == 0) || (i == this.grid.length - 1) || (j == 0) || (j == this.grid[i].length - 1))
                    this.grid[i][j] = true;
                else
                    this.grid[i][j] = false;
            }
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    addObstacles(density) {
        var numberOfObstacles = density * this.rows * this.columns;
        for (var o = 0; o < numberOfObstacles; o++) {
            var i = this.getRandomInt(0, this.rows);
            var j = this.getRandomInt(0, this.columns);
            this.grid[i][j] = true;
        }

        // clear start and goal cells
        this.grid[this.startCell.x][this.startCell.y] = false;
        this.grid[this.goalCell.x][this.goalCell.y] = false;
    }

    createObstacleMeshes() {
        var geometry = new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
        // make material "double sided" to allow raycaster to intersect inside and outside of each face
        var material = new THREE.MeshStandardMaterial({ color: this.obstacleColor, side: THREE.DoubleSide });

        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                var cube = new THREE.Mesh(geometry, material);
                if (this.grid[i][j]) {
                    cube.position.set(i * this.cellSize, j * this.cellSize, 0);
                    this.obstaclesArray.push(cube);
                    cube.position.needsUpdate = true;
                }
            }
        }
    }

    drawObstacles(scene) {
        for (var i = 0; i < this.obstaclesArray.length; i++) {
            scene.add(this.obstaclesArray[i]);
        }
    }
}