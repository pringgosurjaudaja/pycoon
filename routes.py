from flask import Blueprint, render_template,redirect, url_for,request, jsonify, send_file
from .models import User, Term, Course, Assessment, Class, Attachment
from flask_login import login_user, login_required, logout_user, current_user
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from datetime import timedelta
from io import BytesIO
from icalendar import Calendar
import time
import re
import math
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
            return render_template('login.html', error = True, invalid='Invalid username or password')    
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
            return render_template('signup.html', error = True, invalid='User with this email already exists') 

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

        if start_date > end_date:
            return render_template('add_term.html', invalid="Invalid Date")

        db.session.add(new_term)
        db.session.commit()
        return redirect(url_for('main.home'))
    return render_template('add_term.html')

@main.route('/term<term_id>')
@login_required
def term(term_id):
    term = Term.query.filter_by(id=int(term_id)).first()
    courses = Course.query.filter_by(term_id=term.id)
    return render_template('term.html',term=term, courses=courses)    

@main.route('/term<term_id>/delete')
@login_required
def delete_term(term_id):
    term_del = Term.query.filter_by(id = int(term_id)).first()
    db.session.delete(term_del)
    db.session.commit()
    return redirect(url_for('main.home'))

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
    return render_template('add_course.html', term_id = term_id)

@main.route('/course<course_id>')
@login_required
def course(course_id):
    course = Course.query.filter_by(id=int(course_id)).first()
    assessments = Assessment.query.filter_by(course_id=course.id, user_id = current_user.id)
    classes = Class.query.filter_by(course_id = course_id)
    term_id = course.term_id
    return render_template('course_page.html', term_id=term_id, course=course, assessments=assessments, classes=classes)  

@main.route('/term<term_id>/calendar')
@login_required
def calendar(term_id):
    # url = str(request.referrer)
    term = Term.query.filter_by(id=int(term_id))
    course = Course.query.filter_by(term_id=int(term_id))
    result_class = []
    result_assessment = []
    

    for c in course.all():
        classes = Class.query.filter_by(course_id=int(c.id))
        assessments = Assessment.query.filter_by(course_id=int(c.id))
        for cl in classes.all():
            result_class.append(cl.serialize)
        for ass in assessments.all():
            result_assessment.append(ass.serialize)
    
    return render_template('calendar.html', assessment=result_assessment, classes=result_class, terms=[i.serialize for i in term.all()], courses=[i.serialize for i in course.all()]) 


@main.route('/assessment<assessment_id>', methods=['GET', 'POST'])
@login_required
def assessment(assessment_id):
    if request.method == 'POST':
        file = request.files['inputFile']
        new_attachment = Attachment(name=file.filename,data=file.read(),assessment_id=assessment_id)
        db.session.add(new_attachment)
        db.session.commit()   
    assessment = Assessment.query.filter_by(id=int(assessment_id)).first()
    attachments = Attachment.query.filter_by(assessment_id=assessment_id)
    course_id = assessment.course_id
    return render_template('assessment.html',assessment=assessment, attachments=attachments, course_id=course_id)    

@main.route('/attachment<attachment_id>')
def attachment(attachment_id):
    file_data = Attachment.query.filter_by(id = attachment_id).first()
    return send_file(BytesIO(file_data.data), attachment_filename=file_data.name, as_attachment=True)


@main.route('/course<course_id>/add/assessment', methods=['GET', 'POST'])
@login_required
def add_assessment(course_id):
    if request.method == 'POST':
        title = request.form.get('title')
        due_date_string = request.form.get('due_date')
        due_date = datetime.strptime(due_date_string, "%Y-%m-%d")
        time_string = request.form.get('due_time')
        time = datetime.strptime(time_string, "%H:%M").time()
        
        description = request.form.get('description')
        new_assessment = Assessment(title = title, due_date = due_date, due_time=time, course_id = course_id, user_id = current_user.id, description= description)
        db.session.add(new_assessment)
        db.session.commit()
        return redirect(url_for('main.course', course_id = course_id))
    
    return render_template('add_assessment.html', course_id=course_id)      


@main.route('/assessment<assessment_id>/edit', methods=['POST', 'GET'])
@login_required
def edit_assessment(assessment_id):
    if request.method == 'POST':
        assessment = Assessment.query.filter_by(id = int(assessment_id)).first()
        new_title = request.form.get('title')
        due_date_string = request.form.get('due_date')
        new_due_date = datetime.strptime(due_date_string, "%Y-%m-%d")

        time_string = request.form.get('due_time')
        time = datetime.strptime(time_string, "%H:%M").time()
        

        description = request.form.get('description')
        assessment.title = new_title
        assessment.due_date = new_due_date
        assessment.due_time = time
        assessment.description = description
        db.session.commit()
        return redirect(url_for('main.assessment', assessment_id = assessment_id))
    assessment = Assessment.query.filter_by(id = int(assessment_id)).first() 
    return render_template('edit_assessment.html', assessment = assessment)        

