"use strict";
const setter = document.querySelector("#set");
const getter = document.querySelector("#get");
const ioArea = document.querySelector("#io-data");
let data;
setter?.addEventListener('click', () => {
    if (confirm("Do u want rewrite all data?"))
        if (ioArea?.value.includes("@@@"))
            data = ioArea?.value.split('@@@');
    console.log(data);
    localStorage.setItem('USER_NOTES', data[0]);
    localStorage.setItem('USER_TAGS', data[1]);
});
getter?.addEventListener('click', () => {
    if (ioArea)
        ioArea.textContent = localStorage.getItem('USER_NOTES') + "@@@" + localStorage.getItem('USER_TAGS');
});
//# sourceMappingURL=backup.js.map