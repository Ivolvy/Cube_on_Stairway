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



    this.temp = new THREE.Object3D();
    this.temp.position.x = 0;
    this.temp.position.y = 50;
    this.temp.position.z = -50;
    that.temp.rotation.x = -2*Math.PI;

    this.boxe = new THREE.Mesh( geometry, material );
    this.boxe.position.x = 0;
    this.boxe.position.y = -25;
    this.boxe.position.z = 25;

    this.temp.add(this.boxe);
    this.scene.add(this.temp);
};

StairwayCubes.prototype.createFloor = function(){
    var geometry2 = new THREE.PlaneGeometry( 500, 500); //use PlaneBufferGeometry  ? todo
    var material2 = new THREE.MeshBasicMaterial( { color: 0xf2f2f2 } );
    var floor = new THREE.Mesh( geometry2, material2 );
    floor.material.side = THREE.DoubleSide;
    floor.position.y =-180;
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

    var tl = new TimelineMax({repeat: 4 ,repeatDelay:0});
    tl.to(this.temp.rotation, 1, {x: -3*Math.PI, ease: Power1.easeInOut, onComplete:this.increaseValue});

};

StairwayCubes.prototype.increaseValue = function(){
    that.temp.position.y += 50;
    that.temp.position.z -= 50;

    that.boxe.position.y = -25;
    that.boxe.position.z = 25;

    that.temp.rotation.x = -2*Math.PI;
};

StairwayCubes.prototype.render = function(){
  //  this.temp.rotation.x -= 2*Math.PI/128;

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



