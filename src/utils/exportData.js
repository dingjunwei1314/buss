import { PREFIX } from '@/config/app'

export function exportFromForm (url, params) {
  let tempForm = document.createElement('form')
  tempForm.id = 'tempForm'
  tempForm.method = 'post'
  tempForm.action = PREFIX + url
  tempForm.target = '_blank' // 打开新页面

  for (let i in params) {
    let input = document.createElement('input')
    input.type = 'hidden'
    input.name = i // 后台要接受这个参数来取值
    input.value = params[i] // 后台实际取到的值
    tempForm.appendChild(input)
  }
  if (document.all) {
    tempForm.attachEvent('onsubmit', function () {}) // IE
  } else {
    tempForm.addEventListener('submit', function () {}, false) // firefox
  }

  let newWin = window.open()
  newWin.document.body.appendChild(tempForm)

  if (document.all) {
    tempForm.fireEvent('onsubmit')
  } else {
    tempForm.dispatchEvent(new Event('submit'))
  }
  tempForm.submit()
  setTimeout(() => {
    newWin.close()
  }, 100)
}

/* eslint-disable */
const formatJson = function (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

export function exportFromArray (name, tHeader, filterVal, list) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('./vendor/exportExcel.js')
    const data = formatJson(filterVal, list)
    export_json_to_excel(tHeader, data, name)
  })
}
