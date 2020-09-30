import * as THREE from 'three';
import * as dat from 'dat.gui'
import AxisGridHelper from '@/helpers/AxisGridHelper.js'

export default class Sun {
  constructor(el, width, height) {
    this.el = el;
    
    // values used
    this.height = height
    this.width = width
    this.fieldOfView = 40
    this.aspectRatio = width / height
    this.near = 0.1
    this.far = 1000
    this.gui = new dat.GUI()
    // values to be set elsewhere
    this.planets = []
    this.orbits = []
    this.camera = null // will be set by setCamera
    this.light = null // will be set by setLight
    this.scene =  this.createScene()
    this.solarSystem = this.createOrbit(this.scene, null, 'solarsystem', {divisions: 26}) // will be set by createScene
    this.earthOrbit = this.createOrbit(this.solarSystem, this.vector(10), 'earthorbit')
    this.moonOrbit = this.createOrbit(this.earthOrbit, this.vector(2), 'moonOrbit')
    // setting values to use
    this.planetPrimitive = this.createPlanetPrimitive()
    // setup
    this.setRenderer()
    this.setCamera()
    // sun
    this.createPlanet({ emissive: 0xFFE285 }, this.vector(5,5,5), this.solarSystem, 'sun')
    // earth
    this.createPlanet({color: 0x2233FF, emissive: 0x112244}, null, this.earthOrbit, 'earth')
    // moon
    this.createPlanet({color: 0x88888, emissive: 0x222222}, this.vector(.5,.5,.5), this.moonOrbit, 'moon')

    this.createAxisHelper()

    this.setLight()
    // draw the scene
    this.draw()
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.width, this.height)
    this.el.appendChild(this.renderer.domElement)
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, this.near, this.far)
    this.camera.position.set(0,50,0)
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);
  }

  createOrbit(_parent, _pos, _label = null, _userData = null) {
    const orbit = new THREE.Object3D()
    if (_pos) {
      orbit.position.set(_pos.x, _pos.y, _pos.x)
    }
    if (_label) {
      orbit.name = _label
    }
    if (_userData) {
      for (const [key, value] of Object.entries(_userData)) {
        orbit.userData[key] = value
      }
    }
    _parent.add(orbit)
    this.planets.push(orbit)
    return orbit
  }

  createScene( config = { color: 0x00E0E0 }) {
    const scene = new THREE.Scene()

    if (config.color) {
      scene.background = new THREE.Color( 0x000000 )
    }
    return scene
  }

  setLight() {
    const color = 0xFFFFFF;
    const intensity = 3;
    this.light = new THREE.PointLight(color, intensity);
    // this.light.position.set(-1, 2, 4);
    this.scene.add(this.light);
  }

  createPlanetPrimitive() {
    const radius = 1
    const widthSegments = 6
    const heightSegments = 6
    return new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments)
  }

  createPlanet(_material, _scale = null, _parent = null, _label) {
    const material = new THREE.MeshPhongMaterial(_material)
    const planet = new THREE.Mesh(this.planetPrimitive, material)
    if (_scale) {
      planet.scale.set(_scale.x, _scale.y ,_scale.z)
    }
    if (_parent) {
      _parent.add(planet)
    } else {
      this.solarSystem.add(planet)
    }
    if (_label) {
      planet.name = _label
    }
    this.planets.push(planet)
    return planet
  }

  draw() {
    console.log(this.planets)
    this.renderer.render(this.scene, this.camera)
    this.el.appendChild(this.renderer.domElement)
    this.render()
  }

  render(time) {
    time = time * 0.001
    this.planets.forEach((obj) => {
      obj.rotation.y = time;
    });
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }

  createAxisHelper() {
    this.planets.forEach((node) => {
      this.makeAxisGrid(node)
    });
  }

  makeAxisGrid(node) {
    const helper = new AxisGridHelper(node);
    this.gui.add(helper, 'visible').name(node.name);
  }

  vector(x = 0, y = 0, z = 0) {
    return new THREE.Vector3( x, y, z )
  }
}
