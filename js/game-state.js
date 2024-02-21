export default class GameState
{
  #documentRootElement
  #state

  constructor(state, documentRootElement = null)
  {
    this.#documentRootElement = documentRootElement
    this.set(state)
  }

  set(state)
  {
    this.#documentRootElement?.classList.remove(this.#state)
    this.#documentRootElement?.classList.add(state)
    this.#state = state
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
