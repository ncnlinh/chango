import {globalAlert} from '../../controllers/botkit';

/**
 * POST /alert
 */
export async function alertPost (req, res) {
  req.assert('message', 'Message cannot be blank').notEmpty()

  var errors = req.validationErrors()

  if (errors) {
    return res.status(400).send(errors)
  }

  globalAlert(req.body.message)
  res.send({ msg: 'Your alert has been submitted.' })

}
