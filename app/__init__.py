from flask import Flask
from flask_login import LoginManager
from flask_fontawesome import FontAwesome
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://yeaplmzahvwckd:d8dc80dc0d6db2965455f1f6b928b3b1dd3b3f778c1fac6a6b45d9d849cf1913@ec2-54-165-36-134.compute-1.amazonaws.com:5432/d15aj4tp4votld" #Change for testing
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
app.config['UPLOAD_FOLDER'] = './app/static/uploads'
app.config['RETRIEVED_FILE'] = './app/static/uploads'

db = SQLAlchemy(app)
csrf = CSRFProtect(app)
fa = FontAwesome(app)

#flask login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)

from app import views
