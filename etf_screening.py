import numpy as np
import pandas as pd
from numba.typed import List
from math import ceil, sqrt, exp, log, floor
from numba import njit, prange
import yfinance as yf
from scipy.stats import norm

# Riskfolio
import riskfolio.Portfolio as pf
import riskfolio.PlotFunctions as plf
import riskfolio.ConstraintsFunctions as cf
import riskfolio as rp

# Ploty Visuallization
import matplotlib
from matplotlib import colors
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import networkx as nx
import plotly.graph_objs as go
import seaborn as sns
from plotly.offline import init_notebook_mode
import missingno as msno


import monthly_returns_heatmap as mrh
import bt
import statsmodels.api as sm
from pandas_datareader.data import DataReader
from pandas_datareader.fred import FredReader
import FinanceDataReader as fdr
from datetime import datetime
import math as math
import sklearn.mixture as mix
from sklearn.preprocessing import RobustScaler
import scipy.stats as scs
from hmmlearn.hmm import GaussianHMM
from hmmlearn.hmm import GMMHMM
from sklearn.utils import check_random_state
from matplotlib import cm
from matplotlib.dates import YearLocator, MonthLocator
from eft_screening_func import *

def make_corr_heatmap():
    # Define Tickers
    tickers_equity=['ACWI','SPY', 'QQQ','EFA','EEM', 'VLUE', 'IVW', 'MTUM', 'QUAL', 'USMV', 'IWM']
    tickers_gx=['BUG','DRIV', 'LIT', 'NXTG', 'PAVE', 'QCLN', 'SNSR', 'WCLD', 'XSD', 'FIVG', 'FBT', 'IGF', 'KWEB', 'BND']
    tickers_income=['CWB', 'FPE', 'JNK', 'ICVT', 'SRLN', 'BKLN', 'SCHD', 'VIG', 'VCSH', 'VCIT']


    tickers_bond=['TLT','IEF','SHY','TIP','LQD','HYG','BIL']
    tickers_etc=['GLD','DBC','KRW=X']
    tickers=tickers_equity + tickers_bond+tickers_etc+tickers_gx+tickers_income

    tickers= list(set(tickers))

    ETF = pd.read_pickle("data/ETF.pkl")
    ETF = ETF.sort_values('Tickers')
    ETF = ETF.reset_index(drop=True)

    frequency = 'W'

    global annualization

    if frequency == 'M':
        annualization = 12
    elif frequency == 'D':
        annualization = 252
    elif frequency == 'W':
        annualization = 52
    elif frequency == 'Q':
        annualization = 4
    else:
        print('input rebalancing frequency!')

    # Download Yahoo Data
    df_yahoo_index = pd.read_pickle("data/df_yahoo_index.pkl")

    df_asset_index=df_yahoo_index.dropna()
    df_asset_ret=df_asset_index.pct_change()
    df_asset_ret=df_asset_ret.reindex(columns=tickers)

    #####################calculate factor returns
    df_factor_ret=calculate_factor_ret(df_asset_ret, method='specific')

    df_factor_summary=pd.DataFrame([])
    df_factor_summary['Annualized Return']=df_factor_ret.mean()*annualization
    df_factor_summary['Annualized Volatility']=df_factor_ret.std()*(annualization**0.5)
    df_factor_summary['Sharpe(Rf=0%)']=df_factor_summary['Annualized Return'] / df_factor_summary['Annualized Volatility']
    #####################calculate and display factor exposures
    regression_result = factor_model(df_asset_ret.dropna(), df_factor_ret.dropna(), regression='stepwise')


    try:
        gx_ret = df_asset_ret[tickers_gx]
        gx_ret = gx_ret.dropna()

    except:
        pass

    regression_result.corr.style.format("{:.4f}").background_gradient(cmap='YlGn') # Display factor correlations (stepwise)
    print(1)


    def background_gradient(s, m, M, cmap='Pubu', low=0, high=0):
        rng = M - m
        norm = colors.Normalize(m - (rng * low),
                                M + (rng * high))
        normed = norm(s.values)
        c = [colors.rgb2hex(x) for x in plt.cm.get_cmap(cmap)(normed)]
        return ['background-color: %s' % color for color in c]

    #even_range = np.max([np.abs(result.exposures.values.min()), np.abs(result.exposures.values.max())])
    even_range=1.5
    cm = sns.diverging_palette(240, 10, as_cmap=True)
    factor_exposures=regression_result.exposures.copy()
    factor_exposures=factor_exposures.reset_index()
    factor_exposures=factor_exposures.sort_values('index')
    factor_exposures['ETF']=ETF['Name'].values
    factor_exposures.set_index(['index', 'ETF'], inplace=True)

    factor_exposures.style.apply(background_gradient,
                                 cmap=cm,
                                 m=-even_range,
                                 M=even_range).set_precision(4)

    factor_exposures = factor_exposures.T

    return factor_exposures

def reform_df(factor_exposures):
    data = []
    for idx in factor_exposures.index:
        ticker = idx
        sub_data = {}
        sub_data["id"] = ticker
        sub_sub_data = []
        for factor in factor_exposures.loc[idx].index:
            val = factor_exposures.loc[idx, factor]
            sub_sub_data.append({
                "x":factor[0],
                "y":round(val,4)
            })
        sub_data['data'] = sub_sub_data
        data.append(sub_data)
    return  {"data": data}

factor_exposures = make_corr_heatmap()

data = reform_df(factor_exposures)

import pickle

def save_pickle(df, file_nm):
    with open('data/{}.pickle'.format((file_nm)), 'wb') as file:
        pickle.dump(df, file, protocol=pickle.HIGHEST_PROTOCOL)

save_pickle(factor_exposures, 'corr_df')

save_pickle(data, 'corr')
factor_exposures = factor_exposures.T
factor_exposures_inf = factor_exposures['Inflation'][factor_exposures['Inflation']<0].index
factor_exposures_inf_df = factor_exposures[['Inflation']].loc[factor_exposures_inf]
inf_df = reform_df(factor_exposures_inf_df.T)
save_pickle(inf_df, 'inf_corr')

factor_exposures_usd = factor_exposures['USD'][factor_exposures['USD']<0].index
factor_exposures_usd_df = factor_exposures[['USD']].loc[factor_exposures_usd]
usd_df = reform_df(factor_exposures_usd_df.T)
save_pickle(usd_df, 'usd_corr')

factor_exposures['TF'] = factor_exposures.apply(lambda row: row.loc['Value']<0 and row.loc['SmallSize']>0, axis=1)
factor_exposures_dev = factor_exposures[factor_exposures['TF']==True].index
factor_exposures_dev_df = factor_exposures[['Value', 'SmallSize']].loc[factor_exposures_dev]
dev_df = reform_df(factor_exposures_dev_df.T)
save_pickle(dev_df, 'dev_corr')
print(1)


