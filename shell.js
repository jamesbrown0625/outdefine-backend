const shell = require('shelljs')
const path = require('path')
const fs = require('fs')

const result = shell.exec('yarn test --coverage')
fs.writeFileSync(path.resolve('.', 'coverage.txt'), result.substring(result.indexOf('|\nFile') + 2))

if (result.code !== 0) {
  shell.exit(1)
}
