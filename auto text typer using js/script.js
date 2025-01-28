const typedTextSpan = document.querySelector(".type-text");
const cursor = document.querySelector('.cursor');

console.log(typedTextSpan);
console.log(cursor);

let words =["awesome",'wierd','cool','life','fun','everything','famous','easy'];

const typingDelay=100
const erasingDelay =100
// delay between current and next text
const newLetterDelay =2000;
let index =0;
let charindex =0;
let colorIndex =0;

document.addEventListener('DOMContentLoaded',()=>{
    if (words.length) {
        setTimeout(type,newLetterDelay);
    }
})

//typing function
function type() {
    typedTextSpan.style.color = colors[colorIndex];
    if (charindex<words[index].length) {
        typedTextSpan.textContent += words[index].charAt(charindex);
        charindex++;
        setTimeout(type,typingDelay);
    }else{
        setTimeout(erase,newLetterDelay);
    }
}

// Erasin Function
function erase() {
    
    if (charindex>0) {
        typedTextSpan.textContent=words[index].substring(0,charindex-1);
        charindex--;
        setTimeout(erase,erasingDelay)
    }else{
        index++;
        if (index>=words.length) {
            index = 0;
        }
        colorIndex = index % colors.length;  // Cycle through the colors array
        setTimeout(type,typingDelay+1100);
    }
}

let colors = [
    "gold",       // awesome
    "purple",     // weird
    "blue",       // cool
    "green",      // life
    "yellow",     // fun
    "white",    // everything
    "red",        // famous
    "#ADD8E6"   // easy
  ];
//   console.log(index);
let element = document.querySelector(".type-text");
element.style.color=colors[colorIndex];

  
  
  