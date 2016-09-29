
export function submitAlert (message) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    })
    return fetch('/alert', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'ALERT_SUCCESS',
            messages: [json]
          })
        })
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'ALERT_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          })
        })
      }
    }).catch(err => {
      console.log('asd',err)
    })
  }
}
