from models import Cloud, db

def seed_database():
    db.drop_all()
    db.create_all()
    
    db.session.commit()

    print('seeded')

seed_database()

# def seed_db_if_empty():
#     inspector = inspect(db.engine)

#     if not inspector.has_table('admin'):
#         print('Database is empty and has been seeded')
#         seed_database()
#     else:
#         print('Database has already been seeded.')


