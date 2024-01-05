import { Cell } from './cell.js'

function createSea(cellFactoryFunction)
{
  const firstColCharCode = 'A'.charCodeAt(0)
  const lastColCharCode = 'O'.charCodeAt(0)
  const colsCount = lastColCharCode - firstColCharCode + 1
  const middle = colsCount / 2
  const sea = { }

  for (let i = 0, rowsCount = 8; i < colsCount; i++)
  {
    const colChar = String.fromCharCode(firstColCharCode + i)
    const colNumber = i + 1
    sea[colChar] = new Array(rowsCount).fill().map(cellFactoryFunction)

    if (colNumber < Math.floor(middle))
      rowsCount++
    else if (colNumber > Math.ceil(middle))
      rowsCount--
  }

  return sea
}

function clearSea(sea)
{
  for (const cell of getCells(sea))
    cell.clear()
}

function getCells(sea)
{
  return Object.values(sea).flat()
}

const sea = createSea(() =>
{
  const b = document.createElement('button')
  const c = new Cell(b)
  document.body.appendChild(b)
  return c
})

console.log(sea)
console.log(getCells(sea))

