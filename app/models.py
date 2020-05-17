from . import db
import datetime


class UserProfile(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True) 
    username = db.Column(db.String(40)) 
    password = db.Column (db.CharField(widget=db.PasswordInput))
    firstname = db.Column(db.String(40))
    lastname = db.Column(db.String(40))
    email = db.Column(db.String(80), unique=True)
    location = db.Column(db.String(80))
    biography = db.Column(db.String(1000))
    profile_photo = db.Column(db.String(40)) 
    joined_on = db.Column(db.DateTimeField(auto_now_add=True)) 

    
    def __init__(self,username,password, firstname, lastname, email, location, gender, bio, fileName):  
        self.username = username 
        self.password = password 
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.location = location
        self.biography = bio
        self.profile_photo = fileName


class Post(db.Model):  
    __tablename__= 'Posts' 
    
    id = db.Column(db.ForeignKey(UserProfile, on_delete= db.CASCADE, on_update= CASCADE))  
    user_id = db.Column(db.Integer, primary_key=True)  
    photo =  db.Column(db.String(40)) 
    caption = db.Column(db.String (300)) 
    created_on = db.Column(db.DateTimeField(auto_now_add=True)) 

    def __init__ (self,photo, caption): 
        self.photo = photo 
        self.caption = caption 



class Like(db.Model): 
    __tablename__= 'Likes' 

    id = db.Column(db.ForeignKey(UserProfile, on_delete= db.CASCADE, on_update= CASCADE))   
    user_id = db.Column( db.ForeignKey(Post, on_delete= db.CASCADE, on_update= CASCADE))  
    post_id = db.Column(db.Integer, primary_key=True)   


class Follow (db.Model): 
    __tablename__= 'Follows'  

    id = db.Column(db.ForeignKey(UserProfile, on_delete= db.CASCADE, on_update= CASCADE))  
    user_id = db.Column( db.ForeignKey(Post, on_delete= db.CASCADE, on_update= CASCADE))    
    follower_id = db.Column(db.Integer, primary_key=True)   


    




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