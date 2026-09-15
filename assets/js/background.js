/* ==========================================================================
   Music-reactive three.js backdrop: wireframe soundwave terrain, a circular
   equalizer ring, drifting particles and one wireframe solid per section that
   fades in as that section reaches the middle of the viewport.
   Purely decorative — the site works without it.
   ========================================================================== */

(function () {
  'use strict';

  var canvas = document.getElementById('bg3d');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  var ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF5C00';
  var raf = 0;

  function start() {
    var THREE = window.THREE;
    if (!THREE) { setTimeout(start, 120); return; }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      canvas.style.display = 'none';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0a, 0.0014);

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2200);
    camera.position.set(0, 0, 430);

    var ACC = new THREE.Color(ACCENT);
    var WHITE = new THREE.Color('#F2EFE9');

    /* soundwave terrain */
    var SEG = 60;
    var tgeo = new THREE.PlaneGeometry(2800, 1700, SEG, SEG);
    var tmat = new THREE.MeshBasicMaterial({ color: ACC, wireframe: true, transparent: true, opacity: 0.09 });
    var terrain = new THREE.Mesh(tgeo, tmat);
    terrain.rotation.x = -Math.PI / 2.1;
    terrain.position.set(0, -250, -320);
    scene.add(terrain);

    var tpos = tgeo.attributes.position;
    var bx = new Float32Array(tpos.count);
    var by = new Float32Array(tpos.count);
    for (var i = 0; i < tpos.count; i++) { bx[i] = tpos.getX(i); by[i] = tpos.getY(i); }

    /* circular equalizer */
    var ring = new THREE.Group();
    scene.add(ring);
    var BARS = 72;
    var bars = [];
    for (var j = 0; j < BARS; j++) {
      var g = new THREE.BoxGeometry(3.4, 30, 3.4);
      g.translate(0, 15, 0);
      var m = new THREE.MeshBasicMaterial({ color: j % 5 === 0 ? ACC : WHITE, transparent: true, opacity: 0.45 });
      var bar = new THREE.Mesh(g, m);
      var a = (j / BARS) * Math.PI * 2, R = 158;
      bar.position.set(Math.cos(a) * R, -36, Math.sin(a) * R);
      bar.lookAt(0, -36, 0);
      bar.rotateX(Math.PI / 2);
      ring.add(bar);
      bars.push(bar);
    }
    ring.position.set(0, -24, -50);
    ring.rotation.x = 0.52;

    /* drifting particles */
    var pc = 340;
    var pg = new THREE.BufferGeometry();
    var parr = new Float32Array(pc * 3);
    for (var k = 0; k < pc * 3; k++) parr[k] = (Math.random() - 0.5) * 1700;
    pg.setAttribute('position', new THREE.BufferAttribute(parr, 3));
    var points = new THREE.Points(pg, new THREE.PointsMaterial({ color: WHITE, size: 2, transparent: true, opacity: 0.32 }));
    scene.add(points);

    /* per-section wireframe solids */
    var sections = Array.prototype.slice.call(document.querySelectorAll('section'));
    var geos = [
      function () { return new THREE.IcosahedronGeometry(82, 1); },
      function () { return new THREE.TorusGeometry(72, 22, 16, 64); },
      function () { return new THREE.OctahedronGeometry(88, 0); },
      function () { return new THREE.TorusKnotGeometry(54, 15, 140, 16); },
      function () { return new THREE.DodecahedronGeometry(82, 0); },
      function () { return new THREE.SphereGeometry(82, 26, 18); },
      function () { return new THREE.ConeGeometry(72, 150, 44, 1, true); }
    ];
    var features = sections.map(function (s, idx) {
      var mat = new THREE.MeshBasicMaterial({ color: idx % 2 ? ACC : WHITE, wireframe: true, transparent: true, opacity: 0 });
      var mesh = new THREE.Mesh(geos[idx % geos.length](), mat);
      mesh.position.set((idx % 2 ? 1 : -1) * 168, (idx % 3 - 1) * 46, -10);
      mesh.userData = { vis: 0, target: 0, sx: Math.random() * 0.5 + 0.3, sy: Math.random() * 0.5 + 0.3 };
      scene.add(mesh);
      return mesh;
    });

    var mx = 0, my = 0, t = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    });
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Pause the loop when the tab is hidden — no point burning a GPU in the
    // background.
    var running = true;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; }
      else if (!running) { running = true; loop(); }
    });

    function loop() {
      if (!running) return;
      t += 0.016;

      for (var n = 0; n < tpos.count; n++) {
        var x = bx[n], y = by[n];
        tpos.setZ(n, Math.sin(x * 0.006 + t) * 30 + Math.cos(y * 0.0072 + t * 1.2) * 30);
      }
      tpos.needsUpdate = true;
      terrain.rotation.z = Math.sin(t * 0.1) * 0.05;

      bars.forEach(function (b, bi) {
        b.scale.y = 0.3 + Math.abs(Math.sin(t * 2 + bi * 0.5) * Math.cos(t * 1.3 + bi * 0.2)) * 2.6;
      });
      ring.rotation.y = t * 0.16;
      points.rotation.y = t * 0.02;
      points.rotation.x = t * 0.01;

      var vc = window.scrollY + window.innerHeight / 2;
      sections.forEach(function (s, si) {
        var r = s.getBoundingClientRect();
        var c = r.top + window.scrollY + r.height / 2;
        features[si].userData.target = Math.max(0, 1 - Math.abs(c - vc) / (window.innerHeight * 0.62));
      });
      features.forEach(function (f) {
        var u = f.userData;
        u.vis += (u.target - u.vis) * 0.07;
        f.material.opacity = u.vis * 0.5;
        var sc = 0.55 + u.vis * 0.6;
        f.scale.set(sc, sc, sc);
        f.rotation.x += 0.004 * u.sx + 0.0008;
        f.rotation.y += 0.005 * u.sy + 0.001;
      });

      camera.position.x += (mx * 64 - camera.position.x) * 0.04;
      camera.position.y += (-my * 40 - camera.position.y) * 0.04;
      camera.lookAt(0, -20, -50);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }

    loop();
    window.addEventListener('pagehide', function () { cancelAnimationFrame(raf); });
  }

  start();
})();
