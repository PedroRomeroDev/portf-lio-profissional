(function () {
  gsap.registerPlugin(ScrollTrigger);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var boot = document.getElementById('boot');
  var hasGL = (function () {
    try {
      var c = document.createElement('canvas');
      return !!(window.THREE && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  })();

  var pageReady = (function () {
    var loaded = new Promise(function (resolve) {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
      setTimeout(resolve, 8000);
    });
    var fonts = Promise.resolve();
    if (document.fonts && document.fonts.load) {
      fonts = Promise.all([
        document.fonts.load('700 72px "Chakra Petch"'),
        document.fonts.load('400 28px "Chakra Petch"'),
        document.fonts.load('500 26px "JetBrains Mono"')
      ]).catch(function () {});
    }
    return Promise.all([loaded, fonts]);
  })();

  function initParticles() {
    if (!window.tsParticles) return;
    tsParticles.load('particles', {
      fpsLimit: 60,
      detectRetina: true,
      background: { color: 'transparent' },
      particles: {
        number: { value: window.innerWidth < 700 ? 35 : 75, density: { enable: true, area: 900 } },
        color: { value: ['#3b4052', '#4b5063', '#2f3447'] },
        opacity: { value: .5 },
        size: { value: { min: 1, max: 2.6 } },
        links: { enable: true, distance: 140, color: '#3b4052', opacity: .45, width: 1 },
        move: { enable: !reduce, speed: .6, outModes: { default: 'out' } }
      },
      interactivity: {
        events: { onHover: { enable: !reduce, mode: 'grab' }, onClick: { enable: !reduce, mode: 'push' } },
        modes: { grab: { distance: 160, links: { opacity: .7, color: '#5a6075' } }, push: { quantity: 3 } }
      }
    });
  }

  function initTyped() {
    if (!window.Typed) return;
    new Typed('#typed', {
      strings: ['Desenvolvedor back-end em formação', 'Estudante de Software Multiplataforma', 'Desenvolvedor de APIs e Sistemas'],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1600,
      loop: true,
      smartBackspace: true
    });
  }

  function runCounters() {
    document.querySelectorAll('[data-n]').forEach(function (el) {
      var end = +el.dataset.n, o = { v: 0 };
      if (reduce) {
        el.textContent = end;
        return;
      }
      gsap.to(o, {
        v: end,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(o.v); }
      });
    });
    document.querySelectorAll('.hud .meter i').forEach(function (i) {
      gsap.to(i, { width: i.dataset.w + '%', duration: reduce ? 0 : 1.6, ease: 'power3.out' });
    });
  }

  function intro() {
    document.body.classList.remove('booting');
    runCounters();
    ScrollTrigger.refresh();
    if (reduce) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.status', { opacity: 0, x: -24, duration: .6 })
      .from('.hero h1', { opacity: 0, yPercent: 40, skewX: -8, duration: .9 }, '-=.3')
      .from('.role,.lead,.btns', { opacity: 0, y: 18, duration: .7, stagger: .1 }, '-=.4')
      .from('.hud', { opacity: 0, x: 60, rotateY: -18, duration: 1, transformPerspective: 800 }, '-=.8');
  }

  function runBoot(done) {
    var name = document.querySelector('.hero h1').textContent;
    var role = 'Desenvolvedor back-end em formação';
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    boot.insertBefore(renderer.domElement, boot.firstChild);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, .1, 100);
    var look = new THREE.Vector3(0, .55, 0);
    var center = new THREE.Vector3(0, 1.114, -1.37);
    var normal = new THREE.Vector3(0, .257, .966).normalize();

    function farDist() {
      return window.innerWidth / window.innerHeight < 1 ? 10.5 : 7.2;
    }

    function coverDist() {
      var a = window.innerWidth / window.innerHeight;
      return Math.min(2.76, 4.356 / a) * .98;
    }

    camera.position.set(0, 3.4, farDist() + 1.5);

    scene.add(new THREE.AmbientLight(0x8899bb, .6));
    var key = new THREE.DirectionalLight(0xffffff, .9);
    key.position.set(3, 6, 5);
    scene.add(key);
    var rim = new THREE.PointLight(0x4f8cff, 1.3, 22);
    rim.position.set(-4, 3, -3);
    scene.add(rim);
    var glow = new THREE.PointLight(0x4f8cff, 0, 9);
    glow.position.set(0, 1.4, 1.4);
    scene.add(glow);

    var metal = new THREE.MeshStandardMaterial({ color: 0x2a2f42, metalness: .85, roughness: .35 });
    var laptop = new THREE.Group();
    scene.add(laptop);

    laptop.add(new THREE.Mesh(new THREE.BoxGeometry(3.2, .12, 2.2), metal));

    var kc = document.createElement('canvas');
    kc.width = 1024;
    kc.height = 420;
    var kx = kc.getContext('2d');
    kx.fillStyle = '#0d1019';
    kx.fillRect(0, 0, 1024, 420);
    kx.fillStyle = '#1b2030';
    for (var r = 0; r < 4; r++) {
      for (var k = 0; k < 14; k++) kx.fillRect(12 + k * 72, 14 + r * 76, 64, 66);
    }
    kx.fillRect(12, 318, 200, 66);
    kx.fillRect(228, 318, 560, 66);
    kx.fillRect(804, 318, 208, 66);
    var keys = new THREE.Mesh(
      new THREE.PlaneGeometry(2.9, 1.18),
      new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(kc), roughness: .7, metalness: .2 })
    );
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, .062, -.35);
    laptop.add(keys);

    var pad = new THREE.Mesh(
      new THREE.PlaneGeometry(1, .6),
      new THREE.MeshStandardMaterial({ color: 0x1a1e2c, metalness: .6, roughness: .5 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(0, .062, .65);
    laptop.add(pad);

    var pivot = new THREE.Group();
    pivot.position.set(0, .1, -1.1);
    pivot.rotation.x = Math.PI / 2;
    laptop.add(pivot);

    var lid = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.1, .08), metal);
    lid.position.y = 1.05;
    pivot.add(lid);

    var sc = document.createElement('canvas');
    sc.width = 1280;
    sc.height = 800;
    var sx = sc.getContext('2d');
    var stex = new THREE.CanvasTexture(sc);
    stex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.9), new THREE.MeshBasicMaterial({ map: stex }));
    screen.position.set(0, 1.05, .0415);
    pivot.add(screen);

    var logo = new THREE.Mesh(new THREE.CircleGeometry(.12, 32), new THREE.MeshBasicMaterial({ color: 0x4f8cff }));
    logo.position.set(0, 1.05, -.0415);
    logo.rotation.y = Math.PI;
    pivot.add(logo);

    var gc = document.createElement('canvas');
    gc.width = 256;
    gc.height = 256;
    var gx = gc.getContext('2d');
    var grad = gx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0,0,0,.75)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    gx.fillStyle = grad;
    gx.fillRect(0, 0, 256, 256);
    var shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -.07;
    scene.add(shadow);

    function drawBoot(p) {
      var g = sx.createLinearGradient(0, 0, 0, 800);
      g.addColorStop(0, '#0b0f1d');
      g.addColorStop(1, '#06070c');
      sx.fillStyle = g;
      sx.fillRect(0, 0, 1280, 800);
      sx.textAlign = 'center';
      sx.fillStyle = '#e8ecff';
      sx.font = '700 72px "Chakra Petch", sans-serif';
      sx.fillText(name, 640, 330);
      sx.fillStyle = '#8189a6';
      sx.font = '400 28px "JetBrains Mono", monospace';
      sx.fillText(p < .3 ? 'Iniciando ambiente' : p < .6 ? 'Carregando módulos' : p < .95 ? 'Montando interface' : 'Pronto', 640, 392);
      sx.fillStyle = '#171a2b';
      sx.fillRect(340, 450, 600, 10);
      sx.fillStyle = '#4f8cff';
      sx.fillRect(340, 450, 600 * p, 10);
      sx.fillStyle = '#e8ecff';
      sx.font = '500 26px "JetBrains Mono", monospace';
      sx.fillText(Math.round(p * 100) + '%', 640, 520);
    }

    function drawSite(m) {
      sx.globalAlpha = m;
      sx.fillStyle = '#07080d';
      sx.fillRect(0, 0, 1280, 800);
      sx.textAlign = 'left';
      sx.fillStyle = '#4f8cff';
      sx.font = '500 30px "JetBrains Mono", monospace';
      sx.fillText('<Pedro Romero/>', 70, 90);
      sx.fillStyle = '#8189a6';
      sx.font = '400 22px "Chakra Petch", sans-serif';
      ['Sistema', 'Perfil', 'Atributos', 'Missões'].forEach(function (t, i) {
        sx.fillText(t, 700 + i * 140, 90);
      });
      sx.fillStyle = '#0e1018';
      sx.fillRect(70, 190, 300, 44);
      sx.strokeStyle = '#262b45';
      sx.strokeRect(70, 190, 300, 44);
      sx.fillStyle = '#5fc4e8';
      sx.beginPath();
      sx.arc(92, 212, 6, 0, Math.PI * 2);
      sx.fill();
      sx.fillStyle = '#8189a6';
      sx.font = '400 20px "JetBrains Mono", monospace';
      sx.fillText('Online, procurando vaga', 110, 219);
      sx.fillStyle = '#e8ecff';
      sx.font = '700 118px "Chakra Petch", sans-serif';
      sx.fillText(name, 66, 380);
      sx.fillStyle = '#4f8cff';
      sx.font = '500 28px "JetBrains Mono", monospace';
      sx.fillText('> ' + role, 70, 450);
      sx.fillStyle = '#2f5bff';
      sx.fillRect(70, 510, 230, 60);
      sx.fillStyle = '#171a2b';
      sx.fillRect(320, 510, 270, 60);
      sx.fillStyle = '#ffffff';
      sx.font = '700 22px "Chakra Petch", sans-serif';
      sx.fillText('Ver missões', 108, 548);
      sx.fillStyle = '#e8ecff';
      sx.fillText('Explorar o sistema', 350, 548);
      sx.fillStyle = '#0e1018';
      sx.fillRect(870, 250, 340, 330);
      sx.strokeStyle = '#262b45';
      sx.strokeRect(870, 250, 340, 330);
      sx.fillStyle = '#e8ecff';
      sx.font = '700 28px "Chakra Petch", sans-serif';
      sx.fillText('Pedro', 900, 305);
      sx.fillStyle = '#38bdf8';
      sx.font = '500 24px "JetBrains Mono", monospace';
      sx.fillText('Nv. 19', 1090, 305);
      sx.fillStyle = '#171a2b';
      sx.fillRect(900, 360, 280, 12);
      sx.fillRect(900, 430, 280, 12);
      sx.fillStyle = '#4f8cff';
      sx.fillRect(900, 360, 280 * .74, 12);
      sx.fillStyle = '#2f5bff';
      sx.fillRect(900, 430, 280 * .92, 12);
      sx.globalAlpha = 1;
    }

    var st = { p: 0, m: 0 };

    function draw() {
      drawBoot(st.p);
      if (st.m > 0) drawSite(st.m);
      stex.needsUpdate = true;
    }

    draw();

    var raf, finished = false, master, zoomTl;

    function loop() {
      camera.lookAt(look);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }

    loop();

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onResize);

    function finish() {
      if (finished) return;
      finished = true;
      if (master) master.kill();
      if (zoomTl) zoomTl.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      boot.remove();
      done();
    }

    function zoom() {
      if (finished) return;
      var d = coverDist();
      zoomTl = gsap.timeline({ onComplete: finish });
      zoomTl
        .to(st, { p: 1, duration: .5, ease: 'power1.out', onUpdate: draw })
        .to(st, { m: 1, duration: .7, ease: 'power1.inOut', onUpdate: draw }, .4)
        .to(laptop.rotation, { y: 0, duration: 1.4, ease: 'power3.inOut' }, .5)
        .to(camera.position, {
          x: center.x + normal.x * d,
          y: center.y + normal.y * d,
          z: center.z + normal.z * d,
          duration: 1.7,
          ease: 'power3.inOut'
        }, .9)
        .to(look, { x: center.x, y: center.y, z: center.z, duration: 1.7, ease: 'power3.inOut' }, .9)
        .to(boot, { opacity: 0, duration: .6, ease: 'power1.in' }, 2.1);
    }

    master = gsap.timeline();
    master
      .fromTo(camera.position, { y: 3.4, z: farDist() + 1.5 }, { y: 2.3, z: farDist(), duration: 1.4, ease: 'power2.out' }, 0)
      .fromTo(laptop.rotation, { y: -.7 }, { y: -.15, duration: 2.4, ease: 'power2.out' }, 0)
      .to(pivot.rotation, { x: -.26, duration: 1.8, ease: 'power2.inOut' }, .5)
      .to(glow, { intensity: 1.4, duration: 1.2, ease: 'power1.in' }, 1.8)
      .to(st, { p: .9, duration: 2, ease: 'power1.inOut', onUpdate: draw }, 2.2)
      .call(function () { pageReady.then(zoom); });

    var skip = document.getElementById('skip');
    if (skip) skip.addEventListener('click', finish);
  }

  function initLab() {
    var cv = document.getElementById('lab3d');
    if (!cv) return;
    var stage = cv.parentElement;
    var infoTitle = document.getElementById('infoTitle');
    var infoText = document.getElementById('infoText');
    var logBox = document.getElementById('stageLog');
    var sendBtn = document.getElementById('sendReq');
    var resetBtn = document.getElementById('resetView');
    var defaultTitle = infoTitle.textContent;
    var defaultText = infoText.textContent;

    if (!hasGL) {
      stage.style.display = 'none';
      return;
    }

    var renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.set(0, 1.2, 12);

    scene.add(new THREE.AmbientLight(0x8899bb, .8));
    var key = new THREE.DirectionalLight(0xffffff, .9);
    key.position.set(4, 6, 6);
    scene.add(key);
    var rim = new THREE.PointLight(0x4f8cff, 1.6, 25);
    rim.position.set(-5, 3, -3);
    scene.add(rim);

    var world = new THREE.Group();
    scene.add(world);

    var grid = new THREE.GridHelper(16, 16, 0x2f3447, 0x1b2030);
    grid.position.y = -2.7;
    world.add(grid);

    var defs = [
      { id: 'client', label: 'Cliente', info: 'Navegador ou app que faz a requisição HTTP.', msg: 'GET /tarefas', pos: [-4.2, .5, 0], color: 0x7aa8ff, shape: 'ico' },
      { id: 'auth', label: 'Auth JWT', info: 'Valida o token e libera o acesso à rota.', msg: 'Token JWT válido', pos: [-1.9, 2, 1.3], color: 0x38bdf8, shape: 'ring' },
      { id: 'api', label: 'API REST', info: 'Rotas, validação e regras de negócio.', msg: 'Rota /tarefas', pos: [.4, .5, 0], color: 0x4f8cff, shape: 'octa' },
      { id: 'cache', label: 'Cache', info: 'Guarda respostas frequentes para ganhar velocidade.', msg: 'Cache miss', pos: [2.3, 2.2, -1.4], color: 0x5fc4e8, shape: 'box' },
      { id: 'db', label: 'Banco de dados', info: 'SQL: dados persistidos com integridade.', msg: 'SELECT * FROM tarefas', pos: [4.2, -.2, 0], color: 0x2f5bff, shape: 'db' },
      { id: 'docker', label: 'Docker', info: 'Container que empacota e executa a aplicação.', msg: 'Container ativo', pos: [.6, -1.9, 1.5], color: 0x38bdf8, shape: 'cont' }
    ];

    var edges = [['client', 'auth'], ['auth', 'api'], ['api', 'cache'], ['cache', 'db'], ['api', 'db'], ['api', 'docker']];
    var nodes = {};
    var hits = [];

    function labelSprite(text) {
      var c = document.createElement('canvas');
      c.width = 320;
      c.height = 72;
      var x = c.getContext('2d');
      x.font = '500 30px "JetBrains Mono", monospace';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillStyle = 'rgba(7,8,13,.8)';
      x.fillRect(0, 8, 320, 56);
      x.strokeStyle = '#262b45';
      x.strokeRect(1, 9, 318, 54);
      x.fillStyle = '#e8ecff';
      x.fillText(text, 160, 37);
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false }));
      s.scale.set(2.4, .54, 1);
      s.renderOrder = 10;
      return s;
    }

    function part(geo, parent, d, mat, edgeMat, x, y, z) {
      var m = new THREE.Mesh(geo, mat);
      m.position.set(x || 0, y || 0, z || 0);
      m.userData.id = d.id;
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
      parent.add(m);
      hits.push(m);
      return m;
    }

    defs.forEach(function (d) {
      var holder = new THREE.Group();
      holder.position.set(d.pos[0], d.pos[1], d.pos[2]);
      var body = new THREE.Group();
      holder.add(body);
      var mat = new THREE.MeshStandardMaterial({ color: 0x1b2030, metalness: .8, roughness: .4, emissive: d.color, emissiveIntensity: .18 });
      var edge = new THREE.LineBasicMaterial({ color: d.color });
      var top = .85;

      if (d.shape === 'ico') {
        part(new THREE.IcosahedronGeometry(.6, 1), body, d, mat, edge);
      } else if (d.shape === 'ring') {
        part(new THREE.TorusGeometry(.5, .2, 12, 36), body, d, mat, edge);
      } else if (d.shape === 'octa') {
        part(new THREE.OctahedronGeometry(.85, 0), body, d, mat, edge);
        top = 1.15;
      } else if (d.shape === 'box') {
        part(new THREE.BoxGeometry(.85, .85, .85), body, d, mat, edge);
      } else if (d.shape === 'db') {
        for (var i = 0; i < 3; i++) part(new THREE.CylinderGeometry(.75, .75, .38, 32), body, d, mat, edge, 0, i * .5 - .5, 0);
        top = 1.2;
      } else {
        for (var j = 0; j < 3; j++) part(new THREE.BoxGeometry(.5, .5, .7), body, d, mat, edge, (j - 1) * .62, 0, 0);
      }

      var label = labelSprite(d.label);
      label.position.y = top + .35;
      holder.add(label);
      world.add(holder);
      nodes[d.id] = { def: d, holder: holder, body: body, mat: mat, pos: holder.position };
    });

    var lineMat = new THREE.LineBasicMaterial({ color: 0x3b4052, transparent: true, opacity: .9 });
    edges.forEach(function (e) {
      var g = new THREE.BufferGeometry().setFromPoints([nodes[e[0]].pos, nodes[e[1]].pos]);
      world.add(new THREE.Line(g, lineMat));
    });

    [[3.4, Math.PI / 2.3, 0], [4.6, Math.PI / 1.9, .5]].forEach(function (c) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(c[0], .012, 8, 140), new THREE.MeshBasicMaterial({ color: 0x262b45 }));
      ring.rotation.set(c[1], c[2], 0);
      world.add(ring);
    });

    var orbiters = [];
    var cubeMat = new THREE.MeshStandardMaterial({ color: 0x1b2030, metalness: .85, roughness: .38 });
    var cubeEdge = new THREE.LineBasicMaterial({ color: 0x4f8cff, transparent: true, opacity: .6 });
    for (var n = 0; n < 9; n++) {
      var cg = new THREE.BoxGeometry(.18, .18, .18);
      var cube = new THREE.Mesh(cg, cubeMat);
      cube.add(new THREE.LineSegments(new THREE.EdgesGeometry(cg), cubeEdge));
      cube.userData = { a: n * (Math.PI * 2 / 9), r: 4 + (n % 3) * .35, s: .12 + (n % 4) * .04, y: (n % 5) * .8 - 1.6 };
      world.add(cube);
      orbiters.push(cube);
    }

    var packetGeo = new THREE.SphereGeometry(.12, 16, 16);

    function log(text) {
      logBox.classList.add('on');
      var p = document.createElement('p');
      p.textContent = text;
      logBox.appendChild(p);
      while (logBox.children.length > 6) logBox.removeChild(logBox.firstChild);
    }

    function pulse(id) {
      var n = nodes[id];
      gsap.killTweensOf(n.holder.scale);
      gsap.fromTo(n.holder.scale, { x: 1.35, y: 1.35, z: 1.35 }, { x: 1, y: 1, z: 1, duration: .55, ease: 'back.out(2)' });
      gsap.fromTo(n.mat, { emissiveIntensity: 1 }, { emissiveIntensity: n === hoverNode ? .7 : .18, duration: .7, ease: 'power2.out' });
    }

    function fly(steps, onEnd) {
      var first = nodes[steps[0][0]];
      var packet = new THREE.Mesh(packetGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      packet.position.copy(first.pos);
      world.add(packet);
      pulse(steps[0][0]);
      log('→ ' + steps[0][1]);
      var tl = gsap.timeline({
        onComplete: function () {
          world.remove(packet);
          if (onEnd) onEnd();
        }
      });
      steps.slice(1).forEach(function (s) {
        var p = nodes[s[0]].pos;
        tl.to(packet.position, { x: p.x, y: p.y, z: p.z, duration: .6, ease: 'power1.inOut' });
        tl.call(function () {
          pulse(s[0]);
          log((s[2] ? '← ' : '→ ') + s[1]);
        });
      });
    }

    function step(id) {
      return [id, nodes[id].def.msg];
    }

    function fullRequest() {
      sendBtn.disabled = true;
      var started = performance.now();
      fly([
        step('client'),
        step('auth'),
        step('api'),
        step('cache'),
        step('db'),
        ['api', 'Resposta montada', true],
        ['auth', 'Resposta autorizada', true],
        ['client', '200 OK', true]
      ], function () {
        log('✓ concluído em ' + Math.round(performance.now() - started) + ' ms');
        sendBtn.disabled = false;
      });
    }

    var routes = {
      client: null,
      auth: ['client', 'auth'],
      api: ['client', 'auth', 'api'],
      cache: ['api', 'cache'],
      db: ['api', 'db'],
      docker: ['docker', 'api']
    };

    function clickNode(id) {
      if (id === 'client') {
        if (!sendBtn.disabled) fullRequest();
        return;
      }
      fly(routes[id].map(step));
    }

    var view = { y: -.5, x: .16 };
    var vel = 0;
    var dragging = false;
    var moved = 0;
    var lx = 0;
    var ly = 0;
    var inside = false;
    var hoverNode = null;
    var pointer = new THREE.Vector2();
    var ray = new THREE.Raycaster();

    function setHover(n) {
      if (n === hoverNode) return;
      if (hoverNode) {
        gsap.to(hoverNode.body.scale, { x: 1, y: 1, z: 1, duration: .3 });
        gsap.to(hoverNode.mat, { emissiveIntensity: .18, duration: .3 });
      }
      hoverNode = n;
      if (n) {
        gsap.to(n.body.scale, { x: 1.18, y: 1.18, z: 1.18, duration: .3 });
        gsap.to(n.mat, { emissiveIntensity: .7, duration: .3 });
        infoTitle.textContent = n.def.label;
        infoText.textContent = n.def.info;
      } else {
        infoTitle.textContent = defaultTitle;
        infoText.textContent = defaultText;
      }
      cv.classList.toggle('over', !!n);
    }

    function pick() {
      ray.setFromCamera(pointer, camera);
      var found = ray.intersectObjects(hits, false)[0];
      return found ? nodes[found.object.userData.id] : null;
    }

    function updatePointer(e) {
      var r = cv.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }

    cv.addEventListener('pointerdown', function (e) {
      dragging = true;
      moved = 0;
      lx = e.clientX;
      ly = e.clientY;
      updatePointer(e);
      cv.setPointerCapture(e.pointerId);
      cv.classList.add('grabbing');
    });

    cv.addEventListener('pointermove', function (e) {
      inside = true;
      updatePointer(e);
      if (!dragging) return;
      var dx = e.clientX - lx;
      var dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      vel = dx * .008;
      view.y += vel;
      view.x = Math.max(-.35, Math.min(.85, view.x + dy * .005));
    });

    cv.addEventListener('pointerup', function (e) {
      dragging = false;
      cv.classList.remove('grabbing');
      updatePointer(e);
      if (moved < 6) {
        var n = pick();
        if (n) clickNode(n.def.id);
      }
    });

    cv.addEventListener('pointercancel', function () {
      dragging = false;
      cv.classList.remove('grabbing');
    });

    cv.addEventListener('pointerleave', function () {
      inside = false;
      setHover(null);
    });

    sendBtn.addEventListener('click', fullRequest);

    resetBtn.addEventListener('click', function () {
      vel = 0;
      var turns = Math.round((view.y + .5) / (Math.PI * 2));
      gsap.to(view, { y: -.5 + turns * Math.PI * 2, x: .16, duration: 1, ease: 'power3.inOut' });
    });

    var running = true;
    new IntersectionObserver(function (en) {
      running = en[0].isIntersecting;
    }).observe(stage);

    function layout() {
      var w = stage.clientWidth;
      var h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      camera.position.z = Math.max(12, 16.5 / camera.aspect);
    }

    layout();
    window.addEventListener('resize', layout);

    var t0 = performance.now();

    function frame() {
      requestAnimationFrame(frame);
      if (!running) return;
      var t = (performance.now() - t0) / 1000;

      if (!dragging) {
        vel *= .94;
        view.y += vel + (reduce ? 0 : .0025);
      }

      world.rotation.y = view.y;
      world.rotation.x = view.x;

      if (inside && !dragging) setHover(pick());

      if (!reduce) {
        orbiters.forEach(function (c) {
          var d = c.userData;
          var a = d.a + t * d.s;
          c.position.set(Math.cos(a) * d.r, d.y + Math.sin(t + d.a) * .15, Math.sin(a) * d.r);
          c.rotation.x = t * .8;
          c.rotation.y = t * .6;
        });
        nodes.api.body.rotation.y = t * .5;
        nodes.client.body.rotation.y = t * .3;
        nodes.auth.body.rotation.x = t * .6;
        nodes.cache.body.rotation.y = t * .4;
      }

      renderer.render(scene, camera);
    }

    frame();
  }

  function initScroll() {
    gsap.to('#progress', { scaleY: 1, ease: 'none', scrollTrigger: { scrub: .3, start: 0, end: 'max' } });

    document.querySelectorAll('.skills .sk').forEach(function (sk) {
      var bar = sk.querySelector('i');
      var v = sk.dataset.v + '%';
      if (reduce) {
        bar.style.width = v;
        return;
      }
      gsap.to(bar, { width: v, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: sk, start: 'top 92%', once: true } });
    });

    if (reduce) return;

    gsap.to('.tl .fill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: true } });

    gsap.from('.stage', { opacity: 0, y: 40, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.stage', start: 'top 85%', once: true } });

    gsap.from('.proj', {
      opacity: 0,
      y: 40,
      rotateX: -12,
      duration: .8,
      stagger: .12,
      ease: 'power3.out',
      transformPerspective: 700,
      scrollTrigger: { trigger: '.projects', start: 'top 80%', once: true }
    });

    gsap.from('.ach .card', {
      opacity: 0,
      scale: .92,
      duration: .6,
      stagger: .1,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.ach', start: 'top 85%', once: true }
    });

    gsap.from('.term p', {
      opacity: 0,
      x: -16,
      duration: .5,
      stagger: .25,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.term', start: 'top 80%', once: true }
    });

    document.querySelectorAll('h2').forEach(function (h) {
      gsap.from(h, { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });

    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll('.tilt'), { max: 9, speed: 500, glare: true, 'max-glare': .18, scale: 1.02 });
    }
  }

  initParticles();
  initTyped();
  initScroll();

  try {
    initLab();
  } catch (e) {
    var stageEl = document.getElementById('stage');
    if (stageEl) stageEl.style.display = 'none';
  }

  if (reduce || !hasGL) {
    boot.remove();
    intro();
  } else {
    try {
      runBoot(intro);
    } catch (e) {
      boot.remove();
      intro();
    }
  }
})();