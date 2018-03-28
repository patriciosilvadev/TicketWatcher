/**
 * 指定されたURLから非同期でデータを取得し返す
 * 
 * @param url URL
 * @param isJson JSONオブジェクトとしてレスポンスを返す場合、true
 * @returns 取得パラーメータ
 */
export function requestSync (url, isJson) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (isJson) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    resolve(xhr.response);
                }
            } else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = () => {
            reject(new Error(xhr.statusText));
        };
        xhr.send(null);
    });
}
