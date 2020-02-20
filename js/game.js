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
  let orientation = 0
  let x = 25
  let length

  const square = ['square', { 0: [x, (x + 1), (x + width), (x + width + 1)] }]
  const lshape = ['lshape', {
    0: [(x - width), x, (x + width), (x + width + 1)],
    1: [(x - 1), x, (x + 1), (x + width - 1)],
    2: [(x - width - 1), (x - width), x, (x + width)],
    3: [(x - width + 1), (x - 1), x, (x + 1)]
  }]
  const jshape = ['jshape', {
    0: [(x - width), x, (x + width), (x + width - 1)],
    1: [(x - 1 - width), (x - 1), x, (x + 1)],
    2: [(x - width), (x - width + 1), x, (x + width)],
    3: [(x - 1), x, (x + 1), (x + width + 1)]
  }]
  const ishape = ['ishape', {
    0: [(x - width), x, (x + width), (x + (2 * width))],
    1: [(x - 1), x, (x + 1), (x + 2)],
    2: [(x + 1 - width), (x + 1), (x + 1 + width), (x + 1 + (2 * width))],
    3: [(x - 1 + width), (x + width), (x + width + 1), (x + width + 2)]
  }]
  const tshape = ['tshape', {
    0: [(x - width), (x - 1), x, (x + 1)],
    1: [(x - width), x, (x + 1), (x + width)],
    2: [(x - 1), x, (x + 1), (x + width)],
    3: [(x - width), (x - 1), x, (x + width)]
  }]
  const sshape = ['sshape',{
    0: [x, (x + 1), (x + width - 1), (x + width)],
    1: [(x - width), x, (x + 1), (x + width + 1)]
  }]
  const zshape = ['zshape', {
    0: [(x - width - 1), (x - width), x, (x + 1)],
    1: [(x - width), (x - 1), x, (x + width - 1)]
  }]


  for (let i = 0; i < gridCellCount; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    grid.appendChild(cell)
    cellsArray.push(cell)
  }


  for (const button of buttons) {
    button.addEventListener('click', () => {
      console.log(button.id)
      shapeBuilder(eval(button.id))
    })
  }

  function shapeBuilder(input) {
    activeShape = input[0]
    activeObject = input[1]
    length = Object.keys(activeObject).length
    for (const position of input[1][0]) {
      cellsArray[position].classList.add(`${activeShape}`)
      cellsArray[position].classList.add('active')
    }
  }

  function shapeMover(direction) {
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
    for (const position of activeObject[orientation]) {
      cellsArray[position].classList.remove('active')
      cellsArray[position].classList.remove(`${activeShape}`)
    }
    orientation = ((orientation + length + direction) % length)
    for (const position of activeObject[orientation]) {
      cellsArray[position].classList.add('active')
      cellsArray[position].classList.add(`${activeShape}`)
    }
  }

  function oneAwayChecker() {
    let away = []
    let rotation = activeObject[(orientation + 1)]
    for (let i = 1; i < rotation.length; i++) {
      away.push(rotation[i] - rotation[i-1])
    }
    const fives = rotation.map(x => Math.ceil(x / width) * width)

    console.log(activeObject[orientation])
    console.log(away)
    console.log(rotation)
    console.log(fives)
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      if (activeObject[orientation].some(x => (x + 1) % width === 0)) {
        return
      }
      shapeMover(1)
    } else if (event.key === 'ArrowLeft') {
      if (activeObject[orientation].some(x => x % width === 0)) {
        return
      }
      shapeMover(-1)
    } else if (event.key === 'ArrowUp') {
      // if (activeObject[orientation].some(x => x % width === 0)) {
      //   return
      // }
      shapeRotator(1)
    } else if (event.key === 'ArrowDown') {
      if (activeObject[orientation].some(x => (x + 1) % width === 0)) {
        return
      }
      shapeMover(width)
    }
  })




  
  













  
  // shapeBuilder(lshape)
  // shapeMover(width)

  // oneAwayChecker()
}

window.addEventListener('DOMContentLoaded', setupGame)