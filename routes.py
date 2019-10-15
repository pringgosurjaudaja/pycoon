from flask import Blueprint, render_template,redirect, url_for,request
from .models import User, Term, Course, Assessment, Class
from flask_login import login_user, login_required, logout_user, current_user
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint('main',__name__)

@main.route('/')
@login_required
def home():
    terms = Term.query.filter_by(user_id=current_user.id)
    return render_template('home_dev.html',terms=terms)

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return redirect(url_for('main.home'))
        login_user(user)
        return redirect(url_for('main.home'))
        
    if current_user.is_authenticated:
        return render_template('home.html')
    return render_template('login.html')    

@main.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user:
            return redirect(url_for('main.signup'))

        new_user = User(email=email, name=name, password = generate_password_hash(password, method='sha256'))

        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('main.home'))
    return render_template('signup.html')    

@main.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))

@main.route('/add/term')
@login_required
def add_term():
    return render_template('add_term_dev.html')

@main.route('/<id>')
@login_required
def terms(id):
    terms = Term.query.filter_by(user_id=current_user.id)
    return render_template('home_dev.html',terms=terms)    

