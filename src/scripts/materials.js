// ##################################
// IMPORTS
// ##################################
//
//
import * as THREE from 'three';


// ##################################
// GLOBALS
// ##################################
//
//
const loader = new THREE.TextureLoader();


// ##################################
// FUNCTIONS TO GENERATE MATERIALS
// ##################################
//
//
// MATERIALS FOR FOUNDATIONAL BLOCK
const generateBasicMaterials = () => {
    // LOAD TEXTURES
    const blueTexture = loader.load('./src/assets/blue.jpg');
    const redTexture = loader.load('./src/assets/red.jpg');

    // DEFINE MATERIALS FOR ALL FACES
    const blueFace = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: blueTexture })
    const redFace = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: redTexture })
    const transparentFace = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1 })

    // ASSEMBLE MATERIALS ARRAY
    let materials = [
        blueFace,
        blueFace,
        transparentFace,
        transparentFace,
        redFace,
        redFace,
    ];

    // RETURN MATERIALS ARRAY
    return materials
}

// MATERIALS FOR HADAMARD BLOCKS
const generateHadamardMaterials = () => {
    // LOAD TEXTURES
    const hadamardBlueRedTexture = loader.load('./src/assets/hdm-blue-red.jpg');
    const hadamardRedBlueTexture = loader.load('./src/assets/hdm-red-blue.jpg');

    // DEFINE MATERIALS FOR ALL FACES
    const hadamardBlueRedFace = new THREE.MeshBasicMaterial({ map: hadamardBlueRedTexture, side: THREE.DoubleSide })
    const transparentFace = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1 })
    const hadamardRedBlueFace = new THREE.MeshBasicMaterial({ map: hadamardRedBlueTexture, side: THREE.DoubleSide })

    // ASSEMBLE MATERIALS ARRAY
    let hadamardMaterials = [
        hadamardBlueRedFace,
        hadamardBlueRedFace,
        transparentFace,
        transparentFace,
        hadamardRedBlueFace,
        hadamardRedBlueFace,
    ]

    // RETURN MATERIALS ARRAY
    return hadamardMaterials
}


// ##################################
// CALLS
// ##################################
//
//
const materials = generateBasicMaterials()
const hadamardMaterials = generateHadamardMaterials()


// ##################################
// EXPORTS
// ##################################
//
//
export { materials, hadamardMaterials }
