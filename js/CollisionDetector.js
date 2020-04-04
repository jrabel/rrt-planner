class CollisionDetector {

    constructor(collisionObjects) {
        this.collisionObjects = collisionObjects;
    }

    inCollision(mesh) {

        for (var j = 0; j < this.collisionObjects.length; j++) {
            var obstaclePosition = this.collisionObjects[j].position;

            var boxSize = 1;
            var sphereRadius = 0.25;
            var allowableDistance = boxSize / 2 + sphereRadius;
            if (mesh.position.distanceTo(obstaclePosition) < allowableDistance) {
                // console.log("COLLISION!");
                return true;
            }
        }

        var vertices = mesh.geometry.vertices;
        for (var i = 0; i < vertices.length; i++) {

            var localVertex = vertices[i];
            localVertex.applyMatrix4(mesh.matrix); // transform local vector to global frame
            // var directionVector = mesh.position.sub(localVertex);

            // DRAW RAYCASTER LINE
            // var rayOrigin = mesh.position;
            // var rayVector = localVertex.clone().normalize();
            // var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            // var points = [];
            // points.push(rayOrigin);
            // var rayScale = 1;
            // points.push(new THREE.Vector3(rayOrigin.x + rayScale * rayVector.x,
            //     rayOrigin.y + rayScale * rayVector.y,
            //     rayOrigin.z + rayScale * rayVector.z));
            // var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            // var line = new THREE.Line(lineGeometry, lineMaterial);
            // scene.add(line);
            // END RAYCASTER LINE

            var raycaster = new THREE.Raycaster(mesh.position, localVertex.clone().normalize());

            var collisionResults = raycaster.intersectObjects(this.collisionObjects);

            if (collisionResults.length > 0 && collisionResults[0].distance < localVertex.length()) {
                // console.log("COLLISION!");
                return true;
            }

        }
    }

}