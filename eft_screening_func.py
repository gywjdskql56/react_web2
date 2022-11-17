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


def yahoo_download(tickers, start, end, frequency):  # 야후 데이타 다운로드
    data = yf.download(tickers, start=start, end=end)
    data = data['Adj Close']
    data = data.dropna()

    if frequency == 'M':
        data = data.resample('M').last()  # 일간데이터를 월간데이터로 변환
    elif frequency == 'Q':
        data = data.resample('Q').last()  # 일간데이터를 분기데이터로 변환
    elif frequency == 'W':
        data = data.resample('W').last()  # 일간데이터를 분기데이터로 변환
    else:
        pass

    return data


def db_download():  # 동현매니저 작업한 DB데이타 다운로드
    temp_df = get_data('All').run()

    group_df = temp_df.pivot_table(index=['Dates'], columns=['INDEX_ID'])
    group_df.columns = group_df.columns.droplevel(0)
    column_names = group_df.columns

    for i in column_names:
        existing_str = i
        new_str = existing_str.replace('extended_', '')
        new_str = new_str.replace('_US_Equity', '')

        group_df.rename(columns={i: new_str}, inplace=True)
    if frequency == 'M':
        group_df = group_df.resample('M').last()  # 일간데이터를 월간데이터로 변환
    elif frequency == 'Q':
        group_df = group_df.resample('Q').last()  # 일간데이터를 분기데이터로 변환
    elif frequency == 'W':
        group_df = group_df.resample('W').last()  # 일간데이터를 분기데이터로 변환

    return group_df


def calculate_factor_ret(df_asset_ret, method='specific'):  # 야후데이터 활용해 팩터리턴 계산
    if method == 'specific':
        factor_columns = ['US_Growth', 'EFA_Growth', 'EM_Growth', 'Real Rates', 'Inflation', 'Credit', 'Commodity',
                          'USD', 'Value', 'Momentum', 'Quality', 'LowVol', 'SmallSize']
        df_factor_ret = pd.DataFrame([], columns=factor_columns, index=df_asset_ret.index)
        df_factor_ret['US_Growth'] = df_asset_ret['SPY'] - df_asset_ret['BIL']
        df_factor_ret['EFA_Growth'] = df_asset_ret['EFA'] - df_asset_ret['BIL']
        df_factor_ret['EM_Growth'] = df_asset_ret['EEM'] - df_asset_ret['BIL']
        df_factor_ret['Real Rates'] = df_asset_ret['TIP']
        df_factor_ret['Inflation'] = df_asset_ret['IEF'] - df_asset_ret['TIP']
        df_factor_ret['Credit'] = df_asset_ret['LQD'] - df_asset_ret['IEF']
        df_factor_ret['Commodity'] = df_asset_ret['DBC'] - df_asset_ret['BIL']
        df_factor_ret['USD'] = df_asset_ret['KRW=X']
        df_factor_ret['Value'] = df_asset_ret['VLUE'] - df_asset_ret['IVW']
        df_factor_ret['Momentum'] = df_asset_ret['MTUM'] - df_asset_ret['SPY']
        df_factor_ret['Quality'] = df_asset_ret['QUAL'] - df_asset_ret['SPY']
        df_factor_ret['LowVol'] = df_asset_ret['USMV'] - df_asset_ret['SPY']
        df_factor_ret['SmallSize'] = df_asset_ret['IWM'] - df_asset_ret['SPY']


    elif method == 'broad':
        df_factor_ret = pd.DataFrame([], columns=['US_Growth', 'EFA_Growth', 'EM_Growth', 'Real Rates', 'Inflation',
                                                  'Credit', 'USD'], index=df_asset_ret.index)
        df_factor_ret['US_Growth'] = df_asset_ret['SPY'] - df_asset_ret['BIL']
        df_factor_ret['EFA_Growth'] = df_asset_ret['EFA'] - df_asset_ret['BIL']
        df_factor_ret['EM_Growth'] = df_asset_ret['EEM'] - df_asset_ret['BIL']
        df_factor_ret['Real Rates'] = df_asset_ret['TIP']
        df_factor_ret['Inflation'] = df_asset_ret['IEF'] - df_asset_ret['TIP']
        df_factor_ret['Credit'] = df_asset_ret['LQD'] - df_asset_ret['IEF']
        df_factor_ret['USD'] = df_asset_ret['KRW=X']
    else:
        print("Input accurate calculation methodology")
    return df_factor_ret

