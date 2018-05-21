import moment from 'moment';
/**
 * 指定された日付をYYYY-MM-DD HH:mm:ss形式に変換する
 * @param value 日付
 */
export function getDateAndTimes(value:any) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
};