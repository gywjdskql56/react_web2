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

@app.route('/returns/', methods = ['GET','POST'], defaults={"port1": "변동성","port2": "공격" })
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

@app.route('/strategy_explain/', methods=['GET', 'POST'])
def strategy_explain():
    return {
        '변동성': {'공격':['(고위험) 선택된 국내 상장 주식형 ETF에 대하여 시장 상황 및 주가 수준 등을 감안하여 최소 비중 0%에서 최대 비중 100% 내에서 중위험 중수익의 안정적인 수익 추구하되 위험자산의 비중을 상대적으로 높게 유지하며 투자자의 위험 성향에 대응', '위험자산 편입 한도 : 100%'],
                 '위험중립':['(중위험) 선택된 국내 상장 주식형 ETF에 대하여 시장 상황 및 주가 수준 등을 감안하여 최소 비중 0%에서 최대 비중 80% 내에서 중위험 중수익의 안정적인 수익 추구하되 위험자산의 비중을 안정적으로 유지하며 투자자의 위험 성향에 대응', '위험자산 편입 한도 : 80%'],
                 '안정': ['(저위험) 선택된 국내 상장 주식형 ETF에 대하여 시장 상황 및 주가 수준 등을 감안하여 최소 비중 0%에서 최대 비중 60% 내에서 중위험 중수익의 안정적인 수익 추구하되 위험자산의 비중을 상대적으로 낮게 유지하며 투자자의 위험 성향에 대응','위험자산 편입 한도 : 60%']},
        '초개인로보': {'적극':['(고위험) 적극적으로 위험을 수용하면서 적극적으로 투자수익 추구','위험자산군의 비중 : 92% +/- alpha (67% - 100%) 내에서 운용'],
                  '성장':['(중위험) 위험에 다소 민감하나 꾸준한 투자기회 노출 추구','위험자산군의 비중 : 70% +/- alpha (45% - 90%) 내에서 운용'],
                  '안정':['(저위험) 위험에 민감하며 이로 인한 투자 기회 상실 감내','위험자산군의 비중 : 52% +/- alpha (27% - 72%) 내에서 운용']},
        '테마로테션': {'적극': ['(다소 높은 위험) 투자자산의 80% 이하를 위험자산(해외 주식 ETF)에 투자하고 나머지를 안전자산(해외채권 ETF, 외화/원화 예수금)에 투자', '위험자산군의 비중 : 80%'],
                  '중립': ['(보통 위험) 투자자산의 50% 이하를 위험자산(해외 주식 ETF)에 투자하고 나머지를 안전자산(해외채권 ETF, 외화/원화 예수금)에 투자', '위험자산군의 비중 : 50%'],
                  '안정': ['(매우 낮은 위험) 투자자산의 10% 이하를 위험자산(해외 주식 ETF)에 투자하고 나머지를 안전자산(해외채권 ETF, 외화/원화 예수금)에 투자', '위험자산군의 비중 : 10%']},
        '멀티에셋인컴': {'적극': ['(매우 높은 위험) 투자자산의 100% 이하를 위험자산(배당주 ETF/ 리츠 ETF/ 전환사채 ETF/ 우선주 ETF)에 투자 ', '위험자산군의 비중 : 100%'] ,
                  '중립': ['(다소 높은 위험) 투자자산의 80% 이하를 위험자산에 투자', '위험자산군의 비중 : 80%'],
                  '안정':['(보통 위험) 투자자산의 50% 이하를 위험자산에 투자', '위험자산군의 비중 : 50%']}
    }

@app.route('/universe', methods = ['GET','POST'])
def index():
    universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
    universe = universe[universe['펀드명'] == '미래변동성공격1']
    universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()

    data = {'date':universe['종목명'].tolist(), 'price':universe['구성비_x000D_\n(%)'].tolist(), 'returns': universe['수익율_x000D_\n(%)'].tolist()}
    return data

@app.route('/universes/', methods = ['GET','POST'], defaults={"port1": "변동성","port2": "공격" })
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
    return 'flask is working'

if __name__ == '__main__':
    # get_data(file_nm='변동성_20220513.xlsx')
    app.run(debug=True, host='0.0.0.0', port=4000)