def calculate_factor_ret_db(df_asset_ret, method='broad'): #동현M DB데이터 활용해 팩터리턴 계산
    if method=='broad':
        df_factor_ret=pd.DataFrame([], columns=['Growth','Real Rates', 'Inflation', 'Credit', 'Commodity'], index=df_asset_ret.index)
        df_factor_ret['Growth']=df_asset_ret['VOO']-df_asset_ret['treasury_bill']
        df_factor_ret['Real Rates']=df_asset_ret['TIPX']
        df_factor_ret['Inflation']=df_asset_ret['VGIT']-df_asset_ret['TIPX']
        df_factor_ret['Credit']=df_asset_ret['LQD']-df_asset_ret['VGIT']
        df_factor_ret['Commodity']=df_asset_ret['GSG']-df_asset_ret['treasury_bill']
    elif method=='specific':
        df_factor_ret=pd.DataFrame([], columns=['US_Growth','EFA_Growth', 'EM_Growth','Real Rates', 'Inflation', 'Credit', 'Commodity'], index=df_asset_ret.index)
        df_factor_ret['US_Growth']=df_asset_ret['VOO']-df_asset_ret['treasury_bill']
        df_factor_ret['EFA_Growth']=df_asset_ret['VEA']-df_asset_ret['treasury_bill']
        df_factor_ret['EM_Growth']=df_asset_ret['VWO']-df_asset_ret['treasury_bill']
        df_factor_ret['Real Rates']=df_asset_ret['TIPX']
        df_factor_ret['Inflation']=df_asset_ret['VGIT']-df_asset_ret['TIPX']
        df_factor_ret['Credit']=df_asset_ret['LQD']-df_asset_ret['VGIT']
        df_factor_ret['Commodity']=df_asset_ret['GSG']-df_asset_ret['treasury_bill']
        df_factor_ret['USD']=df_asset_ret['KRW=X']
    else:
        print("Input accurate calculation methodology")
    return df_factor_ret


def risk_analysis(df_exposures, df_factorvol, df_portfolio):
    # n: # of asssets
    # f: # of factors
    # df_exposures ( n * f)
    # df_factorvol (f * 1)
    # df_portfolio (1 * n)

    df_exposures = df_exposures.sort_index()
    df_weight = pd.DataFrame([], index=df_exposures.index, columns=['weight'])
    df_weight['weight'] = 0

    for ticker in df_weight.index:
        try:
            df_weight.loc[ticker, 'weight'] = df_portfolio[ticker].values
        except:
            df_weight.loc[ticker, 'weight'] = 0

    df_weight = df_weight.T

    df_risk = df_weight.dot(df_exposures)
    df_risk.index = ['exposure']
    df_risk = df_risk.T

    # df_risk=df_exposures.copy()
    df_risk['Factor Volatility'] = df_factorvol.copy()
    df_risk['risk contribution'] = abs(df_risk['exposure']) * df_risk['Factor Volatility']
    risk_sum = df_risk['risk contribution'].sum()
    df_risk['risk contribution(%)'] = df_risk['risk contribution'] / risk_sum

    return df_weight, df_risk


def predict_regime_performance(df_factorexposure, df_factorreturn):
    # performance_by_regime = pd.DataFrame([],index=['Goldilocks', 'Reflation', 'Deflation', 'Stagflation'], columns=df_factorreturn.columns)

    performance_by_regime = df_factorexposure.dot(df_factorreturn)

    return performance_by_regime


def get_best_hmm_model(X, max_states, max_iter=10000):  # Gaussian HMM 모델
    best_score = -(10 ** 10)
    best_state = 0

    for state in range(2, max_states + 1):
        #        hmm_model = mix.GaussianMixture(n_components = state, random_state = 100,
        hmm_model = GaussianHMM(n_components=state, random_state=108,
                                covariance_type="diag", n_iter=max_iter).fit(X)
        if hmm_model.score(X) > best_score:
            best_score = hmm_model.score(X)
            best_state = state

    #    best_model = mix.GaussianMixture(n_components = best_state, random_state = 100,
    best_model = GaussianHMM(n_components=best_state, random_state=100,
                             covariance_type="diag", n_iter=max_iter).fit(X)
    # print('Transition Matrix')
    # print(best_model.transmat_)
    return best_model


def get_best_gmmhmm_model(X, max_states, max_iter=10000):  # GMM-HMM모델 (관측치 분포가 Gaussian Mixture)
    best_score = -(10 ** 10)
    best_state = 0

    for state in range(2, max_states + 1):
        #        hmm_model = mix.GaussianMixture(n_components = state, random_state = 100,
        hmm_model = GMMHMM(n_components=state, n_mix=2, random_state=108,
                           covariance_type="diag", n_iter=max_iter).fit(X)
        if hmm_model.score(X) > best_score:
            best_score = hmm_model.score(X)
            best_state = state

    #    best_model = mix.GaussianMixture(n_components = best_state, random_state = 100,
    best_model = GMMHMM(n_components=best_state, n_mix=2, random_state=100, min_covar=0.001, covariance_type="diag",
                        n_iter=max_iter).fit(X)
    # print('Transition Matrix')
    # print(best_model.transmat_)
    # print('Gaussian Model Weights')
    # print(best_model.weights_)

    # prob_next_step = best_model.transmat_[state_sequence[-1], :]
    return best_model


