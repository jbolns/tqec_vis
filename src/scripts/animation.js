// ##################################
// MAIN THREE IMPORTS
// ##################################
//
//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// ##################################
// DATA
// ##################################
//
//
import * as IMPORTER from "./importer"

// ##################################
// GLOBAL DEFINITIONS
// ##################################
//
//
let container;
let camera, scene, renderer;
let controls, group;
let enableSelection = true;
const objects = [];
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();


// ##################################
// SCENE INITIALISATION
// ##################################
//
//

export default async function init(data_filename) {

    const BLOCKS = await IMPORTER.get_blocks(data_filename)
    const EDGES = await IMPORTER.get_edges(data_filename, BLOCKS)


    // CREATE DOCUMENT ELEMENT
    const target = document.getElementById("animation-wrapper")
    container = document.createElement("div");
    container.id = "animation-canvas"
    target.appendChild(container);

    // LOAD SCENE
    scene = new THREE.Scene();

    // CONFIGURE RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // ADD LIGHT
    const ambient = new THREE.AmbientLight(0xffffff)
    const hemi = new THREE.HemisphereLight(0xffffff, 1);
    hemi.position.set(10, 10, 10);
    const spotlight1 = new THREE.SpotLight(0xffffff, 10000)
    spotlight1.position.set(0, 25, 50);
    spotlight1.castShadow = true;
    scene.add(ambient, hemi, spotlight1);

    // TURN CAMERAS ON
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(12, 9, 2);

    // ADD GRID
    const grid = new THREE.GridHelper(50, 50, 0xff0000, 0xffffff)
    grid.position.set(0.5, -0.5, 0.5)
    const baseGeo = new THREE.PlaneGeometry(50, 50)
    baseGeo.rotateX(- Math.PI / 2)
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide })
    const ground = new THREE.Mesh(baseGeo, baseMat)
    ground.position.set(0, -0.5, 0)
    scene.add(grid, ground)

    // CREATE A GROUP IN CASE ITS NEEDED
    group = new THREE.Group();
    scene.add(group);

    // CREATE BASE GEOMETRY FOR ALL BLOCKS
    let geometry = new THREE.BoxGeometry();
    const loader = new THREE.TextureLoader();
    const texture_transp_face = loader.load('./src/assets/face_transparent.png');
    const texture_blue_face = loader.load('./src/assets/face_blue.png');
    const texture_red_face = loader.load('./src/assets/face_red.png');
    const texture_hadamard_blue = loader.load('./src/assets/hadamard_blue.png');
    const texture_hadamard_red = loader.load('./src/assets/hadamard_red.png');

    let materials = [
        new THREE.MeshBasicMaterial({ map: texture_blue_face, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_blue_face, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_transp_face, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_transp_face, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_red_face, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_red_face, side: THREE.DoubleSide }),
    ];

    let hadamard_materials = [
        new THREE.MeshBasicMaterial({ map: texture_hadamard_blue, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_hadamard_blue, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_transp_face, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_transp_face, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_hadamard_red, side: THREE.DoubleSide }),
        new THREE.MeshBasicMaterial({ map: texture_hadamard_red, side: THREE.DoubleSide }),
    ]

    // RENDER NODES
    for (const key in BLOCKS) {

        // Extract variables from item dictionary for easier manipulation
        let [x, y, z, rot_x, rot_y, rot_z, scale_x, scale_y, scale_z] = Object.values(BLOCKS[key]["coord"])
        const type = BLOCKS[key]["type"]

        // Pick appropriate color/texture & define geometry
        let object = new THREE.Mesh(geometry, materials);
        if (type === "hadamard") {
            object = new THREE.Mesh(geometry, hadamard_materials);
        }

        // Define object position
        object.position.set(x, y, z);
        object.rotation.set(rot_x, rot_y, rot_z)
        object.scale.set(scale_x, scale_y, scale_z)

        // Add object to scene
        scene.add(object);

        // Add object to global objects array
        objects.push(object);
    }

    // RENDER EDGES
    for (const key in EDGES) {
        let [x, y, z, rot_x, rot_y, rot_z, scale_x, scale_y, scale_z] = Object.values(EDGES[key])
        const color = 0x222222
        const object = new THREE.Mesh(geometry, materials)

        // Define object position
        object.position.set(x, y, z);
        object.rotation.set(rot_x, rot_y, rot_z)
        object.scale.set(scale_x, scale_y, scale_z)

        // Add object to scene
        scene.add(object);

        // Add object to global objects array
        objects.push(object);
    }

    // ORBIT CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);  // re-render on change


    // Bunch of event listeners
    window.addEventListener('resize', onWindowResize);  // Adjust camera, render on window resize

    // Render
    startStopAnimFrame()
}


// ##################################
// FUNCTIONS NEEDED FOR INTERACTIVITY
// ##################################
//
//
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();

}

function render() {
    renderer.render(scene, camera);
    scene.rotation.y -= 0.001
}

function startStopAnimFrame() {
    var id
    async function animate() {
        id = requestAnimationFrame(animate)
        scene.rotation.y -= 0.0005
        renderer.render(scene, camera)
    }
    animate()
    setTimeout(() => {
        cancelAnimationFrame(id)
    }, "1000");
}


function dispose() {
    var to_remove = []
    scene.traverse(child => {
        to_remove.push(child);
    });

    for (var i = 0; i < to_remove.length; i++) {
        scene.remove(to_remove[i]);
    }

    renderer.dispose()
    scene.clear()
}

export { dispose }
