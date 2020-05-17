from flask_wtf import FlaskForm
from wtforms import Form, StringField, TextAreaField, SelectField, SubmitField, PasswordField
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
    profile_photo = FileField('Photo', validators=[
        FileRequired("You need a profile pic."), 
        FileAllowed(['jpg','png','jpeg'], 'Images only!')
    ])
    submit = SubmitField('Register')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


class PostsForm(FlaskForm):
    caption = TextAreaField('Caption', validators=[DataRequired()])
    photo = FileField('Photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'jpeg'], 'Images only!')])
    submit = SubmitField("Submit")


class LikeForm(FlaskForm):
    user_id = StringField('Post ID', validators=[DataRequired()])


class FollowForm(FlaskForm):
    follower_id = StringField('Follower ID', validators=[DataRequired()])