def compute_turbulence(df, years=1, alpha=0.01, frequency='D'):  # Turbulence 지표 계산
    '''
    Compute financial turbulence given time series data
        input:
            df || DataFrame || a Dataframe includes Column "Date"
            years || integer || number of years to compute historical returns
            alpha || float || a punishment coefficient when inverse-coveriance is singular
        output: Turbulence || DataFrame || Column = ["Date", "Turbulence"]
    '''

    # Compute return for this series
    df_return = df.iloc[1:, 1:].values / df.iloc[:-1, 1:].values - 1
    distance = []
    error = []
    if frequency == 'D':
        days_in_year = 252
    elif frequency == 'M':
        days_in_year = 12
    elif frequency == 'W':
        days_in_year = 52
    else:
        pass

    for i in range(years * days_in_year, len(df) - 1):

        df_past_return = df_return[:i + 1, :]
        # Compute historical mean return
        mu = np.mean(df_past_return, axis=0)

        try:
            # Compute inverse covariance matrix
            inv_sig = np.linalg.inv(np.cov(df_past_return.T))
        except:
            # Find days when covariance matrices are not invertible
            # and add small numbers to the diagonal
            sigma = np.cov(df_past_return.T)
            x = np.ones(sigma.shape[0])
            inv_sig = np.linalg.inv(sigma + np.diag(x) * alpha)
            error.append(i)

        y = np.array(df_return[i, :])
        d = np.dot(np.dot(y - mu, inv_sig), (y - mu).T)
        distance.append(d)

    Turbulence = pd.DataFrame({'Date': df['Date'][-len(distance):], 'Turbulence': distance})

    if error != []:
        print('Rows that produce singular covariance matrix')
        print(np.array(error) + 2)

    return Turbulence


def Markov_Regression(df_factor_ret, df_asset_ret, min_timeseries=252,
                      factors=['Real Rates', 'Credit', 'USD', 'US_Growth'], lagging=0):
    np.random.seed(42)
    df = pd.concat([df_factor_ret, df_asset_ret], axis=1)
    df = df.dropna()
    df_result = df.copy()
    num_rows = len(df.index)  # Factor Return Time-Sereies 개수 확인

    for i in df_factor_ret.index[min_timeseries:]:
        print(i)
        X_train = df[df.index < i][factors]

        inflation_target = X_train['Real Rates'].dropna()
        growth_target = X_train['US_Growth'].dropna()
        exog_inflation = X_train[['Real Rates', 'Commodity', 'US_Growth']].dropna()
        exog_growth = X_train[factors].dropna()

        # display(inflation_target.iloc[1:,])
        # display(exog=exog_inflation.iloc[:-1])

        mod_inflation = sm.tsa.MarkovRegression(inflation_target.iloc[1:, ], k_regimes=2, exog=exog_inflation.iloc[:-1],
                                                trend='c', switching_variance=True)
        # mod_inflation = sm.tsa.MarkovRegression(inflation_target, k_regimes=2, exog=exog_inflation, switching_variance=True)
        res_inflation = mod_inflation.fit()

        mod_growth = sm.tsa.MarkovRegression(growth_target.iloc[1:, ], k_regimes=2, exog=exog_growth.iloc[:-1],
                                             trend='c', switching_variance=True)
        # mod_growth = sm.tsa.MarkovRegression(growth_target, k_regimes=2, exog=exog_growth, switching_variance=True)
        res_growth = mod_growth.fit()

        df_result.loc[i, 'inflation_0'] = res_inflation.smoothed_marginal_probabilities[0][-1]
        df_result.loc[i, 'inflation_1'] = res_inflation.smoothed_marginal_probabilities[1][-1]
        if df_result.loc[i, 'inflation_0'] > df_result.loc[i, 'inflation_1']:
            df_result.loc[i, 'inflation'] = 0
        else:
            df_result.loc[i, 'inflation'] = 1
        df_result.loc[i, 'growth_0'] = res_growth.smoothed_marginal_probabilities[0][-1]
        df_result.loc[i, 'growth_1'] = res_growth.smoothed_marginal_probabilities[1][-1]
        if df_result.loc[i, 'growth_0'] > df_result.loc[i, 'growth_1']:
            df_result.loc[i, 'growth'] = 0
        else:
            df_result.loc[i, 'growth'] = 1

        # display(df_result)

    df_result['Goldilocks'] = df_result['inflation_0'].rolling(window=1).mean() * df_result['growth_0'].rolling(
        window=1).mean()
    df_result['Reflation'] = df_result['inflation_1'].rolling(window=1).mean() * df_result['growth_0'].rolling(
        window=1).mean()
    df_result['Deflation'] = df_result['inflation_0'].rolling(window=1).mean() * df_result['growth_1'].rolling(
        window=1).mean()
    df_result['Stagflation'] = df_result['inflation_1'].rolling(window=1).mean() * df_result['growth_1'].rolling(
        window=1).mean()
    df_result['Regime'] = df_result[['Goldilocks', 'Reflation', 'Deflation', 'Stagflation']].idxmax(axis=1)

    return df_result


