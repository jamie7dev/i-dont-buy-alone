from flask import Flask, render_template, jsonify, request
from bson.objectid import ObjectId
from pymongo import MongoClient
import requests

import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://lee1231234:lee1231234@cluster0.vms1u.mongodb.net/?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbibla
app = Flask(__name__)


##일단 사용하지만 처음은 login화면이여야함
@app.route('/', methods=["GET"])
def home():
    dbposts = list(db.board.find({}))
    category = list(db.category.find({}, {'_id': False}))

    return render_template("post.html", dbposts=dbposts, category=category)


@app.route('/detail', methods=["GET"])
def detail():
    query_string = request.args.get('id')
    board = db.board.find_one({'_id': ObjectId(query_string)})
    reply = db.reply.find({'boardId': query_string})
    return render_template('detail.html', board=board, reply=reply, query_string=query_string)


@app.route('/detail/reply', methods=["POST"])
def reply():
    params = request.get_json()


    doc = {
        'boardId': params['boardId'],
        'replyContent': params['replyContent'],
        'date': params['date'],
    }

    db.reply.insert_one(doc)

    return jsonify({'msg': 'reply upload success', })


######Lee1231234 make here######
##카테고리 인덱스만 찾기

@app.route('/index/<keyword>')
def find_index(keyword):
    if keyword.isdigit():
        dbposts = list(db.board.find({}))
    else:
        dbposts = list(db.board.find({"category": keyword}))
    category = list(db.category.find({}, {'_id': False}))
    return render_template("post.html", dbposts=dbposts, category=category)


##전체 인덱스 찾기
@app.route('/index/', methods=['GET'])
def view_index():
    # 인덱스 형성
    dbposts = list(db.board.find({}))
    category = list(db.category.find({}, {'_id': False}))

    return render_template("post.html", dbposts=dbposts, category=category)

@app.route('/search/', methods=['GET'])
def search_index():
    title_receive = request.args.get('title_give')
    dbposts=list(db.board.find({"title": {'$regex' : '.*' +title_receive+ '.*'}}))
    category = list(db.category.find({}, {'_id': False}))
    return render_template("post.html",dbposts=dbposts, category=category)

######Lee1231234 make end######

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
