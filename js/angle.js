export default class Angle
{
  #degrees

  constructor(degrees = 0)
  {
    this.#degrees = degrees >= 0 || degrees < 360 ?
      degrees : new Angle(Math.abs(Math.abs(degrees) - 360)).degrees
  }

  get degrees()
  {
    return this.#degrees
  }
}
