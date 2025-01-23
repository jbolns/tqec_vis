// ##################################
// MAIN THREE IMPORTS
// ##################################
//
//
import * as THREE from "three"
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
import { GUI } from "./dat.gui.module"
import { materials, hadamardMaterials } from "./materials"
import { cubeGeo } from "./primitives"
import { act } from "react"


// ##################################
// GLOBALS
// ##################################
//
//
let ctrlPressed = false
let shiftPressed = false
let xPressed = false
let yPressed = false
let zPressed = false
let activeAxis = "none"
let SELECTED = null
const gui = new GUI()

// ##################################
// EVENT HANDLERS
// ##################################
//
//
// HANDLE KEY PRESS
function updateKeyCache(event) {
  console.log(activeAxis, event.key)
  ctrlPressed = event.ctrlKey
  shiftPressed = event.shiftKey

  const axes = ["x", "y", "z", "Alt"]
  if (axes.includes(event.key)) {
    activeAxis = event.key === "Alt" ? "none" : event.key
  }

  let delta = 0
  if (activeAxis !== "none" && SELECTED) {

    if (event.key === "ArrowDown" || event.key === "ArrowLeft") { delta = -1 }
    if (event.key === "ArrowUp" || event.key === "ArrowRight") { delta = 1 }

    if (!shiftPressed) {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (activeAxis === "x") SELECTED.position.x += delta
        if (activeAxis === "y") SELECTED.position.y += delta
        if (activeAxis === "z") SELECTED.position.z += delta
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (activeAxis === "x") SELECTED.scale.x += delta
        if (activeAxis === "y") SELECTED.scale.y += delta
        if (activeAxis === "z") SELECTED.scale.z += delta
      }
    }

    if (shiftPressed) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (activeAxis === "x") SELECTED.rotation.x += delta * (Math.PI / 4)
        if (activeAxis === "y") SELECTED.rotation.y += delta * (Math.PI / 4)
        if (activeAxis === "z") SELECTED.rotation.z += delta * (Math.PI / 4)
      }
    }

  }
}

// HANDLE DOUBLE-CLICK EVENTS
function onDoubleClick(scene, camera, objects, event) {

  // GET POINTER POSITION
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1

  // TRIGGER ACTIONS AS APPLICABLE
  if (event.which === 1 || event.button === 0) {  // Ensures primary button was clicked

    // Delete if CTRL is pressed, else select
    if (ctrlPressed) {
      selectDeletePrimitive(scene, camera, objects, pointer, "delete")
    } else {
      selectDeletePrimitive(scene, camera, objects, pointer, "select")
    }
  }
}

// HANDLE SINGLE CLICK EVENTS
function onMouseDown(scene, objects, event) {

  // PRIMARY BUTTON
  // Go for default behaviour (rotating scene)
  if (event.which === 1 || event.button === 0) { }

  // MIDDLE BUTTON/WHEEL
  // Go for default behaviour (zooming scene)
  if (event.which === 2 || event.button === 1) { }

  // SECONDARY MOUSE BUTTON
  // Add cube
  if (event.which === 3 || event.button === 2) {
    if (ctrlPressed) {
      askCubeType(scene, objects)
    }
  }
}


// ##################################
// ON-SCREEN ACTIONS
// ##################################

