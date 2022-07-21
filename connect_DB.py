import pandas as pd
import pymssql
from datetime import datetime

conn = pymssql.connect(server='10.93.20.65', user='roboadv', password='roboadv123!', database='ROBO')
fd_return_query = '''
select * 
from FD_RETURN
'''
kr_order_query = '''
select * 
from KR_ORDER
'''
fr_order_query = '''
select * 
from FR_ORDER
'''
def load_returns(port1='멀티에셋인컴', port2='공'):
    fd_return_query = '''
    select * 
    from FD_RETURN
    '''
    date_parsing = lambda x: datetime.strptime(x, '%Y%m%d').strftime('%Y-%m-%d')

    fd_return = load_data_db(fd_return_query)
    fd_return = fd_return[fd_return['TD']!='########']
    fd_return['TD'] = fd_return['TD'].apply(lambda x: date_parsing(x))
    fd_return['FD_NM'] = fd_return['FD_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))
    fd_return = fd_return[fd_return.FD_NM == port1 + port2 + '2']
    fd_return = fd_return.dropna(subset=['RTN'])
    return fd_return

def load_data_db(sql):
    cursor = conn.cursor(as_dict=True)
    # print(sql)
    cursor.execute(sql)
    data = cursor.fetchall()
    data = pd.DataFrame(data)
    return data

# def load_returns():
#     date_parsing = lambda x: datetime.strptime(x, '%Y%m%d').strftime('%Y-%m-%d')
#
#     fd_return = load_data_db(fd_return_query)
#     fd_return = fd_return[fd_return['TD']!='########']
#     fd_return['TD'] = fd_return['TD'].apply(lambda x: date_parsing(x))
#     fd_return['FD_NM'] = fd_return['FD_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))
#     return fd_return[fd_return.FD_NM=='초개인로보성장2'].RTN.tolist()

def load_kr():
    date_parsing = lambda x: datetime.strptime(x, '%Y%m%d').strftime('%Y-%m-%d')

    kr_order = load_data_db(kr_order_query)
    kr_order = kr_order[kr_order['ORDER_DATE'] != '########']
    kr_order['ORDER_DATE'] = kr_order['ORDER_DATE'].apply(lambda x: date_parsing(x))
    kr_order['ACC_NM'] = kr_order['ACC_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))
    return 0

def load_fr():
    date_parsing = lambda x: datetime.strptime(x, '%Y%m%d').strftime('%Y-%m-%d')

    fr_order = load_data_db(fr_order_query)
    fr_order = fr_order[fr_order['ORDER_DATE'] != '########']
    fr_order['ORDER_DATE'] = fr_order['ORDER_DATE'].apply(lambda x: date_parsing(x))
    fr_order['ACC_NM'] = fr_order['ACC_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))
    return 0
load_returns(port1='멀티에셋', port2='인컴')
date_parsing = lambda x: datetime.strptime(x, '%Y%m%d').strftime('%Y-%m-%d')
kr_order = load_data_db(kr_order_query)
kr_order = kr_order[kr_order['ORDER_DATE']!='########']
kr_order['ORDER_DATE'] = kr_order['ORDER_DATE'].apply(lambda x: date_parsing(x))
kr_order['ACC_NM'] = kr_order['ACC_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))
fr_order = load_data_db(fr_order_query)
fr_order = fr_order[fr_order['ORDER_DATE']!='########']
fr_order['ORDER_DATE'] = fr_order['ORDER_DATE'].apply(lambda x: date_parsing(x))
fr_order['ACC_NM'] = fr_order['ACC_NM'].apply(lambda x: x.encode('ISO-8859-1').decode('euc-kr'))


print(1)