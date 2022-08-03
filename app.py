from flask import Flask, render_template, jsonify, request, redirect, url_for
from bson.objectid import ObjectId
from pymongo import MongoClient
from mongo_info import connect
import jwt, hashlib, json
from datetime import datetime
from datetime import timedelta

client = MongoClient(connect)
db = client.dbibla

app = Flask(__name__)

SECRET_KEY = 'team7'

######Lee1231234 make here######
def auth_cookie():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        user_info = db.account.find_one({"accountEmail": payload["accountEmail"]})
    except jwt.ExpiredSignatureError:
        return True
    except jwt.exceptions.DecodeError:
        return True

##전체 인덱스 찾기
@app.route('/', methods=['GET'])
def view_index():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))
    # 인덱스 형성
    boards = list(db.board.find({}))
    category = list(db.category.find({}, {'_id': False}))

    return render_template("index.html", boards=boards, category=category)
    
##카테고리 인덱스만 찾기
@app.route('/<keyword>')
def find_index(keyword):
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    if keyword.isdigit():
        boards = list(db.board.find({}))
    else:
        boards = list(db.board.find({"category": keyword}))

    category = list(db.category.find({}, {'_id': False}))
    return render_template("index.html", boards=boards, category=category)

@app.route('/search/', methods=['GET'])
def search_index():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    title_receive = request.args.get('title_give')
    boards=list(db.board.find({"title": {'$regex' : '.*' +title_receive+ '.*'}}))
    category = list(db.category.find({}, {'_id': False}))
    return render_template("index.html",boards=boards, category=category)
######Lee1231234 make end######

################################## DETAIL ##################################
@app.route('/detail', methods=["GET"])
def detail():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    query_string = request.args.get('id')
    board = db.board.find_one({ '_id': ObjectId(query_string) })
    reply = db.reply.find({ 'boardId': query_string} )

    return render_template('detail.html', board = board, reply = reply, query_string = query_string)

@app.route('/detail', methods=["POST"])
def is_create_user():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    params = request.get_json()
    query_string = params['queryString']

    board = db.board.find_one({ 
        '_id': ObjectId(query_string),
        'boardEmail': params['accountEmail'],
        'nickname': params['nickname']
    })

    if board is not None:
        return jsonify({ 'isOwn': True })
    return jsonify({ 'isOwn': False })

########################## 게시물 삭제 #############################
@app.route('/detail/<query_string>/delete', methods=['DELETE'])
def delete_board(query_string):
    board = db.board.find_one({ '_id': ObjectId(query_string) })
    deletable = True
    if board is None:
        deletable = False
    else:
        db.board.delete_one({ '_id': ObjectId(query_string) })
    return jsonify({ 'delete': deletable })

########################## 댓글 달기 ##############################
@app.route('/detail/reply', methods=["POST"])
def reply():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    params = request.get_json()

    doc = {
      'boardId': params['boardId'],
      'accountEmail': params['accountEmail'],
      'nickname': params['nickname'],
      'replyContent': params['replyContent'],
      'date': params['date'],
    }

    db.reply.insert_one(doc)

    return jsonify({ 'repliable': True, })

################################## SIGNIN ##################################
@app.route('/signin', methods=["GET"])
def render_signin():
    if auth_cookie()==False:
        return redirect(url_for("view_index"))
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
          'expire': json.dumps(datetime.utcnow() + timedelta(seconds = 60 * 60), default=str)
        }
        # ec2
        token = jwt.encode(payload, SECRET_KEY, algorithm = 'HS256').decode('utf-8')

        # local
        # token = jwt.encode(payload, SECRET_KEY, algorithm = 'HS256')

        return jsonify({
          'result': True, 
          'token': token, 
          'nickname': account['nickname']
          })
    else: 
        return jsonify({'result': False, 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

################################## SIGNUP ##################################
@app.route('/signup', methods=["GET"])
def render_signup():
    if auth_cookie()==False:
        return redirect(url_for("view_index"))
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
    
################################## 이메일 중복 체크 ##################################
@app.route('/signup/email', methods=["POST"])
def is_in_use_email():
    params = request.get_json()
    result = db.account.find_one({ 'accountEmail': params['accountEmail'] })
    has_account = False
    if result:
        has_account = True

    return jsonify({ 'hasAccount': has_account })

########################### 업로드 ####################################################     
@app.route('/upload', methods=['GET'])
def upload():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def save_upload():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))

    title_receive = request.form['title_give']
    content_receive = request.form['content_give']
    category_receive = request.form['category_give']
    price_receive = request.form['price_give']
    num_receive = request.form['num_give']
    nickname_receive = request.form['nickname']
    boardEmail_receive = request.form['boardEmail']

    file = request.files["file_give"]

    extension = file.filename.split('.')[-1]
    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
    mytime2= today.strftime('%m월 %d일 %H시 %M분')
    filename = f'file-{mytime}'

    save_to = f'static/{filename}.{extension}'
    file.save(save_to)
    token_receive = request.cookies.get('mytoken')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

    user_info = db.account.find_one({"accountEmail": payload["accountEmail"]})
    doc = {
        'boardEmail': boardEmail_receive,
        'nickname': nickname_receive,
        'title': title_receive,
        'content': content_receive,
        'category': category_receive,
        'price': price_receive,
        'participant': num_receive,
        'file': f'{filename}.{extension}',
        'date': mytime2,
    }

    db.board.insert_one(doc)

    return jsonify({'msg': ' 작성 완료!'})

########################### 프로필 ####################################################     
@app.route('/profile', methods=['GET'])
def render_profile():
    if auth_cookie():
        return redirect(url_for("render_signin", msg="로그인이 필요합니다."))
    
    token_receive = request.cookies.get("mytoken")
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    user_info = db.account.find_one({"accountEmail": payload["accountEmail"]})
    boards = list(db.board.find({"boardEmail": payload["accountEmail"]}))
    
    return render_template('profile.html', account=user_info, boards=boards)

if __name__ == '__main__':
    app.run('0.0.0.0', port = 5000, debug = True)
