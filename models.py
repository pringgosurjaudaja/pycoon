from . import db
from flask_login import UserMixin
from sqlalchemy import Enum
import enum

class ClassEnum(enum.Enum):
    lecture = 1
    tutorial = 2
    lab = 3
    seminar = 4

class User(UserMixin, db.Model):
    __tablename__="users"
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(1000), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    terms = db.relationship('Term', backref='user', lazy=True)

class Term(db.Model):
    __tablename__= "terms"
    term_id = db.Column(db.Integer, primary_key =True)
    term_name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    courses = db.relationship('Course', backref='term', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

class Course(db.Model):
    __tablename__="courses"
    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(100), nullable=False)
    assessments = db.relationship('Assessment', backref='course', lazy=True)
    classes = db.relationship('Class', backref='course', lazy=True)
    term_id = db.Column(db.Integer, db.ForeignKey('terms.term_id'), nullable = False)

class Assessment(db.Model):
    __tablename__="assessments"
    assessment_id = db.Column(db.Integer, primary_key=True)
    assessment_title = db.Column(db.String(100),nullable=False)
    assessment_due = db.Column(db.DateTime, nullable = False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable= False)

class Class(db.Model):
    __tablename__ = "classes"
    class_id = db.Column(db.Integer, primary_key=True)
    class_type = db.Column(db.Enum(ClassEnum), nullable=False)
    class_day = db.Column(db.Integer, nullable=False)
    class_time = db.Column(db.Time, nullable=False)
    # class_weeks = db.Column(db.ARRAY(db.Integer()))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable= False)