import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gltfLoader } from '@/services/Loaders.js'
import { Water } from 'three/examples/jsm/objects/Water.js'
import * as dat from 'dat.gui'
import ColorGUIHelper from '@/helpers/ColorGUIHelper.js'
import MinMaxGUIHelper from '@/helpers/MinMaxGUIHelper.js'

export default class Iceberg {
  constructor(el, width, height) {
    this.el = el;
    
    // values used
    this.height = height
    this.width = width
    this.planeSize = 1000

    this.init()
  }

  async init() {
    this.renderer = this.createRenderer()
    this.camera = this.createCamera(75, 0.1, 500)
    this.controls = this.createOrbitControl()
    this.scene = this.createScene()
    // this.texture = this.createTexture()
    this.water = this.createWater()
    this.light = this.createLight()
    this.gui = this.createGuiHelper()
    // this.createCube()
    // this.createSphere()
    this.iceberg = await this.loadObject()
    requestAnimationFrame(this.render.bind(this));
  }

  async loadObject() {
    const object = await gltfLoader('/data/iceberg2/iceberg.gltf')
    //object.scene.scale.set(5, 5, 5)
    object.scene.position.set(-60, -2.2, -70)
    this.scene.add(object.scene)
    return object.scene
  }

  render() {
    const time = performance.now() * 0.001;
    this.water.material.uniforms[ 'time' ].value += 1.0 / 160.0;
    this.iceberg.position.y = Math.sin( time ) * 0.7  - 2.1;
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }

  updateCamera() {
    this.camera.updateProjectionMatrix()
  }

  /**
   * 
   * Create
   * 
   */
  createGuiHelper() {
    const gui = new dat.GUI();
    // lights
    const skyHelper = new ColorGUIHelper(this.light, 'color')
    gui.addColor(skyHelper, 'value').name('color');
    gui.add(this.light, 'intensity', 0, 2, 0.01);
    gui.add(this.light.target.position, 'x', -10, 10);
    gui.add(this.light.target.position, 'z', -10, 10);
    gui.add(this.light.target.position, 'y', 0, 10);

    // camera
    gui.add(this.camera, 'fov', 1, 180).onChange(this.updateCamera.bind(this));
    const minMaxGUIHelper = new MinMaxGUIHelper(this.camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(this.updateCamera.bind(this));
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(this.updateCamera.bind(this));
    return gui
  }

  createLight() {
    const color = 0xFFFFFF;
    // const skyColor = 0xB1E1FF
    // const groundColor = 0xB97A20
    const intensity = 1
    // const light = new THREE.AmbientLight(color, intensity)
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    this.scene.add(light)
    this.scene.add(light.target)
    return light
  }

  createTexture() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/data/checker.png')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = this.planeSize / 2;
    texture.repeat.set(repeats, repeats);
    return texture
  }

  createCube(size = 4) {

      const cubeSize = size;
      const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      this.scene.add(mesh);
      return mesh
  }

  createSphere(radius = 3, wDivisions = 32, hDivisions = 16) {
    const sphereRadius = radius;
    const sphereWidthDivisions = wDivisions;
    const sphereHeightDivisions = hDivisions;
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    this.scene.add(mesh);
    return mesh
  }

  createWater() {
    const waterGeometry = new THREE.PlaneBufferGeometry( this.planeSize, this.planeSize );
    const waterOptions = {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      alpha: 0.4,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: this.scene.fog !== undefined
    }
    const water = new Water( waterGeometry, waterOptions )
		water.rotation.x = - Math.PI / 2;

		this.scene.add( water );
    return water;
  }

  createCamera(fov = 45, n = 0.1, f = 100) {
    const fieldOfView =  fov
    const aspectRatio =  this.width / this.height
    const near =  n
    const far =  f
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far)
    camera.position.set(0, 3, 12)// = this.vector(0,10,20)
    return camera
  }

  createOrbitControl() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.target.set(0, 5, 0)
    controls.update()
    return controls
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(this.width, this.height)
    this.el.appendChild(renderer.domElement)
    return renderer
  }

  createScene() {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x1E5A99 )
    return scene
  }

  /**
   *
   * Utils
   * 
   */

  vector(x = 0, y = 0, z = 0) {
    return new THREE.Vector3( x, y, z )
  }
}