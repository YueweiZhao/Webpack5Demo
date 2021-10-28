module.exports = function (sources) {
  return `
    const tag = document.createElement("style");
    tag.innerHTML = ${sources};
    document.head.appendChild(tag)
  `
}