from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
import tushare as ts
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app, resources=r'/*')
# 因为Token积分原因，可使用test或者将下面的pro_api换成自己的Token
pro = ts.pro_api('7bdb92642d946229765ed2c1878ea94361de1fbe800be8d7589e4e02')


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/getStockList', methods=['GET'])
def stockList():

    data = pro.stock_basic(exchange='', list_status='L',
                           fields='ts_code,symbol,name,area,industry,list_date')
    list = data.to_dict('records')
    return list


@app.route('/getHistaryData', methods=['GET'])
def histaryData():

    code = request.args.get('ts_code')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    df = pro.query('daily', ts_code=code, start_date=start_date, end_date=end_date)
    data = pd.DataFrame(df)
    # 过滤排序数据
    df = data.sort_values(by='trade_date', axis=0)
    df = df.loc[df["trade_date"].between(start_date, end_date)]
    if df.empty:
        list = []
    else:
        list = df.to_dict('records')
    return list


# 启动运行
if __name__ == '__main__':
    app.run()   # 直接运行在本地服务器
