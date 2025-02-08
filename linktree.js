class Application{
    constructor(){
        //➀Elementを取得
        //➁Radiobuttonに応じて、Elementを表示
        this.setRadioEvent();
    }

    setRadioEvent(){
        const RADIO_BUTTONS = document.querySelectorAll('input[name="option"]')
        for(let radio of RADIO_BUTTONS){
            console.log(radio);
            radio.addEventListener("change",()=>{
                this.hideRadioExtraElem();
                
                if(radio.value == "after~"){
                    document.getElementById("dateAfter").style.display = "inline";
                    document.getElementById("explainDateAfter").style.display = "inline";
                    document.getElementById("enterBtn").style.display = "inline";
                }else if(radio.value == "~before"){
                    document.getElementById("dateBefore").style.display = "inline-block";
                    document.getElementById("explainDateBefore").style.display = "inline-block";
                    document.getElementById("enterBtn").style.display = "inline-block";
                }else if(radio.value=="after~before"){
                    document.getElementById("dateAfter").style.display = "inline";
                    document.getElementById("explainDateAfter").style.display = "inline";

                    document.getElementById("dateBefore").style.display = "inline";
                    document.getElementById("explainDateBefore").style.display = "inline";

                    document.getElementById("enterBtn").style.display = "inline";
                }
            })
        }


        document.querySelectorAll('input[name="color"]').forEach(radio => {
            radio.addEventListener("change", function() {
              document.getElementById("selectedColor").textContent = "選択された色: " + this.value;
            });
          });
    }

    hideRadioExtraElem(){
        document.getElementById("dateAfter").style.display = "none";
        document.getElementById("explainDateAfter").style.display = "none";

        document.getElementById("dateBefore").style.display = "none";
        document.getElementById("explainDateBefore").style.display = "none";

        document.getElementById("enterBtn").style.display = "none";
    }
}


const App = new Application();
