import * as ResetPasswordAction from '../actions/reset-password-actions'
// async onStoreNewPassword('click', (event)) {
// event.preventDefault();

document.getElementById('onStoreNewPassword').addEventListener('click',  async (event) =>{
    event.preventDefault();
    onStoreNewPassword();
  console.log('test');


let userId = this.props.match.params.userId
let resetToken = this.props.match.params.token
if (this.handleValidation()) {
let newPasswordBtnRef = Object.assign({}, this.state.newPasswordBtnRef)
newPasswordBtnRef.current.disabled = true
newPasswordBtnRef.current.innerHTML = "Loading..."
this.setState({ newPasswordBtnRef })
var response = await ResetPasswordAction.storeNewPassword(this.state.password, userId, resetToken)//calling an action to send data to the node.js store-password api
if (response) {
newPasswordBtnRef.current.disabled = false
newPasswordBtnRef.current.innerHTML = "Reset Password"
this.setState({ newPasswordBtnRef })
appHistory.push('/login')
}
}
} )


/*Store-password function */
export function storeNewPassword(password, userId, token) {
    store.dispatch(showLoading())
    return request.post('/reset', {//node.js api to send the new password to
    userId: userId,
    password: password,
    token: token
    }).then(response => {
    store.dispatch(hideLoading())
    if (response.data.success) {
    notification.success(response.data.message)
    return true;
    } else {
    notification.error(response.data.message)
    }
    }).catch(error => {
    console.log(error)
    })
    }
    