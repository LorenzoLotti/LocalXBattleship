export default class Angle
{
  #degrees

  constructor(degrees = 0)
  {
    this.#degrees = degrees >= 0 && degrees < 360 ?
      degrees : new Angle(degrees - 360 * Math.sign(degrees)).degrees
  }

  get degrees()
  {
    return this.#degrees
  }
}
