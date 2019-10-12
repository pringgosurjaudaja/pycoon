from flask import Blueprint, render_template,redirect, url_for,request
from .models import User
from flask_login import login_user, login_required, logout_user, current_user
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth',__name__)

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        print('YO')
        if not user or not check_password_hash(user.password, password):
            return redirect(url_for('auth.home'))
        login_user(user)
        return redirect(url_for('auth.profile'))
    if current_user.is_authenticated:
        return render_template('profile.html')
    return render_template('home.html')    

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user:
            return redirect(url_for('auth.signup'))

        new_user = User(email=email, name=name, password = generate_password_hash(password, method='sha256'))

        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('auth.home'))
    return render_template('signup.html')    

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.home'))

@auth.route('/profile')
def profile():
    return render_template('profile.html')