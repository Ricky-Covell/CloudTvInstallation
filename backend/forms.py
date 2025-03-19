from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, ColorField, IntegerRangeField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, NumberRange
from sqlalchemy.exc import IntegrityError, NoSuchTableError

class UserAddForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

class EntryForm(FlaskForm):
    """Login form."""

    thoughts = StringField('thoughts', validators=[])