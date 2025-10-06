var animacion_scroll = null;
var final_y = 0;

function moveScroll(event){
    var mousey =  (event.pageY) - getE('cinta').getBoundingClientRect().top
    //console.log(mousey)
    var percent = (mousey * 100) / getE('cinta').getBoundingClientRect().height

    var rango = getE('cinta-wrapper').getBoundingClientRect().height - getE('cinta-wrap').getBoundingClientRect().height
    var percent_rango = (rango * percent) / 100
    
    final_y = 0 - percent_rango
}

var out_scroll = true;
function outScroll(){
    getE('cinta-top-btn').className = ''
    getE('cinta-bottom-btn').className = ''
    out_scroll = true;
}

function overSCroll(){
    out_scroll = false;
}

function activateSCroll(){
    animacion_scroll = setInterval(function(){
        var pos = getY(getE('cinta-wrapper').style.top)
        
        if(out_scroll==false){
            //mirar si arriba o abajo
            if(final_y<pos){
                getE('cinta-top-btn').className = ''
                getE('cinta-bottom-btn').className = 'cinta-bottom-btn-active'
            }else{
                getE('cinta-top-btn').className = 'cinta-top-btn-active'
                getE('cinta-bottom-btn').className = ''
            }
        }
        
        var dify = (pos - final_y) / 5
    
        getE('cinta-wrapper').style.top = (pos - dify)+'px'

        //tooltip
        if(over_item!=-1){
            var item_div = getE('cinta-item-'+items_data[over_item].id)
            var y_item = (getE('cinta-top-btn').getBoundingClientRect().height + item_div.getBoundingClientRect().top - (item_div.getBoundingClientRect().height / 2))
            //console.log(y_item)
            getE('cinta-tooltip').style.top = y_item+'px'
            getE('cinta-tooltip').className = 'cinta-tooltip-on'
        }else{
            getE('cinta-tooltip').className = 'cinta-tooltip-off'
        }


    }, 50)
}

function getY(top){
    var pos = top.replace("px","")
    var pos2 = Number(pos)
    return pos2
}

