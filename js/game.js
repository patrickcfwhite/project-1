function setupGame() {


  // Main grid
  const grid = document.querySelector('.grid')
  
  // Game information
  const linesDiv = document.querySelector('#lines')
  const comboDiv = document.querySelector('#combo')
  const scoreDiv = document.querySelector('#score')
  const levelDiv = document.querySelector('#level')
  const nextShapeDiv = document.querySelector('#nextshape')
  const holdShapeDiv = document.querySelector('#holdshape')
  const endScoreDiv = document.querySelector('#endscore')
  const scoresList = document.querySelector('ol')
  
  // Audio
  const audio1 = document.querySelector('#audio1')
  const audio2 = document.querySelector('#audio2')
  const audio3 = document.querySelector('#audio3')
  const audio4 = document.querySelector('#audio4')
  const audio5 = document.querySelector('#audio4')
  const allAudio = document.querySelectorAll('audio')
  
  // Buttons
  const toggleAudio = document.querySelector('#toggleaudio')
  const startButton = document.querySelector('#startgame')
  const restartButton = document.querySelector('#restartgame')
  const playButton = document.querySelector('#startgame')
  
  // Overlays for start and end of game
  const nameInput = document.querySelector('#playername')
  const startScreen = document.querySelector('#beginning')
  const endScreen = document.querySelector('#end')
  
  // Original volume settings for specific sound effects
  audio2.volume = 0.18
  audio3.volume = 0.18
  audio4.volume = 0.18
  audio5.volume = 0.20
  audio1.volume = 0.28

  // Starting values and game variables
  const cellsArray = []
  const shapeArray = []
  const holdArray = []
  const width = 10
  const gridCellCount = width * (2 * width + 4)
  const point = 15
  let activeShape
  let activeObject
  let orientation
  let length
  let ghostArray = []
  let newName
  let totalLines = 0
  let currentScore = 0
  let hardDropCount = 0
  let currentCombo = 1
  let currentLevel = Math.floor(totalLines / 10)

  // Game 'state'
  let full = false
  let swapped = false
  let gameOver = false

  //Info display
  linesDiv.innerHTML = `Lines Cleared: ${totalLines}`
  comboDiv.innerHTML = `Combo: ${currentCombo} x`
  scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
  levelDiv.innerHTML = `Level: ${currentLevel}`
  
  //Simpsons themed default highscore board
  let highScores = [
    { name: 'THRILLHO', score: 100000 }, { name: 'BART', score: 75000 },
    { name: 'MARTIN', score: 70000 }, { name: 'TODDFLAN', score: 65000 },
    { name: 'JIMBO', score: 50000 }, { name: 'MARGE', score: 45000 },
    { name: 'LENNY', score: 30000 }, { name: 'CARL', score: 15000 },
    { name: 'HOMER', score: 5000 }, { name: 'NED', score: 2000 }
  ]
  //Update scores if local storage exists
  if (localStorage) {
    const players = JSON.parse(localStorage.getItem('players'))
    if (players) {
      highScores = players
      renderList(highScores, scoresList)
    }
  }

  // On game start: update name, score, check for fullRow, and remove startScreen Overlay
  startButton.addEventListener('click', () => {
    if (nameInput.value === '') {
      return
    }
    newName = nameInput.value.toUpperCase()
    addShapes()
    updateScore()
    fullRowChecker()
    startScreen.classList.add('invisible')
  })

  // Restart button: resets grid, score, upcoming shapes 
  restartButton.addEventListener('click', () => {
    shapeArray.splice(0, shapeArray.length)
    holdArray.splice(0, 1)
    ghostArray = []
    gameOver = false
    hardDropCount = 0
    activeObject
    activeShape
    orientation
    totalLines = 0
    currentCombo = 1
    currentScore = 0
    full = false
    swapped = false
    for (const cell in cellsArray) {
      const fullClass = cellsArray[cell].classList
      cellsArray[cell].classList.remove(...fullClass)
      cellsArray[cell].classList.add('cell')
    }
    addShapes()
    updateScore()
    fullRowChecker()
    endScreen.classList.toggle('invisible')
  })

  //Mutes audio
  toggleAudio.addEventListener('click', () => {
    for (const audio of allAudio) {
      audio.muted = audio.muted ? false : true
    }
  })

  //Handles key inputs
  document.addEventListener('keydown', (event) => {
    if (gameOver) {
      return
    }
    if (event.key === 'ArrowRight') {
      if (boundaryChecker(1)) {
        return
      }
      shapeMover(1)
      updateAudio(audio3, 'move1')

    } else if (event.key === 'ArrowLeft') {
      if (boundaryChecker()) {
        return
      }
      shapeMover(-1)
      updateAudio(audio3, 'move1')

    } else if (event.key === 'ArrowUp' || event.key === 'x') {
      if (!oneAwayChecker(1)) {
        return
      }
      shapeRotator(1)
      updateAudio(audio4, 'spin')

    } else if (event.key === 'z') {
      if (!oneAwayChecker(-1)) {
        return
      }
      shapeRotator(-1)
      updateAudio(audio4, 'spin')


    } else if (event.key === 'ArrowDown') {
      shapeMover(width)
      currentScore += (1 * (currentLevel + 1))
      scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
    } else if (event.code === 'Space') {
      toHold()
    } else if (event.key === 'c') {
      hardDrop()
    }
  })
  
  
  function squareshape(x) {
    return ['squareshape', { 0: [x, (x + 1), (x + width), (x + width + 1)] }]
  }
  function lshape(x) {
    return ['lshape', {
      0: [(x - width), x, (x + width), (x + width + 1)],
      1: [(x - 1), x, (x + 1), (x + width - 1)],
      2: [(x - width - 1), (x - width), x, (x + width)],
      3: [(x - width + 1), (x - 1), x, (x + 1)]
    }]
  }
  function jshape(x) {
    return ['jshape', {
      0: [(x - width), x, (x + width), (x + width - 1)],
      1: [(x - 1 - width), (x - 1), x, (x + 1)],
      2: [(x - width), (x - width + 1), x, (x + width)],
      3: [(x - 1), x, (x + 1), (x + width + 1)]
    }]
  }
  function ishape(x) {
    return ['ishape', {
      0: [(x - width), x, (x + width), (x + (2 * width))],
      1: [(x - 1), x, (x + 1), (x + 2)],
      2: [(x + 1 - width), (x + 1), (x + 1 + width), (x + 1 + (2 * width))],
      3: [(x - 1 + width), (x + width), (x + width + 1), (x + width + 2)]
    }]
  }
  function tshape(x) {
    return ['tshape', {
      0: [(x - width), (x - 1), x, (x + 1)],
      1: [(x - width), x, (x + 1), (x + width)],
      2: [(x - 1), x, (x + 1), (x + width)],
      3: [(x - width), (x - 1), x, (x + width)]
    }]
  }
  function sshape(x) {
    return ['sshape', {
      0: [x, (x + 1), (x + width - 1), (x + width)],
      1: [(x - width), x, (x + 1), (x + width + 1)]
    }]
  }
  function zshape(x) {
    return ['zshape', {
      0: [(x - width - 1), (x - width), x, (x + 1)],
      1: [(x - width), (x - 1), x, (x + width - 1)]
    }]
  }

  function generateGrid() {
    for (let i = 0; i < gridCellCount; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      if (i < width * 4) {
        cell.id = `hidden${i}`
      }
      grid.appendChild(cell)
      cellsArray.push(cell)
    }
  }

  function addShapes() {
    const shapeNames = ['squareshape', 'lshape', 'jshape', 'tshape', 'ishape', 'sshape', 'zshape']
    const randomOrder = shapeNames.sort(() => Math.random() - 0.5)
    randomOrder.forEach(x => shapeArray.push(x))
  }

  function shapeBuilder(input) {
    if (gameOver) {
      return
    }
    orientation = 0
    activeShape = input[0]
    activeObject = input[1]
    length = Object.keys(activeObject).length
    for (const position of input[1][0]) {
      if (cellsArray[position].classList.contains('fixed')) {
        handleGameOver()
        return
      }
      cellsArray[position].classList.add(`${activeShape}`)
      cellsArray[position].classList.add('active')
    }
    ghost()
    time = setInterval(() => {
      shapeMover(width)
    }, (700 - ((currentLevel + 1) * (72 - currentLevel))))
    return
  }

  function shapeMover(direction) {
    const nextPosition = activeObject[orientation].map(x => x + direction)
    for (const position of nextPosition) {
      if (position >= gridCellCount || cellsArray[position].classList.contains('fixed')) {
        direction === width ? toFixed() : direction
        return
      }

    }
    for (const position of activeObject[orientation]) {
      cellsArray[position].classList.remove('active')
      cellsArray[position].classList.remove(`${activeShape}`)
    }
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < 4; j++) {
        activeObject[i][j] += direction
      }
    }
    for (const position of activeObject[orientation]) {
      if (cellsArray[position].classList.contains('ghost')) {
        cellsArray[position].classList.remove('ghost')
      }
      cellsArray[position].classList.add('active')
      cellsArray[position].classList.add(`${activeShape}`)
    }
    ghost()
  }

  function boundaryChecker(direction = 0) {
    return (activeObject[orientation].some(x => (x + direction) % width === 0))
  }

  function shapeRotator(direction) {
    const newOrientation = ((orientation + length + direction) % length)
    for (const position of activeObject[newOrientation]) {
      if (cellsArray[position].classList.contains('fixed')) {
        return
      }
    }
    for (const position of activeObject[orientation]) {
      cellsArray[position].classList.remove('active')
      cellsArray[position].classList.remove(`${activeShape}`)
    }
    orientation = newOrientation
    for (const position of activeObject[orientation]) {
      if (cellsArray[position].classList.contains('ghost')) {
        cellsArray[position].classList.remove('ghost')
      }
      cellsArray[position].classList.add('active')
      cellsArray[position].classList.add(`${activeShape}`)
    }
    ghost()
  }

  function oneAwayChecker(direction) {
    let check = true
    // let ones = 0
    const away = []
    const rotation = activeObject[((orientation + length + direction) % length)]
    if (rotation.some(x => x >= gridCellCount)) {
      return
    }
    for (let i = 1; i < rotation.length; i++) {
      away.push(rotation[i] - rotation[i - 1])
    }
    const roundToWidth = rotation.map(x => Math.floor(x / width) * width)
    // away.forEach(x => x === 1 ? ones++ : ones[x])

    for (let i = 0; i < roundToWidth.length; i++) {
      const current = roundToWidth[i]

      if (away[i] === 1 && away[i]) {
        check = current === roundToWidth[i + 1] ? true : false
        if (!check) {
          return
        }
      }

    }
    return check
  }

  function toFixed() {
    for (const position of activeObject[orientation]) {
      if (gameOverCheck(position)) {
        handleGameOver()
        break
      }
      cellsArray[position].classList.remove('ghost')
      cellsArray[position].classList.remove('active')
      Array.from(cellsArray[position].classList).length === 2 ? (cellsArray[position].classList.add('fixed'), console.log('adding fixed')) : console.log('x')
    }
    clearInterval(time)
    fullRowChecker()
    return
  }

  function fullRowChecker() {
    let cleared = false
    let linesCleared = 0
    const previousLevel = currentLevel
    const rowArray = []
    for (let i = 0; i <= linesCleared; i++) {
      let check = Math.floor((gridCellCount - 1) / width)
      cleared = false
      for (let i = gridCellCount - 1; i >= 0; i--) {

        if (Math.floor(i / width) === check) {
          rowArray.push(cellsArray[i])
        }
        if (rowArray.length === 10) {
          if (cleared) {
            rowArray.forEach(x => {
              const fullClass = Array.from(x.classList)
              fullClass.splice(0, 1)
              rowMover(x, fullClass)
            })
          }
          check--
          if (rowArray.every(x => x.classList.contains('fixed'))) {
            rowArray.forEach(x => {
              const fullClass = Array.from(x.classList)
              fullClass.splice(0, 1)
              x.classList.remove(...fullClass)
              cleared = true
            })
            currentCombo += 1
            totalLines += 1
            linesCleared += 1
          }
          rowArray.splice(0, 10)
        }
      }
    }
    currentScore += (scoreUpdate(linesCleared, currentLevel) * (currentCombo - 1))
    currentLevel = Math.floor(totalLines / 10)
    updateScore()
    linesCleared === 0 ? currentCombo = 1 : currentCombo
    linesDiv.innerHTML = `Lines Cleared: ${totalLines}`
    comboDiv.innerHTML = `Combo: ${currentCombo} x`
    scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
    levelDiv.innerHTML = `Level: ${currentLevel}`

    const nextShape = shapeArray.shift()
    const nextShapeFunction = eval(nextShape)
    nextShape === 'ishape' ? shapeBuilder(nextShapeFunction(point)) : shapeBuilder(nextShapeFunction(point + width))
    if (previousLevel !== currentLevel) {
      updateAudio(audio1, ['level', (currentLevel % 8)].join(''))
      levelDiv.classList.add('levelup')
      levelDiv.addEventListener('transitionend', removeTransition)
    }
    swapped = false
    addShapes()
    nextShapeDiv.innerHTML = iconDisplayer(shapeArray[0])
  }

  function rowMover(cell, list) {
    cell.classList.remove(...list)
    const newIndex = cellsArray.indexOf(cell) + width
    cellsArray[newIndex].classList.add(...list)
  }

  function scoreUpdate(linesCleared, level) {
    const score = linesCleared === 0 ? ([0, updateAudio(audio5, 'linedrop')]) : linesCleared === 1 ?
      ([40, updateAudio(audio5, 'lineclear')]) : linesCleared === 2 ? ([100, updateAudio(audio5, 'lineclear')]) : linesCleared === 3 ? ([300, updateAudio(audio5, 'lineclear')]) : ([1200, updateAudio(audio5, 'tetris')])
    return (score[0] * (1 + level))
  }

  function toHold() {
    if (swapped) {
      return
    } else {
      updateAudio(audio2, 'tohold')
      clearInterval(time)
      for (const position of activeObject[orientation]) {
        cellsArray[position].classList.remove('active')
        cellsArray[position].classList.remove(`${activeShape}`)
      }
      for (const position of ghostArray) {
        cellsArray[position].classList.remove('ghost')
        cellsArray[position].classList.remove(`${activeShape}`)
      }
      holdArray.push(activeShape)
      holdShapeDiv.innerHTML = iconDisplayer(holdArray[0])
      const nextShape = !full ? eval(shapeArray.shift()) : eval(holdArray.shift())
      full = true
      swapped = true
      shapeBuilder(nextShape(point))
      holdShapeDiv.innerHTML = iconDisplayer(holdArray[0])
    }
  }

  function ghost() {
    for (const position of ghostArray) {
      cellsArray[position].classList.remove('ghost')
      if (!cellsArray[position].classList.contains('active') && !cellsArray[position].classList.contains('fixed')) {
        cellsArray[position].classList.remove(`${activeShape}`)
      }
    }
    const ghostDifference = []
    activeObject[orientation].forEach(x => {
      let ghostTimes = 0
      while (x < (gridCellCount) && !cellsArray[x].classList.contains('fixed')) {
        x += width
        ghostTimes++
      }
      ghostDifference.push(ghostTimes - 1)
      ghostDifference.sort((a, b) => b - a)
    })
    hardDropCount = ghostDifference[3]
    ghostArray = activeObject[orientation].map(x => {
      return x + (hardDropCount * width)
    })

    for (const position of ghostArray) {
      if (!cellsArray[position].classList.contains('active')) {
        cellsArray[position].classList.add('ghost')
      }
      cellsArray[position].classList.add(`${activeShape}`)
    }
  }

  function hardDrop() {
    if (gameOver) {
      return
    }
    clearInterval(time)
    for (const position of ghostArray) {
      if (gameOverCheck(position)) {
        handleGameOver()
        break
      }
      cellsArray[position].classList.remove('ghost')
      cellsArray[position].classList.add('fixed')
    }
    for (const position of activeObject[orientation]) {
      cellsArray[position].classList.remove('active')
      if (!cellsArray[position].classList.contains('fixed')) {
        cellsArray[position].classList.remove(`${activeShape}`)
      }
    }

    fullRowChecker()
    currentScore += (2 * hardDropCount * (currentLevel + 1))
    scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
  }

  function gameOverCheck(position) {
    if (position < 2 * width) {
      gameOver = true
      return true
    }
  }

  function iconDisplayer(shape) {
    return `<img src="assets/${shape}.png">`
  }

  function updateAudio(audio, input) {
    audio.src = `assets/${input}.wav`
    if (!audio.isPlaying) {
      audio.play()
      return
    }


  }

  function renderList(scores, scoresList) {

    const array = scores.sort((playerA, playerB) => playerB.score - playerA.score).map(player => {
      return player.active === true ? `<li id="playerlist">${player.name}: ${player.score}</li>` :
        `<li>${player.name}: ${player.score}</li>`
    })
    scoresList.innerHTML = array.slice(0, 10).join('')
  }

  function updateScore() {
    for (const score of highScores) {
      if (gameOver && score.active) {
        score.active = false
      } else if (score.active === true) {
        highScores.splice(highScores.indexOf(score), 1)
      }
    }
    if (!gameOver) {
      const player = { name: newName, score: currentScore, active: true }
      highScores.push(player)
    }
    renderList(highScores, scoresList)
    if (localStorage) {
      localStorage.setItem('players', JSON.stringify(highScores))
    }
  }

  function removeTransition(e) {
    if (e.propertyName !== 'transform') return
    this.classList.remove('levelup')
  }

  function handleGameOver() {
    clearInterval(time)
    updateAudio(audio1, 'gameover')
    updateScore()
    endScoreDiv.innerHTML = `Final Score: ${currentScore}`
    endScreen.classList.toggle('invisible')
    return
  }

  generateGrid()
}

window.addEventListener('DOMContentLoaded', setupGame)