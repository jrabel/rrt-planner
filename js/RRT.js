class RRT {
    constructor(start, goal, limits, collisionDetector) {
        this.start = start;
        this.goal = goal;
        this.limits = limits;
        this.collisionDetector = collisionDetector;
        this.delta = 0.5;

        this.degrees = 0;
        for (var prop in this.start) {
            if (this.start.hasOwnProperty(prop))
                ++this.degrees;
        }

        var geometry = new THREE.SphereGeometry(0.25, 4, 4);
        var material = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
        this.stateMesh = new THREE.Mesh(geometry, material);

        this.treeNodeArray = [];
        this.startNode = this.createTreeNode(start, null);
        this.goalNode = null;
        this.solutionFound = false;

        this.statesGroup = new THREE.Group();
        this.rrtGroup = new THREE.Group();

        this.buildRRT();
    }

    createTreeNode(stateVector, parentNode) {
        var node = { parent: parentNode, state: stateVector, children: [] };
        this.treeNodeArray.push(node);

        if (parentNode)
            parentNode.children.push(node);

        return node;
    }

    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomState() {
        var state = {};
        for (var prop in this.start) {
            state[prop] = this.getRandomFloat(this.limits[prop][0], this.limits[prop][1]);
        }
        return state;
    }

    isStateInCollision(state) {
        this.stateMesh.position.set(state.x, state.y, 0);
        this.stateMesh.position.needsUpdate = true;

        if (this.collisionDetector && this.collisionDetector.inCollision(this.stateMesh))
            return true;
        return false;
    }

    createState() {
        var stateCreated = false;
        var state;
        while (!stateCreated) {
            state = this.getRandomState();
            if (this.isStateInCollision(state)) {
                // console.log("State in collision");
                continue;
            }
            stateCreated = true;
        }
        return state;
    }

    drawStates(scene) {
        scene.add(this.statesGroup);
    }

    getDistanceBetweenStates(state1, state2) {
        var distance = 0.0;
        for (var prop in state1) {
            distance += (state1[prop] - state2[prop]) * (state1[prop] - state2[prop]);
        }
        return Math.sqrt(distance);
    }

    nearestNode(state) {
        var nearestNode;
        var minDistance = Number.MAX_VALUE;

        for (var i = 0; i < this.treeNodeArray.length; i++) {
            var nodeState = this.treeNodeArray[i].state;
            var distance = this.getDistanceBetweenStates(state, nodeState);

            if (distance < minDistance) {
                minDistance = distance;
                nearestNode = this.treeNodeArray[i];
            }
        }
        return nearestNode;
    }

    createNewState(randomState, nearestNode) {
        var diffState = {};
        var magnitude = 0.0;
        for (var prop in randomState) {
            diffState[prop] = randomState[prop] - nearestNode.state[prop];
            magnitude += diffState[prop] * diffState[prop];
        }
        magnitude = Math.sqrt(magnitude);
        var newState = {};
        for (var prop in diffState) {
            if (magnitude > this.delta)
                diffState[prop] = diffState[prop] / magnitude;
            newState[prop] = nearestNode.state[prop] + this.delta * diffState[prop];
        }
        if (this.isStateInCollision(newState))
            return null;
        else
            return newState;
    }

    attemptConnectionToGoalState(node) {
        var distance = this.getDistanceBetweenStates(node.state, this.goal);
        if (distance < (this.delta)) {
            this.goalNode = this.createTreeNode(this.goal, node);
            return true;
        }
        return false;
    }

    buildRRT() {
        this.solutionFound = false;
        var iterations = 10000;
        var nodesCreated = 0;
        while (nodesCreated < iterations) {
            var randomState = this.createState();
            var nearestNode = this.nearestNode(randomState);
            var newState = this.createNewState(randomState, nearestNode);
            if (newState) {
                var newNode = this.createTreeNode(newState, nearestNode);
                if (this.attemptConnectionToGoalState(newNode)) {
                    this.solutionFound = true;
                    break;
                }
                nodesCreated++;
            }
        }
        console.log("Solution found in " + nodesCreated + " iterations.")
    }
}