# -*- coding: utf-8 -*-
import pandas as pd
from flask import Flask
from flask_cors import CORS
import requests
import json
import random
import pickle
# from etf_screening import *
from TLH import *
import universe_api_test as ut
import math
import warnings
warnings.filterwarnings("ignore")
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)
factor_list = ['growth', 'liquidity', 'price_mom', 'quality', 'sentiment', 'size', 'value', 'volatility']
# conn = pymssql.connect(server='10.93.20.65', user='roboadv', password='roboadv123!', database='ROBO')


def save_pickle(df, file_nm):
    with open('data/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol = pickle.HIGHEST_PROTOCOL)

def read_pickle(file_nm):
    with open('data/{}.pickle'.format((file_nm)), 'rb') as file:
        df = pickle.load(file)
    return df

def get_data(file_nm, skiprows=0, sheet_name =0, index_col=0):
    return pd.read_excel('data/'+file_nm, index_col=index_col , skiprows=skiprows, sheet_name=sheet_name)

def make_port_corr():
    corr_df = read_pickle('corr_df')
    universe('변동성','공격')

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
        mapping = {'공격': '적극', '적극': '중립','중립':'안정' }
        if port2 in mapping.keys():
            port2 = mapping[port2]

        universe = get_data(file_nm='(멀티에셋인컴)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20220303(수정).xlsx', sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-02-28']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ",'').replace("%",'')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())), 'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port':port1+port2}
    elif port1 == "테마로테션":
        mapping = {'공격': '적극', '적극': '중립','중립':'안정' }
        if port2 in mapping.keys():
            port2 = mapping[port2]
        universe = get_data(file_nm='수정본_(테마로테이션)21.(자문일임)포트폴리오 리밸런싱 현황_미래에셋자산운용_202203_vFV3.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-03-03']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}
    elif port1 == "초개인로보":
        if port2 == '성장':
            port2 = '중립'
        universe = get_data(file_nm='(초개인화자산관리로보)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20211102.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2021-11-01']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}
    return data

@app.route('/make_corr_heatmap/', methods=['GET', 'POST'])
def make_corr_heatmap():
    corr = read_pickle('corr')
    return corr

@app.route('/make_corr_heatmap_col/<col>', methods=['GET', 'POST'])
def make_corr_heatmap_col(col):
    corr = read_pickle('{}_corr'.format(col))
    return corr

@app.route('/sort_ranking/<col>', methods=['GET', 'POST'])
def sort_ranking(col):
    df = read_pickle('테마분류_221012')
    df = df[['sector', 'theme']].drop_duplicates().set_index('theme').to_dict()['sector']
    recom = pd.read_excel('data/recom_dat.xlsx').rename(
        columns={'pm_1m': '수익률(1개월)', 'pm_3m': '수익률(3개월)', 'pm_6m': '수익률(6개월)', 'ni_1m_chg': '이익추정치(1개월)',
                 'ni_3m_chg': '이익추정치(3개월)'}).set_index('theme')
    recom = recom.sort_values(by=col, ascending=False)
    recom_idx = recom.index.tolist()[:10]
    recom_idx = list(map(lambda x: df[x]+'-'+x, recom_idx))
    recom_val = recom[col].tolist()[:10]
    recom_val = list(map(lambda x: round(x,2), recom_val))
    return {'rank':recom_idx, 'rank_val': recom_val}


@app.route('/big_di/', methods=['GET', 'POST'])
def get_all_big_DI():
    df = read_pickle('테마분류_221012')
    df = df.drop_duplicates(subset=['ticker'])
    df['count'] = 1
    count = df.groupby('sector').sum()['count'].to_dict().items()
    return {'val': list(set(df['sector'])), 'count':[{'key': k, 'val': v} for k,v in count]}

@app.route('/medium_di/<big_col>', methods=['GET', 'POST'])
def get_all_medium_DI(big_col):
    df = read_pickle('테마분류_221012')
    df = df.drop_duplicates(subset=['ticker'])
    df = df[df['sector']==big_col]
    df['count'] = 1
    count = df.groupby('theme').sum()['count'].to_dict().items()
    return {'val':list(set(df['theme'])), 'count':[{'key': k, 'val': v} for k,v in count]}

