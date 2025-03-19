from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError

bcrypt = Bcrypt()
db = SQLAlchemy() 

def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)


# # # # # # # # # # # # # # # # # # # # # clouds # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
class Cloud(db.Model):
    """Database Model for Journal"""

    __tablename__ = 'clouds'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    file = db.Column(
        db.Text,
        nullable=False,
    )



# # # # # # # # # # # # # # # # USERS # # # # # # # # # # # # # # # # # # # # 
class User(db.Model):
    """Database Model for User"""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    entries = db.relationship(
        'Entry',
        backref = 'users',
        cascade = 'all, delete-orphan',
    )

    @classmethod
    def SignIn(cls, username):
        """ """

        user = cls.query.filter_by(username=username).one()        
        return user
    
    @classmethod
    def SignUp(cls, username):
        """ """

        user = User(
          username=username,            
        )

        try: 
            db.session.add(user)
            db.session.commit()

        except ValueError as err:
            print(err)

        return user    


# # # # # # # # # # # # # # # # # # # # # ENTRIES # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
class Entry(db.Model):
    """Database Model for Journal Entry"""

    __tablename__ = 'entries'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    clip = db.Column(
        db.Text,
        nullable=False,
    )

    thoughts = db.Column(
        db.Text,
        nullable=True,
    )

    date = db.Column(
        db.Text,
        nullable=False,
    )

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)