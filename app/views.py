"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
import datetime, base64, jwt
from functools import wraps
from app import app, db, csrf, login_manager
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from app.forms import RegisterForm, LoginForm, PostsForm, LikesForm, FollowsForm
from app.models import Posts, Users, Likes, Follows

#Decorator functions for JWT Authentication
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, app.config['SECRET_KEY'])

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated

###
# Routing for your application.
###

#Api to accepts user information and saves it to the database
@app.route("/api/users/register", methods=["POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():

        username = form.username.data
        password = form.password.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        email = form.email.data
        location = form.location.data
        bio = form.biography.data
        photo = form.profile_photo.data

        filename = secure_filename(photo.filename)
        photo.save(os.path.join(
            app.config['UPLOAD_FOLDER'], filename
        ))
        
        try:
            #create and add user object to database
            user = Users(username, password, firstname, lastname, email, location, bio, filename)

            db.session.add(user)
            db.session.commit()
        
            #flash success message 
            response = "User registration was sucessful"
            return jsonify(message=response), 201
                
        except Exception as e:
            print(e)
            response = "An error as occured."
            return jsonify(error=response), 400
    
    #flash message for form error
    response = form_errors(form) 
    return jsonify(error=response), 400


#Api route to accepts login credentials as username and password
@app.route("/api/auth/login", methods=["POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        
        #Query the database for records matching the given username and password
        user = db.session.query(Users).filter_by(username=username).first()

        if (check_password_hash(user.password, password)):
            
            login_user(user)

            #creates bearer token 
            jwt_token = jwt.encode({'id':user.id, 'user': user.username}, app.config['SECRET_KEY'], algorithm = 'HS256').decode('utf-8')

            #Flash message for a successful login
            response = "Your login was successful"
            return jsonify(message=response, token=jwt_token), 200
        else:
            #Flash message for a failed login
            response = "Incorrect username and password combination"
            return jsonify(error=response), 400
       
    #Flash message to indicate a failed login
    response = form_errors(form)
    return jsonify(error=response)


#Api route to Logout a user
@app.route("/api/auth/logout", methods=["GET"])
@requires_auth
def logout():
    logout_user()

    #Flash message for successful logout
    response = "You were logged out successfully."
    return jsonify(message=response)



#Api route used for adding posts to the users feed and displaying post
@app.route("/api/users/<user_id>/posts", methods=["POST", "GET"])
@requires_auth
def handlePosts(user_id):
    form = PostsForm()
    if request.method == "POST":
        if form.validate_on_submit():
            caption = form.caption.data
            photo = form.photo.data
            filename = photo.filename
            photo.save(os.path.join(
                app.config['UPLOAD_FOLDER'], filename
            ))
            post = Posts(user_id, filename, caption)

            try:
                
                db.session.add(post)
                db.session.commit()
                
                #Flash message for a successfully added post
                response = "A new post was added successfully"
                return jsonify(message=response), 201
            except Exception as e:
                print(e)
                
                response = "An error as occurred"
                return jsonify(error=response), 401

        response = form_errors(form)
        return jsonify(error=response)
        
    if request.method == "GET":
        if form.validate_on_submit():
            try:
                #Retrieve the user's posts
                posts = db.session.query(Posts).filter_by(user_id=user_id).all()
                
                allPosts = []
                for post in posts:
                    post_detail = {"id": post.id, 
                                    "user_id": post.user_id, 
                                    "photo": post.photo, 
                                    "caption": post.caption}
                    allPosts.append(post_detail)
                
                return jsonify(posts=allPosts)
            except Exception as e:
                print(e)
                response = "An error has occurred"
                return jsonify(error=response), 401

        response = form_errors(form)
        return jsonify(error=response), 400
            
    #Flash message for errors
    response = "An error occurred trying to display posts"
    return jsonify(error=response), 401



#Api route to create a Follow relationship between the current user and the target user.
@app.route("/api/users/<user_id>/follow", methods=["POST"])
@requires_auth
def follow(user_id):
    form = FollowsForm()

    if form.validate_on_submit:
        try:
            follower_id = form.follower_id.data
            follow = Follows(user_id, follower_id)
            db.session.add(follow)
            db.session.commit()
            
            #Flash message for a successfully following
            response = "You are now following this user"
            return jsonify(message=response), 200

        except Exception as e:
            print(e) 
            #Flash message to indicate that an error occurred
            response = "An error as occurred."
            return jsonify(error=response), 400



#Api route to return all posts for all users
@app.route("/api/posts", methods=["GET"])
@requires_auth
def getPosts():
    try:
        
        allPosts = db.session.query(Posts).order_by(Posts.created_on.desc()).all()
        token = request.headers['Authorization'].split()[1]
        user_id = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['id']
        
        user = db.session.query(Users).filter_by(id=user_id).first()
        likes = [like.post_id for like in user.likes]
        posts = []
        for post in allPosts:
            isLiked = post.id in likes
            details = {"id": post.id, "user_id": post.user_id, "photo": post.photo, "caption": post.caption,  "likes": len(post.likes), "isLiked": isLiked, "created_on": post.created_on.strftime("%d %b %Y")}
            posts.append(details)
        return jsonify(posts=posts), 200
    except Exception as e:
        print(e)
        
        response = "An error occered"
        return jsonify(error=response), 400



#Api route to set a like on the current Post by the logged in User
@app.route("/api/posts/<post_id>/like", methods=["POST"])
@requires_auth
def like(post_id):
    form = LikesForm()

    if form.validate_on_submit():
    
        user_id = form.user_id.data
        like = Likes(user_id, post_id)
        try:
            post = db.session.query(Posts).filter_by(id=post_id).first()
            db.session.add(like)
            db.session.commit()
            response = "Post Liked!"
            return jsonify(message=response, likes=len(post.likes)), 200
        except:
            response= "could not like post"
            return jsonify(error=response), 400
    
   
    response = "Failed to like the post, Something went wrong with the form"
    return jsonify(error=response), 400

# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return app.send_static_file('index.html')


# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return db.session.query(Users).get(int(id))


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
