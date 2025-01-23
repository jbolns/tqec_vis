// ##################################
// IMPORTS
// ##################################
//
//
import * as THREE from 'three';
import { materials, hadamardMaterials } from "./materials";


// ##################################
// GLOBALS
// ##################################
//
//
const cubeGeo = new THREE.BoxGeometry();
const generateCubePrimitive = () => {
  const cube = new THREE.Mesh(cubeGeo, materials)
  return cube
}
const generateHadamardPrimitive = () => new THREE.Mesh(cubeGeo, hadamardMaterials)

// ##################################
// CALLS
// ##################################
//
//
const cubePrimitive = generateCubePrimitive()
const hadamardPrimitive = generateHadamardPrimitive()

// ##################################
// EXPORTS
// ##################################
//
//
export { cubeGeo }