class factor_model:

    def __init__(self, df_asset_ret, df_factor_ret, regression='PCR'):
        self.df_asset_ret = df_asset_ret
        self.df_factor_ret = df_factor_ret
        self.regression = regression
        self.check_timeseries(self.df_asset_ret, self.df_factor_ret)
        self.factorstats = self.calculate_stats(self.df_factor_ret)
        self.corr = self.calculate_factorcorr(self.df_factor_ret)
        self.exposures = self.calculate_factorexposures(self.df_asset_ret, self.df_factor_ret)
        self.mu, self.cov = self.estimate_parameters(self.df_asset_ret, self.df_factor_ret)

    def check_timeseries(self, df_asset_ret, df_factor_ret):
        if len(df_asset_ret.index) == len(df_factor_ret.index):
            pass
        else:
            print('The timeseries lengths of assets and factors are not matching!')

        return

    def calculate_stats(self, df_factor_ret):
        df_factor_index = bt.ffn.core.to_price_index(df_factor_ret, start=1000)

        df_factorstats = pd.DataFrame.from_dict({k: v.stats for k, v in bt.ffn.calc_stats(df_factor_index).items()})

        return df_factorstats

    def calculate_factorcorr(self, df_factor_ret):
        corr = df_factor_ret.corr()
        return corr

    def calculate_factorexposures(self, df_asset_ret, df_factor_ret):
        # display(df_asset_ret.tail())
        # display(df_factor_ret.tail())

        if self.regression == 'stepwise':
            step = 'Forward'
            exposures = rp.ParamsEstimation.loadings_matrix(X=df_factor_ret.dropna(), Y=df_asset_ret.dropna(),
                                                            stepwise=step, threshold=0.1)
        else:
            feature_selection = 'PCR'
            n_components = 0.95
            exposures = rp.ParamsEstimation.loadings_matrix(X=df_factor_ret.dropna(), Y=df_asset_ret.dropna(),
                                                            feature_selection=feature_selection,
                                                            n_components=n_components)

        exposures.style.format("{:.4f}").background_gradient(cmap='RdYlGn')
        return exposures

    def estimate_parameters(self, df_asset_ret, df_factor_ret):
        # Building the portfolio object
        port = rp.Portfolio(returns=df_asset_ret)

        # Select method and estimate input parameters:
        method_mu = 'hist'  # Method to estimate expected returns based on historical data.
        method_cov = 'hist'  # Method to estimate covariance matrix based on historical data.
        port.factors = df_factor_ret.copy()

        if self.regression == 'stepwise':
            port.factors_stats(method_mu=method_mu, method_cov=method_cov, d=0.94)
        else:
            feature_selection = 'PCR'
            n_components = 0.95
            port.factors_stats(method_mu=method_mu,
                               method_cov=method_cov,
                               dict_risk=dict(feature_selection=feature_selection,
                                              n_components=n_components)
                               )

        port.mu_fm = port.mu_fm
        port.cov_fm = port.cov_fm
        expected_return = port.mu_fm
        risk_model = port.cov_fm

        return expected_return, risk_model

    def estimate_parameters_stepwise(self, df_asset_ret, df_factor_ret):
        # Building the portfolio object
        port = rp.Portfolio(returns=df_asset_ret)

        # Select method and estimate input parameters:
        method_mu = 'hist'  # Method to estimate expected returns based on historical data.
        method_cov = 'hist'  # Method to estimate covariance matrix based on historical data.
        port.factors = df_factor_ret.copy()

        # step_regression=rp.ParamsEstimation.forward_regression(X=df_factor_ret.dropna(), y=df_asset_ret.dropna()['VOO'], criterion='pvalue', threshold=0.05, verbose=False)
        # print('step_regression', step_regression)

        risk_factors = rp.ParamsEstimation.risk_factors(X=df_factor_ret.dropna(), Y=df_asset_ret.dropna(),
                                                        stepwise='Forward', threshold=0.1)
        display(risk_factors[0] * 12)
        display((risk_factors[1] * 12) ** (0.5))
        # display(risk_factors[2])

        port.factors_stats(method_mu=method_mu, method_cov=method_cov, d=0.94)
        port.mu_fm = port.mu_fm
        port.cov_fm = port.cov_fm
        expected_return = port.mu_fm
        risk_model = port.cov_fm
        return expected_return, risk_model


