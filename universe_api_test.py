import os
import math
import requests
import numpy as np
import pandas as pd
# from flask import Flask
# from flask_cors import CORS
# import FinanceDataReader as fdr
import json
# app = Flask(__name__)
# app.config['JSON_AS_ASCII'] = False
# CORS(app)
import pickle
import warnings
warnings.filterwarnings("ignore")
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
def final_port_DI_str(big_col, rm_ticker, num):
    if rm_ticker == '':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))

    df = read_pickle('model_dat')
    df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
    df = df[df['TF'] == True]
    del df['TF']
    ticker_list = list(set(df.ticker))
    df = read_pickle('model_dat')
    df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
    df = df[df['TF'] == True]

    if big_col == "건전한 재무재표 전략지수":
        rm_sector = ['Utilities', 'Financials', 'Real Estate']
        df = df.rename(columns = {"altman": "score"})
        df['TF'] = df['gics'].apply(lambda x: x not in rm_sector)
        df = df[df['TF'] == True]

    elif big_col == "주주환원지수":
        df = df.rename(columns={"sh_yield": "score"})
    else:
        df = df.rename(columns={"capex_ratio": "score"})


    total_df = pd.DataFrame()
    for td in sorted(list(set(df['td']))):
        if td == '2012-01-31':
            print(1)
        p_df = df[df['td'] == td]
        p_df['gics_weight'] = p_df['gics_weight'].apply(
            lambda x: x * (1 / p_df.drop_duplicates(subset=['gics'])['gics_weight'].sum()))
        p_df['gics_count'] = p_df['gics_weight'].apply(lambda x: round(x * (num - len(list(set(p_df['gics']))) * 2), 0) + 2)
        for gics in sorted(list(set(p_df['gics']))):
            pp_df = p_df[p_df['gics'] == gics]
            pp_df = pp_df.sort_values(by=['score'], ascending=False)
            if td=='2012-01-31':
                print(1)
            try:
                num_ticker = min(list(set(pp_df['gics_count']))[0], len(pp_df))
            except:
                print(1)
            pp_df = pp_df.iloc[:int(num_ticker)]
            pp_df['weight'] = pp_df['weight'].apply(lambda x: x*(1/sum(pp_df['weight'])))
            total_df = total_df.append(pp_df)
    total_df['weight'] = total_df.apply(lambda row: row.loc['weight'] * row.loc['gics_weight'], axis=1)

    rtn = read_pickle('st_index_pr')
    rtn = rtn.ffill()
    rtn = rtn.set_index('td')
    rtn = rtn.pct_change()
    wgt_df = total_df.pivot(index='td', columns='ticker', values='weight').fillna(0)
    wgt_df = wgt_df.sort_index()

    total_rtn = pd.DataFrame()
    for idx, td in enumerate(list(wgt_df.index)):
        if idx-1 != len(wgt_df.index):
            p_rtn = rtn.loc[td:wgt_df.index[idx+1]]
        else:
            p_rtn = rtn.loc[wgt_df.index[idx]:]
        p_rtn['sum'] = 0
        wgt = wgt_df.iloc[idx]
        for col in wgt.index:
            if wgt[col] != 0:
                p_rtn['sum'] += p_rtn[col] * wgt[col]
        total_rtn = total_rtn.append(p_rtn)
    total_port_rtn = (total_rtn['sum']+1).cumprod().ffill()
    total_bm_rtn = (total_rtn['BM']+1).cumprod().ffill()


    return {"date": total_port_rtn.index.tolist(),
        "rtn": list(map(lambda x: int(x*100)/100, total_port_rtn.values.tolist())),
        "rtn_bm": list(map(lambda x: int(x*100)/100, total_bm_rtn.values.tolist())),
        "tot_rtn": ((list(map(lambda x: int(x*10000)/10000, total_bm_rtn.values.tolist()))[-1]-1)*100),
        "bm_nm" : "S&P500"
        }

