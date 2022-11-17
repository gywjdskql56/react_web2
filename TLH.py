import pandas as pd
import numpy as np
tax = 2500000
# init_invest = 20000000
etf_comp_dict = {
    "SPY US EQUITY": {"AAPL US EQUITY": 0.05,
                      "MSFT US EQUITY": 0.05,
                      "FDN US EQUITY": 0.2,
                      "XLV US EQUITY": 0.15,
                      "SOXX US EQUITY": 0.15,
                      "LIT US EQUITY": 0.05,
                      "IYF US EQUITY": 0.15,
                      "XLE US EQUITY": 0.05,
                      "XLP US EQUITY": 0.15},
    "NOBL US EQUITY": {"PG US EQUITY": 0.05263,
                       "KO US EQUITY": 0.05263,
                       "LOW US EQUITY": 0.05263,
                       "CAT US EQUITY": 0.05263,
                       "SPGI US EQUITY": 0.05263,
                       "LIN US EQUITY": 0.05263,
                       "JNJ US EQUITY": 0.05263,
                       "WMT US EQUITY": 0.05263,
                       "NEE US EQUITY": 0.05263,
                       "XOM US EQUITY": 0.05263,
                       "PEP US EQUITY": 0.05263,
                       "MCD US EQUITY": 0.05263,
                       "IBM US EQUITY": 0.05263,
                       "ADP US EQUITY": 0.05263,
                       "CB US EQUITY": 0.05263,
                       "APD US EQUITY": 0.05263,
                       "ABBV US EQUITY": 0.05263,
                       "TGT US EQUITY": 0.05263,
                       "CVX US EQUITY": 0.05263},
    "QQQ US EQUITY": {"FDN US EQUITY": 0.35,
                      "SOXX US EQUITY": 0.25,
                      "XLV US EQUITY": 0.15,
                      "LIT US EQUITY": 0.05,
                      "AAPL US EQUITY": 0.1,
                      "MSFT US EQUITY": 0.1},

    "SOXX US EQUITY": {"TXN US EQUITY": 0.1125,
                       "AVGO US EQUITY": 0.1125,
                       "QCOM US EQUITY": 0.1125,
                       "AMD US EQUITY": 0.1125,
                       "MU US EQUITY": 0.1125,
                       "NVDA US EQUITY": 0.1125,
                       "AMAT US EQUITY": 0.1125,
                       "TSM US EQUITY": 0.05,
                       "ASML US EQUITY": 0.05,
                       "INTC US EQUITY": 0.1125},

}
start_date = '2011-01-01'
end_date = '2022-11-10'
# with pd.ExcelWriter('data/TLH데이터.xlsx') as writer:
#     for etf in etf_comp_dict.keys():
#
#         etf_df = pd.DataFrame(index=[0,1])
#         for ticker in [etf] + list(etf_comp_dict[etf].keys()):
#             etf_df[ticker+"_date"] = ''
#             etf_df[ticker] = ''
#             etf_df.loc[0, ticker+"_date"] = '=BDH("{}","PX_LAST","{}","{}")'.format(ticker, start_date, end_date)
#
#         etf_df.to_excel(writer, sheet_name=etf)
#
#         usd = 'USDKRW CURNCY'
#         etf_df = pd.DataFrame(index=[0, 1])
#         etf_df[usd + "_date"] = ''
#         etf_df[usd] = ''
#         etf_df.loc[0, usd + "_date"] = '=BDH("{}","PX_LAST","{}","{}")'.format(usd, start_date, end_date)
#         etf_df.to_excel(writer, sheet_name=usd)
#     etf_df = pd.DataFrame(index=[0, 1])
#
#     writer.save()
#     print(1)
def make_BB_df(etf):
    etf_dict = pd.read_excel('data/TLH데이터_updated.xlsx', sheet_name=etf, index_col=0)
    usd_df = pd.read_excel('data/TLH데이터_updated.xlsx', sheet_name='USDKRW CURNCY', index_col=0)
    etf_total = pd.DataFrame()
    if etf =='NOBL US EQUITY':
        print(1)
    for idx in range(int(len(etf_dict.columns)/2)):
        cols = etf_dict.columns[2*idx:2*(idx+1)]
        etf_part = etf_dict[cols].rename(columns={cols[0]: 'Date'}).dropna()
        if idx==0:
            etf_total = etf_part
        else:
            etf_total = pd.merge(etf_total, etf_part, left_on='Date', right_on='Date', how='outer')
    idx += 1
    etf_total = pd.merge(etf_total, usd_df.rename(columns={'USDKRW CURNCY_date': 'Date'}).dropna(), left_on='Date', right_on='Date', how='outer')
    return etf_total.sort_values(by=['Date']).ffill()

