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
    pro=ts.pro_api(token)
    data = pro.stock_basic(exchange='', list_status='L', fields='ts_code,symbol,name,area,industry,list_date')
    response = {
        'data': data.to_json()
    }
    return response

# 启动运行
if __name__ == '__main__':
    app.run()   # 直接运行在本地服务器

