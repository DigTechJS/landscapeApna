document.addEventListener('DOMContentLoaded',function(){
    const outerRect= document.getElementById("outer");
    const terrain= document.getElementById("terrain");
    const MAX_WIDTH= +outerRect.getAttributeNS(null,'width');
    const MIN_HEIGHT= +terrain.querySelector('rect').getAttributeNS(null,'y');
    const MAX_HEIGHT= +outerRect.getAttributeNS(null,'height');
    const pineElement=document.querySelector('#pine');
    const oak=document.querySelector('#oak');
    const treeButtons=document.querySelectorAll('#treeButtons button');
    const saveButtons=document.querySelectorAll("#save button");
    const modalButtons=document.querySelectorAll('#modal-inside .modal-button')
    const downloadPNGButton=document.getElementById('downloadPNG');

    treeGenerator.init(outerRect,terrain,MAX_WIDTH,MIN_HEIGHT,MAX_HEIGHT,pineElement,oak);
    
    for(const prop of treeButtons){
        prop.addEventListener('click',drawTrees);
    }

    for(const prop of saveButtons){
        prop.addEventListener('click',saveImg);
    }

    for(const prop of modalButtons){
        prop.addEventListener('click',popModal)
        
    }

    downloadPNGButton.addEventListener('click',saveImg);

    function drawTrees(){
            switch(this.id){
            case 'addOak':
                treeGenerator.createOaks();
                break;
            case 'pineButton':
                treeGenerator.createPineTrees();
                break;
            case 'removeTrees':
                treeGenerator.removeAlltrees();
                break;
            default:
                return;
        }
    }

    function saveImg(){
        const {format}=this.dataset;
        if(format==='prepng'){
            //pop up modal
            popModal();
            
        }
        else{
            
            // console.log(svgData);
            const name=document.getElementById('fileName').value;
            if (format!=='png') {
                width=1520;
                height=672;
            }
            else{

                width=document.getElementById('png-width').value;
                height=document.getElementById('png-height').value;
            }
            const svgData2=document.getElementById('svg').cloneNode(true)
            svgData2.setAttributeNS(null,'width',width)
            svgData2.setAttributeNS(null,'height',height)
            const svgData=svgData2.outerHTML;
            imageSaver.save(name,format,svgData,width,height);
            
        }
    }

    function popModal(){
        const modal=document.getElementById('modal');
        
        modal.classList.toggle('closed');
        
    }
});


