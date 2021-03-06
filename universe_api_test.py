import os
import requests
import pandas as pd
# from flask import Flask
# from flask_cors import CORS
# import FinanceDataReader as fdr
import json
# app = Flask(__name__)
# app.config['JSON_AS_ASCII'] = False
# CORS(app)
def get_data(file_nm, skiprows=0, sheet_name =0):
    return pd.read_excel('data/'+file_nm, index_col=0 , skiprows=skiprows, sheet_name =sheet_name)

def price():
    pass

# @app.route('/universe', methods = ['GET','POST'])
def index():
    universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
    universe = universe[universe['펀드명'] == '미래변동성공격1']
    universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()

    data = {'date':universe['종목명'].tolist(), 'price':universe['구성비_x000D_\n(%)'].tolist(), 'returns': universe['수익율_x000D_\n(%)'].tolist()}
    return data

# @app.route('/universes/', methods = ['GET','POST'], defaults={"port": "미래변동성공격1"})
# @app.route('/universes/<port>', methods = ['GET','POST'])
def universe(port):
    universe = get_data(file_nm='변동성_20220513.xlsx',skiprows=2)
    universe = universe[universe['펀드명'] == port]
    universe = universe[['종목명','구성비_x000D_\n(%)','수익율_x000D_\n(%)']].dropna()
    data = {'ticker':universe['종목명'].tolist(),'percent':universe['구성비_x000D_\n(%)'].tolist(), 'returns': universe['수익율_x000D_\n(%)'].tolist(), 'port':port}
    return data

# @app.route('/', methods = ['GET','POST'])
def main():
    return 'hello'
def cal_thl(start_money, ):
    pass


def get_green_indexing(sec_num, theme_num):
    sec_list = sec_num.split(',')
    theme_list = theme_num.split(',')
    URL = "https://evening-ridge-28066.herokuapp.com/calc_port_weight2"
    data = {
        "sim_start": "20150101",
        "sim_end": "20220101",
        "include_sector_num": sec_list,
        "include_theme_num": theme_list,
        "value_adj": 1,
        "size_adj": 0,
        "quality_adj": 0,
        "em_adj": 1,
        "pm_adj": 1,
        "weight_add_vec": [0.05, -0.05, 0, 0],
        "num_select": 1
    }
    res = requests.post(URL, data=json.dumps(data))
    res = json.loads(res.text)
    port_return = res['port_return']
    port_weight = res['port_weight']
    port_return = pd.DataFrame.from_dict(port_return)
    port_weight = pd.DataFrame.from_dict(port_weight)

    return {'port_return': {
        'date' : port_return.td.to_list(),
        'rtn' : port_return.rtn.to_list() },
        'port_weight': {
            'td': port_weight.td.to_list(),
            'code': port_weight.code.to_list(),
            'name': port_weight.name.to_list(),
            'sector': port_weight.sector.to_list(),
            'theme': port_weight.theme.to_list(),
            'value': port_weight.value.to_list(),
            'size': port_weight.size.to_list(),
            'quality': port_weight.quality.to_list(),
            'earnings_momentum': port_weight.earnings_momentum.to_list(),
            'price_momentum': port_weight.price_momentum.to_list(),
            'score': port_weight.score.to_list(),
            'indv_weight': port_weight.indv_weight.to_list(),
            'sector_score': port_weight.sector_score.to_list(),
            'sector_weight': port_weight.sector_weight.to_list(),
            'quaadd_weight_sectorlity': port_weight.add_weight_sector.to_list(),
            'theme_score': port_weight.theme_score.to_list(),
            'theme_weight': port_weight.theme_weight.to_list(),
            'theme_rank': port_weight.theme_rank.to_list(),
            'weight': port_weight.weight.to_list()
        }
            }

def get_green_indexing_sec_num():
    URL = "https://evening-ridge-28066.herokuapp.com/get_sector_num_tbl"
    res = requests.get(URL)
    return res

def get_green_indexing_theme_num():
    URL = "https://evening-ridge-28066.herokuapp.com/get_theme_num_tbl"
    res = requests.get(URL)
    return res

if __name__ == '__main__':
    get_green_indexing('1','1')
    get_green_indexing_sec_num()

    print(1)
    data = get_data(file_nm='TLH 계산 로직 및 시뮬레이션 결과_NASDAQ100.xlsx',sheet_name='시뮬레이션').reset_index()

    # data_1 = data[['연도', '날짜', 'USDKRW', 'TLH 포트\n($)', 'QQQ ETF\n($)']]
    # data_1 = data[['날짜1','QQQ 평가 금액','TLH 평가 금액']]


    dict1= {'with_tlh' : data.loc[[28, 30, 33, 35, 37, 39], '기본공제\n대비.1'].tolist(),
    'no_tlh' : data.loc[[28, 30, 33, 35, 37, 39], 'QQQ\n실현 수익'].tolist()}
    print(1)
    # data_1['날짜1'] = data_1['날짜1'].apply(lambda x: x.strftime('%Y-%m-%d'))
    #
    # data_2 = data[['날짜2','TLH 전략','QQQ 바이홀드 전략']]
    # data_2['날짜2'] = data_2['날짜2'].apply(lambda x: x.strftime('%Y-%m-%d'))
    # result= {'date': data_1['날짜1'].tolist(), 'QQQ 평가 금액': data_1['QQQ 평가 금액'].tolist(), 'TLH 평가금액': data_1['TLH 평가 금액'].tolist()}
    # result2 = {'date': data_2['날짜2'].tolist(),  'TLH 전략': data_2['TLH 전략'].tolist(), 'QQQ 바이홀드 전략': data_2['QQQ 바이홀드 전략'].tolist()}
    # print(1)


