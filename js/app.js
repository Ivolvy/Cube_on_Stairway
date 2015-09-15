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


    //Display the axes - usefull for place the elements
    var axes = buildAxes(1000);
    this.scene.add(axes);

    function buildAxes(length) {
        var axes = new THREE.Object3D();

        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z

        return axes;

    }

    function buildAxis(src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(),
            mat;

        if (dashed) {
            mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3});
        } else {
            mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
        }

        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line(geom, mat, THREE.LinePieces);

        return axis;

    }

};

StairwayCubes.prototype.createCamera = function(){
    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000 );
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;
    //this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.scene.position);
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
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshLambertMaterial( { color: 0xf2f2f2, shading: THREE.FlatShading});

    this.boxeContainer = new THREE.Object3D();
    this.boxeContainer.rotation.x = -2*Math.PI;
    this.boxeContainer.position.y = 50;
    this.boxeContainer.position.z = -50;

    this.boxe = new THREE.Mesh( geometry, material );
    this.boxe.position.x = 0;
    this.boxe.position.y = -25;
    this.boxe.position.z = 25;

    this.boxeContainer.add(this.boxe);
    this.scene.add(this.boxeContainer);


    var geometryStair = new THREE.BoxGeometry( 50, 51, 50 );
    geometryStair.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0)); //permit to change the origin point to the box floor


    var numberOfStairs = 5;
    this.stairs = [];
    var ZpositionStart = -25;

    for(var i=1;i<=numberOfStairs;i++){
        this.stairs[i] = new THREE.Mesh( geometryStair, material );
        this.stairs[i].position.y = -1;
        this.stairs[i].position.z = ZpositionStart - 50;
        this.stairs[i].scale.y = 0;
        ZpositionStart-= 50;

        this.scene.add(this.stairs[i]);
    }

};

StairwayCubes.prototype.createFloor = function(){
    var geometry2 = new THREE.PlaneBufferGeometry( 1000, 1000);
    var material2 = new THREE.MeshBasicMaterial( { color: 0xf2f2f2 } );
    var floor = new THREE.Mesh( geometry2, material2 );
    floor.material.side = THREE.DoubleSide;
    floor.position.y =0;
    floor.rotation.x = 90*Math.PI/180;
    floor.rotation.y = 0;
    floor.rotation.z = 0;
    floor.doubleSided = true;
    floor.receiveShadow = true;
    this.scene.add(floor);
};

StairwayCubes.prototype.createLights = function(){
    //scene.add(new THREE.AmbientLight(0x666666));

    var shadowLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    shadowLight.position.set( 0, 60, 0 );
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = 0.1;
    //directionalLightshadow.shadowCameraVisible = true;
    shadowLight.shadowCameraFar = 1000;
    this.scene.add(shadowLight);


    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 10, 40, 50 );
    this.scene.add( directionalLight );
};

StairwayCubes.prototype.animateBoxes = function(){
    this.tl = new TimelineMax({repeat: 4 , delay: 1.5, repeatDelay:0, onComplete:this.reverseAnimation});
    this.tl.to(this.boxeContainer.rotation, 0.8, {x: -3*Math.PI, ease: Power1.easeInOut, onComplete:this.increaseValue});


    this.t2 = new TimelineMax({repeat: 0 , delay: 0.9, repeatDelay:0});
    this.t2.to(this.stairs[1].scale, 0.8, {y: 1, ease: Expo.easeInOut});
    this.t2.to(this.stairs[2].scale, 0.8, {y: 2, ease: Expo.easeInOut});
    this.t2.to(this.stairs[3].scale, 0.8, {y: 3, ease: Expo.easeInOut});
    this.t2.to(this.stairs[4].scale, 0.8, {y: 4, ease: Expo.easeInOut});
    this.t2.to(this.stairs[5].scale, 0.8, {y: 5, ease: Expo.easeInOut});
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
        that.tl.restart();
        that.t2.restart();
    }, 2000);
};

/*The cube down stairs*/
StairwayCubes.prototype.reverseAnimation = function(){
    that.decreaseValue();
    that.t3 = new TimelineMax({repeat: 4 , delay: 1.5, repeatDelay:0, onComplete:that.resetAnimations});
    that.t3.to(that.boxeContainer.rotation, 0.8, {x: 3*Math.PI, ease: Power1.easeInOut, onComplete:that.decreaseValue});

    this.t4 = new TimelineMax({repeat: 0 , delay: 0.5, repeatDelay:0});
    this.t4.to(that.stairs[5].scale, 0.8, {y: 5, ease: Expo.easeInOut});
    this.t4.to(that.stairs[4].scale, 0.8, {y: 4, ease: Expo.easeInOut});

    this.t4.to(that.stairs[3].scale, 0.8, {y: 3, ease: Expo.easeInOut});
    this.t4.to(that.stairs[5].scale, 0.8, {y: 0, ease: Back.easeInOut},"=-1");

    this.t4.to(that.stairs[2].scale, 0.8, {y: 2, ease: Expo.easeInOut});
    this.t4.to(that.stairs[4].scale, 0.8, {y: 0, ease: Back.easeInOut},"=-1");

    this.t4.to(that.stairs[1].scale, 0.8, {y: 1, ease: Expo.easeInOut});
    this.t4.to(that.stairs[3].scale, 0.8, {y: 0, ease: Back.easeInOut},"=-1");
    this.t4.to(that.stairs[2].scale, 0.8, {y: 0, ease: Back.easeInOut},"=-0.4");

    this.t4.to(that.stairs[1].scale, 0.8, {y: 0, ease: Back.easeInOut});

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



