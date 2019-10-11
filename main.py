from flask import Blueprint, render_template
from flask_login import current_user

main = Blueprint('main',__name__)

#Main page (login)
@main.route('/')
def index():
    if current_user.is_authenticated:
        return render_template('profile.html')
    return render_template('login.html')

@main.route('/profile')
def profile():
    return render_template('profile.html')