@app.route('/small_di_org/<big_col>_<md_col>', methods=['GET', 'POST'])
def get_all_small_DI_org(big_col,md_col):
    df = read_pickle('테마분류_221012')
    df = df.drop_duplicates(subset=['ticker'])
    df = df[df['sector']==big_col]
    df = df[df['theme'] == md_col]
    df_mcap = read_pickle('mcap_dollar_last') # pd.read_excel('data/mcap_dollar.xlsx', sheet_name='Sheet1')
    # count = df.groupby('industry').sum()['count'].to_dict().items()

    wgt = df_mcap.bfill()[list(df['ticker'])].iloc[-1] / \
          df_mcap.bfill()[list(df['ticker'])].iloc[-1].sum() * 100
    df = df.set_index('ticker')
    df['wgt'] = wgt
    df = df.reset_index()
    df['wgt'] = df['wgt'].fillna(min(df['wgt']))
    area_data = list()
    for sec in list(set(df['industry'])):
        area_data_ch = list()
        sub_df = df[df['industry']==sec]
        for t, w in zip(sub_df['ticker'], sub_df['wgt']):
            child_ch = {"name": t,"color": "hsl({}, 70%, 50%)".format(random.randint(5, 200)),"loc": int(w*100)/100}
            area_data_ch.append(child_ch)
        child = {"name": sec, "color": "hsl({}, 70%, 50%)".format(random.randint(200, 350)), "children": area_data_ch}
        area_data.append(child)
    return {'val': list(set(df['industry'])), 'ticker': list(df['ticker']), 'wgt': list(df['wgt']), "area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}}


@app.route('/screen_DI/<big_col>_<md_col>_<factor_score>_<rm_ticker>', methods=['GET', 'POST'])
def get_screen_DI(big_col,md_col,factor_score,rm_ticker):
    # factor_score = '2I0I0I2I0I0'
    # rm_ticker = '1'
    factor_score = factor_score.split('I')
    factor_score = list(filter(lambda x: len(x)>0, factor_score))
    print(factor_score)
    if rm_ticker=='':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x:len(x)>0, rm_ticker.split('111')))
    df = read_pickle('테마분류_221012')
    df = df.drop_duplicates(subset=['ticker'])
    df = df[df['sector']==big_col]
    df = df[df['theme'] == md_col]
    df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
    df = df[df['TF'] == True]

    model_score = read_pickle('model_score_add_last')
    model_score = model_score[model_score['sector'] == big_col]
    model_score = model_score[model_score['theme'] == md_col]
    model_score['TF'] = model_score['ticker'].apply(lambda x : x not in rm_ticker)
    model_score = model_score[model_score['TF']==True]
    if sum(list(map(lambda x: int(x), factor_score)))==0:
        model_score['wgt'] = model_score['mcap'].fillna(0) * 1000000
    else:
        model_score['wgt'] = model_score['mcap'].fillna(0) * 100
    for f, s in zip(factor_list,factor_score):
        print(f, '---', s)
        model_score['wgt'] += model_score[f].fillna(0).apply(lambda x: x*int(s)*0.1)
    df = pd.merge(model_score, df, left_on=['industry', 'sector', 'theme', 'ticker', 'name'],
             right_on=['industry', 'sector', 'theme', 'ticker', 'name'], how='left')
    area_data = list()
    for sec in list(set(df['industry'])):
        area_data_ch = list()
        sub_df = df[df['industry']==sec].fillna(0)
        for t, w in zip(sub_df['ticker'], sub_df['wgt']):
            child_ch = {"name": t,"color": "hsl({}, 70%, 50%)".format(random.randint(5, 200)),"loc": int(w*100)/100}
            area_data_ch.append(child_ch)
        child = {"name": sec, "color": "hsl({}, 70%, 50%)".format(random.randint(200, 350)), "children": area_data_ch}
        area_data.append(child)
    print({"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}})
    return {"area" : {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}, "portn":len(set(df['ticker'].tolist()))}


@app.route('/screen_DI_str/<big_col>_<rm_ticker>', methods=['GET', 'POST'])
def get_screen_DI_str(big_col, rm_ticker):
    if rm_ticker=='111':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x:len(x)>0, rm_ticker.split('111')))

    # df = read_pickle('model_dat')
    # # df = pd.read_excel('data/st_index/model_dat.xlsx')
    # last_td = sorted(list(set(df['td'])))[-1]
    # # df = read_pickle('테마분류_221012')
    # df = df[df['td']==last_td]
    # df = df.drop_duplicates(subset=['ticker'])
    # # df = df[df['gics']==big_col]
    # df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
    # df = df[df['TF'] == True]
    if big_col == "인플레이션 수혜기업지수":
        df = read_pickle('model_dat2')
    elif big_col == '인플레이션 피해기업지수':
        df = read_pickle('model_dat3')
    else:
        df = read_pickle('model_dat')
    last_td = sorted(list(set(df['td'])))[-1]
    df = df[df['td'] == last_td]
    df = df.drop_duplicates(subset=['ticker'])
    df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
    df = df[df['TF'] == True]

    if big_col == "건전한 재무재표 전략지수":
        rm_sector = ['Utilities', 'Financials', 'Real Estate']
        df = df.rename(columns = {"altman": "score"})
        df['TF'] = df['gics'].apply(lambda x: x not in rm_sector)
        df = df[df['TF'] == True]
        df['gics_weight'] = df['gics_weight'].apply(lambda x: x*(1/sum(df['gics_weight'])))
        df['weight'] = df['weight'].apply(lambda x: x*(1/sum(df['weight'])))

    area_data = list()
    for sec in list(set(df['gics'])):
        area_data_ch = list()
        sub_df = df[df['gics']==sec].fillna(0)
        for t, w in zip(sub_df['ticker'], sub_df['weight']):
            child_ch = {"name": t,"color": "hsl({}, 70%, 50%)".format(random.randint(5, 200)),"loc": int(w*10000)/100}
            area_data_ch.append(child_ch)
        child = {"name": sec, "color": "hsl({}, 70%, 50%)".format(random.randint(200, 350)), "children": area_data_ch}
        area_data.append(child)
    print({"area": {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}})
    return {"area": {"name": "포트폴리오", "color": "hsl(336, 70%, 50%)", "children": area_data}, "portn": len(set(df['ticker'].tolist()))}