treeGenerator={
    init(outerRect,terrain,MAX_WIDTH,MIN_HEIGHT,MAX_HEIGHT,pineElement,oak){
        this.outerRect=outerRect;
        this.terrain=terrain;
        this.MAX_WIDTH=MAX_WIDTH;
        this.MIN_HEIGHT=MIN_HEIGHT;
        this.MAX_HEIGHT=MAX_HEIGHT;
        this.pineElement=pineElement;
        this.oak=oak;
        this.myTrees=[];
        this.treeButtons=treeButtons;

    },

    createOaks(){
        for(let j=0;j<20;j++){
            const newElement= this.oak.cloneNode(true);
            newElement.removeAttributeNS(null,'id');
            newElement.setAttributeNS(null,'class','generatedOak');
            const x=this.getRandom(this.MAX_WIDTH,1);
            const y=this.getRandom(this.MAX_HEIGHT,this.MIN_HEIGHT);
            this.setSVGAttributes(newElement,{class:'generatedOak','data-yaxis':y})
            const rect=newElement.getElementsByTagName('rect')[0];
            newElement.setAttributeNS(null,'data-yAxis',y);
            this.setSVGAttributes(rect,{x:x,y:y});
            const ellipses=newElement.getElementsByTagName('ellipse');
            for(let i=0;i<ellipses.length;i++){
                this.setSVGAttributes(ellipses[i],{cx:((i+1)*10)+x-20,cy:this.getRandom(y-10,y+10)})
            }
            this.myTrees.push(newElement);
            }
            // console.log(this.myTrees);
            const sortedTrees=this.orderByYAxis(this.myTrees);
            this.appendTreesInOrder(sortedTrees);

    },


    createPineTrees(){
        for(let j=0;j<20;j++){
            const newElement= this.pineElement.cloneNode(true);
            // const pineClone=this.pineElement2.cloneNode();
            newElement.removeAttributeNS(null,'id');
            newElement.setAttributeNS(null,'class','generatesPine');
            const x=this.getRandom(this.MAX_WIDTH,1);
            const y=this.getRandom(this.MAX_HEIGHT,this.MIN_HEIGHT);
            this.setSVGAttributes(newElement,{class:'generatedPine','data-yaxis':y})
            const rect=newElement.getElementsByTagName('rect')[0];
            const path=newElement.getElementsByTagName('path')[0];
            newElement.setAttributeNS(null,'data-yAxis',y);
            const randomWidth=this.getRandom(100,50);
            this.setSVGAttributes(rect,{x:`${x-randomWidth/2}`,y:y});
            this.setSVGAttributes(path,{d:`M${x},${y}, ${x-randomWidth},${y} ${x-randomWidth/2} ${y-randomWidth*1.5} ,Z`,'data-yAxis':y})
            
            this.myTrees.push(newElement);
            }
            // console.log(this.myTrees);
            const sortedTrees=this.orderByYAxis(this.myTrees);
            this.appendTreesInOrder(sortedTrees);
    },


    removeAlltrees(){
        for(const prop of this.myTrees){
            this.terrain.removeChild(prop);
            // myTrees.pop(prop);
        }
        this.myTrees=[];
    },

    appendTreesInOrder(trees){
        for(const prop of trees){
            this.terrain.appendChild(prop);
        }
    },

    setSVGAttributes(element,obj){
        for(const prop in obj){
            element.setAttributeNS(null,prop,obj[prop]);
        }
    },

    getRandom(max,min){
        return Math.floor(Math.random() *(max-min+1))+ min;
    },

    orderByYAxis(trees){
        const sortedTrees=trees.sort(function(a,b){
            const ay=a.dataset.yAxis;
            const by=b.dataset.yAxis;
            if (ay>by) return 1;
            else if (by>ay) return -1;
            else return 0;
            
        });
        // console.log(sortedTrees);
        return sortedTrees;
    },

    
}

const imageSaver={

    save(name,format,svgData,width,height){
        this.name=name;
        this.format=format;
        this.svgData=svgData;
        this.parseImage();
        this.width=width;
        this.height=height;
        
    },
    
    parseImage(){
        
        
        if (this.name.length<1) {
            this.name="unnamed";
        }
        // this.setSVGAttributes(null, {width:this.width,height:this.height});
        
        const svgBlob= new Blob([this.svgData], {type: 'image/svg+xml'});
        const svgURL=URL.createObjectURL(svgBlob);
        if(this.format==='png'){
            this.convertToPNG(svgURL)
            .then(href=>this.downloadImg(href))    }
        else{
            this.downloadImg(svgURL);
        }
                
    },

    convertToPNG(svgURL){
        return new Promise((resolve,reject) => {
            const img= new Image();
            img.src=svgURL;
            img.onload=(()=>{
            const canvas= document.createElement('canvas');
            canvas.width=this.width;
            canvas.height=this.height;
            // document.getElementById('png-width').value=1520;
            const context=canvas.getContext('2d');
            context.drawImage(img,0,0);
            const href=canvas.toDataURL('image/png');
            resolve(href);
        })
        })
    },

    downloadImg(href){
        
        
        const downloadLink=document.createElement('a');
    downloadLink.href=href;
    downloadLink.download=`${this.name}.${this.format}`;
    // console.log(downloadLink);
    downloadLink.onClick=function(e){
        setTimeout(()=>{
            URL.revokeObjectURL(this.href);
        },1000)
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    document.getElementById('png-width').value=1520;
    document.getElementById('png-height').value=672;


    }
};