@main.route('/api/calendars')
@login_required
def calendars():
    qryresult1 = Assessment.query.filter_by(user_id = current_user.id)
    qryresult2 = Class.query.filter_by(ter)
    return jsonify(calendars = [i.serialize for i in qryresult])

@main.route('/course<course_id>/edit', methods=['POST', 'GET'])
@login_required
def edit_course(course_id):
    if request.method == 'POST':
        course = Course.query.filter_by(id = int(course_id)).first()
        new_code = request.form.get('code')
        new_title = request.form.get('title')
        new_color = request.form.get('color')
        course.code = new_code
        course.title = new_title
        course.color = new_color
        db.session.commit()
        return redirect(url_for('main.course', course_id = course_id))
    course = Course.query.filter_by(id = int(course_id)).first() 
    return render_template('edit_course.html', course = course, term_id = course.term_id)   

@main.route('/class<class_id>')
@login_required
def class_page(class_id):
    curr_class = Class.query.filter_by(id=int(class_id)).first()
    return render_template('class_page.html',curr_class=curr_class)    

@main.route('/course<course_id>/add/class', methods=['GET', 'POST'])
@login_required
def add_class(course_id):
    course = Course.query.filter_by(id=int(course_id)).first()
    term = course.term
    if request.method == 'POST':
        type = request.form.get('type')
        day = request.form.get('day')
        time_string = request.form.get('start_time')
        time = datetime.strptime(time_string, "%H:%M").time()
        time_string_end = request.form.get('end_time')
        end_time = datetime.strptime(time_string_end, "%H:%M").time() 
        weeks = request.form.getlist('weeks')
        weeks = ",".join(weeks)
        location = request.form.get('location')
        new_class = Class(type = type, day = day, time = time,end_time=end_time, weeks = weeks, location = location ,course_id = course_id)
        db.session.add(new_class)
        db.session.commit()
        return redirect(url_for('main.course', course_id = course_id))
    return render_template('add_class.html', course_id = course_id, term=term)

@main.route('/class<class_id>/edit', methods=['POST', 'GET'])
@login_required
def edit_class(class_id):
    course_id = Class.query.filter_by(id=int(class_id)).first().course_id
    course = Course.query.filter_by(id=int(course_id)).first()
    term = course.term
    if request.method == 'POST':
        class_curr = Class.query.filter_by(id = int(class_id)).first()
        new_type = request.form.get('type')
        new_weeks = request.form.getlist('weeks')
        new_weeks = ",".join(new_weeks)
        new_day = request.form.get('day')
        new_time_string = request.form.get('start_time')
        time_re = re.compile(r'^(([01]\d|2[0-3]):([0-5]\d)|24:00)$')
        if(bool(time_re.match(new_time_string))):
            new_time = datetime.strptime(new_time_string, "%H:%M").time()
        else:
            new_time = datetime.strptime(new_time_string, "%H:%M:%S").time() 
        
        time_string_end = request.form.get('end_time')
        if(bool(time_re.match(time_string_end))):
            end_time = datetime.strptime(time_string_end, "%H:%M").time() 
        else:
            end_time = datetime.strptime(time_string_end, "%H:%M:%S").time()  
        class_curr.type = new_type
        class_curr.day = new_day
        class_curr.time = new_time
        class_curr.weeks = new_weeks
        class_curr.end_time = end_time
        db.session.commit()
        return redirect(url_for('main.class_page', class_id = class_id))
    class_curr = Class.query.filter_by(id = int(class_id)).first()
    return render_template('edit_class.html', class_curr = class_curr,term=term)

@main.route('/class<class_id>/delete')
@login_required
def delete_class(class_id):
    class_del = Class.query.filter_by(id = int(class_id)).first()
    course_id = class_del.course_id
    db.session.delete(class_del)
    db.session.commit()
    return redirect(url_for('main.course', course_id = course_id))

@main.route('/course<course_id>/delete')
@login_required
def delete_course(course_id):
    course = Course.query.filter_by(id = int(course_id)).first() 
    term_id = course.term_id
    db.session.delete(course)
    db.session.commit()
    return redirect(url_for('main.term', term_id = term_id))      

@main.route('/assessment<assessment_id>/delete')
@login_required
def delete_assessment(assessment_id):
    assessment = Assessment.query.filter_by(id = int(assessment_id)).first() 
    course_id = assessment.course_id
    db.session.delete(assessment)
    db.session.commit()
    return redirect(url_for('main.course', course_id = course_id))

@main.route('/attachment<attachment_id>/delete')
@login_required
def delete_attachment(attachment_id):
    attachment = Attachment.query.filter_by(id = int(attachment_id)).first() 
    assessment_id = attachment.assessment_id
    db.session.delete(attachment)
    db.session.commit()
    return redirect(url_for('main.assessment', assessment_id = assessment_id))    

@main.route('/api/delete/assessment<assessment_id>')
@login_required
def delete_an_assessment(assessment_id):
    assessment = Assessment.query.filter_by(id = int(assessment_id)).first() 
    course_id = assessment.course_id
    db.session.delete(assessment)
    db.session.commit()


