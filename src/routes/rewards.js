import express from 'express'
import config from '../config'
const router = express.Router()
export default router

router.get('/details', (req, res) => {
  res.send(
`
<!DOCTYPE html>
<html>
<head>
<title>Changi Rewards Card</title>
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
</head>

<body>
  <p style='text-align: right; margin-right: 32px; font-family: OpenSans, Helvetica; font-weight: 400; font-size: 3rem;'>138 <span style="font-size: 2rem; text-transform: uppercase">points</p>
  <img src='${config.URL}/static/images/rewards.png' style="padding: 0 32px; box-sizing: border-box; width:100%; border-radius: 12px;"/>
</body>

</html>
`
  )
})
