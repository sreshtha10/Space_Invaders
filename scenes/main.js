
const MOVE_SPEED = 200

const TIME_LEFT = 100

const BULLET_SPEED = 400

const INVADER_SPEED = 100

const LEVEL_DOWN = 100


layer(['obj', 'ui'], 'obj')

addLevel([
  '!   ^^^^^^^^^      &',
  '!   ^^^^^^^^^      &',
  '!   ^^^^^^^^^      &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',

], {
    width: 30,
    height: 22,
    '^': [sprite('space-invader'), scale(1.5), 'space-invader'],
    '!': [sprite('wall'), 'left-wall'],
    '&': [sprite('wall'), 'right-wall'],
  })


const player = add([
  sprite('space-ship'),
  pos((width() / 2) - 100, height() / 2),
  origin('center'),
  scale(2)
])



keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

function spawnBullet(p) {
  add([rect(6, 18),
  pos(p),
  origin('center'),
  color(255, 0, 0),
    'bullet'
  ])
}



keyPress('space', () => {
  spawnBullet(player.pos.add(0, -25))
})


action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos < 0) {
    destroy(b)
  }
})


collides('bullet', 'space-invader', (b, s) => {
  camShake(4)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value

})

const score = add([
  text('0'),
  pos(50, 50),
  layer('ui'),
  {
    value: 0,
  },
  scale(3)

])



const timer = add([
  text('0'),
  pos(90, 50),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT,
  },
])


timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if (timer.time <= 0) {
    go('lose', { score: score.value })
  }
})


let CURRENT_SPEED = INVADER_SPEED

action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})



collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})


player.overlaps(('space-invader'), () => {
  go('lose', { score: score.value })
})


action('space-invader', (s) => {
  if (s.pos.y >= (12 * 22)) {
    go('lose', { score: score.value })
  }
})


