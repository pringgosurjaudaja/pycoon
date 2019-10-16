from flask import Blueprint, render_template,redirect, url_for,request, jsonify
from .models import User, Term, Course, Assessment, Class
from flask_login import login_user, login_required, logout_user, current_user
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

main = Blueprint('main',__name__)

@main.route('/')
@login_required
def home():
    terms = Term.query.filter_by(user_id=current_user.id)
    return render_template('home.html',terms=terms)

@main.route('/api/terms')
@login_required
def terms():
    qryresult = Term.query.filter_by(user_id=current_user.id)
    return jsonify(json_list=[i.serialize for i in qryresult.all()])    
    # return jsonify(terms=terms)

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return redirect(url_for('main.login'))
        login_user(user)
        return redirect(url_for('main.home'))
        
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
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

    if current_user.is_authenticated:
        return redirect(url_for('main.home'))    
    return render_template('signup.html')    

@main.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))

@main.route('/add/term', methods=['GET', 'POST'])
@login_required
def add_term():
    if request.method == 'POST':
        title = request.form.get('title')
        start_date_string = request.form.get('start_date')
        start_date = datetime.strptime(start_date_string, "%Y-%m-%d")
        end_date_string = request.form.get('end_date')
        end_date = datetime.strptime(end_date_string, "%Y-%m-%d")
        new_term = Term(title=title, start_date=start_date, end_date = end_date, user_id = current_user.id)

        db.session.add(new_term)
        db.session.commit()
        return redirect(url_for('main.home'))
    return render_template('add_term_dev.html')

@main.route('/term<term_id>')
@login_required
def term(term_id):
    term = Term.query.filter_by(id=int(term_id)).first()
    courses = Course.query.filter_by(term_id=term.id)
    return render_template('term_dev.html',term=term, courses=courses)    

@main.route('/add/course<term_id>', methods=['GET', 'POST'])
@login_required
def add_course(term_id):
    if request.method == 'POST':
        title = request.form.get('title')
        new_course = Course(title = title, term_id = term_id)
        db.session.add(new_course)
        db.session.commit()
        return redirect(url_for('main.term', term_id = term_id))
    return render_template('add_course_dev.html')

@main.route('/course<course_id>')
@login_required
def course(course_id):
    course = Course.query.filter_by(id=int(course_id)).first()
    return render_template('course_dev.html',course=course)  
