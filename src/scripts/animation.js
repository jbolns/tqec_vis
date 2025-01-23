// ##################################
// IMPORTS
// ##################################
//
//
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as IMPORTER from "./importer"
import { materials, hadamardMaterials } from "./materials";
import { updateKeyCache, onDoubleClick, onMouseDown, onContextMenu } from "./actions"
import { cubeGeo } from "./primitives";

// ##################################
// GLOBALS
// ##################################
//
//
let container;
let camera, scene, renderer;
let controls, group;
let objects = [];


// ##################################
// SCENE INITIALISATION
// ##################################
//
//
// INITIALISE ANIMATION
export default async function init(data_filename) {

    // GET INITIAL GRAPH DATA
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
    scene.add(ambient);

    // ADD GRID
    const grid = new THREE.GridHelper(50, 50, 0x000000, 0x000000)
    grid.position.set(0.5, -0.5, 0.5)
    scene.add(grid)

    // CREATE A GROUP IN CASE ITS NEEDED
    group = new THREE.Group();
    scene.add(group);

    // BASE GEOMETRIES & MATERIALS
    // To keep file short, geometries & materials must be global or imported

    // RENDER NODES
    for (const key in BLOCKS) {

        // Extract variables from item dictionary for easier manipulation
        let [x, y, z, rot_x, rot_y, rot_z, scale_x, scale_y, scale_z] = Object.values(BLOCKS[key]["coord"])
        const type = BLOCKS[key]["type"]

        // Pick appropriate color/texture & define geometry
        let object = new THREE.Mesh(cubeGeo, materials);
        if (type === "hadamard") {
            object = new THREE.Mesh(cubeGeo, hadamardMaterials);
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
        const object = new THREE.Mesh(cubeGeo, materials)

        // Define object position
        object.position.set(x, y, z);
        object.rotation.set(rot_x, rot_y, rot_z)
        object.scale.set(scale_x, 2, scale_z)

        // Add object to scene
        //scene.add(object);

        // Add object to global objects array
        //objects.push(object);
    }

    // TURN CAMERAS ON (and position relative to structure size)
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 750);
    const xx = objects.map(object => object.position.y)
    const yy = objects.map(object => object.position.y)
    camera.position.set(Math.max(...xx) + 2, Math.max(...yy) + 2, 2);

    // ORBIT CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);  // re-render on change

    // BUNCH OF EVENT LISTENERS
    window.addEventListener("resize", onWindowResize);  // Adjust camera, render on window resize
    document.addEventListener("dblclick", (event) => onDoubleClick(scene, camera, objects, event));  // Fires on double click
    document.addEventListener("mousedown", (event) => onMouseDown(scene, objects, event)) // Fires on single click
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", updateKeyCache) // Fires on pressing any key
    document.addEventListener("keyup", updateKeyCache) // Fires on pressing any key
    


    // RENDER
    startFrame()
}


// ##################################
// STANDARD INTERACTIVITY OPERATIONS
// ##################################
//
//
// HANDLE WINDOW RESIZING
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// CALL THREEJS RENDERER
function render() {
    renderer.render(scene, camera);

}

// START THREEJS ANIMATION
function startFrame() {
    var id
    async function animate() {
        id = requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()
}

// DISPOSE OF THREEJS SCENE
function disposeScene() {
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