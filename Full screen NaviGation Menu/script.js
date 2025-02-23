//menu
const menu= document.querySelector(".menu");
//links
const links= document.querySelectorAll("li");
// highlight
const highlight= document.querySelector(".highlight");
//button
const btn= document.querySelector(".btn");



btn.addEventListener("click", function(){
    if(this.dataset.open ==="close"){
        menu.style.clipPath ="circle(100% at 50% 50%)";
        this.dataset.open="open";
    }else{
        menu.style.clipPath="";
        this.dataset.open="close";
        highlight.style="";
    }
})

links.forEach((link)=>{
    link.addEventListener("pointerover",function(){
        const w=this.offsetWidth,
        h=this.offsetHeight,
        t=this.offsetTop;
        highlight.style.cssText =`transform: translateY(${t}px); width: ${w}px; height:${h}px;`   //cssText to Set multiple CSS properties at once. and Completely overwrite the existing inline styles of the element. Set dynamic styles easily, especially when dealing with variables (like width, height, etc.) in a string.
        
    });
});









// console.log(menu);
// console.log(links);
// console.log(highlight);
// console.log(btn);
