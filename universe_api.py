import os
import math
import pandas as pd
from flask import Flask
from flask_cors import CORS
import numpy as np
import requests
import json
import pandas as pd
import pymssql
from datetime import datetime

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)
# conn = pymssql.connect(server='10.93.20.65', user='roboadv', password='roboadv123!', database='ROBO')


def get_data(file_nm, skiprows=0, sheet_name =0, index_col=0):
    return pd.read_excel('data/'+file_nm, index_col=index_col , skiprows=skiprows, sheet_name=sheet_name)

def load_data_db(sql):
    cursor = conn.cursor(as_dict=True)
    # print(sql)
    cursor.execute(sql)
    data = cursor.fetchall()
    data = pd.DataFrame(data)
    return data

# @app.route('/returns_db/', methods = ['GET','POST'], defaults={"port1": "변동성","port2": "공격" })
# @app.route('/returns_db/<port1>_<port2>', methods = ['GET','POST'])
# def load_returns(port1, port2):
#     fd_return_query = '''
#     select *
#     from FD_RETURN
#     '''
#     date_parsing = lambda x: datetime.strptime(x, '%Y%m%d').strftime('%Y-%m-%d')
#
#     fd_return = load_data_db(fd_return_query)
#     fd_return = fd_return[fd_return['TD']!='########']
#     fd_return['TD'] = fd_return['TD'].apply(lambda x: date_parsing(x))
#     fd_return['FD_NM'] = fd_return['FD_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))
#     fd_return = fd_return[fd_return.FD_NM == port1 + port2 + '2']
#     fd_return = fd_return.dropna(subset=['RTN'])
#     # return fd_return.RTN.tolist()
#     return {"returns": list(map(lambda x: int(10000*x)/100,fd_return.RTN.tolist())), "date":fd_return.TD.tolist(), "std": int(np.std(fd_return.RTN.tolist())*10000)/10000}


@app.route('/returns/', methods = ['GET','POST'], defaults={"port1": "변동성","port2": "공격" })
@app.route('/returns/<port1>_<port2>', methods = ['GET','POST'])
def returns(port1, port2):
    returns = get_data('RATB_성과표_18차추가.xlsx', sheet_name='그래프(영업일)', skiprows=1)
    if port1=='멀티에셋인컴':
        port2 = port2[0]
    returns = returns[port1+port2+'2'].dropna().drop_duplicates()
    return {"returns": list(map(lambda x: int(10000*x)/100,returns.values.tolist())), "date":list(map(lambda x : x.strftime('%y/%m/%d'),returns.index.tolist())), "std": int(np.std(returns.values)*10000)/10000}

