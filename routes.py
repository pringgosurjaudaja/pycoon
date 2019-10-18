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
    return jsonify(terms=[i.serialize for i in qryresult.all()])    
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

@main.route('/term<term_id>/add/course', methods=['GET', 'POST'])
@login_required
def add_course(term_id):
    if request.method == 'POST':
        title = request.form.get('title')
        code = request.form.get('code')
        color = request.form.get('color')
        new_course = Course(title = title, code = code, color = color, term_id = term_id)
        db.session.add(new_course)
        db.session.commit()
        return redirect(url_for('main.term', term_id = term_id))
    return render_template('add_course_dev.html')

@main.route('/course<course_id>')
@login_required
def course(course_id):
    course = Course.query.filter_by(id=int(course_id)).first()
    assessments = Assessment.query.filter_by(course_id=course.id)
    return render_template('course_dev.html',course=course, assessments=assessments)  

@main.route('/term<term_id>/calendar')
@login_required
def calendar(term_id):
    term = Term.query.filter_by(id=int(term_id)).first()
    return render_template('calendar_dev.html',term=term) 

@main.route('/assessment<assessment_id>')
@login_required
def assessment(assessment_id):
    assessment = Assessment.query.filter_by(id=int(assessment_id)).first()
    return render_template('assessment_dev.html',assessment=assessment)    

@main.route('/course<course_id>/add/assessment', methods=['GET', 'POST'])
@login_required
def add_assessment(course_id):
    if request.method == 'POST':
        title = request.form.get('title')
        due_date_string = request.form.get('due_date')
        due_date = datetime.strptime(due_date_string, "%Y-%m-%d")
        new_assessment = Assessment(title = title, due_date = due_date, course_id = course_id)
        db.session.add(new_assessment)
        db.session.commit()
        return redirect(url_for('main.course', course_id = course_id))
    return render_template('add_assessment_dev.html')    

@main.route('/class<class_id>')
@login_required
def class_page(class_id):
    curr_class = Class.query.filter_by(id=int(class_id)).first()
    return render_template('class_dev.html',curr_class=curr_class)    

@main.route('/course<course_id>/add/class', methods=['GET', 'POST'])
@login_required
def add_class(course_id):
    if request.method == 'POST':
        type = request.form.get('type')
        day = request.form.get('day')
        time_string = request.form.get('time')
        time = datetime.strptime(time_string, "%H:%M")
        weeks = request.form.get('weeks')
        new_class = Class(type = type, day = day, time = time, weeks = weeks)
        db.session.add(new_class)
        db.session.commit()
        return redirect(url_for('main.course', course_id = course_id))
    return render_template('add_class_dev.html')