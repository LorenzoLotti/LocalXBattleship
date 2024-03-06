export default class GameState
{
  #documentRootElement
  #state
  onChange

  constructor(state, documentRootElement = null, onChange = null)
  {
    this.#documentRootElement = documentRootElement
    this.onChange = onChange
    this.set(state)
  }

  set(state)
  {
    this.#documentRootElement?.classList.remove(this.#state)
    this.#documentRootElement?.classList.add(state)
    this.#state = state
    this.onChange?.(state)
  }

  read()
  {
    return this.#state
  }

  is(state)
  {
    return this.#state == state
  }

  get documentRootElement()
  {
    return this.#documentRootElement
  }
}
