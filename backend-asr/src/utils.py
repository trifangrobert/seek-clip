import datetime

def format_timestamp(seconds):
    td = datetime.timedelta(seconds=seconds)
    # keep only 3 decimal places
    if '.' not in str(td):
        td = str(td) + ".000"
    
    td_seconds, td_microseconds = str(td).split(".")
    td_microseconds = td_microseconds[:min(3, len(td_microseconds))]
    if len(td_microseconds) < 3:
        td_microseconds = td_microseconds + "0" * (3 - len(td_microseconds))
    # print(td_seconds)
    # print(td_microseconds)
    td = f"0{td_seconds}.{td_microseconds}"
    # print(td)
    return td
