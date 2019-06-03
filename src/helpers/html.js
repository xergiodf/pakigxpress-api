import ejs from 'ejs'
import path from 'path'

const renderHtml = (templateName, options) => {
  const templateFile = path.join(
    __dirname,
    '..',
    'views',
    `${templateName}.ejs`
  )

  return new Promise((resolve, reject) =>
    ejs.renderFile(templateFile, options, (err, res) =>
      err ? reject(err) : resolve(res)
    )
  )
}

export default renderHtml
