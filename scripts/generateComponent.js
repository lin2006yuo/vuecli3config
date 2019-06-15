const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = message => console.log(chalk.red(`${message}`))
const { vueTemplate, entryTemplate } = require('./template')

const generateFile = (path, data) => {
  if(fs.existsSync(path)) {
    errorLog(`${path}文件已经存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if(err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

log('请输入要生成的组件名称， 如需生成全局组件，请加 global/ 前缀')

let componentName = ''

process.stdin.on('data', async chunk => {
  const inputName = String(chunk).trim().toString()
  const componentDirPath = resolve('../src/components', inputName)
  const componentPath = resolve(componentDirPath, 'main.vue')
  const componentEntryPath = resolve(componentDirPath, 'index.js')

  const hasComponentDir = fs.existsSync(componentDirPath)
  if(hasComponentDir) {
    errorLog(`${inputName}组件目录已存在， 请重新输入`)
    return
  } else {
    log(`正在生成component 目录 ${componentDirPath}`)
    console.log('dirPath:', componentDirPath)
    await doExistDirectoryCreate(componentDirPath)

    try {
      if(inputName.includes('/')) {
        const inputArr = inputName.split('/')
        componentName = inputArr[inputArr.length -1]
      } else {
        componentName = inputName
      }
      log(`正在生成vue文件 ${componentPath}`)
      await generateFile(componentPath, vueTemplate(componentName))
      log(`正在生成entry文件 ${componentEntryPath}`)
      await generateFile(componentEntryPath, entryTemplate)
      successLog('生成成功')
    } catch (e) {
      errorLog(e.message)
    }

    process.stdin.emit('end')
  }
})

process.stdin.on('end', () => {
  log('exit')
  process.exit()
})

function doExistDirectoryCreate (directory) {
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
    mkdirs(path.dirname(directory), function() {
      fs.mkdirSync(directory)
      callback()
    })
  }
}