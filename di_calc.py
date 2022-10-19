import pandas as pd
df_rtn = pd.read_excel('data/rtn_light.xlsx', sheet_name = 'Sheet2')
df = pd.read_excel('data/테마분류_221006.xlsx')
data = pd.read_csv('data/model_score.csv')
def get_all_big_DI(df):
    return list(set(df['cat']))

def get_all_medium_DI(df, big_col):
    return list(set(df[df['cat']==big_col]['theme']))
df_rtn = pd.read_excel('data/rtn_light.xlsx', sheet_name = 'Sheet1')
print(1)

