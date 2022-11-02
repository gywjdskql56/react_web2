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
import pickle
factor_list = ['growth', 'liquidity', 'price_mom', 'quality', 'sentiment', 'size', 'value', 'volatility']
index = pd.read_excel('data_org/BM.xlsx', sheet_name='대표지수')
index = index[['name','ticker']].set_index('name').to_dict()['ticker']
rtn = pd.read_excel('data_org/BM.xlsx', sheet_name='가격', index_col=0)
sample = (rtn['IBB-US']*0.01+1).cumprod()
def save_pickle(df, file_nm):
    with open('data/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('data/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df
def final_port_DI(big_col, md_col, factor_score, rm_ticker, num):
    # factor_score = '2I0I0I2I0I0'
    # rm_ticker = '1'
    factor_score = factor_score.split('I')
    factor_score = list(filter(lambda x: len(x) > 0, factor_score))
    print(factor_score)
    if rm_ticker == '':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))
    df = read_pickle('테마분류_221012')
    df = df.drop_duplicates(subset=['ticker'])
    df = df[df['sector'] == big_col]
    df = df[df['theme'] == md_col]
    df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
    df = df[df['TF'] == True]
    del df['TF']
    ticker_list = list(set(df.ticker))

    model_score = read_pickle('model_score_add')
    model_score = model_score[model_score['sector'] == big_col]
    model_score = model_score[model_score['theme'] == md_col]
    model_score['TF'] = model_score['ticker'].apply(lambda x: x not in rm_ticker)
    model_score = model_score[model_score['TF'] == True]
    del model_score['TF']
    if sum(list(map(lambda x: int(x), factor_score))) == 0:
        model_score['wgt'] = model_score['mcap'].fillna(0) * 1000000
    else:
        model_score['wgt'] = model_score['mcap'].fillna(0) * 10
    for f, s in zip(factor_list, factor_score):
        print(f, '---', s)
        model_score['wgt'] += model_score[f].fillna(0).apply(lambda x: x * int(s) * 0.1)
        del model_score[f]
    df = pd.merge(model_score, df, left_on=['industry', 'sector', 'theme', 'ticker', 'name'],
                  right_on=['industry', 'sector', 'theme', 'ticker', 'name'], how='left')
    df = df.sort_values(['td', 'wgt'])

    bm_idx = read_pickle('bm_index')
    rtn = read_pickle('rtn_add_v2')
    rtn = rtn.bfill()
    ticker_rtn = rtn[ticker_list+['td']]
    # rtn = rtn[ticker_list + ['td','SP500']]
    # rtn['td'] = rtn['td'].apply(lambda x: x.strftime('%Y-%m-%d'))
    rtn_melt = ticker_rtn.melt('td').dropna()
    rtn_melt.columns = ['td', 'ticker', 'rtn']
    total = pd.merge(df, rtn_melt, left_on=['td', 'ticker'],
                     right_on=['td', 'ticker'], how='left')
    total = total.dropna(subset=['rtn','wgt'])
    rebal_dates = sorted(list(set(df['td'])))
    total_rebal_df = pd.DataFrame()
    for idx, rebal in enumerate(rebal_dates):
        rebal_df = total[total['td'] == rebal][['industry', 'sector', 'theme', 'td', 'ticker', 'name', 'wgt']].iloc[-1*int(num):]
        print(idx)
        print(len(total[total['td'] == rebal]),'=====',len(rebal_df))
        rebal_df['wgt'] = rebal_df['wgt'].apply(lambda x: x/rebal_df['wgt'].sum())
        total_rebal_df = total_rebal_df.append(rebal_df)

    total_df = pd.merge(rtn_melt, total_rebal_df, left_on=['td', 'ticker'],
                  right_on=['td', 'ticker'], how='left')
    total_df = total_df.pivot(index='td', columns='ticker', values='wgt')
    total_df = total_df.reset_index()
    total_df = total_df.apply(lambda row:row.fillna(0) if row.loc['td'] in rebal_dates else row,axis=1)
    total_df = total_df.set_index('td').ffill()
    ticker_rtn = ticker_rtn.set_index('td')
    Trtn = ticker_rtn.mul(total_df, fill_value=0)
    Brtn = (rtn.set_index('td')[bm_idx[md_col]].dropna()*0.01+1).cumprod()
    min_date = Brtn.index[0]
    Trtn = Trtn.loc[min_date:]
    Trtn = (Trtn.sum(axis=1)*0.01+1).cumprod()

    return {"date": Trtn.index.tolist(),
            "rtn": list(map(lambda x: int(x*100)/100, Trtn.values.tolist())),
            "rtn_bm": list(map(lambda x: int(x*100)/100, Brtn.values.tolist())),
            "tot_rtn": ((list(map(lambda x: int(x*10000)/10000, Trtn.values.tolist()))[-1]-1)*100),
            "bm_nm" : bm_idx[md_col]
            }
# todo: pickle file로 저장하기, 각각 이중 리스트 형식으로 저장하기,
def get_BM(theme_nm):
    index = pd.read_excel('data_org/BM.xlsx', sheet_name='대표지수')
    index = index[['name', 'ticker']].set_index('name').to_dict()['ticker']
    rtn = pd.read_excel('data_org/BM.xlsx', sheet_name='가격', index_col=0)
    bm_nm = index[theme_nm]
    sample = (rtn[bm_nm] * 0.01 + 1).cumprod()
    return sample

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
    big_col = '그린'
    md_col = '배터리'
    factor_score = 'I'.join(['1', '1', '1', '1', '1', '1', '1', '1'])
    rm_ticker = ''
    num = 10
    result = final_port_DI(big_col, md_col, factor_score, rm_ticker, num)
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


