function getElementByID(id) {
 return document.getElementById(id)
}


function setElementAttributeByID(id, attributeName, value) {
 const element = document.getElementById(id)
 if (element) {
   element.setAttribute(attributeName, value)
 }
}
function getElementAttributeByID(id, attributeName) {
  return document.getElementById(id)[attributeName]
 }
 
const element = getElementAttributeByID('myElement', 'data-attribute')
if (element) {
  const data = element
}
export { getElementByID, getElementAttributeByID, setElementAttributeByID }
