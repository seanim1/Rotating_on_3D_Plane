// Sean Im, 2022
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.145.0/three.module.js';

// Global variables
const timer = new THREE.Clock(true);
const vec_v_pos = new THREE.Vector3( 1, 2, 3 );
const vec_normal_pos = new THREE.Vector3( -2, 1, 2 );
let speed = 1;
let theta = Math.PI/6;

// GUI controller
import { GUI } from '../libs/lil-gui.esm.min.js';
import { OrbitControls } from '../libs/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from '../libs/CSS2DRenderer.js';

const gui = new GUI();

const Controller = {
    X_Normal: vec_normal_pos.x,
    Y_Normal: vec_normal_pos.y,
    Z_Normal: vec_normal_pos.z,

    X_v: vec_v_pos.x,
    Y_v: vec_v_pos.y,
    Z_v: vec_v_pos.z,

    Speed: speed,
    Angle_Theta: theta
};

const valuesChanger = function () {
    vec_normal_pos.x = Controller.X_Normal;
    vec_normal_pos.y = Controller.Y_Normal;
    vec_normal_pos.z = Controller.Z_Normal;

    vec_v_pos.x = Controller.X_v;
    vec_v_pos.y = Controller.Y_v;
    vec_v_pos.z = Controller.Z_v;

    speed = Controller.Speed;
    theta = Controller.Angle_Theta;
};

const folder2 = gui.addFolder( 'Normal Vector' );
folder2.add( Controller, 'X_Normal', -5, 5.0, 0.01 ).onChange( valuesChanger );
folder2.add( Controller, 'Y_Normal', -5, 5.0, 0.01 ).onChange( valuesChanger );
folder2.add( Controller, 'Z_Normal', -5, 5.0, 0.01 ).onChange( valuesChanger );

const folder1 = gui.addFolder( 'Vector V' );
folder1.add( Controller, 'X_v', -5, 5.0, 0.01 ).onChange( valuesChanger );
folder1.add( Controller, 'Y_v', -5, 5.0, 0.01 ).onChange( valuesChanger );
folder1.add( Controller, 'Z_v', -5, 5.0, 0.01 ).onChange( valuesChanger );

gui.add( Controller, 'Speed', -10, 10, 0.2 ).onChange( valuesChanger );
gui.add( Controller, 'Angle_Theta', -Math.PI*2, Math.PI*2, 0.01 ).onChange( valuesChanger );

valuesChanger();

// Getting started
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const frustumSize = 9;
let aspect = window.innerWidth / window.innerHeight;
//let camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );

const controls = new OrbitControls( camera, labelRenderer.domElement );


window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    /*aspect = window.innerWidth / window.innerHeight;
    camera.left = - frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = - frustumSize / 2;*/

    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
}

// initiate
function init() {
    let geometry, material, pixelDiv, pixelLabel;
    // Center
    geometry = new THREE.IcosahedronGeometry( 0.5 );
    material = new THREE.MeshMatcapMaterial( { color: 0xcfcfcf } );
    const center = ( new THREE.Mesh( geometry, material ) );

    // Vector V
    geometry = new THREE.OctahedronGeometry( 0.5 );
    material = new THREE.MeshMatcapMaterial( { color: 0x36eb66 } );
    const vector_v = ( new THREE.Mesh( geometry, material ) );

    // Vector Normal
    geometry = new THREE.OctahedronGeometry( 0.5 );
    material = new THREE.MeshMatcapMaterial( { color: 0xf7af31 } );
    const vector_normal = ( new THREE.Mesh( geometry, material ) );

    // Vector Rotated
    geometry = new THREE.SphereGeometry( 0.5 );
    material = new THREE.MeshBasicMaterial( { color: 0xdb3d48 } );
    const vector_v_rotated = ( new THREE.Mesh( geometry, material ) );

    // Plane
    geometry = new THREE.PlaneGeometry( 10, 10 );
    material = new THREE.MeshBasicMaterial( 
        { 
            color: 0xdb3d48, 
            transparent: true, 
            opacity: 0.4, 
            side: THREE.DoubleSide 
        } );
    const plane_space = ( new THREE.Mesh( geometry, material ) );

    // axis
    geometry = new THREE.BoxGeometry( 0.15, 0.15, 20 );
    material = new THREE.MeshBasicMaterial( 
        { 
            color: 0xf7af31, 
            transparent: true, 
            opacity: 0.4, 
            side: THREE.DoubleSide 
        } );
    const plane_axis = ( new THREE.Mesh( geometry, material ) );

    // < Init: Transformations >

    // < scene.add >
    scene.add( new THREE.AxesHelper( 10 ) ); // scene.children[0]
    scene.add( center ); // scene.children[1]
    scene.add( vector_v ); // scene.children[2]
    scene.add( vector_normal ); // scene.children[3]
    scene.add( vector_v_rotated ); // scene.children[4]
    scene.add( plane_space ); // scene.children[5]
    scene.add( plane_axis ); // scene.children[6]

    camera.position.z = 10;
}

// game loop
function animate() {
    requestAnimationFrame( animate );

    const vector_v = scene.children[2].position;
    const vector_normal = scene.children[3].position;

    // update vector' position
    vector_v.copy( vec_v_pos );
    vector_normal.copy( vec_normal_pos );

    // Remove this line of code if you want to see what happens if v is not on the plane
    // update vector_v's position so it satisfies the plane equation.
    // There won't be a solution when vector_normal.z= 0
    vector_v.set( 1,1, -(vector_normal.x + vector_normal.y)/vector_normal.z );

    // updating rotating vector in a plane
    // Formula: Rot(v) = cos(theta)*(v) + sin(theta)*(normal x v)
    // Must meet the requirement |v| = |w| to use the formula
    // The formula above rotates v in the direction of w.
    const time = timer.getElapsedTime(); // time since the beginning
    let angle = time*speed + theta;
    let v = new THREE.Vector3();
    v.copy(scene.children[2].position);
    const normal = new THREE.Vector3();
    normal.copy(scene.children[3].position);
    normal.normalize();
    const crossed = new THREE.Vector3();
    crossed.crossVectors(normal, v);
    let rot_v = new THREE.Vector3();
    // Formula: Rot(v) = cos(theta)*(v) + sin(theta)*(normal cross v)
    rot_v.addVectors( v.multiplyScalar( Math.cos(angle) ), crossed.multiplyScalar( Math.sin(angle) ) );

    scene.children[ 4 ].position.copy(rot_v);

    // draw vectors
    const number_of_vectors = 4;
    for( let i = 1; i <= number_of_vectors; i++ ) {
        draw_vector( i );
    }

    // Rotate Plane
    const plane_space = scene.children[5];
    const plane_axis = scene.children[6];
    plane_space.lookAt( vector_normal );
    plane_axis.lookAt( vector_normal );

    renderer.render( scene, camera );
    labelRenderer.render( scene, camera );
};

init();
animate();

function draw_vector( index ) {
    let pixelDiv, pixelLabel;
    const vector = scene.children[ index ];
    pixelDiv = document.createElement( 'div' );
    pixelDiv.className = 'label';
    pixelDiv.textContent = String( Math.round( vector.position.x * 10 ) / 10  ) + "," 
                            + String( Math.round( vector.position.y * 10 ) / 10  ) + "," 
                            + String( Math.round( vector.position.z * 10 ) / 10  );
    pixelLabel = new CSS2DObject( pixelDiv );
    scene.children[ index ].remove(scene.children[ index ].children[0]);
    scene.children[ index ].add(pixelLabel);
}
