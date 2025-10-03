var i = 0;
var j = 0;

function loadTrack(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        console.log("error cargando")
        data.callBack(null)
    })
}

function loadImg(data){
    var img = new Image()
    img.onload = function(){
        img.onload = null
        img.onerror = null
        data.callBack(img)
    }
    img.onerror = function(){
        img.onload = null
        img.onerror = null
        data.callBack(null)   
    }
    img.src = data.src
}

function getE(idname){
    return document.getElementById(idname)
}

var load_item = 0
var audios_fotos = []

function loadItems(){
    if(load_item==items_data.length){
        getE('sonido-btn').setAttribute('onclick','clickSonido()')
        setCintaItems()
        activateSCroll()
        getE('cinta-wrap').addEventListener('mousemove', moveScroll, true)
        getE('cinta-wrap').addEventListener('mouseleave', outScroll, true)

        getE('picture-img').getElementsByTagName('img')[0].src = 'assets/fotos/'+items_data[0].id+'.jpg'
        getE('cinta-item-'+items_data[0].id).className = 'cinta-item-active'
        unsetLoader()
    }else{
        loadItem()
    }
}


function loadItem(){
    loadImg({src:'assets/fotos/'+items_data[load_item].id+'.jpg', callBack: function(){
        loadTrack({src: 'assets/audios/'+items_data[load_item].id+'.mp3', callBack: function(data){
            audios_fotos.push(data)
            load_item++
            loadItems()
        }})
    }})
}


function setCintaItems(){
    for(i = 0;i<items_data.length;i++){
        var div_item = document.createElement('div')
        div_item.id = 'cinta-item-'+items_data[i].id
        div_item.className = 'cinta-item'
        div_item.innerHTML = '<div class="cinta-item-picture" onclick="clickCintaItem('+i+')" onmouseenter="overCintaItem('+i+')" onmouseleave="outCintaItem('+i+')"><img src="assets/fotos/'+items_data[i].id+'.jpg" /></div>'

        getE('cinta-wrapper').appendChild(div_item)
    }
} 

var over_item = -1

function overCintaItem(ite){
    over_item = ite
    getE('cinta-tooltip-txt').innerHTML = items_data[ite].peligro
    over_mp3.play()
}

function outCintaItem(ite){
    over_item = -1
}

var click_item = 0
var animacion_click_item = null
var animating_click_item = false

function clickCintaItem(ite){
    if(!animating_click_item){
        animating_click_item = true

        getE('cinta-item-'+items_data[click_item].id).removeAttribute('class')
        audios_fotos[click_item].pause()
        getE('modal').className = 'modal-off'
        getE('picture-img').className = 'picture-img-off'
        click_mp3.play()

        animacion_click_item = setTimeout(function(){
            clearTimeout(animacion_click_item)
            animacion_click_item = null
    
            click_item = ite
            getE('picture-img').getElementsByTagName('img')[0].src = 'assets/fotos/'+items_data[ite].id+'.jpg'
            getE('cinta-item-'+items_data[ite].id).className = 'cinta-item-active'

            getE('modal-body-txt1').innerHTML = '<p><span>Riesgo: </span>'+items_data[ite].riesgo+'</p>'
            var txt2 = "<p>Medidas de control:</p>"
            txt2+='<ul>'
            for(i = 0;i<items_data[ite].medidas.length;i++){
                txt2+='<li>'+items_data[ite].medidas[i]+'</li>'
            }
            txt2+='</ul>'
            getE('modal-body-txt2').innerHTML = txt2
            getE('modal-body-txt1').innerHTML = '<p><span>👤 Responsable:</span> '+items_data[i].responsable+'</p>'
    
            getE('modal').className = 'modal-on'
            getE('picture-img').className = 'picture-img-on'
            animating_click_item = false

            audios_fotos[ite].currentTime = 0
            audios_fotos[ite].play()
            transicion_mp3.play()
        },1000)
    }
}