from . import db
from werkzeug.security import generate_password_hash
from datetime import date

class Posts(db.Model):  
    __tablename__= 'Posts' 
    
    id = db.Column(db.Integer, primary_key=True)  
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id', ondelete='CASCADE'), nullable=False)  
    photo =  db.Column(db.String(200), nullable=False) 
    caption = db.Column(db.String (300)) 
    created_on = db.Column(db.Date()) 

    #Relationship between a posts and its likes
    likes = db.relationship('Likes', backref='Posts', passive_deletes=True, lazy=True)

    def __init__ (self,user_id, photo, caption): 
        self.user_id = user_id
        self.photo = photo 
        self.caption = caption 
        self.created_on = date.today()


class Users(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True) 
    username = db.Column(db.String(40), nullable=False, unique=True) 
    password = db.Column (db.String(300), nullable=False)
    firstname = db.Column(db.String(40), nullable=False)
    lastname = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(80), nullable=False,unique=True)
    location = db.Column(db.String(80), nullable=False)
    biography = db.Column(db.String(1000), nullable=False)
    profile_photo = db.Column(db.String(40), nullable=False) 
    joined_on = db.Column(db.Date()) 

    #Relationship among the users the posts, the likes and the followers
    posts = db.relationship('Posts', backref='Users', passive_deletes=True, lazy=True)
    likes = db.relationship('Likes', backref='Users', passive_deletes=True, lazy=True)
    followers = db.relationship('Follows', backref='Users', passive_deletes=True, lazy=True)

    
    def __init__(self,username,password, firstname, lastname, email, location, bio, fileName):  
        self.username = username 
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.location = location
        self.biography = bio
        self.profile_photo = fileName
        self.joined_on = date.today()

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)


class Likes(db.Model): 
    __tablename__= 'Likes' 

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id', ondelete='CASCADE'))
    post_id = db.Column(db.Integer, db.ForeignKey('Posts.id', ondelete='CASCADE'))
    
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id


class Follows(db.Model): 
    __tablename__= 'Follows'  

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id', ondelete='CASCADE'), nullable=False)
    follower_id = db.Column(db.Integer, nullable=False) 

    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id
