class TreeAnimator {

    constructor(treeNodeArray) {
        this.treeNodeArray = treeNodeArray;

        this.startNode = this.treeNodeArray[0];
        this.goalNode = this.treeNodeArray[this.treeNodeArray.length - 1];

        this.pointMaterial = new THREE.PointsMaterial({ color: 0x000000, size: 0.1 });
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

        this.nodeIndexToDraw = 0;
        this.drawing = false;
    }

    initializeAnimator() {
        this.drawing = true;
        this.nodeIndexToDraw = 0;
    }

    drawGoalState(scene) {
        var geometry = new THREE.SphereGeometry(0.25, 20, 20);
        var material = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
        var goalStateMesh = new THREE.Mesh(geometry, material);
        goalStateMesh.position.set(this.goalNode.state.x, this.goalNode.state.y, 0.0);
        goalStateMesh.position.needsUpdate = true;
        scene.add(goalStateMesh);
    }

    drawSolutionPath(scene) {
        var solutionPath = new THREE.Group();

        var pointMaterial = new THREE.PointsMaterial({ color: 0x00FF00, size: 0.2 });
        var lineMaterial = new THREE.LineBasicMaterial({ color: 0x00FF00 });

        var node = this.goalNode;

        while (node.parent) {
            var pointGeometry = new THREE.Geometry();
            pointGeometry.vertices.push(new THREE.Vector3(node.state.x, node.state.y, 0));
            var point = new THREE.Points(pointGeometry, pointMaterial);
            solutionPath.add(point);

            var points = [];
            points.push(new THREE.Vector3(node.state.x, node.state.y, 0));
            points.push(new THREE.Vector3(node.parent.state.x, node.parent.state.y, 0));
            var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            var line = new THREE.Line(lineGeometry, lineMaterial);
            solutionPath.add(line);

            node = node.parent;
        }
        scene.add(solutionPath);
    }

    drawRRT(scene) {
        var nodes = [];
        nodes.push(this.startNode);

        while (nodes.length > 0) {
            var node = nodes.pop();

            var pointGeometry = new THREE.Geometry();
            pointGeometry.vertices.push(new THREE.Vector3(node.state.x, node.state.y, 0));
            var point = new THREE.Points(pointGeometry, this.pointMaterial);
            scene.add(point);

            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                nodes.push(child);

                var points = [];
                points.push(new THREE.Vector3(node.state.x, node.state.y, 0));
                points.push(new THREE.Vector3(child.state.x, child.state.y, 0));
                var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                var line = new THREE.Line(lineGeometry, this.lineMaterial);
                scene.add(line);
            }
        }
    }

    drawNextTreeNode(scene) {
        if (this.drawing) {
            var node = this.treeNodeArray[this.nodeIndexToDraw];

            var pointGeometry = new THREE.Geometry();
            pointGeometry.vertices.push(new THREE.Vector3(node.state.x, node.state.y, 0));
            var point = new THREE.Points(pointGeometry, this.pointMaterial);
            scene.add(point);

            if (node.parent) {
                var points = [];
                points.push(new THREE.Vector3(node.state.x, node.state.y, 0));
                points.push(new THREE.Vector3(node.parent.state.x, node.parent.state.y, 0));
                var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                var line = new THREE.Line(lineGeometry, this.lineMaterial);
                scene.add(line);
            }

            this.nodeIndexToDraw++;
        }

        if (this.nodeIndexToDraw >= this.treeNodeArray.length) {
            this.drawing = false;
        }
    }

}