def make_port(etf, etf_total_dict):
    port_df = pd.DataFrame()
    port_df[etf] = etf_total_dict.set_index('Date')[etf]
    port_df['TLH'] = 0
    for ticker in etf_comp_dict[etf].keys():
        port_df['TLH'] += etf_total_dict.set_index('Date')[ticker] * etf_comp_dict[etf][ticker]
    port_df['USDKRW CURNCY'] = etf_total_dict.set_index('Date')['USDKRW CURNCY']
    port_df = port_df.ffill().dropna()
    return port_df

def make_yearly_port(port_df):
    port_df = port_df.reset_index()
    port_df['year'] = port_df['Date'].apply(lambda x: str(x.year))
    port_df = port_df.sort_index()
    return port_df.drop_duplicates(subset=['year'], keep='last').set_index('Date')

def make_thl_port(port_year_dict, pre_date,date, etf,tax):
    port_year_dict.loc[date, "TLH" + "_수량"] = port_year_dict.loc[pre_date, "TLH" + "_수량(실현후)"]
    port_year_dict.loc[date, etf + "_수량"] = port_year_dict.loc[pre_date, etf + "_수량(실현후)"]

    port_year_dict.loc[date, "TLH" + "_금액"] = port_year_dict.loc[date, "TLH"] * port_year_dict.loc[
        date, 'USDKRW CURNCY'] * port_year_dict.loc[date, "TLH" + "_수량"]
    port_year_dict.loc[date, etf + "_금액"] = port_year_dict.loc[date, etf] * port_year_dict.loc[
        date, 'USDKRW CURNCY'] * port_year_dict.loc[date, etf + "_수량"]

    port_year_dict.loc[date, "TLH" + "_누적수익"] = port_year_dict.loc[pre_date, "TLH" + "_수량(실현후)"] * (
                port_year_dict.loc[date, 'USDKRW CURNCY'] * port_year_dict.loc[date, "TLH"] -
                port_year_dict.loc[pre_date, 'USDKRW CURNCY'] * port_year_dict.loc[
                    pre_date, "TLH" + "_평단(실현후)"])
    port_year_dict.loc[date, etf + "_누적수익"] = port_year_dict.loc[pre_date, etf + "_수량(실현후)"] * (
                port_year_dict.loc[date, 'USDKRW CURNCY'] * port_year_dict.loc[date, etf] -
                port_year_dict.loc[pre_date, 'USDKRW CURNCY'] * port_year_dict.loc[
                    pre_date, etf + "_평단(실현후)"])

    port_year_dict.loc[date, "TLH" + "_기본공제대비"] = 0 if port_year_dict.loc[
                                                                date, "TLH" + "_누적수익"] == 0 else 1 if tax / port_year_dict.loc[date, "TLH" + "_누적수익"] > 1 else tax / port_year_dict.loc[date, "TLH" + "_누적수익"]
    port_year_dict.loc[date, etf + "_기본공제대비"] = 0 if port_year_dict.loc[
                                                              date, etf + "_누적수익"] == 0 else 1 if tax / port_year_dict.loc[date, etf + "_누적수익"] > 1 else tax / port_year_dict.loc[date, etf + "_누적수익"]

    port_year_dict.loc[date, "TLH" + "_실현수익"] = 0 if port_year_dict.loc[date, "TLH" + "_누적수익"] < 0 else \
    port_year_dict.loc[date, "TLH" + "_누적수익"] * port_year_dict.loc[date, "TLH" + "_기본공제대비"] * 0.5 if \
    port_year_dict.loc[date, "TLH" + "_누적수익"] * port_year_dict.loc[date, "TLH" + "_기본공제대비"] < tax else tax
    port_year_dict.loc[date, etf + "_실현수익"] = 0 if port_year_dict.loc[date, etf + "_누적수익"] < 0 else 0 if \
    port_year_dict.loc[date, "TLH" + "_실현수익"] >= tax else port_year_dict.loc[date, etf + "_누적수익"] if \
    port_year_dict.loc[date, etf + "_누적수익"] < tax else tax - port_year_dict.loc[date, "TLH" + "_실현수익"]

    port_year_dict.loc[date, "TLH" + "_실현금액"] = port_year_dict.loc[date, "TLH" + "_실현수익"] / \
                                                     port_year_dict.loc[date, "TLH" + "_누적수익"] * \
                                                     port_year_dict.loc[date, "TLH" + "_금액"] if \
    port_year_dict.loc[date, "TLH" + "_실현수익"] > 0 else 0
    port_year_dict.loc[date, etf + "_실현금액"] = port_year_dict.loc[date, etf + "_실현수익"] / \
                                                   port_year_dict.loc[date, etf + "_누적수익"] * \
                                                   port_year_dict.loc[date, etf + "_금액"] if \
    port_year_dict.loc[date, etf + "_실현수익"] > 0 else 0

    port_year_dict.loc[date, "TLH" + "_실현수량"] = (port_year_dict.loc[date, "TLH" + "_실현금액"] / (
                port_year_dict.loc[date, "TLH"] * port_year_dict.loc[date, 'USDKRW CURNCY']))
    port_year_dict.loc[date, etf + "_실현수량"] = (port_year_dict.loc[date, etf + "_실현금액"] / (
                port_year_dict.loc[date, etf] * port_year_dict.loc[date, 'USDKRW CURNCY']))

    port_year_dict.loc[date, "TLH" + "_매수수량"] = (0.995 * port_year_dict.loc[date, etf + "_실현수량"] * \
                                                      port_year_dict.loc[date, etf] / port_year_dict.loc[
                                                          date, "TLH"])
    port_year_dict.loc[date, etf + "_매수수량"] = (0.995 * port_year_dict.loc[
        date, "TLH" + "_실현수량"] * port_year_dict.loc[date, "TLH"] / port_year_dict.loc[date, etf])

    port_year_dict.loc[date, "TLH" + "_수량(실현후)"] = port_year_dict.loc[pre_date, "TLH" + "_수량(실현후)"] - \
                                                        port_year_dict.loc[date, "TLH" + "_실현수량"] + \
                                                        port_year_dict.loc[date, "TLH" + "_매수수량"]
    port_year_dict.loc[date, etf + "_수량(실현후)"] = port_year_dict.loc[pre_date, etf + "_수량(실현후)"] - \
                                                      port_year_dict.loc[date, etf + "_실현수량"] + \
                                                      port_year_dict.loc[date, etf + "_매수수량"]

    port_year_dict.loc[date, "TLH" + "_평단(실현후)"] = port_year_dict.loc[pre_date, "TLH" + "_평단(실현후)"] if \
    port_year_dict.loc[date, "TLH" + "_수량(실현후)"] == 0 else (port_year_dict.loc[
                                                                     pre_date, "TLH" + "_평단(실현후)"] * (
                                                                             port_year_dict.loc[
                                                                                 pre_date, "TLH" + "_수량(실현후)"] -
                                                                             port_year_dict.loc[
                                                                                 date, "TLH" + "_실현수량"]) + (
                                                                             port_year_dict.loc[date, "TLH"] *
                                                                             port_year_dict.loc[
                                                                                 date, "TLH" + "_매수수량"])) / \
                                                                port_year_dict.loc[date, "TLH" + "_수량(실현후)"]
    port_year_dict.loc[date, etf + "_평단(실현후)"] = port_year_dict.loc[pre_date, etf + "_평단(실현후)"] if \
    port_year_dict.loc[date, etf + "_수량(실현후)"] == 0 else (port_year_dict.loc[pre_date, etf + "_평단(실현후)"] * (
                port_year_dict.loc[pre_date, etf + "_수량(실현후)"] - port_year_dict.loc[date, etf + "_실현수량"]) +
                                                               port_year_dict.loc[date, etf] *
                                                               port_year_dict.loc[date, etf + "_매수수량"]) / \
                                                              port_year_dict.loc[date, etf + "_수량(실현후)"]
    return port_year_dict
