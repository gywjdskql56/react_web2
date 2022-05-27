import os

import pandas as pd
from flask import Flask
from flask_cors import CORS
# import FinanceDataReader as fdr

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)
def get_data(file_nm, skiprows=0):
    return pd.read_excel('data/'+file_nm, index_col=0 , skiprows=skiprows)


@app.route('/universe', methods = ['GET','POST'])
def index():
    universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
    universe = universe[universe['펀드명'] == '미래변동성공격1']
    universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()

    data = {'date':universe['종목명'].tolist(), 'price':universe['구성비_x000D_\n(%)'].tolist(), 'returns': universe['수익율_x000D_\n(%)'].tolist()}
    return data

@app.route('/universes/<port>', methods = ['GET','POST'])
def universe(port):
    universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
    universe = universe[universe['펀드명'] == port]
    universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()
    data = {'ticker':universe['종목명'].tolist(),'percent':universe['구성비_x000D_\n(%)'].tolist(), 'returns': universe['수익율_x000D_\n(%)'].tolist(), 'port':port}
    return data

@app.route('/', methods = ['GET','POST'])
def main():
    return 'hello'

if __name__ == '__main__':
    # get_data(file_nm='변동성_20220513.xlsx')
    app.run(debug=True, host='localhost', port=5001)

