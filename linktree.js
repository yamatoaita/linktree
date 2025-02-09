import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push,  get, set, onChildAdded, remove, onChildRemoved } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

class FirebaseFunctions{
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

class Application{
    constructor(){
        //➀Elementを取得
        this.INPUT_SINCE          = document.getElementById("dateSince");
        this.SPAN_SINCE           = document.getElementById("explainDateSince");

        this.INPUT_UNTIL         = document.getElementById("dateUntil");
        this.SPAN_UNTIL          = document.getElementById("explainDateUntil");

        this.BUTTON_ENTER         = document.getElementById("enterBtn");

        this.SINCE_DATE           = document.getElementById("dateSince");
        this.UNTIL_DATE           = document.getElementById("dateUntil");

        const FIREBASE_CONFIG = {
            apiKey: "AIzaSyBYf6N1S-oMoHvJFGmLvlJ9t1WBsiSy2XQ",
            authDomain: "x-linktree.firebaseapp.com",
            databaseURL: "https://x-linktree-default-rtdb.firebaseio.com",
            projectId: "x-linktree",
            storageBucket: "x-linktree.firebasestorage.app",
            messagingSenderId: "207042084073",
            appId: "1:207042084073:web:e305b706b65b4d6e718478"
        };
        this.FIREBASE_APP = new FirebaseFunctions(FIREBASE_CONFIG);
        
        this.setLastUsedOption();

        this.setRadioEvent();//ラジオボタンの選択状況に応じて、elementを表示させる
        this.setButtonEvent();//確定ボタンのイベントを設定
        this.setA_Event();//リンククリック時の色変化を設定
    }

    async setLastUsedOption(){
        const DATA = await this.FIREBASE_APP.downloadData("cookie");

        this.SINCE_DATE.value = DATA["since"];
        this.UNTIL_DATE.value = DATA["until"];
        
        const OPTION = DATA["option"];
        this.selectRadioButton(OPTION);

        this.hideRadioExtraElems();
        this.showRadioExtraElem(OPTION);

        this.doButtonEvent();

    }

    uploadLastUsedOption(){
        const OPTION        = document.querySelector('input[name="option"]:checked').value;
        const DICT_OPTIONS = {
                                "since" : this.SINCE_DATE.value,
                                "until" : this.UNTIL_DATE.value,
                                "option": OPTION
                             }
        this.FIREBASE_APP.uploadData("cookie",DICT_OPTIONS)
    }

    setButtonEvent(){
        this.BUTTON_ENTER.addEventListener("click",()=>{
            this.doButtonEvent();
        })
    }

    doButtonEvent(){
        this.composeLinks();
        this.resetA_Color();

        this.uploadLastUsedOption();
    }

    composeLinks(){
        const OPTION        = document.querySelector('input[name="option"]:checked').value;
        const TABEL_ROW_LEN = document.querySelectorAll("tr").length;

        if(      OPTION == "all"){
            for(let i = 1; i< TABEL_ROW_LEN; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?q=(${HASHTAG})&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?q=(${HASHTAG})&src=typed_query&f=live`;
            }

        }else if(OPTION == "since~"){
            const SINCE_VALUE = this.SINCE_DATE.value;

            for(let i = 1; i< TABEL_ROW_LEN; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?f=live&q=(${HASHTAG})%20since%3A${SINCE_VALUE}&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?f=live&q=(${HASHTAG})%20since%3A${SINCE_VALUE}&src=typed_query&f=live`;
            }

        }else if(OPTION == "~until"){
            const UNTIL_VALUE = this.UNTIL_DATE.value;
            for(let i = 1; i< TABEL_ROW_LEN; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${UNTIL_VALUE}&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${UNTIL_VALUE}&src=typed_query&f=live`;
            }

        }else if(OPTION == "since~until"){
            const SINCE_VALUE = this.SINCE_DATE.value;
            const UNTIL_VALUE = this.UNTIL_DATE.value;
          
            for(let i = 1; i< TABEL_ROW_LEN; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${UNTIL_VALUE}%20since%3A${SINCE_VALUE}&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${UNTIL_VALUE}%20since%3A${SINCE_VALUE}&src=typed_query&f=live`;
            }
        }else{
            alert(`error:${OPTION}`)
        }
    }

    setA_Event(){
        const A_TAGS = document.querySelectorAll("a");
        for(let aTag of A_TAGS){
            aTag.addEventListener("click",(event)=>{
                event.target.style.color = "rgb(100, 46, 150)" //リンククリック後の色。
            })
        }
    }

    resetA_Color(){
        const A_TAGS = document.querySelectorAll("a");
        for(let aTag of A_TAGS){
          
            aTag.style.color = "rgb(0, 0, 238)";//aタグを初期状態に戻す
        }
    }

    setRadioEvent(){
        const RADIO_BUTTONS = document.querySelectorAll('input[name="option"]');
        for(let radio of RADIO_BUTTONS){
     
            radio.addEventListener("change",()=>{

                this.hideRadioExtraElems();
                const OPTION = radio.value;
                this.showRadioExtraElem(OPTION);

                this.resetA_Color();
            })
        }

    }

    selectRadioButton(OPTION){
        var radioButton = "";

        if(      OPTION == "all"){
            radioButton = document.getElementById("radioAll");
            radioButton.checked = true;
        }else if(OPTION == "since~"){
            radioButton = document.getElementById("radioSince");
            radioButton.checked = true;
        }else if(OPTION == "~until"){
            radioButton = document.getElementById("radioUntil");
            radioButton.checked = true;
        }else if(OPTION == "since~until"){
            radioButton = document.getElementById("radioSinceUntil");
            radioButton.checked = true;
        }else{
            alert(`error:${OPTION}`)
        }
    }

    hideRadioExtraElems(){
        this.INPUT_SINCE.style.display  = "none";
        this.SPAN_SINCE.style.display   = "none";

        this.INPUT_UNTIL.style.display  = "none";
        this.SPAN_UNTIL.style.display   = "none";

    }

    showRadioExtraElem(option){
        if(      option == "since~"){
            this.INPUT_SINCE.style.display  = "inline";
            this.SPAN_SINCE.style.display   = "inline";

        }else if(option == "~until"){
            this.INPUT_UNTIL.style.display  = "inline";
            this.SPAN_UNTIL.style.display   = "inline";   

        }else if(option=="since~until"){
            this.INPUT_SINCE.style.display  = "inline";
            this.SPAN_SINCE.style.display   = "inline";

            this.INPUT_UNTIL.style.display  = "inline";
            this.SPAN_UNTIL.style.display   = "inline";

        }
    }
}


const App = new Application();