@app.route('/finalPort_DI/', methods=['GET', 'POST'], defaults={"big_col":"기타", "md_col":"반려동물", 'factor_score':'2I0I0I2I0I0I0I0','rm_ticker':'1','num':'5' } )
@app.route('/finalPort_DI/<big_col>_<md_col>_<factor_score>_<rm_ticker>_<num>', methods=['GET', 'POST'])
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
    if md_col in ['원자재', '달러강세', '금리인상', '퀄리티고배당']:
        bm_idx[md_col] = 'SP500'
        rtn[bm_idx[md_col]] = rtn[bm_idx[md_col]]*100
    rtn = rtn.ffill()
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

    Brtn = rtn.set_index('td')[bm_idx[md_col]].dropna()

    Brtn = (Brtn.dropna()*0.01+1).cumprod()
    min_date = Brtn.index[0]
    Trtn = Trtn.loc[min_date:]
    Trtn = (Trtn.sum(axis=1)*0.01+1).cumprod()


    return {"date": Trtn.index.tolist(),
        "rtn": list(map(lambda x: int(x*100)/100, Trtn.values.tolist())),
        "rtn_bm": list(map(lambda x: int(x*100)/100, Brtn.values.tolist())),
        "tot_rtn": ((list(map(lambda x: int(x*10000)/10000, Trtn.values.tolist()))[-1]-1)*100),
        "bm_nm" : bm_idx[md_col]
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

@app.route('/finalPort_DI_str/', methods=['GET', 'POST'], defaults={"big_col":"기타", "md_col":"반려동물", 'rm_ticker':'111','num':'50' } )
@app.route('/finalPort_DI_str/<big_col>_<rm_ticker>_<num>', methods=['GET', 'POST'])
def final_port_DI_str(big_col, rm_ticker, num):
    num = int(num)
    print(num)
    if rm_ticker == '':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))

    rtn = read_pickle('st_index_rtn_v3')

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
        print('***************************',gics_sum)
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
        if idx < len(td_list) - 1:
            p_rtn_df = rtn.loc[td:td_list[idx + 1]].iloc[1:]
        else:
            p_rtn_df = rtn.loc[td:].iloc[1:]


        for gics in sorted(list(set(p_df['gics']))):
            pp_df_past =  past_df[past_df['gics'] == gics]
            pp_df_past = pp_df_past.sort_values(by=['score'], ascending=False)

            pp_df = p_df[p_df['gics'] == gics]
            pp_df = pp_df.sort_values(by=['score'], ascending=False)
            gics_wgt = pp_df['gics_weight'].iloc[0]



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
            p_rtn_cum_df = (wgt * (p_rtn_cum_df))
            p_rtn_cum_df = p_rtn_cum_df.shift(1).fillna(wgt)

            gics_rebal_df = gics_rebal_df.append(p_rtn_cum_df.reset_index().melt(id_vars=['td']).rename(columns={'variable':'ticker','value':'weight'}))

        gics_rebal_df = gics_rebal_df.drop_duplicates(subset=['td','ticker'])
        gics_rebal_df_rf = gics_rebal_df.pivot(index='td', columns='ticker', values='weight')
        gics_rebal_df_rf = gics_rebal_df_rf.apply(lambda row: row/row.sum(), axis=1)

        port_df = (gics_rebal_df_rf * (p_rtn_df[gics_rebal_df_rf.columns]).values)
        if td=='2020-01-31':
            print(1)
        check = p_rtn_df[gics_rebal_df_rf.columns]
        check_univ = gics_rebal_df_rf
        for tdtd in port_df.index:
            check_p = check.loc[tdtd]
            check_univ_p = check_univ.loc[tdtd]

        total_port_df_dt = total_port_df_dt.append(port_df)
        total_port_df_wgt = total_port_df_wgt.append(gics_rebal_df_rf.reset_index().melt(id_vars=['td']))
        port_df = port_df.sum(axis=1)
        port_df = pd.DataFrame(port_df, columns=['contrib'], index=port_df.index)

        total_port_df = total_port_df.append(port_df)
        turn_over = len(list(set(total_univ_df[total_univ_df['td']==td].ticker) - set(past_df.ticker)))
        past_df = total_univ_df[total_univ_df['td']==td]

        turnovers += turn_over * 2
        print('--------------------')
        print(len(total_univ_df[total_univ_df['td']==td]))
        print(p_df.drop_duplicates(subset=['gics'])['gics_count'].sum())
        print(sum(total_univ_df[total_univ_df['td']==td]['weight']))
    avg_turnover = round(turnovers/(2*(len(td_list))),2)

    total_port_rtn = total_port_df.sort_index()
    total_port_rtn['cum_rtn'] = 0
    total_bm_rtn  = rtn.loc[total_port_rtn.index[0]:total_port_rtn.index[-1]]['BM'].sort_index().fillna(0)
    total_bm_rtn = pd.DataFrame(total_bm_rtn.values, index=total_bm_rtn.index, columns=['contrib'])
    total_bm_rtn['cum_rtn'] = 0
    for idx, td in enumerate(total_port_rtn.index):
        print(td)
        if idx==0:
            past_td = td
            try:
                total_port_rtn.loc[td, 'cum_rtn'] = total_port_rtn.loc[td, 'contrib']
                total_bm_rtn.loc[td, 'cum_rtn'] = total_bm_rtn.loc[td, 'contrib']
            except:
                print(1)

            continue
        if big_col!='건전한 재무재표 전략지수':
            total_port_rtn.loc[td, 'cum_rtn'] = (total_port_rtn.loc[past_td, 'cum_rtn'] + 1) * (
                        total_port_rtn.loc[td, 'contrib']) + total_port_rtn.loc[past_td, 'cum_rtn']
        else:
            total_port_rtn.loc[td,'cum_rtn'] = (total_port_rtn.loc[past_td, 'cum_rtn']+1) * (total_port_rtn.loc[td, 'contrib']+0.00008) + total_port_rtn.loc[past_td, 'cum_rtn']
        total_bm_rtn.loc[td,'cum_rtn'] = (total_bm_rtn.loc[past_td, 'cum_rtn']+1) * total_bm_rtn.loc[td, 'contrib'] + total_bm_rtn.loc[past_td, 'cum_rtn']

        past_td = td
    # total_port_rtn = (total_port_df['contrib'].fillna(1)+1).cumprod() -1
    # total_bm_rtn = (rtn.loc[total_port_rtn.index[0]:total_port_rtn.index[-1]]['BM'].sort_index().pct_change().fillna(0)+1).cumprod() -1

    total_univ_df['weight'] = total_univ_df['weight'].apply(lambda x: round(x*100, 2))
    total_univ_df_rv = total_univ_df.sort_values('td', ascending=False)
    # total_univ_df.to_excel('temp.xlsx')
    cagr = (total_port_rtn.values.flatten().tolist()[-1] ** (1/(len(total_port_rtn.index.tolist()) // 252)) - 1)* 100
    std = np.std(total_port_rtn.values.tolist()) * np.sqrt(252)
    spr = cagr / std
    total_port_rtn.to_excel('total_port_rtn.xlsx')
    total_univ_df.to_excel('univ_{}.xlsx'.format(big_col))



    return {"date": total_port_rtn.index.tolist(),
            "rtn": list(map(lambda x: int(x * 100) / 100, total_port_rtn['cum_rtn'].values.flatten().tolist())),
            "rtn_bm": list(map(lambda x: int(x * 100) / 100, total_bm_rtn['cum_rtn'].values.flatten().tolist())),
            "tot_rtn": round(((list(map(lambda x: int(x * 10000) / 10000, total_port_rtn['cum_rtn'].values.flatten().tolist()))[-1] - 1) * 100),2),
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

# def final_port_DI_str_v2(big_col, rm_ticker, num):
#     init_val = 100000000
#     num = int(num)
#     print(num)
#     if rm_ticker == '':
#         rm_ticker = []
#     else:
#         rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))
#     pr_data = read_pickle('pr_data_v2')
#     df = select_data(big_col, rm_ticker)
#
#
#     total_univ_df = pd.DataFrame()
#     total_port_df = pd.DataFrame()
#     total_port_df_wgt = pd.DataFrame()
#
#     td_list = sorted(list(set(df['td'])))
#     turnovers = 0
#
#
#     for idx, td in enumerate(td_list):
#         print('{}/{}'.format(idx, len(td_list)))
#         print(td)
#         p_df = df[df['td'] == td]
#         gics_sum = p_df.drop_duplicates(subset=['gics'])['gics_weight'].sum()
#         p_df['gics_weight'] = p_df['gics_weight'].apply(
#                 lambda x: x * (1 / gics_sum))
#         p_df['gics_count'] = p_df['gics_weight'].apply(
#             lambda x: int(round(x * num,0)))
#
#         total_count = p_df.drop_duplicates(subset=['gics'])['gics_count'].sum()
#         p_df = p_df.sort_values(by=['gics_weight'], ascending=False)
#         first_gics = p_df['gics'].iloc[0]
#         p_df = p_df.set_index('gics')
#         p_df.loc[first_gics,'gics_count'] = p_df.loc[first_gics,'gics_count']+(num-total_count)
#         p_df = p_df.reset_index()
#         if idx < len(td_list) - 1:
#             p_rtn_df = pr_data.loc[td:td_list[idx + 1]].iloc[:-1]
#         else:
#             p_rtn_df = pr_data.loc[td:]
#
#         if td == td_list[0]:
#             past_df = p_df
#         gics_rebal_df = pd.DataFrame()
#         for gics in sorted(list(set(p_df['gics']))):
#             pp_df_past =  past_df[past_df['gics'] == gics]
#             pp_df_past = pp_df_past.sort_values(by=['score'], ascending=False)
#
#             pp_df = p_df[p_df['gics'] == gics]
#             pp_df = pp_df.sort_values(by=['score'], ascending=False)
#             gics_wgt = pp_df['gics_weight'].iloc[0]
#
#             if len(p_df)<=num:
#                 num_ticker = len(pp_df)
#             else:
#                 num_ticker = min(list(set(pp_df['gics_count']))[0], len(pp_df))
#
#             if td != td_list[0]:
#                 org_ticker = pp_df_past['ticker'].tolist()
#                 org_ticker = list(set(org_ticker) & set(pp_df['ticker'].iloc[:num_ticker+max(int(num_ticker*0.25),1)].tolist()))
#                 pp_df['TF'] = pp_df['ticker'].apply(lambda x: x in org_ticker)
#                 org_port = pp_df[pp_df['TF']==True]
#                 org_port = org_port.sort_values(by='score', ascending=False)
#                 org_port = org_port.iloc[: min(len(org_ticker), num_ticker)]
#                 not_org_port = pp_df[pp_df['TF']==False].sort_values(by=['score'], ascending=False)
#                 pp_df = org_port.append(not_org_port.iloc[:max(int(num_ticker-len(org_port)),0)])
#
#             else:
#                 pp_df = pp_df.iloc[:int(num_ticker)]
#
#             pp_df['weight'] = pp_df['weight'].apply(lambda x: 1 / num_ticker)
#             pp_df['weight'] = pp_df.apply(lambda row: row.loc['weight'] * gics_wgt, axis=1)
#
#             pp_df['invest'] = pp_df['weight'] * init_val
#
#             pr = p_rtn_df.loc[td][pp_df.ticker]
#             pr = pd.DataFrame(pr.values, index=pr.index, columns=['pr'])
#             pr_pp_df = pd.merge(pr.reset_index().rename(columns={'index': 'ticker'}), pp_df, left_on='ticker', right_on='ticker',
#                      how='right')
#
#             pr_pp_df['qty'] = pr_pp_df['invest'] / pr_pp_df['pr']
#
#
#             # pp_df['weight'] = pp_df['weight'] * init_val
#             total_univ_df = total_univ_df.append(pr_pp_df)
#
#             qty_dict = pr_pp_df[['ticker','qty']].set_index('ticker').to_dict()['qty']
#             rebal_df = p_rtn_df[qty_dict.keys()].copy(deep=True)
#             for key in qty_dict.keys():
#                 rebal_df[key] = p_rtn_df[key] * qty_dict[key]
#                 gics_rebal_df[key] = p_rtn_df[key] * qty_dict[key]
#
#         port_df = gics_rebal_df.sum(axis=1)
#         port_df = pd.DataFrame(port_df, columns=['contrib'], index=port_df.index)
#         init_val = port_df.iloc[-1]['contrib']
#         print(init_val)
#
#         total_port_df = total_port_df.append(port_df)
#         turn_over = len(list(set(total_univ_df[total_univ_df['td']==td].ticker) - set(past_df.ticker)))
#         past_df = total_univ_df[total_univ_df['td']==td]
#
#         turnovers += turn_over * 2
#         print('--------------------')
#         print(len(total_univ_df[total_univ_df['td']==td]))
#         print(p_df.drop_duplicates(subset=['gics'])['gics_count'].sum())
#         # print(gics_rebal_df_rf.sum(axis=1).tolist()[0])
#         print(sum(total_univ_df[total_univ_df['td']==td]['weight']))
#     avg_turnover = round(turnovers/(2*(len(td_list)/250)),2)
#
#     total_port_df = total_port_df.sort_index()
#     total_port_rtn = ((total_port_df).pct_change().fillna(0)+1).cumprod() -1
#
#     # total_port_rtn = (total_port_df.pct_change().fillna(0)).cumsum()
#     pr_data = pr_data.sort_index()
#     total_bm_rtn = ((pr_data['BM_v2'].loc[total_port_rtn.index[0]:total_port_rtn.index[-1]].ffill() / pr_data['BM_v2'].loc[total_port_rtn.index[0]]) ).cumprod() -1
#     # total_bm_rtn = (pr_data['BM_v2'].loc[total_port_rtn.index[0]:total_port_rtn.index[-1]].ffill().pct_change().fillna(0)).cumsum()
#
#     total_univ_df['weight'] = total_univ_df['weight'].apply(lambda x: round(x*100, 2))
#     total_univ_df_rv = total_univ_df.sort_values('td', ascending=False)
#     total_port_df_wgt.to_excel('total_port_df_wgt.xlsx')
#     cagr = (total_port_rtn.values.flatten().tolist()[-1] ** (1/(len(total_port_rtn.index.tolist()) // 252)) - 1)* 100
#     std = np.std(total_port_rtn.values.tolist()) * np.sqrt(252)
#     spr = cagr / std
#
#     return {"date": total_port_rtn.index.tolist(),
#             "rtn": list(map(lambda x: int(x * 100) / 100, total_port_rtn.values.flatten().tolist())),
#             "rtn_bm": list(map(lambda x: int(x * 100) / 100, total_bm_rtn.values.tolist())),
#             "tot_rtn": round(((list(map(lambda x: int(x * 10000) / 10000, total_port_rtn.values.flatten().tolist()))[-1] - 1) * 100),2),
#             "bm_nm": "S&P500",
#             "universe": {
#                 "ticker": total_univ_df_rv.ticker.tolist(),
#                 "name": total_univ_df_rv.name.tolist(),
#                 "theme1": total_univ_df_rv.gics.tolist(),
#                 "weight": total_univ_df_rv.weight.tolist(),
#                 "td": total_univ_df_rv.td.tolist(),
#                 "td_list": sorted(list(set(total_univ_df_rv.td.tolist()))),
#             },
#             "CAGR": str(round(cagr,2)) + "%",
#             "STD": str(round(std,2)) + "%",
#             "SHR": str(round(spr,2)),
#             "TURNOVER": avg_turnover,
#             }







# def final_port_DI_str(big_col, rm_ticker, num):
#     num = int(num)
#     print(num)
#     if rm_ticker == '':
#         rm_ticker = []
#     else:
#         rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))
#
#     rtn = read_pickle('st_index_pr').sort_values(by=['td'])
#     rtn = rtn.ffill()
#     rtn = rtn.set_index('td')
#     rtn = rtn.pct_change()
#     rtn = rtn[rtn[rtn.columns[0]] != 0]
#
#     if big_col == "건전한 재무재표 전략지수":
#         df = read_pickle('model_dat')
#         df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
#         df = df[df['TF'] == True]
#         del df['TF']
#         rm_sector = ['Utilities', 'Financials', 'Real Estate']
#         df = df.rename(columns = {"altman": "score"})
#         df['TF'] = df['gics'].apply(lambda x: x not in rm_sector)
#         df = df[df['TF'] == True]
#         # df['gics_weight'] = df['gics_weight'].apply(lambda x: x*(100/sum(df['gics_weight'])))
#         # df['weight'] = df['weight'].apply(lambda x: x*(1/sum(df['weight'])))
#     elif big_col == "주주환원지수":
#         df = read_pickle('model_dat')
#         df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
#         df = df[df['TF'] == True]
#         del df['TF']
#         df = df.rename(columns={"sh_yield": "score"})
#     elif big_col == "Capex와 R&D 지수":
#         df = read_pickle('model_dat')
#         df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
#         df = df[df['TF'] == True]
#         del df['TF']
#         df = df.rename(columns={"capex_ratio": "score"})
#     elif big_col == "인플레이션 수혜기업지수":
#         df = read_pickle('model_dat2')
#         df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
#         df = df[df['TF'] == True]
#         del df['TF']
#     elif big_col == "인플레이션 피해기업지수":
#         df = read_pickle('model_dat3')
#         df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
#         df = df[df['TF'] == True]
#         del df['TF']
#         df['score'] = df['score'] * (-1)
#     df = df.sort_index()
#
#     total_rebal_df = pd.DataFrame()
#     total_univ_df = pd.DataFrame()
#     total_port_df = pd.DataFrame()
#     td_list = sorted(list(set(df['td'])))
#     turnovers = 0
#
#
#     for idx, td in enumerate(td_list):
#         print('{}/{}'.format(idx, len(td_list)))
#         print(td)
#         # if num >= len(td_list):
#         p_df = df[df['td'] == td]
#         gics_sum = p_df.drop_duplicates(subset=['gics'])['gics_weight'].sum()
#         if True:#big_col == "건전한 재무재표 전략지수" or big_col == "인플레이션 수혜기업지수" or big_col == "인플레이션 피해기업지수":
#             p_df['gics_weight'] = p_df['gics_weight'].apply(
#                 lambda x: x * (1 / gics_sum))
#         p_df['gics_count'] = p_df['gics_weight'].apply(
#             lambda x: int(round(x * num,0)))
#
#         total_count = p_df.drop_duplicates(subset=['gics'])['gics_count'].sum()
#         p_df = p_df.sort_values(by=['gics_weight'], ascending=False)
#         first_gics = p_df['gics'].iloc[0]
#         p_df = p_df.set_index('gics')
#         p_df.loc[first_gics,'gics_count'] = p_df.loc[first_gics,'gics_count']+(num-total_count)
#         p_df = p_df.reset_index()
#         if td == td_list[0]:
#             past_df = p_df
#         for gics in sorted(list(set(p_df['gics']))):
#             pp_df_past =  past_df[past_df['gics'] == gics]
#             pp_df_past = pp_df_past.sort_values(by=['score'], ascending=False)
#             pp_df = p_df[p_df['gics'] == gics]
#             pp_df = pp_df.sort_values(by=['score'], ascending=False)
#             gics_wgt = pp_df['gics_weight'].iloc[0]
#
#             if len(p_df)<=num:
#                 num_ticker = len(pp_df)
#             else:
#                 num_ticker = min(list(set(pp_df['gics_count']))[0], len(pp_df))
#
#             if td != td_list[0]:
#                 org_ticker = pp_df_past['ticker'].tolist()
#                 org_ticker = list(set(org_ticker) & set(pp_df['ticker'].iloc[:num_ticker+max(int(num_ticker*0.25),1)].tolist()))
#                 pp_df['TF'] = pp_df['ticker'].apply(lambda x: x in org_ticker)
#                 org_port = pp_df[pp_df['TF']==True]
#                 org_port = org_port.sort_values(by='score', ascending=False)
#                 org_port = org_port.iloc[: min(len(org_ticker), num_ticker)]
#                 org_port['편입이유'] = '턴오버제한'
#                 not_org_port = pp_df[pp_df['TF']==False].sort_values(by=['score'], ascending=False)
#                 not_org_port['편입이유'] = '신규편입'
#                 pp_df = org_port.append(not_org_port.iloc[:max(int(num_ticker-len(org_port)),0)])
#             else:
#                 pp_df = pp_df.iloc[:int(num_ticker)]
#
#             pp_df['weight'] = pp_df['weight'].apply(lambda x: 1 / num_ticker)
#             pp_df['weight'] = pp_df.apply(lambda row: row.loc['weight'] * gics_wgt, axis=1)
#             total_univ_df = total_univ_df.append(pp_df)
#
#             if idx < len(td_list)-1:
#                 p_rtn = rtn.loc[td:td_list[idx + 1]]
#             else:
#                 p_rtn = rtn.loc[td:]
#             p_rtn = p_rtn.reset_index().melt(id_vars=['td'])
#             rebal_df = pd.merge(pp_df, p_rtn, left_on='ticker', right_on='variable', how='left')
#             rebal_df = rebal_df.sort_values(by=['td_y'])
#             rebal_df['weight_increase'] = (rebal_df['value']+1).cumprod()
#             rebal_df['weight_increase'] = rebal_df['weight_increase'].shift(1)
#             rebal_df['weight_increase'] = rebal_df['weight_increase'].fillna(1) * rebal_df['weight']
#
#             total_rebal_df = total_rebal_df.append(rebal_df)
#
#
#         total_rebal_df = total_rebal_df.drop_duplicates(subset=['td_y','variable'])
#         total_rebal_df_rf = total_rebal_df.pivot(index='td_y', columns='variable', values='weight_increase')
#         total_rebal_df_rf = total_rebal_df_rf.apply(lambda row: (row / sum(row)), axis=1)
#         total_rebal_df_rf = total_rebal_df_rf.reset_index().melt(id_vars=['td_y'])
#
#         port_df = pd.merge(total_rebal_df[['ticker', 'td_y', 'value']].rename(columns={'value': 'rtn'}),
#                  total_rebal_df_rf.rename(columns={'variable': 'ticker', 'value': 'wgt'}), left_on=['ticker', 'td_y'],
#                  right_on=['ticker', 'td_y'], how='right')
#         port_df['contrib'] = port_df.apply(lambda row: row.loc['wgt']*row.loc['rtn'], axis=1)
#         port_df = port_df.groupby(by='td_y').sum()
#         total_port_df = total_port_df.append(port_df)
#         turn_over = len(list(set(p_df.ticker) - set(past_df.ticker)))
#         past_df = total_univ_df[total_univ_df['td']==td]
#
#         turnovers += turn_over * 2
#         print('--------------------')
#         print(len(total_univ_df[total_univ_df['td']==td]))
#         print(p_df.drop_duplicates(subset=['gics'])['gics_count'].sum())
#         print(p_df.drop_duplicates(subset=['gics'])['gics_weight'].sum())
#         print(sum(total_univ_df[total_univ_df['td']==td]['weight']))
#     avg_turnover = round(turnovers/2*(len(td_list)/250),2)
#
#     total_port_df = total_port_df.reset_index()
#     total_port_df = total_port_df.groupby('td_y').sum()
#     # total_port_df = pd.merge(total_port_df.reset_index(), rtn['BM'].reset_index(), left_on='td_y', right_on='td',how='left').ffill().set_index('td').dropna(subset=['contrib','BM'])
#     total_port_df = total_port_df.sort_index()
#     total_port_rtn = (total_port_df['contrib'].fillna(0) + 1).cumprod()
#     total_bm_rtn = (rtn['BM'].fillna(0) + 1).cumprod()
#
#     total_univ_df['weight'] = total_univ_df['weight'].apply(lambda x: round(x*100, 2))
#     total_univ_df_rv = total_univ_df.sort_values('td', ascending=False)
#     # total_univ_df.to_excel('temp.xlsx')
#     cagr = (total_port_rtn.values.tolist()[-1] ** (1/(len(total_port_rtn.index.tolist()) // 252)) - 1)* 100
#     std = np.std(total_port_rtn.values.tolist()) * np.sqrt(252)
#     spr = cagr / std
#
#     return {"date": total_port_rtn.index.tolist(),
#             "rtn": list(map(lambda x: int(x * 100) / 100, total_port_rtn.values.tolist())),
#             "rtn_bm": list(map(lambda x: int(x * 100) / 100, total_bm_rtn.values.tolist())),
#             "tot_rtn": round(((list(map(lambda x: int(x * 10000) / 10000, total_port_rtn.values.tolist()))[-1] - 1) * 100),2),
#             "bm_nm": "S&P500",
#             "universe": {
#                 "ticker": total_univ_df_rv.ticker.tolist(),
#                 "name": total_univ_df_rv.name.tolist(),
#                 "theme1": total_univ_df_rv.gics.tolist(),
#                 "weight": total_univ_df_rv.weight.tolist(),
#                 "td": total_univ_df_rv.td.tolist(),
#                 "td_list": sorted(list(set(total_univ_df_rv.td.tolist()))),
#             },
#             "CAGR": str(round(cagr,2)) + "%",
#             "STD": str(round(std,2)) + "%",
#             "SHR": str(round(spr,2)),
#             "TURNOVER": avg_turnover,
#             }



@app.route('/OptimalScore/<sm_col>')
def get_optimal_score(sm_col):
    score_part = read_pickle('model_score_part')
    score_part = score_part[score_part['theme']==sm_col]
    score_part = score_part[['growth','liquidity','price_mom','quality','sentiment','size','value','volatility']].sum() / len(score_part) * 10
    score_part = list(map(lambda x : int(round(x,0)), score_part))
    return {'score':score_part}

@app.route('/finalUniverse_DI/<big_col>_<md_col>_<factor_score>_<rm_ticker>_<num>', methods=['GET', 'POST'])
def final_universe_DI(big_col, md_col, factor_score, rm_ticker, num):
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
    rtn = read_pickle('rtn_add')
    rtn = rtn[ticker_list + ['td']]
    # rtn['td'] = rtn['td'].apply(lambda x: x.strftime('%Y-%m-%d'))
    rtn_melt = rtn.melt('td').dropna()
    rtn_melt.columns = ['td', 'ticker', 'rtn']
    total = pd.merge(df, rtn_melt, left_on=['td', 'ticker'],
                     right_on=['td', 'ticker'], how='left')
    total = total.dropna(subset=['rtn', 'wgt'])
    rebal_dates = sorted(list(set(df['td'])))
    total_rebal_df = pd.DataFrame()
    for rebal in rebal_dates:
        rebal_df = total[total['td'] == rebal][['industry', 'sector', 'theme', 'td', 'ticker', 'name', 'wgt']].iloc[
                   -1 * int(num):]
        print(len(total[total['td'] == rebal]), '=====', len(rebal_df))
        rebal_df['wgt'] = rebal_df['wgt'].apply(lambda x:round(x /rebal_df['wgt'].sum()*100,2))
        total_rebal_df = total_rebal_df.append(rebal_df)
    total_rebal_df = total_rebal_df.dropna()
    print(total_rebal_df)
    total_rebal_df = total_rebal_df.sort_index()


    return {"ticker": total_rebal_df.ticker.tolist(),
            "name": total_rebal_df.name.tolist(),
            "theme1": total_rebal_df.sector.tolist(),
            "theme2": total_rebal_df.theme.tolist(),
            "theme3": total_rebal_df.industry.tolist(),
            "weight": total_rebal_df.wgt.tolist(),
            "td": total_rebal_df.td.tolist(),
            "td_list": sorted(list(set(total_rebal_df.td.tolist()))),
            }

@app.route('/finalUniverse_DI_str/<big_col>_<rm_ticker>_<num>', methods=['GET', 'POST'])
def final_universe_DI_str(big_col, rm_ticker, num):

    num = int(num)
    if rm_ticker == '111':
        rm_ticker = []
    else:
        rm_ticker = list(filter(lambda x: len(x) > 0, rm_ticker.split('111')))

    if big_col == "건전한 재무재표 전략지수":
        df = read_pickle('model_dat')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
        rm_sector = ['Utilities', 'Financials', 'Real Estate']
        df = df.rename(columns = {"altman": "score"})
        df['TF'] = df['gics'].apply(lambda x: x not in rm_sector)
        df = df[df['TF'] == True]
        df['gics_weight'] = df['gics_weight'].apply(lambda x: x*(100/sum(df['gics_weight'])))
        df['weight'] = df['weight'].apply(lambda x: round(x*(1/sum(df['weight']))*100, 2))

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
        # df = df#.rename(columns={"capex_ratio": "score"})

    elif big_col == "인플레이션 피해기업지수":
        df = read_pickle('model_dat3')
        df['TF'] = df['ticker'].apply(lambda x: x not in rm_ticker)
        df = df[df['TF'] == True]
        del df['TF']
        df['score'] = df['score'] * (-1)

    return {"ticker": df.ticker.tolist(),
            "name": df.name.tolist(),
            "theme1": df.gics.tolist(),
            # "theme2": df.theme.tolist(),
            # "theme3": df.industry.tolist(),
            "weight": df.weight.tolist(),
            "td": df.td.tolist(),
            "td_list": sorted(list(set(df.td.tolist()))),
            }

@app.route('/sec_ex_DI/<md_col>', methods=['GET', 'POST'])
def sec_explain_DI(md_col):
    ex = read_pickle('sec_explain')
    if md_col in ex.keys():
        return {"ex":ex[md_col]}
    else:
        return {"ex":md_col}

@app.route('/fac_ex_DI/', methods=['GET', 'POST'])
def fac_explain_DI():
    ex = read_pickle('fac_explain')
    return {"ex": ex}




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
    if port1=='멀티에셋인컴':
        port2 = port2[0]
    # mapping_dict = {
    #     '테마로테션적극' : '테마로테션공격',
    #     '테마로테션중립' : '테마로테션적극',
    #     '테마로테션안정' : '테마로테션중립',
    #     '멀티에셋인컴적극' : '멀티에셋인컴공',
    #     '멀티에셋인컴중립' : '멀티에셋인컴적',
    #     '멀티에셋인컴안정' : '멀티에셋인컴중',
    # }
    # if port1+port2 in mapping_dict.keys():
    #     return data.loc[mapping_dict[port1 + port2]].to_dict()
    # else:
    #     return data.loc[port1+port2].to_dict()
    return data.loc[port1 + port2].to_dict()

@app.route('/strategy/', methods=['GET', 'POST'])
def strategy():
    return {
        '변동성': ['공격', '위험중립', '안정'],
        '초개인로보': ['적극','성장', '안정'],
        '테마로테션':[ '공격','적극','중립'],
        '멀티에셋인컴': [ '공격','적극','중립']
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
def universe_ui(port1, port2):
    if port1 == "변동성":
        mapping = {'공격': '적극', '위험중립': '중립',}
        if port2 in mapping.keys():
            port2 =  mapping[port2]

        universe = get_data(file_nm='변동성_20220513.xlsx', sheet_name="MP내역({})".format(port2))
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())), 'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port':port1+port2}
    elif port1 == "멀티에셋인컴":
        mapping = {'공격': '적극', '적극': '중립','중립':'안정' }
        if port2 in mapping.keys():
            port2 = mapping[port2]

        universe = get_data(file_nm='(멀티에셋인컴)21.(자문일임)리밸런싱 발생내역_미래에셋자산운용_20220303(수정).xlsx', sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-02-28']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ",'').replace("%",'')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker':universe['종목명'].tolist(),'percent':list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())), 'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port':port1+port2}
    elif port1 == "테마로테션":
        mapping = {'공격': '적극', '적극': '중립','중립':'안정' }
        if port2 in mapping.keys():
            port2 = mapping[port2]
        universe = get_data(file_nm='수정본_(테마로테이션)21.(자문일임)포트폴리오 리밸런싱 현황_미래에셋자산운용_202203_vFV3.xlsx',
                            sheet_name="MP내역({})".format(port2))
        universe = universe[universe.index == '2022-03-03']
        universe = universe[['종목명', '비중']].dropna()
        # universe['비중'] = universe['비중'].apply(lambda x: float(x.replace(" ", '').replace("%", '')))
        universe = universe.sort_values(by='비중', ascending=False)
        data = {'ticker': universe['종목명'].tolist(), 'percent': list(map(lambda x:int(10000*x)/100,universe['비중'].tolist())),
                'returns': ["" for i in range(len(universe['종목명'].tolist()))], 'port': port1 + port2}
    elif port1 == "초개인로보":
        if port2 == '성장':
            port2 = '중립'
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

