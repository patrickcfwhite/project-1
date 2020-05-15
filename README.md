### ![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly Software Engineering Immersive
# Project 1 : Tetris
## Overview
This was my first project whilst studying on the Software Engineering Immersive course. We were given a list of grid-based games to recreate, using only HTML, CSS and *vanilla* JavaScript.
I chose Tetris as it was considered one of the more difficult games and I wanted to challenge myself.



**Technical Requirements**

* Render a game in the browser
* Include separate HTML / CSS / JavaScript files
* Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
* Use Javascript for DOM manipulation
* Deploy your game online, where the rest of the world can access it
* Use semantic markup for HTML and CSS (adhere to best practices)

**Tetris Requirements**

* The game should stop if a Tetromino fills the highest row of the game board
* The player should be able to rotate each Tetromino about its own axis
* If a line is completed it should be removed and the pieces above should take its place


**Technologies Used**

* JavaScript
* HTML
* CSS
* Git & Github
* Logic Pro

**[Play the game here](https://patrickcfwhite.github.io/project-1/)**
![](https://i.imgur.com/Cu0IOIO.png?2)


## First Steps

I started by writing out some notes and pseudocode about the basic Tetris logic and functionality, hoping to identify the core components of gameplay I would need to faithfully recreate the game. **_I've used a few snippets of some pseudocode and code I wrote in the planning stages later on in this ReadMe, excuse the messiness some was written on the bus!_**


* A range of four-block shapes (Tetronimoes) are generated at the top of a container
* Shapes move down a row on a timer until any or all of its 'blocks' are impeded by another fixed shape or the bottom of the container, at that point the 'active' shape becomes 'fixed'
* Shapes can also be moved by the player left, right or downwards
* Shapes can be rotated 90deg counter-/clockwise unless new position is impeded by existing shape or container edge
* Lines can be cleared if entire rows are filled (can be multiple lines at once)
* The higher the score the faster the shape descends
* The game ends if any cell of a fixed shape occupies the highest row of the container

It was clear that **rotation** would be the most complex element so after creating the game grid I would start with this.


## Creating the Grid

The container would be a tall rectangular grid of cells. To create this, I made a function containing a 'for loop' to render individual cells by creating divs and then appending it to a parent container. The container is 20 visible rows and a fixed width of 10 columns. _n.b. I later enlarged the grid and created 4 hidden rows so that when a shape is created it appears by descending from above top of the grid. These hidden rows are also used to determine when a game finishes._

```javascript
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
```
  
As well as appending cells to the container, they were also pushed into a cells array. The structure of the cells array gave the ability to define the exact positions of the active and fixed shapes.



## Shapes and their movement

Each shape or *Tetronimo* in Tetris is made from four square blocks. They are named after the letters they resemble. There are seven in total:

![](https://qph.fs.quoracdn.net/main-qimg-356e2b21c801381db2890dab49a9ea88)

Depending on the type of shape it could have up to four orientations, rotating around a specific cell or point. This had to be represented somehow and I chose to store them as 'coordinates' in an object.

For example, the **L-Shape**, if *x* is the fixed point of rotation within the shape, and *width* is the width of the grid: 
image here

can be represented as:

```javascript
{
	0: [(x - width), x, (x + width), (x + width + 1)],
	1: [(x - 1), x, (x + 1), (x + width - 1)],
	2: [(x - width - 1), (x - width), x, (x + width)],
	3: [(x - width + 1), (x - 1), x, (x + 1)]
}
```

At first all the shapes were stored simply as objects like above but to solve a different issue they ended up being functions that returned an array containing the name of the shape and an object of the coordinates.

```javascript
  function lshape(x) {
    return ['lshape', {
      0: [(x - width), x, (x + width), (x + width + 1)],
      1: [(x - 1), x, (x + 1), (x + width - 1)],
      2: [(x - width - 1), (x - width), x, (x + width)],
      3: [(x - width + 1), (x - 1), x, (x + 1)]
    }]
  }
```

### Displaying A Shape

The shape is displayed on the grid by adding or modifying specific classes to the occupied cells, as follows:

**Classes**

* **active**: This is the current shape being moved by the player
* **fixed**: These are shapes that have travelled as far as possible, and have fixed and are no longer controlled by the player
* **ghost**: Ghost was a stretch goal and it represents the furthest the current active shape could travel before becoming fixed
* **`${activeShape}`**: Each shape has different styling, this is used for the CSS to render the correct colour


When a new active shape is added to the grid this function is called:

```javascript

  function shapeBuilder(input) {
    if (gameOver) {
      return
    }
    orientation = 0
    //Shape name e.g. 'lshape'
    activeShape = input[0]
    //Object containing possible shape coordinates
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
    ...
  }
  
```
This checks to see if the new shape will be blocked by any fixed cells, triggering a 'game over' and if not, it adds classes `active` and `${activeShape}` to those cells.

**orientation**, **activeShape** and **activeObject** are all stored as global variables and used by other functions throughout the game.,


### Movement
Moving a shape down, or side to side is relatively straightforward. If we have the current coordinates we only have to add or subtract a certain amount to each coordinate.

If we are moving right or left we `± 1` to each coordinate.
![](https://imgur.com/Um0siLV.jpg)

If we are moving downwards we `+ width` to each coordinate. 
![](https://imgur.com/HWg0uc1.jpg)

Depending on the input (which in this case is captured by a list of 'keydown' event listeners), this function is called:

```javascript
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
  }
```

If the direction is downwards i.e. the width, the function checks whether the active shape should become fixed, this is handled by a seperate function `toFixed()`. If not, it removes the classes from its original position, updates the active object position (each set of possible coordinates), removes the ghost class if there is any overlap and then finally adds the active position to the new updated coordinates.

If the direction is left or right another check is made at the point of the keypress:

```javascript
  function boundaryChecker(direction = 0) {
    return (activeObject[orientation].some(x => (x + direction) % width === 0))
  }
```

Here we check whether moving the shape can move in that direction or whether it is already at the furthest point left or right.



### Rotation
Rotating a shape is functionally similar to moving a shape, in that we are modifying which cells contain the active class. When rotating we are not however altering the coordinates, we are just choosing the orientation coordinates one step away in either direction. e.g. If `orientation = 1` and we are rotating clockwise we add 1 therefore, `orientation = 2`. To prevent the orientation breaking if moving from 4 to 0 instead of 4 to 5, the `newOrientation` variable is set using the code on line 2 from the extract below, where `length` is the amount of possible orientations of the shape, and `direction` is ±1 depending on the turning direction.

```javascript
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
```
Like the `boundaryChecker` function for lateral movement there needed to be a check for the rotation to not break. It took some time to fix an issue where if you were too close to the barrier and rotated it would 'split' the shape and cause the game to malfunction.
![](https://imgur.com/w9fAa3X.jpg)

To solve this, we have to check if any cells occupied by the new orientation are 'one away' from each other (e.g. 10, 11, 12), they **must** be on the same row. If that isn't possible it's an illegal rotation. To do this the following function iterates through the new orientation, creates a new `away` array that is the distance between each consecutive coordinate, and checks if the 'one-aways' are all on the same row.

```javascript
  function oneAwayChecker(direction) {
    let check = true
    const away = []
    const rotation = activeObject[((orientation + length + direction) % length)]
    if (rotation.some(x => x >= gridCellCount)) {
      return
    }
    for (let i = 1; i < rotation.length; i++) {
      away.push(rotation[i] - rotation[i - 1])
    }
    const roundToWidth = rotation.map(x => Math.floor(x / width) * width)

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
```


## Game Logic & State

### State
There are a number of variables used to keep track of aspects of the game. Here is a brief description of them:

  * **cellsArray**: Array of all the cells on the grid
  * **shapeArray**: Order of upcoming shapes in the game
  * **holdArray**: Specific shape we are 'holding', feature means you can swap a shape once a turn
  * **full**: Initial check to see if hold has been used
  * **swapped**: Checks if hold has been used already that turn
  * **gridCellCount**: Total amount of cells on the grid
  * **width**: Width of the container, set to 10 as default
  * **point**: Starting point for `x` in shape coordinates
  * **activeShape**: Tracks which shape is currently active
  * **activeObject**: Stores all the active shapes potential orientations
  * **orientation**: The active shapes current orientation
  * **length**: Amount of possible orientation
  * **ghostArray**: This stores the co-ordinates of the shapes 'Ghost'
  * **newName**: User's name for scoring
  * **totalLines**: Total lines cleared on current game
  * **currentScore**: Score calculated for current game
  * **currentCombo**: How many lines cleared in a row, which multiplies the scoring
  * **currentLevel**: Every ten lines cleared the level increases, influencing the game speed
  * **hardDropCount**: The amount of rows the active shape would drop by before becoming fixed, on its current trajectory
  * **gameOver**: Checks game over conditions to end game


### From Active to Fixed
As our active shape falls, each time it moves down a row the function controlling this checks if it's upcoming coordinates already hold either a fixed shape, or are out of range. If this is the case the class of the cells will change from `active` to `fixed`. If so, the function `toFixed` is called to update the classes on the current coordinate cells. It first checks to see if this would result in a game over, if not it updates the classes on the correct cells and then checks the length of the remaining classes in classList. If it is two we can infer it has the `${activeShape}` class and therefore needs to be `fixed` in place.

```javascript
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

```

### Checking for full rows
During each `toFixed` function call, the `fullRowChecker` function is called as the addition of the new fixed shape may have filled a row. 

```javascript
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
    ...
}

```

This is a complex process and roughly works in the following way:

* Iterate through the `cellArray` in reverse order, and push them into a `rowArray`
* Once `rowArray.length === 10` we have a row of cells on our grid
* If each cell contains the class `fixed` we remove their classes, rendering them visibly empty and set a variable `cleared` to be true.
* The function then clears the rowArray and iterates throught the `cellArray` this time checking the row above
* Once `rowArray.length === 10`, if the variable `cleared === true` we use a different function `rowMover` to take the classes of the cells in that row, and move them down i.e. add them to the cells where their index is one `width` ahead

```javascript   
function rowMover(cell, list) {
	cell.classList.remove(...list)
	const newIndex = cellsArray.indexOf(cell) + width
	cellsArray[newIndex].classList.add(...list)
} 
```

* This row moving happens for every row above the cleared row. The entire function then will repeat for as many times as a row has been cleared, as the max possible clearance is 4 rows at a time -- _A full Tetris!_


## Stretch Goals

### Stretch Goal 1: Holding a shape
One of my stretch goals was to add the hold function which is a *newer* feature of Tetris, first added to 1999's **The New Tetris**. At any time starting when a new active shape enters the grid until it locks in place, the single player can switch it for the held shape, adding it to the `holdArray` and launching the previously held shape. It can only be triggered once per active shape. This is achieved by the following function `toHold`. It will check first if it has already happened this turn, before removing the relevant classes from the `cellsArray` and trigger the next shape.

```javascript

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
  
```

I had thought this might be quite tricky to implement but it was actually quite straight-forward to implement which was a nice surprise.



### Stretch Goal 2: Ghost mode (& 2.5: Hard Drop)

![](https://i.imgur.com/soAeVVL.png)

My second goal was to add the Ghost/Shadow/Temporary Landing System (TLS) feature that was also first implemented in 1999's **The New Tetris**. The ghost mode, projects a copy of the current active shape as far as it would travel on it's current trajectory, before it hits the bottom of the container or is impeded by a fixed shape. It gets it's name due to it being usually styled to be more opaque than the `active` or `fixed` shapes so that it is recognisable as a temporary position. To do this the function does the following:

* For each block comprising the active shape we check how many widths can be added to it before it hits a fixed shape or boundary
* Once we have the amounts for each block -- which may differ due to the active shape, its orientation and the shapes fixed shapes below -- they are pushed into the `ghostDifference` array, and sorted
* Each coordinate in the active shape is transformed by the lowest amount of widths possible, and stored in the `ghostArray`
* `ghostArray` is iterated through, and for each div with the corresponding coordinate in the `cellsArray` has the `ghost` and `${activeShape}` classes added to it


```javascript

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

```


Creating the ghost function also helped create a solution for a 'hard drop' function and vice versa. Hard drop allows the player to immediately set the current active shape in it's final resting place, which is conveniently the same space occupied by the shape's ghost. The `hardDrop` function swaps the `ghost` classes for `fixed` and also adds a multiplier to the score, based on the amount of rows (widths) dropped.


```javascript

  function hardDrop() {
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

```



### Stretch Goal 3: Sound design

If I had time I wanted to add some sound design and or music to accompany the game but the Tetris theme is so iconic I didn't want to just imitate it. I also wanted to avoid the frenetic nature of this melody, as I find Tetris to be a rather peaceful game so I decided to interpret the melody in a sparse piano arrangement. I am a big fan of computer games and their soundtracks and I have recently been really impressed by the soundtrack to **Zelda: Breath of The Wild** and how it takes elements of the familiar Zelda themes and repurposes them to better fit the mood of the game so I used this as inspiration. As you level up it plays a short snippet of the main melody, reharmonised on solo piano with a little level-up tag to round it off. There are eight snippets of melody, which will begin again once you hit level nine. The audio is updateded within the `fullRowChecker` function, which in turn calls the `updateAudio` function.


```javascript

  function fullRowChecker() {
	...
	if (previousLevel !== currentLevel) {
      updateAudio(audio1, ['level', (currentLevel % 8)].join(''))
      levelDiv.classList.add('levelup')
      levelDiv.addEventListener('transitionend', removeTransition)
    }
  ...
  }

  function updateAudio(audio, input) {
    audio.src = `assets/${input}.wav`
    if (!audio.isPlaying) {
      audio.play()
      return
    }

```

As well as the level up sections, there are some simple textural piano sound effects for the other keypresses, as well as a final short melody using the main Tetris Theme for the game over screen.

## Final thoughts

### Victories

After an initial period of _'well how am I going to do any of this?'_ I was really pleased with how much it came together in a relatively straightforward manner. I think the amount of time I spent planning and preparing was really vital in having a clear approach to actually build the game. I of course encountered setbacks and hurdles but I never had to make wild changes to any of the game processes.

I'm definitely pleased with the overall gameplay, it feels like actual Tetris, and when testing the game I found myself forgetting what I was doing and just playing the game which is quite comforting.

Finally I'm really glad I managed to achieve all my stretch goals, especially the sound design and music. Music has been a large part of my career and having the opportunity to utilise it feels rewarding.

### Potential future features

For me the biggest issue is that it is not responsively designed. As this was our first project I wanted to focus on delivering a polished working game and I didn't take into account how this would be represented on different screensizes. I'd never intended it to be a mobile game but it should definitely be more responsive to different screensizes.

I'd like to improve the accessibilty of the game. You can currently get it running with just a keyboard which is positive for users that don't use a mouse but I would also like to have custom key-mapping allowed for people who would prefer different controls.

I've tested a few different options for the speed increase as you level up and think the current one is quite good but still not perfect. This is something I'm going to try to tweak.

Once I'd added the ghost function, I realised it was quite imbedded in the in-game processes and to allow users to toggle the function would require some refactoring of the code. This is something I'd like to add.


### Lessons learnt

Planning is key to having a clear vision and roadmap of what you want to achieve. It's much easier creating the answer when the question is clear.

Responsive design has to be considered earlier than an additional feature at the end.

Going back over the code I realised I'd picked some slightly odd names. It took me a good while to remember what the `oneAwayChecker` function meant! Try to keep naming consistent as you begin to work collaboratively it helps to make everything as clear as possible for others.

Tetris is still really fun.

![](https://i.imgur.com/1njVKW9.png)
