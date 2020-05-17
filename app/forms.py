from flask_wtf import FlaskForm
from wtforms import Form, StringField, TextAreaField, SelectField, SubmitField
from wtforms.validators import DataRequired, Email, InputRequired, Length
from flask_wtf.file import FileField, FileRequired, FileAllowed


class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()]) 
    firstname = StringField('Firstname', validators=[InputRequired()]) 
    lastname = StringField('Lastname', validators=[InputRequired()]) 
    email = StringField('E-mail', validators=[DataRequired(), Email('Enter a valid email')])
    location = StringField('Located at', validators=[DataRequired()])
    biography = TextAreaField('Biography', validators=[
        InputRequired(),
        Length(min=15, max=200, message="Can enter from 15 to 200 characters.")
    ])
    profile_photo = FileField('Image', validators=[
        FileRequired("You need a profile pic."), 
        FileAllowed(['jpg','png'], 'Images only!')
    ])
    submit = SubmitField('Register')