@app.route('/tlh_solution/<etf>_<init_invest>', methods = ['GET','POST'])
def calc_TLH(etf, init_invest):
    etf += " US EQUITY"
    print(etf)
    init_invest = int(init_invest)
    port_year_df, port_df = make_all_port(etf, init_invest)
    simul_df = make_simul(etf, port_year_df, port_df, init_invest)
    table_df = make_table(etf, port_year_df, init_invest)
    return {
        "SIMUL": {
            "Date": list(map(lambda x: x.strftime('%Y-%m-%d'), simul_df.index)),
            "PORT_SIMUL".format(etf): simul_df["{}_SIMUL".format(etf)].values.tolist(),
            "TLH_SIMUL": simul_df["TLH_SIMUL"].values.tolist(),
            "CAGR" : table_df.loc['세후수익률(연환산)','TLH 적용']
        },
        "TABLE": {
            "col": list(table_df.index),
            "diff_tlh": table_df['절세전략 효과'].values.tolist(),
            "no_tlh": table_df['TLH 미적용'].values.tolist(),
            "with_tlh": table_df['TLH 적용'].values.tolist(),
        }
    }



@app.route('/tlh_solution_spy', methods = ['GET','POST'])
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
            '전략': {'date': data_2['날짜2'].tolist(),  'TLH 전략': data_2['TLH 전략'].tolist(), 'QQQ 바이홀드 전략': data_2['QQQ 바이홀드 전략'].tolist()},
            'returns':round((data_2['TLH 전략'].iloc[-1]-data_2['TLH 전략'].iloc[0])/data_2['TLH 전략'].iloc[0]*10000)/100,
            'cagr': round(((data_2['TLH 전략'].iloc[-1]/data_2['TLH 전략'].iloc[0])**(1/10)-1)*10000)/100}

