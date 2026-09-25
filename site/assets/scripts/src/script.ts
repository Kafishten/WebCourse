interface INote {
    name:string;
    type:string;
    tags:string[];
    create:number;
    change:number;
    book:number;
    id:number;
}

let notesData:INote[] = [];
const checkNotes = () => {
    if (localStorage.getItem('USER_NOTES') == null)
    {
        console.log("notes not found")
        console.log("Adding first note...")
        notesData = [
            {
                name:"Hello World!",
                type:"note",
                tags:["someTag"],
                book:0,
                create:Date.now(),
                change:Date.now(),
                id:0}
        ]   
        const jsonString = JSON.stringify(notesData); 
        localStorage.setItem('USER_NOTES', jsonString); 
        console.log("Ok")
    }
    else {console.log("notes found")}
}


const loadNotes = (): INote[] => {
    // 1. Пытаемся достать строку по ключу
    const savedString = localStorage.getItem('USER_NOTES');

    // 2. Если друг открыл сайт ВПЕРВЫЕ, ключа еще нет, вернется null
    if (savedString === null) {
        return []; // Возвращаем пустой массив
    }

    // 3. Десериализуем (превращаем мертвую строку обратно в живые объекты TypeScript)
    // Важно: JSON.parse возвращает тип 'any', поэтому мы жестко указываем 'as Note[]'
    const parsedNotes = JSON.parse(savedString) as INote[];
    
    return parsedNotes;
};

// Вызываем при старте приложения
checkNotes();
const activeNotes = loadNotes();






const board = document.querySelector<HTMLDivElement>('#note-space');
const fragment = document.createDocumentFragment();
const addNoteButton = document.querySelector<HTMLButtonElement>(".add-new-note");
const closeDialog = document.querySelector<HTMLButtonElement>("#close-dialog");
const addNoteDialog = document.querySelector<HTMLDialogElement>("#note-dialog");

addNoteDialog?.showModal();
addNoteButton?.addEventListener('click',() => {
    console.log("show modal")
    addNoteDialog?.showModal();
})

closeDialog?.addEventListener('click',() => {
    console.log("close dialog")
    addNoteDialog?.close();
})

const textButton = document.querySelector<HTMLButtonElement>("#type-text-button");
const topButton = document.querySelector<HTMLButtonElement>("#type-top-button");
const tableButton = document.querySelector<HTMLButtonElement>("#type-table-button");
textButton?.addEventListener('click',() => {
    console.log("text Button click")
    topButton?.classList.remove("current-type-button")
    tableButton?.classList.remove("current-type-button")
    textButton?.classList.add("current-type-button")
})
topButton?.addEventListener('click',() => {
    console.log("text Button click")
    topButton?.classList.add("current-type-button")
    tableButton?.classList.remove("current-type-button")
    textButton?.classList.remove("current-type-button")
})
tableButton?.addEventListener('click',() => {
    console.log("text Button click")
    topButton?.classList.remove("current-type-button")
    tableButton?.classList.add("current-type-button")
    textButton?.classList.remove("current-type-button")
})

activeNotes.forEach(note => {
    
    const cardElement = document.createElement('div');
    cardElement.classList.add('note');

    const noteInfo = document.createElement('div');
    noteInfo.classList.add('note-info');

    const noteData = document.createElement('div');
    noteData.classList.add('note-data');
    noteData.classList.add('can-be-selected');
    noteData.textContent="data";

    const noteName = document.createElement('h2');
    noteName.classList.add('note-name');
    noteName.textContent=note.name;

    const noteType = document.createElement('p');
    noteType.classList.add('note-type');
    noteType.textContent="\t"+note.type;

    const noteCreate = document.createElement('p');
    noteCreate.classList.add('note-create');
    noteCreate.textContent = "\t"+new Date(note.create).toLocaleDateString("ru-RU",{
        year:"numeric",
        month: "short",   // Выведет слово "сентября" вместо числа
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const noteChange = document.createElement('p');
    noteChange.classList.add('note-change');
    noteChange.textContent="\t"+new Date(note.change).toLocaleDateString("ru-RU",{
        year:"numeric",
        month: "short",   // Выведет слово "сентября" вместо числа
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const noteTags = document.createElement('p');
    noteTags.classList.add('note-tags');
    noteTags.textContent="\t"+note.tags.join(' | ');

    noteInfo.append(noteName,noteType,noteCreate,noteChange,noteTags);
    cardElement.append(noteInfo,noteData)
    fragment.append(cardElement);
});
board?.append(fragment)