def make_all_port(etf, init_invest):
    etf_total_dict = make_BB_df(etf)
    port_df = make_port(etf, etf_total_dict)
    port_year_dict = make_yearly_port(port_df)

    # port_year_dict['PORT_Q'] = port_year_dict.apply(lambda x: int(init_invest/(x.loc['PORT'] * x.loc['USDKRW CURNCY'])))
    for col in ['_금액','_수량','_누적수익','_기본공제대비','_실현수익','_실현금액','_실현수량','_매수수량','_수량(실현후)','_평단(실현후)']:
        port_year_dict[etf+col] = 0
        port_year_dict["TLH"+col] = 0
    pre_date = ''
    for idx, date in enumerate(port_year_dict.index):
        if idx == 0:
            port_year_dict.loc[date, etf+"_금액"] = init_invest
            port_year_dict.loc[date, etf+"_수량"] = (init_invest / (port_year_dict.loc[date, etf]*port_year_dict.loc[date, 'USDKRW CURNCY']))
            port_year_dict.loc[date, etf+"_수량(실현후)"] = port_year_dict.loc[date, etf + "_수량"]
            port_year_dict.loc[date, etf+"_평단(실현후)"] = port_year_dict.loc[date, etf]
        else:
            port_year_dict = make_thl_port(port_year_dict, pre_date,date, etf,tax)

        pre_date = date
    return port_year_dict, port_df

