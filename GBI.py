from GBI_func import *



def get_setting():
    data = pd.read_excel("data/Data_rev.xlsx", engine="openpyxl")
    data.columns = ["Date"] + data.columns[1:].tolist()
    data = data.set_index(["Date"])

    class_tag = pd.read_excel("data/Sec_tagging.xlsx", engine="openpyxl")
    class_tag = class_tag.iloc[:, 1:]

    stock_N = len(data.columns)

    ret_data_origin = data.pct_change().dropna()  # data / data.shift(1) -1
    # ret_data_origin=ret_data_origin.dropna()
    est_ret_data = copy.deepcopy(ret_data_origin)

    ret_data_origin["Year+Month"] = [x[:7] for x in ret_data_origin.index.astype(str)]
    ret_data_origin["Date"] = ret_data_origin.index.values

    today_Y, today_m, today_d = 2020, 12, 31
    today = pd.Timestamp(today_Y, today_m, today_d)
    return data, class_tag, stock_N, ret_data_origin, est_ret_data, today

def get_range(G, T, Risk_type, Payment_type, L, h, period):
    data, class_tag, stock_N, ret_data_origin, est_ret_data, today = get_setting()
    minimum_wealth, minportnum, minprob, maximum_wealth, maxportnum = get_payment_range(T, h, est_ret_data, class_tag,
                                                                                        stock_N, G, today, T, h,
                                                                                        Payment_type, m, Risk_type,
                                                                                        w_range=(0, 1),
                                                                                        restrictions="valid",
                                                                                        tolerance=1e-9)[:5]
    return minimum_wealth, maximum_wealth

def get_init_port(T, h):
    data, class_tag, stock_N, ret_data_origin, est_ret_data, today = get_setting()
    mu_list, sigma_list, portw_list, i_max_init = Cal_parameters(T, h, est_ret_data, class_tag, stock_N, today,
                                                                 252 * 10, characteristics=Risk_type, w_range=(0, 1),
                                                                 restrictions="valid", tolerance=1e-9)[2:]

    selected_wealth = 110 * 1000000
    # if (selected_wealth < minimum_wealth) or (selected_wealth > maximum_wealth):
    #     print( "범위 내의 부담금을 선택하지 않았습니다.")

    Risk_types_EN = ["Aggressive", "Neutral", "Conservative"]
    Risk_types_KR = ["공격", "중립", "안정"]
    Risk_types = ["Aggressive", "Neutral", "Conservative"]
    Risk_types.remove(Risk_type)

    # start = time()

    res_main = get_gbi_tree(selected_wealth, G, np.array([0.] * int(T / h)), T, mu_list,
                            sigma_list, i_max_init, h, L)
    res_max = get_gbi_tree(selected_wealth, G, np.array([0.] * int(T / h)), T, np.array([mu_list[-1]] * 2),
                           np.array([sigma_list[-1]] * 2), i_max_init, h, L)

    mu_list_alt_1, sigma_list_alt_1, portw_list_alt_1, i_max_init_alt_1 = Cal_parameters(T, h, est_ret_data, class_tag,
                                                                                         stock_N, today, 252 * 10,
                                                                                         characteristics=Risk_types[0],
                                                                                         w_range=(0, 1),
                                                                                         restrictions="valid",
                                                                                         tolerance=1e-9)[2:]

    mu_list_alt_2, sigma_list_alt_2, portw_list_alt_2, i_max_init_alt_2 = Cal_parameters(T, h, est_ret_data, class_tag,
                                                                                         stock_N, today, 252 * 10,
                                                                                         characteristics=Risk_types[1],
                                                                                         w_range=(0, 1),
                                                                                         restrictions="valid",
                                                                                         tolerance=1e-9)[2:]

    res_alt_1 = get_gbi_tree(selected_wealth, G, np.array([0.] * int(T / h)), T, mu_list_alt_1,
                             sigma_list_alt_1, i_max_init_alt_1, h, L)

    res_alt_2 = get_gbi_tree(selected_wealth, G, np.array([0.] * int(T / h)), T, mu_list_alt_2,
                             sigma_list_alt_2, i_max_init_alt_2, h, L)

    recomm_prob = res_main[0][0][0][0]
    recomm_prob_loss = sum(cumprod(res_main[1][0].T,
                                   res_main[1][1:])[0][:closest_value(res_main[0][3][-1], L)])
    recomm_er = mu_list[-1]

    print(
        f"제안 포트폴리오 \n\n목표달성확률: {recomm_prob * 100:.1f}%\n손실률: {recomm_prob_loss * 100:.1f}%\n기대수익률: {recomm_er * 100:.1f}%")
    ret_max_prob = res_max[0][0][0][0]
    ret_max_prob_loss = sum(cumprod(res_max[1][0].T,
                                    res_max[1][1:])[0][:closest_value(res_max[0][3][-1], L)])
    ret_max_er = mu_list[-1]

    print(
        f"기대수익 최대화 포트폴리오 \n\n목표달성확률: {ret_max_prob * 100:.1f}%\n손실률: {ret_max_prob_loss * 100:.1f}%\n기대수익률: {ret_max_er * 100:.1f}%")
    recomm_alt_1_prob = res_alt_1[0][0][0][0]
    recomm_alt_1_prob_loss = sum(cumprod(res_alt_1[1][0].T,
                                         res_alt_1[1][1:])[0][:closest_value(res_alt_1[0][3][-1], L)])
    recomm_alt_1_er = mu_list_alt_1[-1]

    print(
        f"{Risk_types_KR[Risk_types_EN.index(Risk_types[0])]} 기준 제안 포트폴리오 \n\n목표달성확률: {recomm_alt_1_prob * 100:.1f}%\n손실률: {recomm_alt_1_prob_loss * 100:.1f}%\n기대수익률: {recomm_alt_1_er * 100:.1f}%")

    recomm_alt_2_prob = res_alt_2[0][0][0][0]
    recomm_alt_2_prob_loss = sum(cumprod(res_alt_2[1][0].T,
                                         res_alt_2[1][1:])[0][:closest_value(res_alt_2[0][3][-1], L)])
    recomm_alt_2_er = mu_list_alt_2[-1]

    print(
        f"{Risk_types_KR[Risk_types_EN.index(Risk_types[1])]} 기준 제안 포트폴리오 \n\n목표달성확률: {recomm_alt_2_prob * 100:.1f}%\n손실률: {recomm_alt_2_prob_loss * 100:.1f}%\n기대수익률: {recomm_alt_2_er * 100:.1f}%")
    return 0

if __name__ == '__main__':
    data, class_tag, stock_N, ret_data_origin, est_ret_data, today = get_setting()

    ################################################################
    G = 200.*1000000 # 목표 금액
    T = 10. # 은퇴 시기
    Risk_type = "Conservative"
    Payment_type = "One_time" # 거치식: One_time / 적립식: Recurring
    L = 0.8 * G

    h = 1/12 #리밸런싱 주기(default 1/12)
    period = int(12 * h)
    ################################################################

    minimum_wealth, maximum_wealth = get_range(G, T, Risk_type, Payment_type, L, h, period)
    KR_payment_type = "거치식" if Payment_type == "One_time" else "적립식"
    print(f"{KR_payment_type} 기준 부담금 범위는 {minimum_wealth:.0f} ~ {maximum_wealth:.0f} 입니다.")

    # minimum_wealth, minportnum, minprob, maximum_wealth, maxportnum = get_payment_range(T, h, est_ret_data, class_tag, stock_N, G, today, T, h, Payment_type, m, Risk_type,w_range = (0,1),restrictions="valid",tolerance=1e-9)[:5]
    get_init_port(T, h)