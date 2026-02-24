const sass = require('sass')
const stripIndent = require('strip-indent')

module.exports = (css, settings) => {
  const cssWithPlaceholders = css
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%%(\w*[ ),;!{])/g,
      (_, id, p1) => `styled-jsx-percent-placeholder-${id}-${p1}`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%(\w*[ ),;!{])/g,
      (_, id, p1) => `styled-jsx-placeholder-${id}-${p1}`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%%/g,
      (_, id) => `/*%%styled-jsx-percent-placeholder-${id}%%*/`
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%/g,
      (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  const optionData = (settings.sassOptions && settings.sassOptions.data) || ''
  const data =
    stripIndent(optionData) + '\n' + stripIndent(cssWithPlaceholders)

  // Map legacy sassOptions to modern API options
  const { data: _, ...sassOptions } = settings.sassOptions || {}
  const preprocessed = sass
    .compileString(data, {
      ...sassOptions,
      syntax: sassOptions.indentedSyntax ? 'indented' : 'scss'
    })
    .css.toString()

  return preprocessed
    .replace(
      /styled-jsx-percent-placeholder-(\d+)-(\w*[ ),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%%${p1}`
    )
    .replace(
      /styled-jsx-placeholder-(\d+)-(\w*[ ),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%${p1}`
    )
    .replace(
      /\/\*%%styled-jsx-percent-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%%`
    )
    .replace(
      /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%`
    )
}
