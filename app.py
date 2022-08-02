from flask import Flask, render_template, jsonify, request, redirect, url_for
from bson.objectid import ObjectId
from pymongo import MongoClient
from mongo_info import connect
import datetime, jwt, hashlib, json

client = MongoClient(connect)
db = client.dbibla

app = Flask(__name__)

SECRET_KEY = 'team7'

################################## ROOT ##################################
@app.route('/', methods=["GET"])
def home():
    board = list(db.board.find({},))
    return render_template('index.html', board = board)

################################## DETAIL ##################################
@app.route('/detail', methods=["GET"])
def detail():
    query_string = request.args.get('id')
    board = db.board.find_one({ '_id': ObjectId(query_string) })
    reply = db.reply.find({ 'boardId': query_string} )

    return render_template('detail.html', board = board, reply = reply, query_string = query_string)

@app.route('/detail/reply', methods=["POST"])
def reply():
    params = request.get_json()

    doc = {
      'boardId': params['boardId'],
      'replyContent': params['replyContent'],
      'date': params['date'],
    }

    db.reply.insert_one(doc)

    return jsonify({ 'repliable': True, })

################################## SIGNIN ##################################
@app.route('/signin', methods=["GET"])
def render_signin():
    return render_template('signin.html')

@app.route('/signin', methods=["POST"])
def confirm_signin():
    params = request.get_json()
    pw_hash = hashlib.sha256(params['pw'].encode('utf-8')).hexdigest()

    account = db.account.find_one({ 
      'accountEmail': params['accountEmail'],
      'pw': pw_hash
     })

    if account is not None:
        payload = {
          'accountEmail': params['accountEmail'],
          'expire': json.dumps(datetime.datetime.utcnow() + datetime.timedelta(seconds = 60 * 60), default=str)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm = 'HS256')

        return jsonify({'result': 'success', 'token': token})
    else: 
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

################################## SIGNUP ##################################
@app.route('/signup', methods=["GET"])
def render_signup():
    return render_template('signup.html')

@app.route('/signup', methods=["POST"])
def confirm_signup():
    params = request.get_json()
    account = {
      'accountEmail': params['accountEmail'],
      'nickname': params['nickname'],
      'pw': hashlib.sha256(params['pw'].encode('utf-8')).hexdigest()
    }

    db.account.insert_one(account)
    
    return jsonify({ 'msg': True })

@app.route('/signup/email', methods=["POST"])
def is_in_use_email():
    params = request.get_json()
    result = db.account.find_one({ 'accountEmail': params['accountEmail'] })
    has_account = False
    if result:
        has_account = True
        
    return jsonify({ 'hasAccount': has_account })
    

if __name__ == '__main__':
    app.run('0.0.0.0', port = 5000, debug = True)
