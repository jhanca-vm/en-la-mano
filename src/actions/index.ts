import signIn from './signIn'
import validateTotp from './validateTotp'
import changePassword from './changePassword'
import createAdmin from './createAdmin'
import regenerateQr from './regenerateQr'
import deleteAdmin from './deleteAdmin'
import setData from './setData'
import setImage from './setImage'
import deleteImage from './deleteImage'
import sendRequest from './sendRequest'
import addComplaint from './addComplaint'

export const server = {
  signIn,
  validateTotp,
  changePassword,
  createAdmin,
  regenerateQr,
  deleteAdmin,
  setData,
  setImage,
  deleteImage,
  sendRequest,
  addComplaint
}