// SELECT OR DELETE CUBES
function selectDeletePrimitive(scene, camera, objects, pointer, operation) {

  // CONTINUOUSLY UPDATE OBJECT-POINTER INTERSECTIONS
  raycaster.setFromCamera(pointer, camera)
  var intersects = raycaster.intersectObjects(objects, false)

  // HANDLE INTERSECTIONS
  // Select object if intersections exist, else unload controls
  if (intersects.length > 0) {

    // Only take action if object is NOT already selected 
    if (SELECTED != intersects[0].object) {

      // Remove controls for previous object
      gui.__controllers.toReversed().map(controller => controller.remove())

      // Select new object
      SELECTED = intersects[0].object


      // Call controls (if operation is select)
      if (operation === "select") {
        manualGUI(scene, SELECTED)
      }

      // Remove selection (if operation is delete)
      if (operation === "delete") {

        // Remove geometries and materials for performance
        // (three.js should auto-ignore if geometry/material used elsewhere)
        if (SELECTED.geometry) SELECTED.geometry.dispose()
        if (SELECTED.material) {
          if (SELECTED.material instanceof Array) {
            SELECTED.material.forEach(material => material.dispose())
          } else {
            SELECTED.material.dispose()
          }
        }

        // Remove from scene
        scene.remove(SELECTED)

        // Remove from global objects array
        objects = objects.filter(object => object.id !== SELECTED.id)

        // Clear selection
        SELECTED = null
      }
    }

  } else {
    // Remove any open controls
    // (In practice, this triggers only if double clicks empty space)
    gui.__controllers.toReversed().map(controller => controller.remove())
    SELECTED = null
  }
}

// ADD CUBES
function addPrimitive(scene, objects, objType) {

  // REMOVE TYPE SELECTION DIV
  let element = document.getElementById("pop-menu")
  element.remove()

  // DEFINE OBJECT & OBJECT POSITIONS
  let object = new THREE.Mesh(cubeGeo, materials)
  if (objType === "hadamard") {
    object = new THREE.Mesh(cubeGeo, hadamardMaterials)
  }

  object.position.set(-3, 0, 0)
  object.rotation.set(0, 0, 0)
  object.scale.set(1, objType === "separator" ? 2 : 1, 1)


  // ADD TO SCENE
  scene.add(object)

  // ADD TO GLOBAL OBJECTS ARRAY
  objects.push(object)
}


// ##################################
// GUI
// ##################################
//
//
// OPEN/CLOSE GUI UPON SELECTING OBJECTS
function manualGUI(scene, selectedObject) {

  // DEFINE TARGET
  let target = scene.getObjectById(selectedObject.id)

  // POPULATE CONTROLS FOR TARGET
  // Position
  gui.add(target.position, "x", -10, 10, 1).name("Position X")
  gui.add(target.position, "y", -10, 10, 1).name("Position Y")
  gui.add(target.position, "z", -10, 10, 1).name("Position Z")

  // Rotation
  gui.add(target.rotation, "x", 0, Math.PI * 2, Math.PI / 2).name("Rotation X")
  gui.add(target.rotation, "y", 0, Math.PI * 2, Math.PI / 2).name("Rotation Y")
  gui.add(target.rotation, "z", 0, Math.PI * 2, Math.PI / 2).name("Rotation Z")

  // Scale 
  // !!! Might remove if implementing menu of pre-defined blocks
  gui.add(target.scale, "x", 0, 3, 1).name("Scale X")
  gui.add(target.scale, "y", 0, 3, 1).name("Scale Y")
  gui.add(target.scale, "z", 0, 3, 1).name("Scale Z")
}

// ##################################
// EXPORTS
// ##################################
//
//
function askCubeType(scene, objects) {

  const cubeTypes = ["standard", "hadamard", "separator"]

  let element = document.createElement("div")
  element.id = "pop-menu"

  let p = document.createElement("p")
  p.innerText = "add cube of type:"
  element.appendChild(p)

  let ul = document.createElement("ul")
  ul.id = "pop-ul"
  element.appendChild(ul)

  cubeTypes.forEach((item) => {
    let tag = document.createElement("li")
    tag.id = "pop-li"
    tag.innerText = item
    tag.addEventListener("click", (event) => addPrimitive(scene, objects, item)) // Fires on single click
    ul.appendChild(tag)
  })

  document.body.append(element)
}

// Avoid conflicts with context menu when clicking secondary button
function onContextMenu(event) {
  if (ctrlPressed) {
    event.preventDefault()
  }
}

// ##################################
// EXPORTS
// ##################################
//
//
export { addPrimitive, selectDeletePrimitive, updateKeyCache, onDoubleClick, onMouseDown, onContextMenu }