@app.route('/period_returns/<port1>_<port2>', methods = ['GET','POST'])
def period_returns(port1, port2):
    data = get_data("RATB_성과표_18차추가.xlsx", sheet_name="성과(요약)", skiprows=2, index_col=1)
    col_list = ['1D', '1W', '2W', '1M', '2M', '3M', '6M', '1Y', 'MTD', 'YTD', 'ITD']
    data = data[col_list]
    data = data*100
    data.index = list(map(lambda x: str(x).replace('2', ''), data.index))
    data = data.fillna("")
    mapping_dict = {
        '테마로테션적극' : '테마로테션공격',
        '테마로테션중립' : '테마로테션적극',
        '테마로테션안정' : '테마로테션중립',
        '멀티에셋인컴적극' : '멀티에셋인컴공',
        '멀티에셋인컴중립' : '멀티에셋인컴적',
        '멀티에셋인컴안정' : '멀티에셋인컴중',
    }
    if port1+port2 in mapping_dict.keys():
        return data.loc[mapping_dict[port1 + port2]].to_dict()
    else:
        return data.loc[port1+port2].to_dict()


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
        '변동성': {'공격': {
                     'title':'(고위험) 선택된 국내 상장 주식형 ETF에 대하여 시장 상황 및 주가 수준 등을 감안하여 최소 비중 0%에서 최대 비중 100% 내에서 중위험 중수익의 안정적인 수익 추구하되 위험자산의 비중을 상대적으로 높게 유지하며 투자자의 위험 성향에 대응',
                     'desc':'위험자산 편입 한도 : 100%'},
                 '위험중립': {
                     'title':'(중위험) 선택된 국내 상장 주식형 ETF에 대하여 시장 상황 및 주가 수준 등을 감안하여 최소 비중 0%에서 최대 비중 80% 내에서 중위험 중수익의 안정적인 수익 추구하되 위험자산의 비중을 안정적으로 유지하며 투자자의 위험 성향에 대응',
                     'desc':'위험자산 편입 한도 : 80%'},
                 '안정': {
                     'title':'(저위험) 선택된 국내 상장 주식형 ETF에 대하여 시장 상황 및 주가 수준 등을 감안하여 최소 비중 0%에서 최대 비중 60% 내에서 중위험 중수익의 안정적인 수익 추구하되 위험자산의 비중을 상대적으로 낮게 유지하며 투자자의 위험 성향에 대응',
                     'desc':'위험자산 편입 한도 : 60%'}},
        '초개인로보': {'적극': {
                      'title':'(고위험) 적극적으로 위험을 수용하면서 적극적으로 투자수익 추구',
                      'desc':'위험자산군의 비중 : 92% +/- alpha (67% - 100%) 내에서 운용'},
                  '성장': {'title':'(중위험) 위험에 다소 민감하나 꾸준한 투자기회 노출 추구', 'desc':'위험자산군의 비중 : 70% +/- alpha (45% - 90%) 내에서 운용'},
                  '안정': {'title':'(저위험) 위험에 민감하며 이로 인한 투자 기회 상실 감내', 'desc':'위험자산군의 비중 : 52% +/- alpha (27% - 72%) 내에서 운용'}},
        '테마로테션': {'적극': {'title':'(다소 높은 위험) 투자자산의 80% 이하를 위험자산(해외 주식 ETF)에 투자하고 나머지를 안전자산(해외채권 ETF, 외화/원화 예수금)에 투자',
                         'desc':'위험자산군의 비중 : 80%'},
                  '중립': {'title':'(보통 위험) 투자자산의 50% 이하를 위험자산(해외 주식 ETF)에 투자하고 나머지를 안전자산(해외채권 ETF, 외화/원화 예수금)에 투자',
                         'desc':'위험자산군의 비중 : 50%'},
                  '안정': {'title':'(매우 낮은 위험) 투자자산의 10% 이하를 위험자산(해외 주식 ETF)에 투자하고 나머지를 안전자산(해외채권 ETF, 외화/원화 예수금)에 투자',
                         'desc':'위험자산군의 비중 : 10%'}},
        '멀티에셋인컴': {'적극': {'title':'(매우 높은 위험) 투자자산의 100% 이하를 위험자산(배당주 ETF/ 리츠 ETF/ 전환사채 ETF/ 우선주 ETF)에 투자 ', 'desc':'위험자산군의 비중 : 100%'} ,
                  '중립': {'title':'(다소 높은 위험) 투자자산의 80% 이하를 위험자산에 투자', 'desc':'위험자산군의 비중 : 80%'},
                  '안정': {'title':'(보통 위험) 투자자산의 50% 이하를 위험자산에 투자','desc': '위험자산군의 비중 : 50%'}}
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
        mapping = {'공격': '적극', '위험중립': '중립',}
        if port2 in mapping.keys():
            port2 =  mapping[port2]

        universe = get_data(file_nm='변동성_20220513.xlsx',sheet_name="MP내역({})".format(port2))
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())), 'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port':port1+port2}
    elif port1 == "멀티에셋인컴":
        universe = get_data(file_nm='(멀티에셋인컴)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20220303(수정).xlsx', sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-02-28']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ",'').replace("%",'')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())), 'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port':port1+port2}
    elif port1 == "테마로테션":
        universe = get_data(file_nm='수정본_(테마로테이션)21.(자문일임)포트폴리오 리밸런싱 현황_미래에셋자산운용_202203_vFV3.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-03-03']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}
    elif port1 == "초개인로보":
        universe = get_data(file_nm='(초개인화자산관리로보)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20211102.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2021-11-01']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}
    return data

@app.route('/', methods = ['GET','POST'])
def main():
    return 'flask is working'