def make_simul(etf, port_year_df, port_df, init_invest):
    merge_col = list(port_df.reset_index().columns)
    simul_df = pd.merge(port_df.reset_index(), port_year_df.reset_index()[merge_col+[etf+'_수량', 'TLH_수량']], left_on=merge_col, right_on=merge_col, how='left')
    simul_df = simul_df.ffill().dropna().set_index('Date')
    simul_df['TLH_SIMUL'] = 0
    simul_df[etf+'_SIMUL'] = 0
    simul_df[etf+'_수량(2)'] = np.nan
    for ticker in [etf, 'TLH']:
        simul_df['TLH_SIMUL'] += simul_df[ticker] * simul_df[ticker+'_수량'] * simul_df['USDKRW CURNCY']
    simul_df.loc[list(simul_df.index)[0], etf+'_수량(2)'] = init_invest / (simul_df[etf].iloc[0]* simul_df['USDKRW CURNCY'].iloc[0])
    simul_df[etf+'_수량(2)'] = simul_df[etf+'_수량(2)'].ffill()
    simul_df[etf + '_SIMUL'] = simul_df[etf] * simul_df[etf+'_수량(2)'] * simul_df['USDKRW CURNCY']
    simul_df['TLH_SIMUL'] = (simul_df['TLH_SIMUL'].pct_change().fillna(0)+1).cumprod()
    simul_df[etf + '_SIMUL'] = (simul_df[etf + '_SIMUL'].pct_change().fillna(0)+1).cumprod()
    simul_df = simul_df.reset_index().reset_index()
    simul_df['TF'] = simul_df['index'].apply(lambda x: x%10==0)
    simul_df = simul_df[simul_df['TF']==True]
    return simul_df.set_index('Date')[[etf + '_SIMUL', 'TLH_SIMUL']]

