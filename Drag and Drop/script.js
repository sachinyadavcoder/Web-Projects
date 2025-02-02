let lists = document.getElementsByClassName("list");
// console.log(lists[3]);

let rightBox = document.getElementById("right");
let leftBox = document.getElementById("left");


for (list of lists) {
    // console.log(list);

    list.addEventListener("dragstart", function (a) {
        let selected = a.target;
        //    console.log(selected);
        rightBox.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        rightBox.addEventListener("drop", function (e) {
            rightBox.appendChild(selected);
            selected = null;
        });
        leftBox.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        leftBox.addEventListener("drop", function (e) {
            leftBox.appendChild(selected);
            selected = null;
        });

    });
}