@main.route('/api/assessment<assessment_id>')
@login_required
def get_assessment(assessment_id):
    assessment = Assessment.query.filter_by(id=int(assessment_id)).first()
    attachments = Attachment.query.filter_by(assessment_id=assessment_id)
    return jsonify(assessment=assessment.serialize, attachments=[i.serialize for i in attachments])    
# [i.serialize for i in qryresult]


@main.route('/home', methods=['POST'])
@login_required
def ics_import():
    ics = request.files['ics']
    # print(type(ics))
    # g = open(ics, 'rb')
    gcal = Calendar.from_ical(ics.read())
    course_dict = dict()
    class_dict = dict()
    color_dict = ('#50b2ac', '#5c3dc2','#e27737','#baca45')
    color_i = 0
    for x in  gcal.walk():
        if(x.name =="VEVENT"):
            summ = str(x.get('summary'))
            if('Term' in summ):
                term_start = x['DTSTART'].dt
                term_end = term_start + timedelta(weeks = 11)
                start_term = datetime.strptime(str(term_start).split(' ',1)[0], "%Y-%m-%d").date()
                end_term = datetime.strptime(str(term_end).split(' ',1)[0], "%Y-%m-%d").date() 
                print(start_term)
                title = summ.split(' ', 2)[-1]
                new_term = Term(title=title, start_date=start_term, end_date = end_term, user_id = current_user.id)
                save_term_start = start_term
                db.session.add(new_term)
                db.session.commit()
                term_id = new_term.id
            else:
                summ = str(x.get('summary'))
                desc = str(x.get('description'))
                course = summ.split(' ',1)[0]
                course_desc = desc.split(' ', 1)[1]
                course_desc = course_desc.rsplit(' ',2)[0]
                term_start = x['DTSTART'].dt
                term_end = x['DTEND'].dt
                start_term = datetime.strptime(str(term_start).split(' ',1)[0], "%Y-%m-%d").date()
                end_term = datetime.strptime(str(term_end).split(' ',1)[0], "%Y-%m-%d").date()  
                if(summ in class_dict):
                    class_i= class_dict[summ]
                    class_dict[summ] = class_i+1
                else:
                    class_dict[summ]=1
                class_info = (course, summ.split(' ')[-2], )
                if (Course.query.filter_by(code = course,term_id = int(term_id)).first() == None):
                    new_course = Course(title = course_desc, code = course, color = color_dict[color_i], term_id = term_id)
                    db.session.add(new_course)
                    db.session.commit() 
                    color_i+=1
                    course_dict[course] = new_course.id
    print(class_dict)
    for y in gcal.walk():
        if(y.name == 'VEVENT'and 'Term' not in str(y.get('summary'))):
            summ = str(y.get('summary'))
            course = summ.split(' ',1)[0]
            exam = False
            if('Lecture' in summ):
                type = 'lecture'
            elif ('Tutorial' in summ):
                type = 'tutorial'
            elif('Laboratory' in summ):
                type = 'lab'
            elif('Exam' in summ):
                print("EXAM")
                exam = True
            start_date = y['DTSTART'].dt
            end_date = y['DTEND'].dt
            class_date = datetime.strptime(str(start_date).split(' ',1)[0], "%Y-%m-%d").date()
            if(not exam):
                end_class_date = y['RRULE']['UNTIL'][0]
                end_class = datetime.strptime(str(end_class_date).split(' ',1)[0], "%Y-%m-%d").date()

            start_day_name = class_date.strftime('%A')
            time = str(start_date).split(' ',1)[-1]
            
            class_time = datetime.strptime(time[0:5],"%H:%M").time()
            end_time = str(end_date).split(' ',1)[-1]
            class_time_end = datetime.strptime(end_time[0:4],"%H:%M").time()
            week_start = class_date - save_term_start
            if(not exam):
                class_subtract = end_class - class_date
                # print(class_subtract.days)
                num_weeks = class_subtract.days
                week = str(num_weeks).split(' ',1)[0]
                week_amount = math.ceil(float(week)/7)
                week_counter = (week_start.days/7)+1
                freq = y['RRULE']['FREQ']
                weeks = ''
                print(week_amount)
                if('WEEKLY' in str(freq)):
                    for x in range(0,int(week_amount)):
                        weeks = weeks+str(week_counter)
                        if(x != int(week_amount)-1):
                            weeks = weeks+','
                        week_counter+=1
                    print(weeks)
                location = y['LOCATION']
                new_class = Class(type = type, day = start_day_name, time = class_time,end_time = class_time_end, weeks = weeks, location = location ,course_id = course_dict[course])
                db.session.add(new_class)
            if(exam):
                new_exam = Assessment(title = summ, due_date  = class_date, due_time = class_time, description  = str(y['DESCRIPTION']), course_id = course_dict[course], user_id = current_user.id)
                db.session.add(new_exam)
            
            db.session.commit()

    print("ICS")
    print(ics)

    return redirect(url_for('main.home'))

