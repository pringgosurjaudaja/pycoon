from flask import Blueprint, render_template,redirect, url_for,request
from .models import User
from flask_login import login_user, login_required, logout_user
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth',__name__)

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    
    user = User.query.filter_by(email=email).first()
    print('YO')
    if not user or not check_password_hash(user.password, password):
        return redirect(url_for('main.index'))
    login_user(user)
    return redirect(url_for('main.profile'))
@auth.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if user:
        return redirect(url_for('auth.signup'))

    new_user = User(email=email, name=name, password = generate_password_hash(password, method='sha256'))

    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for('main.index'))

@auth.route('/signup')
def signup():
    return render_template('register.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))