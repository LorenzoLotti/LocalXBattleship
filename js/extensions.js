HTMLElement.fromHTML = text =>
{
  const template = document.createElement('template')
  template.innerHTML = text
  return template.content.lastElementChild
}