def make_table(etf, port_year_df, init_invest):
    min_date = port_year_df.index[0]
    max_date = port_year_df.index[-1]
    table_df = pd.DataFrame(index=['초기자산', '현재자산', '총 수익', '기본공제(누적)', '과세대상수익', '세금(22%)', '세후수익'], columns=['TLH 적용', 'TLH 미적용']) # '절세전략 효과'
    table_df.loc['초기자산'] = init_invest
    table_df.loc['현재자산', 'TLH 적용'] = port_year_df.iloc[-1][etf+'_금액'] + port_year_df.iloc[-1]['TLH_금액']
    table_df.loc['현재자산', 'TLH 미적용'] = port_year_df.loc[min_date, etf+'_수량'] * port_year_df.loc[max_date, etf] * port_year_df.loc[max_date, 'USDKRW CURNCY']
    table_df.loc['총 수익'] = table_df.loc['현재자산'] - table_df.loc['초기자산']
    table_df.loc['기본공제(누적)','TLH 적용' ] = port_year_df[etf+'_실현수익'].sum() + port_year_df['TLH_실현수익'].sum()
    table_df.loc['기본공제(누적)', 'TLH 미적용'] = tax
    table_df.loc['거래비용'] = table_df.loc['총 수익'] * 0.25
    table_df.loc['과세대상수익'] = table_df.loc['총 수익'] - table_df.loc['거래비용'] - table_df.loc['기본공제(누적)']
    table_df.loc['세금(22%)'] = table_df.loc['과세대상수익'] * 0.22
    table_df.loc['세후수익'] = table_df.loc['총 수익'] - table_df.loc['세금(22%)']
    table_df['절세전략 효과'] = table_df['TLH 적용'] - table_df['TLH 미적용']
    saved = (table_df.loc['세후수익'] - table_df.loc['초기자산'])
    table_df = table_df.applymap(lambda x: f"{int(round(x, 0)):,} 원")
    table_df.loc['세후수익률(연환산)'] = (saved+1)**(365/((max_date-min_date).days)) -1
    table_df.loc['세후수익률(연환산)','절세전략 효과'] = table_df.loc['세후수익률(연환산)','TLH 적용'] - table_df.loc['세후수익률(연환산)','TLH 미적용']
    table_df.loc['세후수익률(연환산)'] = table_df.loc['세후수익률(연환산)'].map(lambda x: str(round(x, 2)) + '%')
    return table_df
def calc_TLH(etf, init_invest):
    etf += " US EQUITY"
    print(etf)
    port_year_df, port_df = make_all_port(etf, init_invest)
    simul_df = make_simul(etf, port_year_df, port_df, init_invest)
    table_df = make_table(etf, port_year_df,init_invest)
    return {
        "SIMUL": {
            "Date": list(map(lambda x: x.strftime('%Y-%m-%d'), simul_df.index)),
            "{}_SIMUL".format(etf): simul_df["{}_SIMUL".format(etf)].values.tolist(),
            "TLH_SIMUL": simul_df["TLH_SIMUL"].values.tolist(),
        },
        "TABLE": {
            "col": list(table_df.index),
            "diff_tlh": table_df['절세전략 효과'].values.tolist(),
            "no_tlh": table_df['TLH 미적용'].values.tolist(),
            "with_tlh": table_df['TLH 적용'].values.tolist(),
        }

    }

if __name__ == '__main__':

    for etf in etf_comp_dict.keys():
        etf = etf.split(' ')[0]
        # port_year_df, port_df = make_all_port(etf)
        # simul_df = make_simul(etf, port_year_df, port_df)
        # table_df = make_table(etf, port_year_df)
        result = calc_TLH(etf, init_invest=50000000)
        print(1)