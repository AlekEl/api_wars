from flask import Flask, render_template, request, redirect, url_for, session
from flask_bootstrap import Bootstrap
from flask_nav import Nav
from flask_nav.elements import Navbar, View
from werkzeug import security
import data_manager

app = Flask(__name__)
Bootstrap(app)
nav = Nav()


@nav.navigation()
def mynavbar():
    if 'username' in session:
        username = session["username"]
        logout_text = "Logged in as: " + username + ". Click to logout"
        return Navbar(
                'API Wars',
                View('Home', 'index'),
                View(logout_text, 'logout'),
            )
    return Navbar(
        'API Wars',
        View('Home', 'index'),
        View("Login", 'login'),
        View("Register", 'register'),
    )


nav.init_app(app)


@app.route('/')
def index():
    user_logged_in = False
    if "username" in session:
        user_logged_in = True
    print(session)
    return render_template('index.html', user_logged_in=user_logged_in)


@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template('register_login.html', type="register")
    elif request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if data_manager.add_user(username, password) == "user_already_exists":
            message = "User Already Exists"
            return render_template('register_login.html', type="register", message=message)
        data_manager.add_user(username, password)
        session["username"] = username
        return redirect('/')


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template('register_login.html', type="login")
    elif request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if data_manager.get_user(username, password):
            session["username"] = username
            return redirect('/')
        message = "Invalid username or password"
        return render_template('register_login.html', type="login", message=message)


@app.route('/logout')
def logout():
    session.pop("username", None)
    return redirect("/")


if __name__ == '__main__':
    app.secret_key = 'some_key'
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )
