(function (document, window) {
  var maxParticles = 100
  var numParticles = 0
  var particles = []
  var collisionDamper = 0.1

  var w = window
  var d = document
  var e = d.documentElement
  var g = d.getElementsByTagName('body')[0]

  var canvas = document.querySelector('canvas')
  var ctx = canvas.getContext('2d')

  canvas.width = w.innerWidth || e.clientWidth || g.clientWidth
  canvas.height = w.innerHeight|| e.clientHeight|| g.clientHeight

  function particle () {
    var p = this
    p.id = Date.now()
    p.removeParticle = false
    p.setParticle = function () {
      p.position = {
        x: 40 + (Math.random() * (canvas.width - 40)),
        y: -10 - (Math.random() * 50),
        z: (Math.random() * 10)
      }
      p.velocity = {
        x: 0,
        y: 0
      }
      p.alpha = 0.6
      p.length = 10
      p.lineWidth = (1 - ((p.position.z / 12)))
      p.acceleration = {
        x: 0,
        y: 0.8 - (p.position.z / 10)
      }
      if (p.removeParticle) {
        deleteParticle(p.id)
      }
    }
    p.setParticle()
  }

  function newParticle () {
    var curPart = new particle()
    particles.push(curPart)
  }

  function deleteParticle (id) {
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].id === id) {
        particles[i].removed = true
        particles.splice(i, 1)
      }
    }
  }

  function deleteAllParticles () {
    for (var i = 0; i < particles.length; i++) {
      particles.splice(i, 1)
    }
  }

  function drawParticles () {
    for (var i = 0; i < particles.length; i++) {
      var position = particles[i].position
      ctx.strokeStyle = 'rgba(225, 55, 55,' + particles[i].alpha + ')'
      ctx.lineWidth = particles[i].lineWidth
      ctx.beginPath()
      ctx.moveTo(position.x, position.y)
      ctx.lineTo(position.x, position.y + particles[i].length)
      ctx.stroke()
    }
  }

  function updateParticles () {
    for (var i = 0; i < particles.length; i++) {
          // Update velocity (Acceleration)
      particles[i].velocity.x += particles[i].acceleration.x
      particles[i].velocity.y += particles[i].acceleration.y

            // Update position based on velocity
      particles[i].position.x += particles[i].velocity.x
      particles[i].position.y += particles[i].velocity.y

            // Check current position relative to floor
      checkFloorCollision(i, particles[i].position.y)

      if (particles[i]) {
              // Check next position relative to floor
        var nextVy = particles[i].velocity.y + particles[i].acceleration.y
        var nextPy = particles[i].position.y + particles[i].velocity.y
        checkFloorCollision(i, nextPy)
      }

      if (particles[i]) {
              // Update the length of the rain drop based on velocity
        particles[i].length = particles[i].velocity.y * 1.8

              // The negative length gives the bounce effect, but it buggy, so this resets particles when the length is below -20
        if (particles[i].length <= -20) {
          particles[i].setParticle()
        }
      }

      if (particles[i] && particles[i].removed) {
        particles.splice(i, 1)
      }
    }
  }

  function checkFloorCollision (i, nextPy) {
    if (nextPy >= canvas.height - (particles[i].position.z * (canvas.height / 15))) {
      particles[i].velocity.y *= -1
      particles[i].velocity.y *= collisionDamper
      particles[i].length = 3
      if (particles[i].velocity.y >= -0.2 && particles[i].velocity.y <= 0.2) {
        particles[i].setParticle()
      }
    }
  }

  function loop () {
    clear()
    update()
    draw()
    queue()
  }

  function clear () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  function filterNonRemovable (p) {
    return !p.removeParticle
  }
  function removeParticle () {
    var filteredParticles = particles.filter(filterNonRemovable)
    if (filteredParticles[filteredParticles.length - 1]) {
      filteredParticles[filteredParticles.length - 1].removeParticle = true
    }
  };

  function update () {
    var filteredParticles = particles.filter(filterNonRemovable)
    if (filteredParticles.length < numParticles) {
      newParticle()
    } else if (filteredParticles.length > numParticles) {
      removeParticle()
    }
    updateParticles()
  }

  function draw () {
    drawParticles()
  }

  function queue () {
    window.requestAnimationFrame(loop)
  }

  function startRain () {
    var setInt
    setInt = setInterval(function () {
      if (numParticles < maxParticles) {
        numParticles++
      } else {
        clearInterval(setInt)
        setTimeout(function () {
          stopRain()
        }, 8000)
      }
    }, 20)
  }

  function stopRain () {
    var setInt
    setInt = setInterval(function () {
      if (numParticles > 10) {
        numParticles--
      } else {
        clearInterval(setInt)
        setTimeout(function () {
          startRain()
        }, 5000)
      }
    }, 50)
  }
  window.onload = function () {
    setTimeout(function () {
      loop()
      startRain()
    }, 100)
  }

})(document, window)