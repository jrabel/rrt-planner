class Robot {
    constructor(x, y, z, size) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;

        this.color = 0x0000FF;
        this.createRobotMesh();
    }

    createRobotMesh() {
        var geometry = new THREE.SphereGeometry(this.size / 2, 20, 20);
        var material = new THREE.MeshStandardMaterial({ color: this.color });
        this.robotMesh = new THREE.Mesh(geometry, material);
        this.robotMesh.position.set(this.x, this.y, this.z);
        this.robotMesh.position.needsUpdate = true;
    }

    drawRobot(scene) {
        scene.add(this.robotMesh);
    }

}