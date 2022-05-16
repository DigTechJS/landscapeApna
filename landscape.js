

const ns="http://www.w3.org/2000/svg";
const outerRect= document.getElementById("outer");
const terrain= document.getElementById("terrain");
const MAX_WIDTH= +outerRect.getAttributeNS(null,'width');
const MIN_HEIGHT= +terrain.querySelector('rect').getAttributeNS(null,'y');
const MAX_HEIGHT= +outerRect.getAttributeNS(null,'height');
const pineElement=document.querySelector('#pine path');
const pineButton=document.getElementById('createPines');
const oak=document.querySelector('#oak');
const addOak=document.getElementById('addOak');
const treeButtons=document.getElementById('treeButtons');
let myTrees=[];
treeButtons.addEventListener('click',treeDispatcher);

function treeDispatcher(e){
    switch(e.target.id){

        case 'pineButton':
            createPineTrees();
            break;
        case 'removeTrees':
            removeAlltrees();
            break;
        case 'addOak':
            createOaks();
            break;
        default:
            return;
            

    }

}


// addOak.addEventListener('click',createOaks);


function setSVGAttributes(element,obj){
    for(const prop in obj){
        element.setAttributeNS(null,prop,obj[prop]);
    }
}


function createOaks(){
    for(let j=0;j<20;j++){

    
    const newElement= oak.cloneNode(true);
    newElement.removeAttributeNS(null,'id');
    newElement.setAttributeNS(null,'class','generatedOak');
    const x=getRandom(MAX_WIDTH,1);
    const y=getRandom(MAX_HEIGHT,MIN_HEIGHT);
    setSVGAttributes(newElement,{class:'generatedOak','data-yaxis':y})
    const rect=newElement.getElementsByTagName('rect')[0];
    newElement.setAttributeNS(null,'data-yAxis',y);
    setSVGAttributes(rect,{x:x,y:y});
    // rect.setAttributeNS(null,'x',x);
    // rect.setAttributeNS(null,'y',y);
    // newElement.setAttributeNS(null,'data-yAxis',y);
    const ellipses=newElement.getElementsByTagName('ellipse');
    for(let i=0;i<ellipses.length;i++){
        // ellipses[i].setAttributeNS(null,'cx',((i+1)*10)+x-20);
        // ellipses[i].setAttributeNS(null,'cy',getRandom(y-10,y+10));
        setSVGAttributes(ellipses[i],{cx:((i+1)*10)+x-20,cy:getRandom(y-10,y+10)})
    }    

    // terrain.appendChild(newElement);
    myTrees.push(newElement);
    }
    console.log(myTrees);
    orderByYAxis();
}

function orderByYAxis(){
    const sortedTrees=myTrees.sort(function(a,b){
        const ay=a.dataset.yAxis;
        const by=b.dataset.yAxis;
        if (ay>by) return 1;
        else if (by>ay) return -1;
        else return 0;
        
    })
    console.log(sortedTrees);
    for(const prop of sortedTrees){
        terrain.appendChild(prop);
    }
}


// pineButton.addEventListener('click',createPineTrees);

function createPineTrees(){

    for(let i=0; i<20;i++){
        const pineClone=pineElement.cloneNode();
        const x=getRandom(MAX_WIDTH,1)+30;
        const y=getRandom(MAX_HEIGHT,MIN_HEIGHT)+30;
        const randomWidth=getRandom(100,50);
        setSVGAttributes(pineClone,{class:'generatesPine',d:`M${x},${y}, ${x-randomWidth},${y} ${x-randomWidth/2} ${y-randomWidth*1.5} ,Z`,'data-yAxis':y})
        // pineClone.setAttributeNS(null,'class','generatedPine');
        // pineClone.setAttributeNS(null,'d',`M${x},${y}, ${x-randomWidth},${y} ${x-randomWidth/2} ${y-randomWidth*1.5} ,Z`);
        // pineClone.setAttributeNS(null,'data-yaxis',y);
        // terrain.appendChild(pineClone);
        myTrees.push(pineClone);

    }
    console.log(myTrees);
    orderByYAxis();
};

function getRandom(max,min){
    return Math.floor(Math.random() *(max-min+1))+ min;
}

// document.getElementById('removeTrees').addEventListener('click',removeAlltrees);

function removeAlltrees(){
    // const allPines=terrain.querySelectorAll('.generatedPine');
    for(const prop of myTrees){
        terrain.removeChild(prop);
        // myTrees.pop(prop);
    }
    myTrees=[];
}


document.getElementById('save').addEventListener('click',saveImage);

function saveImage(e){
    const {format}=e.target.dataset;
    if (format){
        const svgData=document.getElementById('svg').outerHTML;
    let name=document.getElementById('fileName').value;
    if (name.length<1) {
        name="unnamed";
    }
    const svgBlob= new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgURL=URL.createObjectURL(svgBlob);
    if(format==='png'){
        convertAndDownloadPNG(name,svgURL,format);

    }
    else{
        downloadImg(name,format,svgURL);
    }
}
    
}


function convertAndDownloadPNG(name,svgURL,format){
 

    const img= new Image();
    img.src=svgURL;
    img.onload=(()=>{
        const canvas= document.createElement('canvas');
        canvas.width=1682;
        canvas.height=672;
        const context=canvas.getContext('2d');
        context.drawImage(img,0,0);
        const href=canvas.toDataURL('image/png');
        downloadImg(name,format,href);

    })
}

function downloadImg(name,type,href){
    const downloadLink=document.createElement('a');
    downloadLink.href=href;
    downloadLink.download=`${name}.${type}`;
    // console.log(downloadLink);
    downloadLink.onClick=(e)=>{
        setTimeout(()=>{
            URL.revokeObjectURL(this.href);
            console.log("revoked Obejct URL ");
        },1000)
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}