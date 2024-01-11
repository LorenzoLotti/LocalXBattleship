Document.prototype.createElementFromHTML = function(text)
{
  const template = this.createElement('template')
  template.innerHTML = text
  return template.content.lastElementChild
}
