function setupGame() {
  const width = 10
  const gridCellCount = width * (2 * width)
  const grid = document.querySelector('.grid')
  const linesDiv = document.querySelector('#lines')
  const comboDiv = document.querySelector('#combo')
  const scoreDiv = document.querySelector('#score')
  const levelDiv = document.querySelector('#level')
  const nextShapeDiv = document.querySelector('#nextshape')
  const holdShapeDiv = document.querySelector('#holdshape')

  const buttons = document.querySelectorAll('.buttons')
  const checker = document.querySelector('#check')

  const cellsArray = []
  const shapeArray = []
  const holdArray = []
  let activeObject
  let activeShape
  let orientation
  const point = 15
  let length
  let totalLines = 0
  let currentCombo = 1
  let currentScore = 0
  let currentLevel = Math.floor(totalLines / 10)
  let full = false
  let swapped = false
  addShapes()
  linesDiv.innerHTML = `Lines Cleared: ${totalLines}`
  comboDiv.innerHTML = `Combo: ${currentCombo} x`
  scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
  levelDiv.innerHTML = `Level: ${currentLevel}`
  nextShapeDiv.innerHTML = `${shapeArray[1]}`



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

  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    grid.appendChild(cell)
    cellsArray.push(cell)
  }

  for (const button of buttons) {
    if (button.classList.contains('factory')) {
      button.addEventListener('click', () => {
        const fn = eval(button.id)
        shapeBuilder(fn(point))
      })
    } else if (button.classList.contains('function')) {
      button.addEventListener('click', () => {
        const fn = eval(button.id)
        fn()
      })
    }
  }

  function shapeBuilder(input) {
    orientation = 0
    activeShape = input[0]
    activeObject = input[1]
    //console.log(input[1][0])
    length = Object.keys(activeObject).length
    for (const position of input[1][0]) {

      cellsArray[position].classList.add(`${activeShape}`)
      cellsArray[position].classList.add('active')
    }
    time = setInterval(() => {
      shapeMover(width)
    }, (800 - ((currentLevel + 1) * 20)))
    return
  }

  function shapeMover(direction) {
    const nextPosition = activeObject[orientation].map(x => x + direction)
    for (const position of nextPosition) {
      console.log(position)
      if (position >= gridCellCount || cellsArray[position].classList.contains('fixed')) {
        console.log(position)
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
      cellsArray[position].classList.add('active')
      cellsArray[position].classList.add(`${activeShape}`)
    }
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
      cellsArray[position].classList.add('active')
      cellsArray[position].classList.add(`${activeShape}`)
    }
  }

  function oneAwayChecker(direction) {
    let check = true
    let ones = 0
    const away = []
    const rotation = activeObject[((orientation + length + direction) % length)]
    if (rotation.some(x => x >= gridCellCount)) {
      return
    }
    for (let i = 1; i < rotation.length; i++) {
      away.push(rotation[i] - rotation[i - 1])
    }
    const roundToWidth = rotation.map(x => Math.floor(x / width) * width)
    away.forEach(x => x === 1 ? ones++ : ones[x])

    // console.log(activeObject[orientation])
    // console.log(rotation)
    // console.log(away)
    // console.log(roundToWidth)
    //console.log(ones)


    for (let i = 0; i < roundToWidth.length; i++) {
      const current = roundToWidth[i]

      if (away[i] === 1 && away[i]) {
        //console.log(away[i])
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
      //console.log(cellsArray[position])
      //console.log(activeObject[orientation])
      cellsArray[position].classList.remove('active')
      Array.from(cellsArray[position].classList).length === 2 ? (cellsArray[position].classList.add('fixed'), console.log('adding fixed')) : console.log('x')
    }
    clearInterval(time)
    fullRowChecker()
    return
  }

  function boundaryChecker(direction = 0) {
    return (activeObject[orientation].some(x => (x + direction) % width === 0))
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      if (boundaryChecker(1)) {
        return
      }
      shapeMover(1)

    } else if (event.key === 'ArrowLeft') {
      if (boundaryChecker()) {
        return
      }
      shapeMover(-1)

    } else if (event.key === 'ArrowUp') {
      if (!oneAwayChecker(1)) {
        return
      }
      shapeRotator(1)

    } else if (event.key === 'ArrowDown') {
      // if (activeObject[orientation].some(x => (x + width) >= gridCellCount)) {
      //   return
      // }
      shapeMover(width)
      currentScore += (1 * (currentLevel + 1))
      scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
    } else if (event.key === 'x') {
      toHold()
    }
  })

  checker.addEventListener('click', fullRowChecker)

  function fullRowChecker() {

    let cleared = false
    let linesCleared = 0

    let rowArray = []
    console.log('checking for full rows')
    for (let i = 0; i <= linesCleared; i++) {
      let check = Math.floor((gridCellCount - 1) / width)
      cleared = false
      console.log('lineCleared loop', linesCleared)
      for (let i = gridCellCount - 1; i >= 0; i--) {

        if (Math.floor(i / width) === check) {
          rowArray.push(cellsArray[i])
        }
        if (rowArray.length === 10) {
          if (cleared) {
            rowArray.forEach(x => {
              let fullClass = Array.from(x.classList)
              fullClass.splice(0, 1)
              //console.log(fullClass, x)
              rowMover(x, fullClass)

            })
          }
          check--
          if (rowArray.every(x => x.classList.contains('fixed'))) {
            rowArray.forEach(x => {
              let fullClass = Array.from(x.classList)
              fullClass.splice(0, 1)
              x.classList.remove(...fullClass)
              cleared = true

            })
            currentCombo += 1
            totalLines += 1
            linesCleared += 1
            console.log(linesCleared)
          }
          rowArray.splice(0, 10)
        }
      }
    }
    currentScore += scoreUpdate(linesCleared, currentLevel) * (currentCombo - 1)
    currentLevel = Math.floor(totalLines / 10)
    linesCleared === 0 ? currentCombo = 1 : currentCombo
    linesDiv.innerHTML = `Lines Cleared: ${totalLines}`
    comboDiv.innerHTML = `Combo: ${currentCombo} x`
    scoreDiv.innerHTML = `Total Score: ${currentScore} Points`
    levelDiv.innerHTML = `Level: ${currentLevel}`
    //console.log(combo, linesCleared)

    const nextShape = eval(shapeArray.shift())
    console.log(nextShape)
    shapeBuilder(nextShape(point))
    swapped = false
    addShapes()
    nextShapeDiv.innerHTML = `${shapeArray[0]}`
    console.log(shapeArray)
  }


  function rowMover(cell, list) {
    cell.classList.remove(...list)
    let newIndex = cellsArray.indexOf(cell) + width
    cellsArray[newIndex].classList.add(...list)
  }

  function scoreUpdate(linesCleared, level) {
    let score = linesCleared === 0 ? 0 : linesCleared === 1 ? 40 : linesCleared === 2 ? 100 : linesCleared === 3 ? 300 : 1200
    console.log(score)
    return (score * (1 + level))
  }


  // const nextPosition = activeObject[orientation].map(x => x + direction)
  // for (const position of nextPosition) {
  //   if (cellsArray[position].classList.contains('fixed')) {
  //     return
  //   }



  function addShapes() {
    const shapeNames = ['squareshape', 'lshape', 'jshape', 'tshape', 'ishape', 'sshape', 'zshape']
    const randomOrder = shapeNames.sort(() => Math.random() - 0.5)
    randomOrder.forEach(x => shapeArray.push(x))
    console.log(shapeArray)
  }


  function toHold() {
    if (swapped) {
      return
    } else {
      clearInterval(time)
      for (const position of activeObject[orientation]) {
        cellsArray[position].classList.remove('active')
        cellsArray[position].classList.remove(`${activeShape}`)
      }
      if (!full) {
        holdArray.push(activeShape)
        full = true
        swapped = true
        holdShapeDiv.innerHTML = `${holdArray[0]}`
        const nextShape = eval(shapeArray.shift())
        shapeBuilder(nextShape(point))
      } else if (full && !swapped) {
        holdArray.push(activeShape)
        full = true
        swapped = true
        const nextShape = eval(holdArray.shift())
        shapeBuilder(nextShape(point))
        holdShapeDiv.innerHTML = `${holdArray[0]}`
      }
    }
  }



  // shapeMover(width)


}

window.addEventListener('DOMContentLoaded', setupGame)