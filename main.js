const data = document.querySelector('.data')
const googleSignInBtn = querySelector('.g-signin2')

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $("#name").text(profile.getName()); /*the name id on our html gets the data of name from this function*/
    $("#email").text(profile.getEmail());
    $("#image").attr('src', profile.getImageUrl());
    data.style.display = 'block';
    googleSignInBtn.style.display = 'none'

    
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

function signOut() {
var auth2 = gapi.auth2.getAuthInstance();
auth2.signOut().then(function () {
    console.log('User signed out.');
    alert("You have been signed out successfully!")
    googleSignInBtn.style.display = 'block'
    data.style.display = 'none';

});
}