import os
from flask_cors import CORS

from models import db, connect_db, Cloud, User

import json
from flask import Flask, render_template, jsonify, request, flash, redirect, session, url_for, g
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError, DataError

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = (
     os.environ.get('DATABASE_URL', 'postgresql:///cloudtv'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "it's a secret")
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)
CURR_USER_KEY = "curr_user"

app.app_context().push()
connect_db(app)

# # # # # # # # # # # # # # # # GLOBAL FUNCTIONS # # # # # # # # # # # # # # # # # # # # 

# def do_login(admin):
#     """Log in user."""

#     session[CURR_USER_KEY] = admin.id


# def do_logout():
#     """Logout user."""

#     if CURR_USER_KEY in session:
#         del session[CURR_USER_KEY]

# # # # # # # # # # # # # # # # # WORKS ROUTES # # # # # # # # # # # # # # # # # # # # 
@app.route('/cloudset', methods=["GET"])
def get_clouds(): 
    cloud_urls = Cloud.query.all()
    cloud_dict = {}
    for i in range (len(cloud_urls)):
        cloud_dict[i] = cloud_urls[i].file
    return cloud_dict
    

# @app.route('/<username>/entries/<id>', methods=["GET"])
# def get_entries(): 

# @app.route('/<username>/entries', methods=["POST"])
# def new_entry():    

# @app.route('/<username>/entries', methods=["PUT"])
# def edit_entry():    

# @app.route('/<username>/entries', methods=["DELETE"])
# def delete_entry():    
    
# # # # # # # # # # # # # # # # # USER ROUTES # # # # # # # # # # # # # # # # # # # # 
@app.route('/user/<username>', methods=["GET"])
def user_login_or_signup(username): 
    exists = User.query.filter(User.username == username).first() is not None

    if exists:
        u = User.SignIn(username)        
        return username
    else: 
        u = User.SignUp(username)
        return username
    
    
       
    
# @app.route('/register', methods=["POST"])
# def new_user(): 

# @app.route('/logout', methods=["POST"])
# def user_logout(): 
