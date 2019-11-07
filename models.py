from . import db
from flask_login import UserMixin
from sqlalchemy import Enum
import enum

def dump_datetime(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [value.strftime("%Y-%m-%d"), value.strftime("%H:%M:%S")]

def dump_time(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [value.strftime("%H:%M:%S")]


def dump_enum(enum):
    if enum == ClassEnum.lecture:
        return "lecture"
    elif enum == ClassEnum.tutorial:
        return "tutorial"
    elif enum == ClassEnum.lab:
        return "lab"
    elif enum == ClassEnum.seminar:
        return "seminar"
    elif enum == ClassEnum.meeting:
        return "meeting"
    else:
        return "other"

class ClassEnum(enum.Enum):
    lecture = 1
    tutorial = 2
    lab = 3
    seminar = 4
    meeting = 5
    other = 6

class User(UserMixin, db.Model):
    __tablename__="user"
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(1000), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    terms = db.relationship('Term', backref='user', lazy=True)

class Term(db.Model):
    __tablename__= "term"
    id = db.Column(db.Integer, primary_key =True)
    title = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    courses = db.relationship('Course', cascade="all,delete", backref='term', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    @property
    def weeks(self):
        diff = self.end_date - self.start_date
        num_weeks = diff.days / 7
        return round(num_weeks)

    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'id'         : self.id,
           'title'      : self.title,
           'start_date' : dump_datetime(self.start_date),
           'end_date' : dump_datetime(self.end_date),
        #    'courses' : self.courses,
           'user_id' : self.user_id,
       }

class Course(db.Model):
    __tablename__="course"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(9), nullable=False)
    color = db.Column(db.String(7), nullable=False)
    assessments = db.relationship('Assessment', cascade="all,delete", backref='course', lazy=True)
    classes = db.relationship('Class', cascade="all,delete", backref='course', lazy=True)
    term_id = db.Column(db.Integer, db.ForeignKey('term.id'), nullable = False)
    @property
    def serialize(self):
       """Return object data in easily serializable format"""
       return {
           'id'             : self.id,
           'title'          : self.title,
           'code'           : self.code,
           'color'          : self.color,
        #    'assessments'    : self.assessments,
        #    'classes'        : self.classes,
           'term_id'        : self.term_id,
       }

class Assessment(db.Model):
    __tablename__="assessment"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100),nullable=False)
    due_date = db.Column(db.Date, nullable = False)
    due_time = db.Column(db.Time, nullable = True)
    description = db.Column(db.String, nullable = True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable= False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    attachments = db.relationship('Attachment', cascade="all,delete", backref='assessment', lazy=True)
    @property
    def serialize(self):
        return{
            'id'            : self.id,
            'title'         : self.title,
            'start'         : self.due_date,
            'course_id' : self.course_id,
            'user_id'   : self.user_id,
            'description': self.description,
            'due_time': dump_time(self.due_time)
        }

class Attachment(db.Model):
    __tablename__="attachment"
    id = db.Column(db.Integer, primary_key=True)  
    name = db.Column(db.String(300), nullable = False)
    data = db.Column(db.LargeBinary, nullable = False)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessment.id'), nullable= False)
    @property
    def serialize(self):
        return{
            'id'            : self.id,
            'assessment_id' : self.assessment_id,
            'name'          : self.name
        }
class Class(db.Model):
    __tablename__ = "class"
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(ClassEnum), nullable=False)
    day = db.Column(db.Integer, nullable=False)
    time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time,nullable=False)
    weeks = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    notes = db.Column(db.String)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable= False)
    @property
    def serialize(self):
        return{
            'id'            : self.id,
            'type'          : dump_enum(self.type),
            'day'           : self.day,
            'time'          : dump_time(self.time),
            'end_time'      : dump_time(self.end_time),
            'weeks'         : self.weeks,
            'location'      : self.location,
            'course_id'     : self.course_id,
        }