def select_data(big_col, rm_ticker):
    if big_col == "건전한 재무재표 전략지수":
        df = read_pickle('model_dat')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
        rm_sector = ['Utilities', 'Financials', 'Real Estate']
        df = df.rename(columns = {"altman": "score"})
        df['TF'] = df['gics'].apply(lambda x: x not in rm_sector)
        df = df[df['TF'] == True]
        # df['gics_weight'] = df['gics_weight'].apply(lambda x: x*(100/sum(df['gics_weight'])))
        # df['weight'] = df['weight'].apply(lambda x: x*(1/sum(df['weight'])))
    elif big_col == "주주환원지수":
        df = read_pickle('model_dat')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
        df = df.rename(columns={"sh_yield": "score"})
    elif big_col == "Capex와 R&D 지수":
        df = read_pickle('model_dat')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
        df = df.rename(columns={"capex_ratio": "score"})
    elif big_col == "인플레이션 수혜기업지수":
        df = read_pickle('model_dat2')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
    elif big_col == "인플레이션 피해기업지수":
        df = read_pickle('model_dat3')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
        df['score'] = df['score'] * (-1)
    df = df.sort_index()
    return df

def final_port_DI_str(big_col, rm_ticker, num):
    ini_val = 100000000
    num = int(num)
    print(num)
    if rm_ticker == '':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))

    rtn = read_pickle('st_index_pr').sort_values(by=['td'])
    rtn = rtn.ffill()
    rtn = rtn.set_index('td')
    rtn = rtn.pct_change()
    rtn = rtn[rtn[rtn.columns[0]] != 0]

    df = select_data(big_col, rm_ticker)


    total_univ_df = pd.DataFrame()
    total_port_df = pd.DataFrame()
    total_port_df_dt = pd.DataFrame()
    total_port_df_wgt = pd.DataFrame()

    td_list = sorted(list(set(df['td'])))
    turnovers = 0


    for idx, td in enumerate(td_list):
        print('{}/{}'.format(idx, len(td_list)))
        print(td)
        p_df = df[df['td'] == td]
        gics_sum = p_df.drop_duplicates(subset=['gics'])['gics_weight'].sum()
        p_df['gics_weight'] = p_df['gics_weight'].apply(
                lambda x: x * (1 / gics_sum))
        p_df['gics_count'] = p_df['gics_weight'].apply(
            lambda x: int(round(x * num,0)))

        total_count = p_df.drop_duplicates(subset=['gics'])['gics_count'].sum()
        p_df = p_df.sort_values(by=['gics_weight'], ascending=False)
        first_gics = p_df['gics'].iloc[0]
        p_df = p_df.set_index('gics')
        p_df.loc[first_gics,'gics_count'] = p_df.loc[first_gics,'gics_count']+(num-total_count)
        p_df = p_df.reset_index()
        if td == td_list[0]:
            past_df = p_df
        gics_rebal_df = pd.DataFrame()
        for gics in sorted(list(set(p_df['gics']))):
            pp_df_past =  past_df[past_df['gics'] == gics]
            pp_df_past = pp_df_past.sort_values(by=['score'], ascending=False)

            pp_df = p_df[p_df['gics'] == gics]
            pp_df = pp_df.sort_values(by=['score'], ascending=False)
            gics_wgt = pp_df['gics_weight'].iloc[0]

            if idx < len(td_list)-1:
                p_rtn_df = rtn.loc[td:td_list[idx + 1]].iloc[1:]
            else:
                p_rtn_df = rtn.loc[td:].iloc[1:]
            ticker_able = p_rtn_df.dropna(axis=1).columns

            if len(p_df)<=num:
                num_ticker = len(pp_df)
            else:
                num_ticker = min(list(set(pp_df['gics_count']))[0], len(pp_df))

            if td != td_list[0]:
                org_ticker = pp_df_past['ticker'].tolist()
                org_ticker = list(set(org_ticker) & set(pp_df['ticker'].iloc[:num_ticker+max(int(num_ticker*0.25),1)].tolist()))
                pp_df['TF'] = pp_df['ticker'].apply(lambda x: x in org_ticker)
                org_port = pp_df[pp_df['TF']==True]
                org_port = org_port.sort_values(by='score', ascending=False)
                org_port = org_port.iloc[: min(len(org_ticker), num_ticker)]
                not_org_port = pp_df[pp_df['TF']==False].sort_values(by=['score'], ascending=False)
                pp_df = org_port.append(not_org_port.iloc[:max(int(num_ticker-len(org_port)),0)])

            else:
                pp_df = pp_df.iloc[:int(num_ticker)]

            pp_df['weight'] = pp_df['weight'].apply(lambda x: 1 / num_ticker)
            pp_df['weight'] = pp_df.apply(lambda row: row.loc['weight'] * gics_wgt, axis=1)
            total_univ_df = total_univ_df.append(pp_df)



            p_rtn_cum_df = (p_rtn_df[pp_df.ticker.tolist()]+1).cumprod()
            wgt = pp_df['weight'].iloc[0]
            # gics_dict = pp_df[['ticker','weight']].set_index('ticker').to_dict()['weight']
            # for col in p_rtn_cum_df.columns:
            #     p_rtn_cum_df[col] = p_rtn_cum_df[col]*gics_dict[col]
            # p_rtn_cum_df = p_rtn_cum_df.apply(lambda row: row/row.sum(), axis=1)
            p_rtn_cum_df = (wgt * (p_rtn_cum_df))
            p_rtn_cum_df = p_rtn_cum_df.shift(1).fillna(wgt)

            gics_rebal_df = gics_rebal_df.append(p_rtn_cum_df.reset_index().melt(id_vars=['td']).rename(columns={'variable':'ticker','value':'weight'}))

        gics_rebal_df = gics_rebal_df.drop_duplicates(subset=['td','ticker'])
        gics_rebal_df_rf = gics_rebal_df.pivot(index='td', columns='ticker', values='weight')
        gics_rebal_df_rf = gics_rebal_df_rf.apply(lambda row: row/row.sum(), axis=1)

        port_df = (gics_rebal_df_rf * (p_rtn_df[gics_rebal_df_rf.columns]).values)
        total_port_df_dt = total_port_df_dt.append(port_df)
        temp = gics_rebal_df_rf.reset_index().melt(id_vars=['td'])
        temp2 = p_rtn_df.reset_index().melt(id_vars=['td'])
        temp3 = pd.merge(temp, temp2, left_on=['td', 'ticker'], right_on=['td', 'variable'], how='left')
        total_port_df_wgt = total_port_df_wgt.append(temp3)
        port_df = port_df.sum(axis=1)
        port_df = pd.DataFrame(port_df, columns=['contrib'], index=port_df.index)

        total_port_df = total_port_df.append(port_df)
        turn_over = len(list(set(p_df.ticker) - set(past_df.ticker)))
        past_df = total_univ_df[total_univ_df['td']==td]

        turnovers += turn_over * 2
        print('--------------------')
        print(len(total_univ_df[total_univ_df['td']==td]))
        print(p_df.drop_duplicates(subset=['gics'])['gics_count'].sum())
        print(gics_rebal_df_rf.sum(axis=1).tolist()[0])
        print(sum(total_univ_df[total_univ_df['td']==td]['weight']))
    avg_turnover = round(turnovers/(2*(len(td_list)/250)),2)

    total_port_df = total_port_df.sort_index()
    total_port_rtn = (total_port_df['contrib'].fillna(1)+1).cumprod()
    total_bm_rtn = (rtn['BM'].fillna(0) + 1).cumprod()

    total_univ_df['weight'] = total_univ_df['weight'].apply(lambda x: round(x*100, 2))
    total_univ_df_rv = total_univ_df.sort_values('td', ascending=False)
    total_port_df_wgt.to_excel('total_port_df_wgt.xlsx')
    cagr = (total_port_rtn.values.tolist()[-1] ** (1/(len(total_port_rtn.index.tolist()) // 252)) - 1)* 100
    std = np.std(total_port_rtn.values.tolist()) * np.sqrt(252)
    spr = cagr / std

    return {"date": total_port_rtn.index.tolist(),
            "rtn": list(map(lambda x: int(x * 100) / 100, total_port_rtn.values.tolist())),
            "rtn_bm": list(map(lambda x: int(x * 100) / 100, total_bm_rtn.values.tolist())),
            "tot_rtn": round(((list(map(lambda x: int(x * 10000) / 10000, total_port_rtn.values.tolist()))[-1] - 1) * 100),2),
            "bm_nm": "S&P500",
            "universe": {
                "ticker": total_univ_df_rv.ticker.tolist(),
                "name": total_univ_df_rv.name.tolist(),
                "theme1": total_univ_df_rv.gics.tolist(),
                "weight": total_univ_df_rv.weight.tolist(),
                "td": total_univ_df_rv.td.tolist(),
                "td_list": sorted(list(set(total_univ_df_rv.td.tolist()))),
            },
            "CAGR": str(round(cagr,2)) + "%",
            "STD": str(round(std,2)) + "%",
            "SHR": str(round(spr,2)),
            "TURNOVER": avg_turnover,
            }


def final_port_DI_str_v2(big_col, rm_ticker, num):
    init_val = 100000000
    num = int(num)
    print(num)
    if rm_ticker == '':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))

    # pr_data = pd.read_excel('data/st_index/indv/daily/price.xlsx', sheet_name='Sheet1')
    # pr_data['td'] = pr_data['td'].apply(lambda x: x.strftime('%Y-%m-%d'))
    # pr_data = pr_data.set_index('td')

    pr_data = read_pickle('pr_data')
    # rtn = read_pickle('st_index_pr').sort_values(by=['td'])
    # rtn = rtn.ffill()
    # rtn = rtn.set_index('td')
    # rtn = rtn.pct_change()
    # rtn = rtn[rtn[rtn.columns[0]] != 0]

    df = select_data(big_col, rm_ticker)


    total_univ_df = pd.DataFrame()
    total_port_df = pd.DataFrame()
    total_port_df_dt = pd.DataFrame()
    total_port_df_wgt = pd.DataFrame()

    td_list = sorted(list(set(df['td'])))
    turnovers = 0


    for idx, td in enumerate(td_list):
        print('{}/{}'.format(idx, len(td_list)))
        print(td)
        p_df = df[df['td'] == td]
        gics_sum = p_df.drop_duplicates(subset=['gics'])['gics_weight'].sum()
        p_df['gics_weight'] = p_df['gics_weight'].apply(
                lambda x: x * (1 / gics_sum))
        p_df['gics_count'] = p_df['gics_weight'].apply(
            lambda x: int(round(x * num,0)))

        total_count = p_df.drop_duplicates(subset=['gics'])['gics_count'].sum()
        p_df = p_df.sort_values(by=['gics_weight'], ascending=False)
        first_gics = p_df['gics'].iloc[0]
        p_df = p_df.set_index('gics')
        p_df.loc[first_gics,'gics_count'] = p_df.loc[first_gics,'gics_count']+(num-total_count)
        p_df = p_df.reset_index()
        if idx < len(td_list) - 1:
            p_rtn_df = pr_data.loc[td:td_list[idx + 1]].iloc[:-1]
        else:
            p_rtn_df = pr_data.loc[td:]

        if td == td_list[0]:
            past_df = p_df
        gics_rebal_df = pd.DataFrame()
        for gics in sorted(list(set(p_df['gics']))):
            pp_df_past =  past_df[past_df['gics'] == gics]
            pp_df_past = pp_df_past.sort_values(by=['score'], ascending=False)

            pp_df = p_df[p_df['gics'] == gics]
            pp_df = pp_df.sort_values(by=['score'], ascending=False)
            gics_wgt = pp_df['gics_weight'].iloc[0]


            ticker_able = p_rtn_df.dropna(axis=1).columns

            if len(p_df)<=num:
                num_ticker = len(pp_df)
            else:
                num_ticker = min(list(set(pp_df['gics_count']))[0], len(pp_df))

            if td != td_list[0]:
                org_ticker = pp_df_past['ticker'].tolist()
                org_ticker = list(set(org_ticker) & set(pp_df['ticker'].iloc[:num_ticker+max(int(num_ticker*0.25),1)].tolist()))
                pp_df['TF'] = pp_df['ticker'].apply(lambda x: x in org_ticker)
                org_port = pp_df[pp_df['TF']==True]
                org_port = org_port.sort_values(by='score', ascending=False)
                org_port = org_port.iloc[: min(len(org_ticker), num_ticker)]
                not_org_port = pp_df[pp_df['TF']==False].sort_values(by=['score'], ascending=False)
                pp_df = org_port.append(not_org_port.iloc[:max(int(num_ticker-len(org_port)),0)])

            else:
                pp_df = pp_df.iloc[:int(num_ticker)]

            pp_df['weight'] = pp_df['weight'].apply(lambda x: 1 / num_ticker)
            pp_df['weight'] = pp_df.apply(lambda row: row.loc['weight'] * gics_wgt, axis=1)

            pp_df['invest'] = pp_df['weight'] * init_val
            print(init_val)

            pr = p_rtn_df.loc[td][pp_df.ticker]
            pr = pd.DataFrame(pr.values, index=pr.index, columns=['pr'])
            pr_pp_df = pd.merge(pr.reset_index().rename(columns={'index': 'ticker'}), pp_df, left_on='ticker', right_on='ticker',
                     how='right')

            pr_pp_df['qty'] = pr_pp_df['invest'] / pr_pp_df['pr']


            # pp_df['weight'] = pp_df['weight'] * init_val
            total_univ_df = total_univ_df.append(pr_pp_df)

            qty_dict = pr_pp_df[['ticker','qty']].set_index('ticker').to_dict()['qty']
            rebal_df = p_rtn_df[qty_dict.keys()].copy(deep=True)
            for key in qty_dict.keys():
                rebal_df[key] = p_rtn_df[key] * qty_dict[key]
                gics_rebal_df[key] = p_rtn_df[key] * qty_dict[key]

        # gics_rebal_df = gics_rebal_df.drop_duplicates(subset=['td','ticker'])
        # gics_rebal_df_rf = gics_rebal_df.pivot(index='td', columns='ticker', values='weight')
        # gics_rebal_df_rf = gics_rebal_df_rf.apply(lambda row: row/row.sum(), axis=1)

        # port_df = (gics_rebal_df_rf * (p_rtn_df[gics_rebal_df_rf.columns]).values)
        # total_port_df_dt = total_port_df_dt.append(port_df)
        # temp = gics_rebal_df_rf.reset_index().melt(id_vars=['td'])
        # temp2 = p_rtn_df.reset_index().melt(id_vars=['td'])
        # temp3 = pd.merge(temp, temp2, left_on=['td', 'ticker'], right_on=['td', 'variable'], how='left')
        # total_port_df_wgt = total_port_df_wgt.append(temp3)
        port_df = gics_rebal_df.sum(axis=1)
        port_df = pd.DataFrame(port_df, columns=['contrib'], index=port_df.index)
        init_val = port_df.iloc[-1]['contrib']

        total_port_df = total_port_df.append(port_df)
        turn_over = len(list(set(total_univ_df[total_univ_df['td']==td].ticker) - set(past_df.ticker)))
        past_df = total_univ_df[total_univ_df['td']==td]

        turnovers += turn_over * 2
        print('--------------------')
        print(len(total_univ_df[total_univ_df['td']==td]))
        print(p_df.drop_duplicates(subset=['gics'])['gics_count'].sum())
        # print(gics_rebal_df_rf.sum(axis=1).tolist()[0])
        print(sum(total_univ_df[total_univ_df['td']==td]['weight']))
        if td == '2020-01-31':
            print(1)
    avg_turnover = round(turnovers/(2*(len(td_list))),2)

    total_port_df = total_port_df.sort_index()
    total_port_df = (total_port_df / 100000000) - 1
    total_port_rtn = total_port_df
    total_bm_rtn = (pr_data['BM'].pct_change().fillna(0) + 1).cumprod()

    total_univ_df['weight'] = total_univ_df['weight'].apply(lambda x: round(x*100, 2))
    total_univ_df_rv = total_univ_df.sort_values('td', ascending=False)
    total_port_df_wgt.to_excel('total_port_df_wgt.xlsx')
    cagr = (total_port_rtn.values.flatten().tolist()[-1] ** (1/(len(total_port_rtn.index.tolist()) // 252)) - 1)* 100
    std = np.std(total_port_rtn.values.tolist()) * np.sqrt(252)
    spr = cagr / std

    return {"date": total_port_rtn.index.tolist(),
            "rtn": list(map(lambda x: int(x * 100) / 100, total_port_rtn.values.tolist())),
            "rtn_bm": list(map(lambda x: int(x * 100) / 100, total_bm_rtn.values.tolist())),
            "tot_rtn": round(((list(map(lambda x: int(x * 10000) / 10000, total_port_rtn.values.tolist()))[-1] - 1) * 100),2),
            "bm_nm": "S&P500",
            "universe": {
                "ticker": total_univ_df_rv.ticker.tolist(),
                "name": total_univ_df_rv.name.tolist(),
                "theme1": total_univ_df_rv.gics.tolist(),
                "weight": total_univ_df_rv.weight.tolist(),
                "td": total_univ_df_rv.td.tolist(),
                "td_list": sorted(list(set(total_univ_df_rv.td.tolist()))),
            },
            "CAGR": str(round(cagr,2)) + "%",
            "STD": str(round(std,2)) + "%",
            "SHR": str(round(spr,2)),
            "TURNOVER": avg_turnover,
            }

if __name__ == '__main__':
    big_col = '주주환원지수'
    rm_ticker = '111'
    num = 50

    result = final_port_DI_str_v2(big_col, rm_ticker, num)

    port_j = pd.read_excel('data/종목 비중 추이.xlsx')
    port_h = pd.read_excel('total_port_df_wgt.xlsx')

    port = pd.read_excel('port_p.xlsx')
    port_j = pd.read_excel('data/st_index/인덱스결과_230104_편출입제한 25%_v2.xlsx',sheet_name='shareholder_sim')
    port_j['td'] = port_j['td'].apply(lambda x: x.strftime('%Y-%m-%d'))
    # port = port.set_index('td')
    # port_j = port_j.set_index('td')
    rtn_total = pd.merge(port[['td','contrib']], port_j[['td','rtn_port']], left_on='td', right_on='td')
    rtn_total['contrib'] - rtn_total['rtn_port']
    rtn_total['diff'] = rtn_total['contrib'] - rtn_total['rtn_port']
    rtn_total.to_excel('rtn_total.xlsx')

    # univ_total = pd.merge(port[['td', 'gics', 'ticker', 'gics_weight', 'gics_count', 'score', '순위','편입이유','weight']], univ_j[['td', 'gics', 'ticker', 'gics_weight', 'n_select', 'score','weight']], left_on=['td', 'gics', 'ticker'], right_on=['td', 'gics', 'ticker'], how='outer')
    # univ_total = univ_total.sort_values(by=['td', 'gics', 'score_x'])
    # univ_total.to_excel('univ_total.xlsx')

    univ = pd.read_excel('univ.xlsx')
    univ_j = pd.read_excel('data/st_index/인덱스결과_230104_편출입제한 25%_v2.xlsx',sheet_name='shareholder_yield_port')
    univ_j['td'] = univ_j['td'].apply(lambda x: x.strftime('%Y-%m-%d'))
    univ_total = pd.merge(univ[['td', 'gics', 'ticker', 'gics_weight', 'gics_count', 'score','weight']], univ_j[['td', 'gics', 'ticker', 'gics_weight', 'n_select', 'score','weight']], left_on=['td', 'gics', 'ticker'], right_on=['td', 'gics', 'ticker'], how='outer')
    univ_total = univ_total.sort_values(by=['td', 'gics', 'score_x'])
    univ_total.to_excel('univ_total.xlsx')
    # final_port_DI_str(big_col='건전한 재무재표 전략지수', rm_ticker='111', num=50)
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


