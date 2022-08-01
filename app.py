from flask import Flask, render_template, jsonify, request
from bson.objectid import ObjectId
from pymongo import MongoClient

client = MongoClient('mongodb+srv://mslee:goodzz123@cluster0.vms1u.mongodb.net/?retryWrites=true&w=majority')
db = client.dbibla

app = Flask(__name__)

@app.route('/', methods=["GET"])
def home():
    board = list(db.board.find({},))
    return render_template('index.html', board = board)

@app.route('/detail', methods=["GET"])
def detail():
    query_string = request.args.get('id')
    board = db.board.find_one({'_id': ObjectId(query_string)})
    reply = db.reply.find({'board_id': query_string})
    return render_template('detail.html', board = board, reply = reply, query_string = query_string)

@app.route('/detail/reply', methods=["POST"])
def reply():
    params = request.get_json()
    print(params['replyContent'])
    print(params['date'])
    print(params['queryString'])

    doc = {
      'board_id': params['queryString'],
      'replyContent': params['replyContent'],
      'date': params['date'],
    }

    db.reply.insert_one(doc)

    return jsonify({
      'msg': 'reply upload success',
    })

if __name__ == '__main__':
    app.run('0.0.0.0', port = 5000, debug = True)


