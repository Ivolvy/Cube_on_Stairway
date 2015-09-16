var that;
var StairwayCubes = function(){
    this.scene = new THREE.Scene();
    that = this;
};

StairwayCubes.prototype.init = function(){
    this.createCamera();
    this.createRenderer();

    this.createBoxes();

    this.createFloor();
    this.createLights();

    this.animateBoxes();

    this.render();
};

StairwayCubes.prototype.createCamera = function(){
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;

    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.camera.zoom = 1.1;
    this.camera.updateProjectionMatrix();

    //Adjust the scene to center the stairs
    this.scene.position.z=150;
    this.scene.position.y=-50;
};

StairwayCubes.prototype.createRenderer = function(){
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xf2f2f2);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    this.renderer.shadowMapSoft = true;
    document.body.appendChild( this.renderer.domElement );
    window.addEventListener('resize', this.onWindowResize, false);
};

StairwayCubes.prototype.createBoxes = function(){
    this.numberOfStairs = 5;
    this.repeatBoxeAnimation = this.numberOfStairs - 1;
    this.stairs = [];
    var positionZStart = -25; //start position of the stairs on their Z axis


    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshLambertMaterial( { color: 0xf2f2f2, shading: THREE.FlatShading});

    //boxe container is usefull to rotate the boxe around his edge
    this.boxeContainer = new THREE.Object3D();
    this.boxeContainer.rotation.x = -2*Math.PI;
    this.boxeContainer.position.y = 50;
    this.boxeContainer.position.z = -50;

    this.boxe = new THREE.Mesh( geometry, material );
    this.boxe.position.x = 0;
    this.boxe.position.y = -25;
    this.boxe.position.z = 25;
    this.boxe.castShadow = true;

    this.boxeContainer.add(this.boxe);
    this.scene.add(this.boxeContainer);

    //We create the stairs
    var geometryStair = new THREE.BoxGeometry( 50, 51, 50 );
    geometryStair.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0)); //permit to change the origin point to the box floor

    for(var i=1;i<=this.numberOfStairs;i++){
        this.stairs[i] = new THREE.Mesh( geometryStair, material );
        this.stairs[i].position.y = -1;
        this.stairs[i].position.z = positionZStart - 50;
        this.stairs[i].scale.y = 0;
        this.stairs[i].castShadow = true;
        positionZStart-= 50;
        this.scene.add(this.stairs[i]);
    }
};

StairwayCubes.prototype.createFloor = function(){
    var geometry2 = new THREE.PlaneBufferGeometry( 1000, 1000);
    var material2 = new THREE.MeshBasicMaterial( { color: 0xf2f2f2 } );
    var floor = new THREE.Mesh( geometry2, material2 );
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = 90*Math.PI/180;
    floor.doubleSided = true;
    floor.receiveShadow = true;
    this.scene.add(floor);
};

StairwayCubes.prototype.createLights = function(){
    this.scene.add(new THREE.AmbientLight(0x5b5b5b));

    var shadowLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    shadowLight.position.set( -1000, 1000, 0 );
    shadowLight.target.position.set(this.scene.position);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = 0.1;
    //shadowLight.shadowCameraVisible = true;
    this.scene.add(shadowLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( -1000, 1000, 0 );
    directionalLight.target.position.set(this.scene.position);
    this.scene.add( directionalLight );
};

/*The boxe climb the stairs*/
StairwayCubes.prototype.animateBoxes = function(){
    this.tl = new TimelineMax({repeat: that.repeatBoxeAnimation , delay: 1.2, repeatDelay:0, onComplete:this.reverseAnimation});
    this.tl.to(this.boxeContainer.rotation, 0.8, {x: -3*Math.PI, ease: Power1.easeInOut, onComplete:this.increaseValue});

    this.t2 = new TimelineMax({repeat: 0 , delay: 0.60, repeatDelay:0});
    for(var i=1;i<=this.numberOfStairs;i++) {
        this.t2.to(this.stairs[i].scale, 0.8, {y: i, ease: Expo.easeInOut});
    }
};

/*Increase boxe Container value to increase in height the cube rotation*/
StairwayCubes.prototype.increaseValue = function(){
    that.boxeContainer.position.y += 50;
    that.boxeContainer.position.z -= 50;

    that.boxe.position.y = -25;
    that.boxe.position.z = 25;

    that.boxeContainer.rotation.x = -2*Math.PI;
};

/*Decrease boxe Container value to decrease in height the cube rotation*/
StairwayCubes.prototype.decreaseValue = function(){
    that.boxeContainer.position.y -= 50;
    that.boxeContainer.position.z += 50;

    that.boxe.position.y = +25;
    that.boxe.position.z = -25;

    that.boxeContainer.rotation.x = 2*Math.PI;
};

/*Restart the animation*/
StairwayCubes.prototype.resetAnimations = function(){
    that.increaseValue();

    setTimeout(function(){
        that.t2.play(0);
        setTimeout(function(){
            that.tl.play(0);
        },600);
    }, 1000);
};

/*The cube down stairs*/
StairwayCubes.prototype.reverseAnimation = function(){
    that.decreaseValue();
    that.t3 = new TimelineMax({repeat: that.repeatBoxeAnimation , delay: 1.5, repeatDelay:0, onComplete:that.resetAnimations});
    that.t3.to(that.boxeContainer.rotation, 0.8, {x: 3*Math.PI, ease: Power1.easeInOut, onComplete:that.decreaseValue});

    this.t4 = new TimelineMax({repeat: 0 , delay: 2.2, repeatDelay:0});
    for(var i=that.numberOfStairs;i>=1;i--) {
        this.t4.to(that.stairs[i].scale, 0.8, {y: 0, ease: Back.easeInOut});
    }

};

StairwayCubes.prototype.render = function(){
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
};

StairwayCubes.prototype.onWindowResize = function(){
    that.camera.left = window.innerWidth / -2;
    that.camera.right = window.innerWidth / 2;
    that.camera.top = window.innerHeight / 2;
    that.camera.bottom = window.innerHeight / -2;

    that.renderer.setSize(window.innerWidth, window.innerHeight);
};

var movingBoxes = new StairwayCubes();
movingBoxes.init();



