from flask import Flask, jsonify, request, send_file, session, escape, redirect
from flask_cors import CORS
import pymysql
from werkzeug.utils import secure_filename
import random
import string
import os
import time

app = Flask(__name__)
app.secret_key = b'1234wqerasdfzxc#$@$@$@$@%@%#@%Afwefa04435253vawee332342)-=3223@'
CORS(app,supports_credentials=True)

def MySQL_Connect():
    return pymysql.connect(host='localhost', user='root', password='root', db='blog_db')

def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj

mlist =   [{ 'title': 'Python', 'url': '/menu/0', 'desc':'Python is best' ,'img':'http://127.0.0.1:5000/images/python.jpg'},
  { 'title': 'Hacking', 'url': '/menu/1', 'desc' : '' ,'img':''},
  { 'title': 'C/C++', 'url': '/menu/2','desc' : '' ,'img':''},
  { 'title': 'Linux', 'url': '/menu/3','desc' : '' ,'img':''}]


def getDate(date):
    month = ['','Jan','Feb','Mar','Apr','May','Jun','Jul', 'Aug','Sep','Oct','Nov','Dec']
    return '%s %02d'%(month[int(date[5:7])], int(date[8:10]))
    
@app.route('/ajax/getPosts/<int:menuId>', methods=['GET'])
def ajax_post(menuId):
    conn = MySQL_Connect()
    cursor = conn.cursor()
    sql = 'SELECT * FROM posts WHERE menu_id=%s'
    cursor.execute(sql, (menuId))
    result = cursor.fetchall()
    conn.close()
    res = []
    for i in result:
        res.append({'postId':i[0],
                    'menuId':i[1],
                    'author':i[2],
                    'date':getDate(i[3]),
                    'title':i[4],
                    'description':i[5],
                    'image':i[6],
                    'imageText':'Post Image'
                    })
    
    return jsonify(res)

@app.route('/uploadimg', methods=['POST'])
def upload_img():
    res = jsonify({'result': 'err'})
    if 'isLogin' in session:
        f = request.files['image']
        prevURL = 'images/' + secure_filename(f.filename)
        ext = prevURL.split('.')[-1]
        newURL = ''
        f.save(prevURL)
        string_pool = string.ascii_letters
        for i in range(30):
            newURL += random.choice(string_pool)
        newURL = 'images/' + session['userid'] + '_' + newURL +  '.' + ext
        os.rename(prevURL, newURL)
        res = jsonify({'data':{'link':'http://127.0.0.1:5000/' + newURL}})
    return res

@app.route('/images/<string:fileName>', methods=['GET','POST'])
def download_img(fileName):
    referrer = request.headers.get("Referer")
    if referrer and 'http://127.0.0.1:3000' in referrer:
        return send_file('images/' + fileName)
    else:
        return ''

@app.route('/ajax/login/', methods=['POST'])
def login():
    print(request.form)
    _id = request.form['id']
    _pw = request.form['pw']
        
    if _id and _pw:
        conn = MySQL_Connect()
        cursor = conn.cursor()
        sql = "SELECT * FROM users WHERE id=%s and pw=%s"
        cursor.execute(sql, (_id,_pw))
        result = cursor.fetchone()
        conn.close()
        
        res = jsonify({'result': 'err'})
        if result:
            session['userid'] = _id
            session['isLogin'] = '1'
            session['expire_time'] = int(time.time() + 7200)
            res = jsonify({'result': 'ok'})
        
        return res
    else:
        return jsonify({'result': 'err'})

@app.route('/ajax/logout', methods=['GET','POST'])
def logout():
    res = jsonify({'result': 'err'})
    if 'userid' in session:
        session.clear()
        res = jsonify({'result': 'ok'})
    return res

@app.route('/ajax/writePost', methods=['POST'])
def writePost():
    if 'isLogin' in session:
        _author_id = request.form['authorId']
        _menu_id = request.form['menuId']
        _subject = request.form['subject']
        _content = request.form['content']
        if 'img' in request.form:
            _img = request.form['img']
            
        res = jsonify({'result': 'err'})
        
        if _menu_id and _subject and _content:
            conn = MySQL_Connect()
            cursor = conn.cursor()
            sql = 'INSERT INTO posts (menu_id, author_id, date, subject, content, img) VALUE(%s, %s, now(), %s, %s, %s)'
            cursor.execute(sql, (_menu_id, _author_id, _subject, _content, _img))
            conn.commit()
            conn.close()
            res = jsonify({'result': 'ok'})

        return res
    return jsonify({'result': 'err'})
        

@app.route('/ajax/menulist', methods=['GET','POST'])
def ajax_menulist():
    return jsonify(mlist)


if __name__ == '__main__':
    app.run()
