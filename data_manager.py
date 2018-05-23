import database_common
from werkzeug.security import generate_password_hash, check_password_hash


@database_common.connection_handler
def add_user(cursor, username, password):
    cursor.execute(""" 
                        SELECT username FROM users
                        WHERE LOWER(username) = LOWER(%(username)s);
                       """,
                   {'username': username})
    if cursor.fetchall():
        return "user_already_exists"
    cursor.execute("""
                    INSERT INTO users (username, password)
                    VALUES (%(username)s, %(password)s);
                   """,
                   {'username': username, 'password': generate_password_hash(password)})


@database_common.connection_handler
def get_user(cursor, username, password):
    cursor.execute("""
                    SELECT username, password FROM users
                    WHERE LOWER(username) = LOWER(%(username)s);
                   """,
                   {'username': username})
    db_user = cursor.fetchall()[0]

    if check_password_hash(db_user['password'], password):
        return db_user['username']
    else:
        return None
