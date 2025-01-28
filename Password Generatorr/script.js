const genBtn =document.querySelector(".btn1");
const copyBtn =document.querySelector(".btn2");


console.log(genBtn);
console.log(copyBtn);
console.log(password);

genBtn.addEventListener('click',()=>genPassword());
copyBtn.addEventListener('click',()=>copyPassword());

function genPassword() {
    let chars ="*0123456789!@#$%^&ABCDEF`?GHIJ~KLMNOPQ RSTUVWXYZabcdef_ghijklmnopqrstuvwxyz";
    passwordLength=7;
    password="";

    for (let i = 0; i < passwordLength; i++) {
       let randomNumber = Math.floor(Math.random()*chars.length)
        password += chars.substring(randomNumber,randomNumber + 1);
        // console.log(randomNumber);
        // console.log(randomNumber +1);
    }
    document.getElementById("password").value =password;
   
}

function copyPassword() {
    let copyText = document.getElementById("password");
    copyText.select();
    document.execCommand("copy");
}
