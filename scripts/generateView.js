const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = message => console.log(chalk.red(`${message}`))
const { vueTemplate } = require('./template')


const generateFile = (path, data) => {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

log('请输入要生成的页面名称、将生成在 views/ 目录下')

let componentName = ''

process.stdin.on('data', async chunk => {
  const inputName = String(chunk).trim().toString()
  
  // 组件路径
  let viewComponentPath = resolve('../src/views', inputName)

  if(!viewComponentPath.endsWith('.vue')) {
    viewComponentPath += '.vue'
  }

  // 页面路径
  const viewComponentDirPath = path.dirname(viewComponentPath)

  const hasComponentExists = fs.existsSync(viewComponentPath)
  if(hasComponentExists) {
    errorLog(`${inputName}页面已经存在，请重新输入`)
    return
  } else {
    log(`正在生成view目录${viewComponentDirPath}`)
    // 递归生成文件夹
    await doExistDirCreate(viewComponentDirPath)
  }

  try {
    if(inputName.includes('/')) {
      const inputArr = inputName.split('/')
      componentName = inputArr[inputArr.length -1]
    } else {
      componentName = inputName
    }
    log(`正在生成vue文件 ${componentName}`)
    await generateFile(viewComponentPath, vueTemplate(componentName))
    successLog('生成生成')
  } catch (e) {
    errorLog(e.message)
  }

  process.stdin.emit('end')
})

process.stdin.on('end', () => {
  log('exit')
  process.exit()
})

function doExistDirCreate (directory) {
  return new Promise((resolve) => {
    mkdirs(directory, function() {
      resolve(true)
    })
  })
}

function mkdirs (directory, callback) {
  let exists = fs.existsSync(directory)
  if(exists) {
    callback()
  } else {
    mkdirs(path.dirname(directory), function () {
      fs.mkdirSync(directory)
      callback()
    })
  }
}