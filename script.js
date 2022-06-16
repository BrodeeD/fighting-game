const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
// Brings Down All The Way //
const gravity = 0.7

const player = new Fighter({
    position: {
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 10
    },
    offset : {
        x: 0,
        y: 0
    }
})


const enemy = new Fighter({
    position: {
      x: 400,
      y: 100
    },
    velocity: {
      x: 0,
      y: 10
    },
    color: 'blue',
    offset : {
        x: -50,
        y: 0
    }
})

// Moving Sprites .5 //
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

// Win/Lose or Tie Game //
function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'

  if (player.health === enemy.health){
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  } 
}

// Timer //
let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({player, enemy, timerId})
  }
}

decreaseTimer()

// Background & Animation //
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


    // Player Movement //
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    // Enemy Movement //
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // Detect for Collision //
    if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy
    }) && 
        player.isAttacking
        ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy
    }) && 
        enemy.isAttacking
        ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // End Game Based on Health //
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId })
    }
}

animate()

// Moves Sprite 1 //
window.addEventListener('keydown', (event) => {
    if (!player.dead) {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true
          player.lastKey = 'd'
          break
        case 'a':
          keys.a.pressed = true
          player.lastKey = 'a'
          break
        case 'w':
          player.velocity.y = -20
          break
        case ' ':
          player.attack()
          break
      }
    }
  
    if (!enemy.dead) {
      switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          enemy.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          enemy.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp':
          enemy.velocity.y = -20
          break
        case 'ArrowDown':
          enemy.attack()
  
          break
      }
    }
  })

// Stops Movement //
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
          keys.d.pressed = false
          break
        case 'a':
          keys.a.pressed = false
          break
    }

    // Enemy Keys //
    switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = false
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = false
          break
    }

})