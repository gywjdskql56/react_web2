import os

import pandas as pd
from flask import Flask
from flask_cors import CORS
import FinanceDataReader as fdr

def get_price(ticker,date):
    # return fdr.DataReader(ticker, date)
    return pd.read_excel('src/layouts/dashboard/data/KS200.xlsx', index_col=0)

def get_data(file_nm):
    return pd.read_excel('data/'+file_nm, index_col=0)
app = Flask(__name__)
CORS(app)

@app.route('/kospi', methods = ['GET','POST'])
def index():
    price = get_price(ticker='KS11',date='2017-09-01')
    returns = (price - price.shift(1)) /price.shift(1)
    price.index = list(map(lambda x: str(x.strftime('%Y%m%d')),price.index))
    print(price.index)
    data = {'date':price.index.tolist()[-10:],'price':price.Close.values.tolist()[-10:], 'returns': returns.Close.values.tolist()[-10:]}
    return data
if __name__ == '__main__':
    app.run(debug=True)