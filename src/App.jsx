import { useState } from 'react';
import * as THREE from 'three';
import Canvas from './Canvas';
import './App.css';

/**
 * Tamaño del canvas
 */
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}



// Funcion para actualizar el tamaño del canvas

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function App() {
    // Canvas
  const canvas = document.querySelector('canvas.webgl');

  // Scene
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 2

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const clock = new THREE.Clock()
  const tick = () =>
  {
      const elapsedTime = clock.getElapsedTime()

      renderer.render(scene, camera)
      
      window.requestAnimationFrame(tick)

  }

  tick()
  

  return (
    <>
      <Canvas/>   
    </>
  )
}

export default App