@app.route('/tlh_table_spy', methods = ['GET','POST'])
def TLH_Table():
    data = get_data(file_nm='TLH 계산 로직 및 시뮬레이션 결과_SPY.xlsx', sheet_name='시뮬레이션').reset_index()
    data.loc[30,'기본공제\n대비'] *= 100
    data.loc[30,'기본공제\n대비.1'] *= 100
    list_a = list(map(lambda x: round(x*10)/10, data.loc[[23, 25, 26, 27, 29, 30], '기본공제\n대비'].tolist()))
    list_b = list(map(lambda x: round(x*10)/10, data.loc[[23, 25, 26, 27, 29, 30], '기본공제\n대비.1'].tolist()))

    return {
        'col': data.loc[[23, 25, 26, 27, 29, 30], 'TLH\n누적수익'].tolist(),
        'with_tlh': list(map(lambda x:format(x,','),list_a)),
        'no_tlh': list(map(lambda x:format(x,','),list_b)),
        'diff_tlh' : list(map(lambda x: format(round(x*10)/10,','), list(i-j for i, j in zip(list_a, list_b))))
    }

@app.route('/tlh_solution_nasdaq', methods = ['GET','POST'])
def TLH_Nasdaq():
    data = get_data(file_nm='TLH 계산 로직 및 시뮬레이션 결과_NASDAQ100.xlsx',sheet_name='차트')
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

@app.route('/tlh_table_nasdaq', methods = ['GET','POST'])
def TLH_Table_Nasdaq():
    data = get_data(file_nm='TLH 계산 로직 및 시뮬레이션 결과_NASDAQ100.xlsx', sheet_name='시뮬레이션').reset_index()
    data.loc[39, 'QQQ\n실현 수익'] *= 100
    data.loc[39, '기본공제\n대비.1'] *= 100
    list_a = list(map(lambda x: round(x*10)/10,data.loc[[28, 30, 33, 35, 37, 39], '기본공제\n대비.1'].tolist()))
    list_b = list(map(lambda x: round(x*10)/10,data.loc[[28, 30, 33, 35, 37, 39], 'QQQ\n실현 수익'].tolist()))
    return {
        'col': data.loc[[28, 30, 33, 35, 37, 39], '기본공제\n대비'].tolist(),
        'with_tlh': list(map(lambda x:format(x,','),list_a)),
        'no_tlh': list(map(lambda x:format(x,','),list_b)),
        'diff_tlh': list(format(round((i-j)*10)/10,',') for i, j in zip(list_a, list_b))
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
    res = json.loads(res.text)
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