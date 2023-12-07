from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
import tushare as ts
import pandas as pd

app = Flask(__name__)
CORS(app, resources=r'/*')
token='7bdb92642d946229765ed2c1878ea94361de1fbe800be8d7589e4e02'

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/getMsg', methods=['GET', 'POST'])
def home():
    data=request.json.get('centent')
    print(data)
    pro=ts.pro_api(token)
    pa=pro.daily(ts_code='000001.sz', start_date='20190101', end_date='20200213')
    response = {
        'msg': pa.to_json()
    }
    return jsonify(response)

# 启动运行
if __name__ == '__main__':
    app.run()   # 直接运行在本地服务器

