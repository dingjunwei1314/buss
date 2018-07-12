import Parse from 'parse'

Parse.initialize('e8b9ed3e57a3c04c56b4ec7bd82d3b47')
Parse.serverURL = 'https://col-api.mydadao.com/parse'

const ActionEvent = Parse.Object.extend('ActionEvent')

const sendLog = async (url, params = {}, log = {action: 'no message', comment: 'no message'}) => {
  let event = new ActionEvent()
  const sendlog = Object.assign({}, params, log)
  let result = await event.save({
    operate_user_id: localStorage.user_id ? localStorage.user_id : '',
    time: (new Date()).toString(),
    ip: window.returnCitySN['cip'],
    model: window.navigator.userAgent,
    env: 'dev',
    api: url,
    event: sendlog
  })
  return result
}

export default sendLog
