export default class Sea
{
  #map = { }

  constructor(startColChar, endColChar, minRowsCount, cellFactoryFunction)
  {
    let minColCharCode = startColChar.charCodeAt(0)
    let maxColCharCode = endColChar.charCodeAt(0)

    if (maxColCharCode < minColCharCode)
      [minColCharCode, maxColCharCode] = [maxColCharCode, minColCharCode]

    const colsCount = maxColCharCode - minColCharCode + 1
    const middle = colsCount / 2

    for (let i = 0, rowsCount = minRowsCount; i < colsCount; i++)
    {
      const colChar = String.fromCharCode(minColCharCode + i)
      const colNumber = i + 1

      this.map[colChar] = Object.freeze
      (
        new Array(rowsCount)
          .fill()
          .map((_, i) => cellFactoryFunction(colChar, i + 1))
      )

      if (colNumber < Math.floor(middle))
        rowsCount++
      else if (colNumber > Math.ceil(middle))
        rowsCount--
    }

    Object.freeze(this.map)
  }

  get #getColCharsAsCodes()
  {
    return Object.keys(this.map).map(k => k.charCodeAt(0))
  }

  get #minColCharCode()
  {
    return Math.min(...this.#getColCharsAsCodes)
  }

  get #maxColCharCode()
  {
    return Math.max(...this.#getColCharsAsCodes)
  }

  get map()
  {
    return this.#map
  }

  get cells()
  {
    return Object.values(this.map).flat()
  }

  forEachCol(callbackFunction, isInverse = false)
  {
    let start = this.#minColCharCode
    let end = this.#maxColCharCode
    let increment = 1

    if (isInverse)
    {
      [start, end] = [start, end]
      increment = -1
    }

    for (let colCharCode = start; colCharCode != end + increment; colCharCode += increment)
    {
      const colChar = String.fromCharCode(colCharCode)
      callbackFunction(this.map[colChar], colChar)
    }
  }

  forEachColInverse(callbackFunction)
  {
    this.forEachCol(callbackFunction, true)
  }

  clear()
  {
    for (const cell of this.cells)
      cell.clear()
  }
}
