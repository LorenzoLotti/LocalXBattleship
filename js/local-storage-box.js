export default class LocalStorageBox
{
  #name

  constructor(boxName)
  {
    this.#name = boxName

    if (localStorage.getItem(boxName) == null)
      this.clear()
  }

  get name()
  {
    return this.#name
  }

  #getSelf()
  {
    return JSON.parse(localStorage.getItem(this.name))
  }

  #setSelf(value)
  {
    localStorage.setItem(this.name, JSON.stringify(value))
  }

  hasItem(key)
  {
    return key in this.#getSelf()
  }

  getItem(key)
  {
    return this.#getSelf()[key]
  }

  setItem(key, value)
  {
    const self = this.#getSelf()
    self[key] = value
    this.#setSelf(self)
  }

  setItemIfNotExists(key, value)
  {
    if (!this.hasItem(key))
      this.setItem(key, value)
  }

  getOrSetItem(key, value)
  {
    this.setItemIfNotExists(key, value)
    return this.getItem(key)
  }

  updateItem(key, updateFunction)
  {
    this.setItem(key, updateFunction?.(this.getItem(key)))
  }

  removeItem(key)
  {
    const self = this.#getSelf()
    delete self[key]
    this.#setSelf(self)
  }

  clear()
  {
    this.#setSelf({})
  }

  static destroy(boxName)
  {
    localStorage.removeItem(boxName)
  }
}
