function setupGame() {
  const width = 10
  const gridCellCount = width * (2 * width)
  const grid = document.querySelector('.grid')
  const cells = document.querySelectorAll('.cells')
  const active = document.querySelectorAll('.active')
  const buttons = document.querySelectorAll('.buttons')

  const cellsArray = []
  let activeObject
  let activeShape
  let orientation
  const point = 25
  let length

  function square(x) {
    return ['square', { 0: [x, (x + 1), (x + width), (x + width + 1)] }]
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
    console.log(input[1][0])
    length = Object.keys(activeObject).length
    for (const position of input[1][0]) {

      cellsArray[position].classList.add(`${activeShape}`)
      cellsArray[position].classList.add('active')
    }
    return
  }

  function shapeMover(direction) {
    const nextPosition = activeObject[orientation].map(x => x + direction)
    for (const position of nextPosition) {
      if (cellsArray[position].classList.contains('fixed')) {
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
        console.log(away[i])
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
      console.log(cellsArray[position])
      console.log(activeObject[orientation])
      cellsArray[position].classList.remove('active')
      cellsArray[position].classList.add('fixed')
    }
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
      if (activeObject[orientation].some(x => (x + width) >= gridCellCount)) {
        return
      }
      shapeMover(width)
    }
  })


  function fullRowChecker() {
    
  }



















  // shapeMover(width)

}

window.addEventListener('DOMContentLoaded', setupGame)