@app.route('/tlh_solution', methods = ['GET','POST'])
def TLH():
    data = get_data(file_nm='TLH 계산 로직 및 시뮬레이션 결과_SPY.xlsx',sheet_name='차트')
    data.columns = ['Unnamed: 1', 'QQQ 보유 수량', 'TLH 보유 수량', 'Unnamed: 4', '날짜1',
       'QQQ 평가 금액', 'TLH 평가 금액', 'Unnamed: 8', '날짜2', 'TLH 전략',
       'QQQ 바이홀드 전략']
    # data_1 = data[['연도', '날짜', 'USDKRW', 'TLH 포트\n($)', 'QQQ ETF\n($)']]
    data_1 = data[['날짜1','QQQ 평가 금액','TLH 평가 금액']]
    data_1['날짜1'] = data_1['날짜1'].apply(lambda x: x.strftime('%Y-%m-%d'))
    data_1 = data_1.reset_index()
    data_1['tf'] = data_1.index.map(lambda x: x%20==0)
    data_1 = data_1[data_1['tf']==True]

    data_2 = data[['날짜2','TLH 전략','QQQ 바이홀드 전략']]
    data_2['날짜2'] = data_2['날짜2'].apply(lambda x: x.strftime('%Y-%m-%d'))
    data_2 = data_2.reset_index()
    data_2['tf'] = data_2.index.map(lambda x: x % 20 == 0)
    data_2 = data_2[data_2['tf'] == True]

    return {'평가금액': {'date': data_1['날짜1'].tolist(), 'QQQ 평가 금액': list(map(lambda x: x/10000000, data_1['QQQ 평가 금액'].tolist())), 'TLH 평가금액': list(map(lambda x: x/10000000,data_1['TLH 평가 금액'].tolist()))} ,
            '전략': {'date': data_2['날짜2'].tolist(),  'TLH 전략': data_2['TLH 전략'].tolist(), 'QQQ 바이홀드 전략': data_2['QQQ 바이홀드 전략'].tolist()}, 'returns':round((data_2['TLH 전략'].iloc[-1]-data_2['TLH 전략'].iloc[0])/data_2['TLH 전략'].iloc[0]*10000)/100,
            'cagr': round(((data_2['TLH 전략'].iloc[-1]/data_2['TLH 전략'].iloc[0])**(1/10)-1)*10000)/100}

@app.route('/tlh_table', methods = ['GET','POST'])
def TLH_Table():
    data = get_data(file_nm='TLH 계산 로직 및 시뮬레이션 결과_SPY.xlsx', sheet_name='시뮬레이션').reset_index()
    return {
        'col': data.loc[[23, 25, 26, 27, 29, 30], 'TLH\n누적수익'].tolist(),
        'with_tlh': list(map(lambda x: int(x*100)/100,data.loc[[23, 25, 26, 27, 29, 30], '기본공제\n대비'].tolist())),
        'no_tlh': list(map(lambda x: int(x*100)/100,data.loc[[23, 25, 26, 27, 29, 30], '기본공제\n대비.1'].tolist()))
    }

@app.route('/green_index/<sec_num>_<theme_num>', methods = ['GET','POST'])
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
    print(res)
    res = json.loads(res.text)
    print(res)
    port_return = res['port_return']
    port_weight = res['port_weight']
    port_return = pd.DataFrame.from_dict(port_return)
    port_weight = pd.DataFrame.from_dict(port_weight)
    port_weight = port_weight.sort_values('td', ascending=False)
    port_weight['weight'] = port_weight['weight'].apply(lambda x: int(x*10000)/100)


    return {'port_return': {
        'date' : port_return.td.tolist()[-300:],
        'rtn' : port_return.iloc[-300:].rtn.cumsum().tolist() },
        'port_weight': {
            'td': port_weight.td.tolist(),
            'code': port_weight.code.tolist(),
            'name': port_weight.name.tolist(),
            'sector': port_weight.sector.tolist(),
            'theme': port_weight.theme.tolist(),
            # 'value': port_weight.value.tolist(),
            # 'size': port_weight.size.tolist(),
            # 'quality': port_weight.quality.tolist(),
            # 'earnings_momentum': port_weight.earnings_momentum.tolist(),
            # 'price_momentum': port_weight.price_momentum.tolist(),
            # 'score': port_weight.score.tolist(),
            # 'indv_weight': port_weight.indv_weight.tolist(),
            # 'sector_score': port_weight.sector_score.tolist(),
            # 'sector_weight': port_weight.sector_weight.tolist(),
            # 'quaadd_weight_sectorlity': port_weight.add_weight_sector.tolist(),
            # 'theme_score': port_weight.theme_score.tolist(),
            # 'theme_weight': port_weight.theme_weight.tolist(),
            # 'theme_rank': port_weight.theme_rank.tolist(),
            'weight': port_weight.weight.tolist()
        }
            }

@app.route('/green_index_sec', methods = ['GET','POST'])
def get_green_indexing_sec_num():
    URL = "https://evening-ridge-28066.herokuapp.com/get_sector_num_tbl"
    res = requests.get(URL)
    # res = json.loads(res.text)
    return res.text

@app.route('/green_index_theme', methods = ['GET','POST'])
def get_green_indexing_theme_num():
    URL = "https://evening-ridge-28066.herokuapp.com/get_theme_num_tbl"
    res = requests.get(URL)
    # res = json.loads(res.text)
    return res.text

if __name__ == '__main__':
    # get_data(file_nm='변동성_20220513.xlsx')
    app.run(debug=True, host='0.0.0.0', port=5000)