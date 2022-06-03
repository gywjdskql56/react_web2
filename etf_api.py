import re
from flask import Flask
from flask_cors import CORS
import pandas as pd
import pymssql
import datetime as dt
import numpy as np
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)


now = dt.datetime.now()
delta = dt.timedelta(weeks=15)
today = now.strftime('%Y%m%d')
past = (now - delta).strftime('%Y%m%d')
trd_date = lambda x, y: '''
select TOP 100 * 
from MARKET.dbo.MA
where FD > '{}'
and FD < '{}'
and TR = '1'
'''.format(x, y)

print(past)
input_option = False
conn = pymssql.connect(server='10.93.20.65', user='quant', password='mirae', database='master', charset = 'utf8')
def load_data_db(sql):
    cursor = conn.cursor(as_dict=True)
    # print(sql)
    cursor.execute(sql)
    data = cursor.fetchall()
    data = pd.DataFrame(data)
    return data

universe_by_country = lambda x, y: '''
    select *
    from AGGR..ETF_COVERAGE
    where ETF_GEO_EXPOSURE_CODE in ({})
    and ETF_ASSET_CLASS in ({})
    and ETF_ACTIVE_DESC = 'Active'
    ;
    '''.format('\'' + '\',\''.join(x) + '\'','\'' + '\',\''.join(y) + '\'')


num_dict_1 = {'1':'US+KR', '2':'US', '3':'KR'}
print('STEP 1  || SELECT UNIVERSE')
print('STEP 1-1|| SELECT UNIVERSE by Country ({}): '.format(' / '.join([str(key)+': '+num_dict_1[key] for key in list(num_dict_1.keys())])))
if input_option:
    num_1 = input()
else:
    num_1 = '1' #input() # 1
print('        || {} is selected'.format(num_dict_1[num_1]))
num_dict_2 = {'1':'Equity', '2':'Fixed Income', '3':'Commodities', '4':'Currency', '5':'Alternatives', '6':'Multi_Asset'}
print('STEP 1-2|| SELECT UNIVERSE by Asset Class ({}): '.format(' / '.join([str(key)+': '+num_dict_2[key] for key in list(num_dict_2.keys())])))
print('        || Seperate by /   ex) 1/3/6 ')
if input_option:
    num_2 = input()
else:
    num_2 = '1/2/5' #input() #1/2/5
print('        || {} is selected'.format('/'.join([num_dict_2[n2] for n2 in num_2.split('/')])))
universe = load_data_db(universe_by_country(num_dict_1[num_1].split('+'),[num_dict_2[n] for n in num_2.split('/')]))
num_dict_3 = {'0':'All', '1':'Frontier Markets', '2':'Developed Markets', '3':'Emerging Markets', '4':'Blended Development'}
print('STEP 1-3|| SELECT UNIVERSE by Market ({}): '.format(' / '.join([str(key)+': '+num_dict_3[key] for key in list(num_dict_3.keys())])))
if input_option:
    num_3 = input()
else:
    num_3 = '2' #input() # 2
print('        || {} is selected'.format(num_dict_3[num_3]))

universe['count'] = 1
if num_3 != 'All':
    universe = universe[universe['ETF_ECON_DEVELOPMENT_DESC']==num_dict_3[num_3]]
    universe_groupby = universe.groupby(['ETF_GEO_EXPOSURE_CODE', 'ETF_ASSET_CLASS']).sum()['count']
else:
    universe_groupby = universe.groupby(['ETF_GEO_EXPOSURE_CODE', 'ETF_ASSET_CLASS', 'ETF_ECON_DEVELOPMENT_DESC']).sum()['count']

print('        || {} tickers are selected'.format(str(len(universe))))

print('        || ', universe_groupby)





print('STEP 2  || SELECT RULES and CONSTRAINTS')
num_dict_4 = {'1':'Return_1M', '2':'Return_2M', '3':'Return_3M', '4':'Volatility_1M', '5':'Volatility_2M', '6':'Volatility_3M'}
print('STEP 2-1|| SELECT SORTING RULE ({}): '.format(' / '.join([str(key)+': '+num_dict_4[key] for key in list(num_dict_4.keys())])))
universe_sorted = universe.sort_values('LAST_UPDATE_USER_ID')
if input_option:
    num_4 = input()
else:
    num_4 = '2' #input() # 2
print('        || Tickers are sorted by {} '.format(num_dict_4[num_4]))

print('=========================  SCREENING RESULT  ========================')
print(universe_sorted[['FSYM_ID', 'ETF_DESC','ETF_ASSET_CLASS']])
print(1)






