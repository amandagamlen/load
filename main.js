import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'

// Set up scene, camera, and renderer
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(1, 1, 20)

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // Enable alpha for transparency
renderer.setClearColor(0x000000, 0) // Set background color to black and fully transparent
var canvas = renderer.domElement
document.body.appendChild(canvas)
renderer.setPixelRatio(2)

// Add ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // Intensity set to 0.5
scene.add(ambientLight)

// Add directional light to the scene
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5) // Intensity set to 0.5
directionalLight.position.set(100, 1000, 100)
scene.add(directionalLight)

// Load GLTF model
let model
let base = new THREE.Object3D()
scene.add(base)

const loader = new GLTFLoader()
loader.load(
  'assets/M-Logo.glb',
  function (gltf) {
    model = gltf.scene

    // Apply black material to the model
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x000000, // Set color to black
          transparent: true, // Enable transparency
          opacity: 1, // Set opacity to 1 (fully opaque)
        })
      }
    })

    model.scale.setScalar(2.5)
    base.add(model)
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  function (error) {
    console.log('An error happened')
  }
)

// Event listener for mouse move
var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2)
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var pointOfIntersection = new THREE.Vector3()
canvas.addEventListener('mousemove', onMouseMove, false)

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  raycaster.ray.intersectPlane(plane, pointOfIntersection)
  base.lookAt(pointOfIntersection)
}

// Resize renderer function
function resize(renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

// Render loop
renderer.setAnimationLoop(() => {
  if (resize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
  }
  renderer.render(scene, camera)
})
