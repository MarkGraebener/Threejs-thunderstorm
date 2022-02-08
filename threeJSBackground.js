
// import * as THREE from '/three';
import * as THREE from 'https://cdn.skypack.dev/three@0.120.0/build/three.module.js'

let scene,camera, renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 15000;
function init() {

    scene = new THREE.Scene(); // setting scene
    // camera position
    camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    // setting lighting
    let ambient = new THREE.AmbientLight("#555555");
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0,0,1);
    scene.add(directionalLight);


// renderer
    renderer = new THREE.WebGLRenderer();
    scene.fog = new THREE.FogExp2(0x1c1c2a, 0.002);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // creating lightning
    flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
    flash.position.set(200,300,100);
    scene.add(flash);

    //rain geometry
    rainGeo = new THREE.Geometry();
    for(let i=0;i<rainCount;i++) {
        let rainDrop = new THREE.Vector3(
            Math.random() * 400 -200,
            Math.random() * 500 - 250,
            Math.random() * 400 - 200
        );
        // rainDrop.velocity = {};
        rainDrop.velocity = 1;
        rainGeo.vertices.push(rainDrop);
    }
    // creating rain drop
    let rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.4,
        transparent: true,
    });
    rain = new THREE.Points(rainGeo,rainMaterial);
    scene.add(rain);
    // adding clouds
    let loader = new THREE.TextureLoader();
    loader.load("assets/smoke.png", function(texture){
// setting cloud plane
        let cloudGeo = new THREE.PlaneBufferGeometry(500,500);
        let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            // opacity: 0.9,
            transparent: true
        });
// adding 30 clouds in random order
        for(let p=0; p<30; p++) {
            let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
            cloud.position.set(
                Math.random()*800 -400,
                500,
                Math.random()*500 - 450
            );
            //facing clouds to camers
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*360;
            cloud.material.opacity = 0.6;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
        animate();
    });
}
function animate() {
    cloudParticles.forEach(p => {//random rotation for clouds
        p.rotation.z -=0.001;
    });
    rainGeo.vertices.forEach(p => {// setting velocity for gravity affect
        p.velocity -= 0.1 + Math.random() * 0.1;
        p.y += p.velocity;
        if (p.y < -200) {
            p.y = 200;
            p.velocity = 0;
        }
    });
    rainGeo.verticesNeedUpdate = true;
    rain.rotation.y +=0.002;// cinematic effect
    if(Math.random() > 0.93 || flash.power > 100) {// random flashes and intensity
        if(flash.power < 100)
            flash.position.set(
                Math.random()*400,
                300 + Math.random() *200,
                100
            );
        flash.power = 50 + Math.random() * 500;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
init();