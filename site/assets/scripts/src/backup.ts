const setter = document.querySelector<HTMLButtonElement>("#set")
const getter = document.querySelector<HTMLButtonElement>("#get")
const ioArea = document.querySelector<HTMLTextAreaElement>("#io-data")
let data: string[];
setter?.addEventListener('click', () => {
    if(confirm("Do u want rewrite all data?"))
        if (ioArea?.value.includes("@@@")) data = ioArea?.value.split('@@@');
    console.log(data)
    localStorage.setItem('USER_NOTES', data[0]);
    localStorage.setItem('USER_TAGS', data[1]);
})

getter?.addEventListener('click', () => {
    if (ioArea) ioArea.textContent=(localStorage.getItem('USER_NOTES') as string)+"@@@"+(localStorage.getItem('USER_TAGS') as string);
})