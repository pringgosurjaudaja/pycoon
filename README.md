# pycoon
A web app to help students keep track of their timetables and assessments

LOGIN, SIGNUP SIMPLE:
1. Setup virtual environment
2. install flask, flas-sqlalchemy, flask-login (using pip)
3. (create database) in python terminal type:
    from pycoon import db, create_app
    db.create_all(app=create_app())
4. type:
    export FLASK_APP=pycoon
    export FLASK_DEBUG=1
    flask run