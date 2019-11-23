# pycoon
A web app to help students keep track of their timetables and assessments<br/>

LOGIN, SIGNUP SIMPLE:<br/>
1. Setup virtual environment (i used python3)<br/>
2. install flask, flask-sqlalchemy, flask-login (using pip)<br/>
3. (create database) in python terminal type:<br/>
    from pycoon import db, create_app<br/>
    db.create_all(app=create_app())<br/>
4. type:<br/>
    export FLASK_APP=pycoon<br/>
    export FLASK_DEBUG=1<br/>
    flask run  or   python -m flask run<br/>
