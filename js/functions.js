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
const sshape = ['sshape', {
  0: [x, (x + 1), (x + width - 1), (x + width)],
  1: [(x - width), x, (x + 1), (x + width + 1)]
}]
const zshape = ['zshape', {
  0: [(x - width - 1), (x - width), x, (x + 1)],
  1: [(x - width), (x - 1), x, (x + width - 1)]
}]