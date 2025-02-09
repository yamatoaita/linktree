class Application{
    constructor(){
        //➀Elementを取得
        this.INPUT_AFTER          = document.getElementById("dateAfter");
        this.SPAN_AFTER           = document.getElementById("explainDateAfter");

        this.INPUT_BEFORE         = document.getElementById("dateBefore");
        this.SPAN_BEFORE          = document.getElementById("explainDateBefore");

        this.BUTTON_ENTER         = document.getElementById("enterBtn");

        
        this.setRadioEvent();
        this.setButtonEvent();
    }

    setButtonEvent(){
        this.BUTTON_ENTER.addEventListener("click",()=>{
            this.composeLinks();
        })
    }

    composeLinks(){
        const OPTION = document.querySelector('input[name="option"]:checked').value;
        const TABEL_ROW_NUM = document.querySelectorAll("tr").length;

        if(      OPTION == "all"){
            for(let i = 1; i< TABEL_ROW_NUM; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?q=(${HASHTAG})&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?q=(${HASHTAG})&src=typed_query&f=live`;
            }

        }else if(OPTION == "after~"){
            for(let i = 1; i< TABEL_ROW_NUM; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?f=live&q=(${HASHTAG})%20since%3A${AFTER}&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?f=live&q=(${HASHTAG})%20since%3A${AFTER}&src=typed_query&f=live`;
            }
        }else if(OPTION == "~before"){
            for(let i = 1; i< TABEL_ROW_NUM; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${BEFORE}&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${BEFORE}&src=typed_query&f=live`;
            }
        }else if(OPTION == "after~before"){
            const BEFORE = document.getElementById("dateBefore").textContent;
            const AFTER = document.getElementById("dateAfter").textContent;
            console.log(`time: ${BEFORE}`);
            for(let i = 1; i< TABEL_ROW_NUM; i++){
            
                var HASHTAG    = document.getElementById(`hashtag${i}Title`).textContent;
                HASHTAG        = HASHTAG.replace("#","%23");

                var LINK_CELL         = document.getElementById(`hashtag${i}LINK`);
                LINK_CELL.href        = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${BEFORE}%20since%3A${AFTER}&src=typed_query&f=live`;
                LINK_CELL.textContent = `https://x.com/search?f=live&q=(${HASHTAG})%20until%3A${BEFORE}%20since%3A${AFTER}&src=typed_query&f=live`;
            }
        }
    }

    setRadioEvent(){
        const RADIO_BUTTONS = document.querySelectorAll('input[name="option"]')
        for(let radio of RADIO_BUTTONS){
     
            radio.addEventListener("change",()=>{
                this.hideRadioExtraElems();

                //➁Radiobuttonに応じて、Elementを表示
                const OPTION = radio.value;
                this.showRadioExtraElem(OPTION);
            })
        }

    }

    hideRadioExtraElems(){
        this.INPUT_AFTER.style.display  = "none";
        this.SPAN_AFTER.style.display   = "none";

        this.INPUT_BEFORE.style.display = "none";
        this.SPAN_BEFORE.style.display  = "none";

    }

    showRadioExtraElem(option){
        if(      option == "after~"){
            this.INPUT_AFTER.style.display  = "inline";
            this.SPAN_AFTER.style.display   = "inline";

        }else if(option == "~before"){
            this.INPUT_BEFORE.style.display = "inline";
            this.SPAN_BEFORE.style.display  = "inline";   

        }else if(option=="after~before"){
            this.INPUT_AFTER.style.display  = "inline";
            this.SPAN_AFTER.style.display   = "inline";

            this.INPUT_BEFORE.style.display = "inline";
            this.SPAN_BEFORE.style.display  = "inline";

        }
    }
}


const App = new Application();