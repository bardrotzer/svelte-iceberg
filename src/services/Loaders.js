import { TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'


// this utility function allows you to use any three.js
// loader with promises and async/await
export const gltfLoader = url => {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject);
  });
}

export const objLoader = url => {
  const loader = new OBJLoader2()
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject);
  });
}

export const textureLoader = url => {
  const loader = new TextureLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject);
  });
}