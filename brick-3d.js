import * as THREE from './assets/vendor/three-0.180.0.module.min.js';

const mount = document.querySelector('[data-brick-webgl]');
const brickButton = document.querySelector('[data-brick]');
const hero = document.querySelector('.hero');

if (mount && brickButton && hero && window.WebGLRenderingContext) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.12, 6.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const makeClayTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 384;
      const context = canvas.getContext('2d');
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ad5a33');
      gradient.addColorStop(0.42, '#7c351f');
      gradient.addColorStop(1, '#3c180f');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      let seed = 7319;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let index = 0; index < 560; index += 1) {
        const x = random() * canvas.width;
        const y = random() * canvas.height;
        const radius = 1 + random() * 5;
        context.fillStyle = random() > 0.42 ? `rgba(242, 162, 99, ${0.08 + random() * 0.2})` : `rgba(29, 9, 5, ${0.12 + random() * 0.3})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      context.strokeStyle = 'rgba(38, 12, 7, .48)';
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(430, 30);
      context.lineTo(405, 105);
      context.lineTo(438, 171);
      context.lineTo(417, 254);
      context.stroke();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      return texture;
    };

    const makeLabelTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 360;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.textAlign = 'left';
      context.fillStyle = '#f0c784';
      context.shadowColor = 'rgba(30, 9, 5, .85)';
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.font = '500 104px Georgia, serif';
      context.fillText('FocusTube', 62, 152);
      context.fillStyle = '#d39155';
      context.font = '600 39px Arial, sans-serif';
      context.letterSpacing = '8px';
      context.fillText('RECOVERED RECORD 01', 66, 228);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const width = 3.3;
    const height = 1.42;
    const depth = 1.18;
    const radius = 0.12;
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 4
    });
    geometry.center();

    const brickMaterial = new THREE.MeshStandardMaterial({
      map: makeClayTexture(),
      color: 0xffffff,
      roughness: 0.98,
      metalness: 0,
      bumpMap: makeClayTexture(),
      bumpScale: 0.055
    });
    const brickMesh = new THREE.Mesh(geometry, brickMaterial);
    brickMesh.castShadow = true;
    brickMesh.receiveShadow = true;

    const labelMaterial = new THREE.MeshBasicMaterial({
      map: makeLabelTexture(),
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      toneMapped: false
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.95), labelMaterial);
    label.position.set(-0.12, -0.08, depth / 2 + 0.095);

    const brickGroup = new THREE.Group();
    brickGroup.add(brickMesh, label);
    scene.add(brickGroup);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.1, 3.1),
      new THREE.ShadowMaterial({ color: 0x090302, opacity: 0.52 })
    );
    shadowPlane.position.z = -1.02;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    scene.add(new THREE.HemisphereLight(0xffd49a, 0x210b07, 1.05));
    const keyLight = new THREE.DirectionalLight(0xffb45f, 2.15);
    keyLight.position.set(-3.5, 4.8, 6.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xffd98b, 1.35, 12);
    rimLight.position.set(3.6, -0.4, 4.2);
    scene.add(rimLight);

    const rest = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: -0.28, y: -0.68, z: -0.035 }
    };

    const setRestPose = () => {
      brickGroup.position.set(rest.position.x, rest.position.y, rest.position.z);
      brickGroup.rotation.set(rest.rotation.x, rest.rotation.y, rest.rotation.z);
      brickGroup.scale.setScalar(1);
    };
    setRestPose();

    const resize = () => {
      const widthPixels = Math.max(1, mount.clientWidth);
      const heightPixels = Math.max(1, mount.clientHeight);
      camera.aspect = widthPixels / heightPixels;
      camera.updateProjectionMatrix();
      renderer.setSize(widthPixels, heightPixels, false);
      renderer.render(scene, camera);
    };

    const render = () => renderer.render(scene, camera);
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    renderer.setAnimationLoop(render);

    const reset = () => {
      window.gsap?.killTweensOf([brickGroup.position, brickGroup.rotation, brickGroup.scale]);
      setRestPose();
      render();
    };

    const recover = ({ mobile = false, reduced = false } = {}) => {
      window.gsap?.killTweensOf([brickGroup.position, brickGroup.rotation, brickGroup.scale]);
      if (!window.gsap || reduced) {
        brickGroup.position.set(mobile ? 0 : 0.25, mobile ? -1.45 : -1.6, 0.18);
        brickGroup.rotation.set(2.45, 0.25, 0.08);
        render();
        return;
      }

      window.gsap.timeline({ defaults: { overwrite: 'auto' } })
        .to(brickGroup.position, { x: mobile ? 0 : -0.58, y: 0.02, z: 1.55, duration: 0.42, ease: 'power3.out' })
        .to(brickGroup.rotation, { x: -0.4, y: 0.48, z: -0.06, duration: 0.42, ease: 'power3.out' }, '<')
        .to(brickGroup.position, { x: mobile ? 0 : -0.16, y: -0.86, z: 1.18, duration: 0.34, ease: 'power1.in' })
        .to(brickGroup.rotation, { x: 1.06, y: -0.28, z: 0.15, duration: 0.34, ease: 'power1.in' }, '<')
        .to(brickGroup.position, { x: mobile ? 0 : 0.22, y: mobile ? -1.38 : -1.58, z: 0.18, duration: 0.31, ease: 'power2.in' })
        .to(brickGroup.rotation, { x: 2.48, y: 0.22, z: 0.08, duration: 0.31, ease: 'power2.in' }, '<')
        .to(brickGroup.position, { y: mobile ? -1.3 : -1.49, z: 0.27, duration: 0.12, ease: 'power2.out' })
        .to(brickGroup.rotation, { x: 2.34, duration: 0.12, ease: 'power2.out' }, '<')
        .to(brickGroup.position, { y: mobile ? -1.38 : -1.58, z: 0.18, duration: 0.1, ease: 'power1.in' })
        .to(brickGroup.rotation, { x: 2.48, duration: 0.1, ease: 'power1.in' }, '<');
    };

    brickButton.addEventListener('pointerenter', () => {
      if (hero.classList.contains('is-recovering') || !window.gsap) return;
      window.gsap.to(brickGroup.rotation, { x: -0.36, y: -0.86, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
    });
    brickButton.addEventListener('pointerleave', () => {
      if (hero.classList.contains('is-recovering') || !window.gsap) return;
      window.gsap.to(brickGroup.rotation, { ...rest.rotation, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
    });

    window.brick3D = { recover, reset, render };
    hero.classList.add('has-webgl-brick');
    resize();
  } catch (error) {
    console.warn('3D brick unavailable; using the CSS cuboid fallback.', error);
  }
}
