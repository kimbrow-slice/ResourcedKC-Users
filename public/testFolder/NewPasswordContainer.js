import NewPasswordContainer from '../modules/resetPassword/components/new-password-container';

<GuestRoute exact path="/reset/:userId/:token" component={NewPasswordContainer} />

handleValidation();{ //validating password and confirm password
    let password = this.state.password
    let confirmPassword = this.state.confirmPassword
    let errors = {};
    let formIsValid = true;
    //validation
    if(!password) {
    formIsValid = false;
    errors["password"] = "Password is required.";
    }
    if (!confirmPassword) {
    formIsValid = false;
    errors["confirmPassword"] = "Confirmation password is required.";
    }
    if (password && confirmPassword) {
    if (password.length < 5) {
    formIsValid = false;
    errors["password"] = "Password minimum lenght is 5.";
    } else if (password !== confirmPassword) {
    formIsValid = false;
    errors["password"] = "The password confirmation does not match.";
    }
    }
    this.setState({errors: errors})
    return formIsValid;
}

