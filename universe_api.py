import os

import pandas as pd
from flask import Flask
from flask_cors import CORS
# import FinanceDataReader as fdr
import numpy as np
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)
def get_data(file_nm, skiprows=0, sheet_name =0):
    return pd.read_excel('data/'+file_nm, index_col=0 , skiprows=skiprows, sheet_name=sheet_name)

@app.route('/returns/<port1>_<port2>', methods = ['GET','POST'])
def returns(port1, port2):
    returns = get_data('RATB_성과표_18차추가.xlsx', sheet_name='그래프(영업일)', skiprows=1)
    if port1=='멀티에셋인컴':
        port2 = port2[0]
    returns = returns[port1+port2+'2'].dropna().drop_duplicates()
    return {"returns": list(map(lambda x: 100*x,returns.values.tolist())), "date":list(map(lambda x : x.strftime('%y/%m/%d'),returns.index.tolist())), "std": int(np.std(returns.values)*10000)/10000}


@app.route('/strategy/', methods=['GET', 'POST'])
def strategy():
    return {
        '변동성': ['공격', '위험중립', '안정'],
        '초개인로보': ['적극','성장', '안정'],
        '테마로테션':[ '적극','중립','안정'],
        '멀티에셋인컴': [ '적극','중립','안정']
    }

@app.route('/universe', methods = ['GET','POST'])
def index():
    universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
    universe = universe[universe['펀드명'] == '미래변동성공격1']
    universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()

    data = {'date':universe['종목명'].tolist(), 'price':universe['구성비_x000D_\n(%)'].tolist(), 'returns': universe['수익율_x000D_\n(%)'].tolist()}
    return data

@app.route('/universes/', methods = ['GET','POST'], defaults={"port": "미래변동성공격1"})
@app.route('/universes/<port1>_<port2>', methods = ['GET','POST'])
def universe(port1, port2):
    if port1 == "변동성":
        port = "미래"+port1+port2+"2"
        universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
        universe = universe[universe['펀드명'] == port]
        universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x/100),universe['구성비_x000D_\n(%)'].tolist())), 'returns': universe['수익율_x000D_\n(%)'].tolist(), 'port':port}
    elif port1 == "멀티에셋인컴":
        universe = get_data(file_nm='(멀티에셋인컴)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20220303(수정).xlsx', sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-02-28']
        universe = universe[['종목명','비중']].dropna()
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x/100),universe['비중'].tolist())), 'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port':port1+port2}
    elif port1 == "테마로테션":
        universe = get_data(file_nm='수정본_(테마로테이션)21.(자문일임)포트폴리오 리밸런싱 현황_미래에셋자산운용_202203_vFV3.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-03-03']
        universe = universe[['종목명', '비중']].dropna()
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x/100),universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}
    elif port1 == "초개인로보":
        universe = get_data(file_nm='(초개인화자산관리로보)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20211102.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2021-11-01']
        universe = universe[['종목명', '비중']].dropna()
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x/100),universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}

    return data

@app.route('/', methods = ['GET','POST'])
def main():
    return 'hello'

if __name__ == '__main__':
    # get_data(file_nm='변동성_20220513.xlsx')
    app.run(debug=True, host='0.0.0.0', port=4000)

