import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push,  get, set, onChildAdded, remove, onChildRemoved } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

export class FirebaseFunctions{
    constructor(FIREBASE_CONFIG){              
        // Initialize Firebase
        const APP = initializeApp(FIREBASE_CONFIG); 
        this.DB = getDatabase(APP);
        this.DB_REF_COOKIE =  ref(this.DB, `data/cookie`);
    
        this.__initTipFlg();
        
    }

    uploadData(rawPath,DATA){
        rawPath = `data/${rawPath}`;
        var reviewdPath = this.__reviewPath(rawPath);

        const DB_REF_DATA =  ref(this.DB, reviewdPath);
        const JSON_DATA = JSON.stringify(DATA);
        set(DB_REF_DATA,JSON_DATA);
    }
    
    async downloadData(rawPath) {
        this.__tellTips("downloadData");

        rawPath = `data/${rawPath}`;
        var reviewedPath = this.__reviewPath(rawPath);
        const DB_REF_DATA = ref(this.DB, reviewedPath);
    
        try {
            const snapshot = await get(DB_REF_DATA); // await で結果を待機
            if (snapshot.exists()) { // パスワードが登録されていた場合
                const JSON_DATA = snapshot.val(); // データを格納
                const PARSED_DATA = JSON.parse(JSON_DATA); // 必要ならJSONをパース
                return PARSED_DATA; // 取得したデータを返す
            } else {
                console.log('No data available');
                return null;
            }
        } catch (error) {
            this.__alertMessage(error);
            console.error('Error getting data:', error);
            throw error; // エラーを呼び出し元に伝える
        }
    } 

    __reviewPath(PATH){
        return PATH.replace(/(\/?data\/)+/, "data/");
        //:  / /は正規表現を宣言
        //:  \/は/のエスケープ文字
    }

    __alertMessage(INFO){
        alert(`Error: yamatoaita@gmail.comにこの文章をお知らせください。\nError info : ${INFO}`)
    }

    __initTipFlg(){
        this.isShowTip = {
                            "downloadData" : true
                        
                        }
    }
    
    __tellTips(METHOD){
        const GREEN = "color:green";
        const RED = "color:red";
        const NORMAL = "color:black;font-weight:normal"
        const BOLD  ="font-weight:bold`"

        if(METHOD == "downloadData" && this.isShowTip["downloadData"]){
            this.isShowTip["downloadData"] = false;

            console.log(
`
============================================================================
|                        %cTip of [downloadData]:%c                            |
|                                                                          |
|downloadDataメソッドを実行する際は以下のように使います。                  |
|--------------------------------------------------------------------------|
|    class ClassName{                                                      |
|        constructor(){                                                    |
|                                                                          |
|            ・・・処理・・・                                              |
|                                                                          |
|            this.init(); // データ取得後に実行させたいコードは            |
|                        // init関数にくくる。                             |
|        }                                                                 |
|                                                                          |
|        %casync%c init(){                                                     |
|            const DATA = %cawait%c this.FIREBASE_APP.downloadData("cookie");  |
|            console.log(‘データが取得後に表示されます$｛DATA｝‘)        |
|            console.log("このログはその後に表示されます")                 |
|        }                                                                 |
|    }                                                                     |
============================================================================` ,`${GREEN};${BOLD}`,`${NORMAL}`,`${RED};${BOLD}`,`${NORMAL}`,`${RED};${BOLD}`,`${NORMAL}`)
        }
    }
}

