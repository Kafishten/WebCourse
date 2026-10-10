import { tagButtonAction, addTags } from './dialogFunctions.js';
import { loadNotes, INote, loadTags} from './getData.js';



addTags();
const tagsButton = document.querySelector<HTMLButtonElement>("#tag-button");
tagsButton?.addEventListener('click', () => {
    tagButtonAction(tagsButton);
});

//=========================================// Визуальное переключение тегов
const tagListDiv = document.querySelector<HTMLDivElement>("#tag-list");
tagListDiv?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('some-tag')) {
        target.classList.toggle('selected-tag-active'); 
    }
});
//=========================================// Визуальное переключение тегов

//=========================================// Открытие модалки (Создание НОВОЙ)
const addNoteDialog = document.querySelector<HTMLDialogElement>("#note-dialog");
const addNoteButton = document.querySelector<HTMLButtonElement>(".add-new-note");

document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('current-type-button'));
    document.querySelector('#type-top-button')?.classList.add('current-type-button');
    document.querySelectorAll('.input-div').forEach(div => div.classList.add('hidden'));
    document.querySelector('#top-input-div')?.classList.remove('hidden');


addNoteButton?.addEventListener('click', () => {
    console.log("show modal (NEW)");
    
    // Сбрасываем форму в дефолт
    const nameInput = document.querySelector<HTMLInputElement>('#input-name');
    const dataInput = document.querySelector<HTMLInputElement>('#text-input-item');
    if (nameInput) nameInput.value = "New Note";
    if (dataInput) dataInput.value = "";
    const tiers = document.querySelectorAll<HTMLDivElement>('.some-tier');
    const tierDefault = document.querySelector<HTMLDivElement>('.card-text');
    tiers.forEach(i=>{
        i.textContent="";
    })
    if (tierDefault) tierDefault.textContent="";


    document.querySelectorAll('.selected-tag-active').forEach(tag => tag.classList.remove('selected-tag-active'));
    

    document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('current-type-button'));
    document.querySelector('#type-top-button')?.classList.remove('current-type-button');
    document.querySelectorAll('.input-div').forEach(div => div.classList.add('hidden'));
    document.querySelector('#top-input-div')?.classList.add('hidden');


    if (addNoteDialog) addNoteDialog.dataset.editId = "";

    document.querySelector<HTMLButtonElement>('#submit-button')?.classList.add("hidden");
    addNoteDialog?.showModal();
});


//=========================================// Обработка кнопок типов
const textButton = document.querySelector<HTMLButtonElement>("#type-text-button");
const textInput = document.querySelector<HTMLDivElement>("#text-input-div");
const topButton = document.querySelector<HTMLButtonElement>("#type-top-button");
const topInput = document.querySelector<HTMLDivElement>("#top-input-div");
const tableButton = document.querySelector<HTMLButtonElement>("#type-table-button");
const tableInput = document.querySelector<HTMLDivElement>("#table-input-div");
const submitButton = document.querySelector<HTMLButtonElement>("#submit-button");

// Функция переключения типов
const switchType = (typeBtn: HTMLElement | null, activeInput: HTMLElement | null) => {
    document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('current-type-button'));
    typeBtn?.classList.add("current-type-button");
    
    document.querySelectorAll('.input-div').forEach(div => div.classList.add('hidden'));
    activeInput?.classList.remove("hidden");
    submitButton?.classList.remove('hidden');
}

textButton?.addEventListener('click', () => 
    {
        if (addNoteDialog) addNoteDialog.classList.remove('has-scroll');
        switchType(textButton, textInput);
    });

topButton?.addEventListener('click', () => {
        switchType(topButton, topInput);
        if (addNoteDialog) addNoteDialog.classList.add('has-scroll');
    });
tableButton?.addEventListener('click', () => 
    {
        if (addNoteDialog) addNoteDialog.classList.remove('has-scroll');
        switchType(tableButton, tableInput);
    });


const parseTierListToJSON = (): string => {

    const tierData: Record<string, string[]> = {};

    const tiers = document.querySelectorAll<HTMLDivElement>('.some-tier');
    
    tiers.forEach(tier => {

        let tierLetter = "unknown";
        if (tier.classList.contains('s-tier')) tierLetter = "s";
        else if (tier.classList.contains('a-tier')) tierLetter = "a";
        else if (tier.classList.contains('b-tier')) tierLetter = "b";
        else if (tier.classList.contains('c-tier')) tierLetter = "c";
        else if (tier.classList.contains('d-tier')) tierLetter = "d";
        else if (tier.classList.contains('e-tier')) tierLetter = "e";
        else if (tier.classList.contains('f-tier')) tierLetter = "f";

        const cardsContent: string[] = [];

        const cards = tier.querySelectorAll<HTMLDivElement>('.tier-card');

        cards.forEach(card => {

            const img = card.querySelector<HTMLImageElement>('img.card-image');
            if (img && img.src) {

                if (img.classList.contains("big-image"))
                        cardsContent.push(`img:big:${img.src}`);
                else cardsContent.push(`img:${img.src}`);
            } else {

                const textDiv = card.querySelector<HTMLDivElement>('.card-text');
                if (textDiv && textDiv.innerText.trim() !== "") {
                    cardsContent.push(textDiv.innerText.trim());
                }
            }
        });
        

        tierData[tierLetter] = cardsContent;
    });

    return JSON.stringify(tierData);
};

//=========================================// ГЛАВНЫЙ КОНВЕЙЕР СОХРАНЕНИЯ (SUBMIT)
submitButton?.addEventListener('click', () => {
    const allNotes = loadNotes();
    let data : string ="";

    const name = document.querySelector<HTMLInputElement>('#input-name')?.value ?? 'Без названия';

    
    
    const activeTagElements = document.querySelectorAll('.selected-tag-active');
    const tags = Array.from(activeTagElements).map(el => el.id);
    if (tags.length === 0) tags.push('default');


    let type = "text";
    if (topButton?.classList.contains('current-type-button')) type = "top";
    if (tableButton?.classList.contains('current-type-button')) type = "table";

    switch (type) {
        case "text":
            data = document.querySelector<HTMLTextAreaElement>('#text-input-item')?.value ?? '';
            break;
        case "top":
            data = parseTierListToJSON();
            break;
    
        default:
            break;
    }

const editId = addNoteDialog?.dataset.editId;

    if (editId) {

        const index = allNotes.findIndex(n => n.create.toString() === editId);
        if (index !== -1) {
            allNotes[index].name = name;
            allNotes[index].data = data;
            allNotes[index].tags = tags;
            allNotes[index].type = type;
            allNotes[index].change = Date.now(); // Меняем только дату изменения!
        }
    } else {

        const newNote: INote = {
            name: name,
            data: data,
            tags: tags,
            type: type,
            create: Date.now(),
            change: Date.now(),
        };
        allNotes.push(newNote);
    }


    localStorage.setItem('USER_NOTES', JSON.stringify(allNotes));
    
    const board = document.querySelector<HTMLDivElement>('#note-space');
    if (board) board.innerHTML = ''; 
    
    addAllNotesOnScreen(allNotes);
    addNoteDialog?.close();
});



const closeDialog = document.querySelector<HTMLButtonElement>("#close-dialog");
closeDialog?.addEventListener('click', () => {
    addNoteDialog?.close();
});


const getDataById=(id:string,notes:INote[]) => {
    return notes.find(i => i.create.toString() === id);
}


const filterNotes = (notes: INote[], searchQuery: string): INote[] => {
    const query = searchQuery.trim().toLowerCase();
    

    if (!query) return notes;


    const tokens = query.split(/\s+/);

    return notes.filter(note => {

        return tokens.every(token => {
            

            if (token.startsWith('tag:')) {
                const targetTag = token.replace('tag:', '');

                return note.tags.some(t => t.toLowerCase() === targetTag);
            }
            

            if (token.startsWith('type:')) {
                const targetType = token.replace('type:', '');
                return note.type.toLowerCase() === targetType;
            }

            if (token.startsWith('create:')) {
                const targetDate = token.replace('create:', '');
                return new Date(note.create).toLocaleDateString("ru-RU",
                    { 
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit" }).includes(targetDate) || 
                    new Date(note.create).toLocaleDateString("ru-RU",
                    { 
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour:"2-digit",
                    minute:"2-digit"
                    }).includes(targetDate)
            }




            if (token.startsWith('change:')) {
                const targetDate = token.replace('change:', '');
                return new Date(note.change).toLocaleDateString("ru-RU",
                    { 
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit" }).includes(targetDate) || 
                    new Date(note.change).toLocaleDateString("ru-RU",
                    { 
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour:"2-digit",
                    minute:"2-digit"
                    }).includes(targetDate)
            }

            if (token.startsWith('include:')) {
                const targetText = token.replace('include:', '');
                return note.name.toLowerCase().includes(targetText) || note.data.toLowerCase().includes(targetText);
            }
        });
    });
};

const searchInput = document.querySelector<HTMLInputElement>('#filters');
const board2 = document.querySelector<HTMLDivElement>('#note-space');

searchInput?.addEventListener('input', () => {
    const query = searchInput.value;
    const allNotes = loadNotes(); 
    
    const filteredNotes = filterNotes(allNotes, query);
    

    if (board2) board2.innerHTML = '';
    addAllNotesOnScreen(filteredNotes);
});


const filtringDiv = document.querySelector<HTMLDivElement>('.filtring-button-div')

filtringDiv?.addEventListener('click', (event)=> {
    const target = event.target as HTMLButtonElement;
    if (target.id.includes("filter-"))
    if (searchInput) 
        {
            searchInput.value+=" "+target.id.replace("filter-","")+":";
            searchInput.focus();
        }
})

const filtringButton = document.querySelector<HTMLButtonElement>('.filter-button')
filtringButton?.addEventListener('click', (event)=> {
    if (searchInput) searchInput.value="";
})



//=========================================// ВЫВОД НА ЭКРАН (И КНОПКА РЕДАКТИРОВАНИЯ)
const defaultTierItem = document.querySelector<HTMLDivElement>('.tier-card');
const addNoteOnScreen = (note:INote) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('note');
    cardElement.id = note.create.toString();

    const noteInfo = document.createElement('div');
    noteInfo.classList.add('note-info');
    const noteHeader = document.createElement('div');
    noteHeader.classList.add('note-header');
    const noteActions = document.createElement('div');
    noteActions.classList.add('note-actions');

    const noteDeleteBut = document.createElement('button');
    noteDeleteBut.classList.add('note-actions-button',"note-delete-button");
    noteDeleteBut.id = note.create.toString();
    noteDeleteBut.innerHTML = '<svg class="icon" width="100%" height="100%" viewBox="0 0 24 24"><path d="M19,6 L19,18.5 C19,19.8807119 17.8807119,21 16.5,21 L7.5,21 C6.11928813,21 5,19.8807119 5,18.5 L5,6 L4.5,6 C4.22385763,6 4,5.77614237 4,5.5 C4,5.22385763 4.22385763,5 4.5,5 L9,5 L9,4.5 C9,3.67157288 9.67157288,3 10.5,3 L13.5,3 C14.3284271,3 15,3.67157288 15,4.5 L15,5 L19.5,5 C19.7761424,5 20,5.22385763 20,5.5 C20,5.77614237 19.7761424,6 19.5,6 L19,6 Z M6,6 L6,18.5 C6,19.3284271 6.67157288,20 7.5,20 L16.5,20 C17.3284271,20 18,19.3284271 18,18.5 L18,6 L6,6 Z M14,5 L14,4.5 C14,4.22385763 13.7761424,4 13.5,4 L10.5,4 C10.2238576,4 10,4.22385763 10,4.5 L10,5 L14,5 Z M14,9.5 C14,9.22385763 14.2238576,9 14.5,9 C14.7761424,9 15,9.22385763 15,9.5 L15,16.5 C15,16.7761424 14.7761424,17 14.5,17 C14.2238576,17 14,16.7761424 14,16.5 L14,9.5 Z M9,9.5 C9,9.22385763 9.22385763,9 9.5,9 C9.77614237,9 10,9.22385763 10,9.5 L10,16.5 C10,16.7761424 9.77614237,17 9.5,17 C9.22385763,17 9,16.7761424 9,16.5 L9,9.5 Z"/></svg>';
    

    noteDeleteBut.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLElement;
        const allNotes = loadNotes();
        const index = allNotes.findIndex(n => n.create.toString() === target.id);
        if (index !== -1) {
            allNotes.splice(index, 1);
            localStorage.setItem('USER_NOTES', JSON.stringify(allNotes));
            const board = document.querySelector<HTMLDivElement>('#note-space');
            if (board) board.innerHTML = '';
            addAllNotesOnScreen(allNotes);
        }
    });

    const noteEditBut = document.createElement('button');
    noteEditBut.classList.add('note-actions-button',"note-edit-button");
    noteEditBut.id = note.create.toString();
    noteEditBut.innerHTML = '<svg class="icon" width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M25.384,11.987a.993.993,0,0,1-.707-.293L20.434,7.452a1,1,0,0,1,0-1.414l2.122-2.121a3.07,3.07,0,0,1,4.242,0l1.414,1.414a3,3,0,0,1,0,4.242l-2.122,2.121A.993.993,0,0,1,25.384,11.987ZM22.555,6.745l2.829,2.828L26.8,8.159a1,1,0,0,0,0-1.414L25.384,5.331a1.023,1.023,0,0,0-1.414,0Z"/><path d="M11.9,22.221a2,2,0,0,1-1.933-2.487l.875-3.5a3.02,3.02,0,0,1,.788-1.393l8.8-8.8a1,1,0,0,1,1.414,0l4.243,4.242a1,1,0,0,1,0,1.414l-8.8,8.8a3,3,0,0,1-1.393.79h0l-3.5.875A2.027,2.027,0,0,1,11.9,22.221Zm3.752-1.907h0ZM21.141,8.159l-8.094,8.093a1,1,0,0,0-.262.465l-.876,3.5,3.5-.876a1,1,0,0,0,.464-.263l8.094-8.094Z"/><path d="M22,29H8a5.006,5.006,0,0,1-5-5V10A5.006,5.006,0,0,1,8,5h9.64a1,1,0,0,1,0,2H8a3,3,0,0,0-3,3V24a3,3,0,0,0,3,3H22a3,3,0,0,0,3-3V14.61a1,1,0,0,1,2,0V24A5.006,5.006,0,0,1,22,29Z"/></svg>';
    




    noteEditBut?.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLElement;
        const a = getDataById(target.id, loadNotes());
        if (!a) return;

        const nameInput = document.querySelector<HTMLInputElement>('#input-name');
        if (nameInput) nameInput.value = a.name;
        
        switch (a.type) {
            case "text":
                const dataInput = document.querySelector<HTMLInputElement>('#text-input-item');
                if (dataInput) dataInput.value = a.data;//
                break;

            case "top":
                console.log('top enter');
                const topData = JSON.parse(a.data) as Record<string, string[]>;
                for (const [tierName,tierData] of Object.entries(topData)) {
                    const targetTierDiv = document.querySelector<HTMLDivElement>(`.${tierName}-tier`);
                    if (targetTierDiv)  targetTierDiv.textContent="";
                        console.log(`.${tierName}-tier`)

                        tierData.forEach((cardContent: string) => {
                            
                            const newCard = defaultTierItem?.cloneNode(true) as HTMLDivElement;
                            newCard.id = 'card-' + Date.now().toString() + Math.random().toString(36).substr(2, 5); // Уникальный ID
                            

                            const textDiv = newCard.querySelector<HTMLDivElement>('.card-text');
                            if (cardContent.startsWith('img:')) {
                                newCard.classList.add("image-card");
                                const imgElement = document.createElement('img');
                                let imageUrl : string;
                                if (cardContent.startsWith('img:big:')){
                                imageUrl = cardContent.slice(8).trim();
                                imgElement.classList.add('card-image','big-image')
                                }
                                else {
                                    imageUrl = cardContent.slice(4).trim();
                                    imgElement.className = 'card-image';
                                }
                                imgElement.src = imageUrl;
                                
                                if (textDiv) {
                                    textDiv.textContent = "";
                                    textDiv.append(imgElement);
                                    textDiv.contentEditable = "false";
                                }
                            } else {
                                console.log(textDiv)

                                if (textDiv) {
                                    textDiv.textContent = cardContent;
                                }
                            }
                            console.log(newCard)

                            newCard.addEventListener('dragstart', (event) => {
                                event.dataTransfer?.setData("tier-item", newCard.id);
                            });

                            if (targetTierDiv) targetTierDiv.append(newCard);
                            else console.log("no found")
                        });
                    }
                break;
                
            default:
                break;
        }

        document.querySelectorAll('.selected-tag-active').forEach(tag => tag.classList.remove('selected-tag-active'));
        a.tags.forEach(tag => {
            document.querySelector(`#${tag}`)?.classList.add('selected-tag-active');
        });

        const typeBtn = document.querySelector<HTMLButtonElement>(`#type-${a.type}-button`);
        const typeInput = document.querySelector<HTMLDivElement>(`#${a.type}-input-div`);
        switchType(typeBtn, typeInput);

        if (addNoteDialog) addNoteDialog.dataset.editId = a.create.toString();

        addNoteDialog?.showModal();
    });

    const noteData = document.createElement('div');
    noteData.classList.add('note-data', 'can-be-selected');
    noteData.textContent = note.data;

    const noteName = document.createElement('h2');
    noteName.classList.add('note-name');
    noteName.textContent = note.name;

    const noteType = document.createElement('p');
    noteType.classList.add('note-type');
    noteType.textContent = "\t" + note.type;

    const noteCreate = document.createElement('p');
    noteCreate.classList.add('note-create');
    noteCreate.textContent = "\t" + new Date(note.create).toLocaleDateString("ru-RU", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });

    const noteChange = document.createElement('p');
    noteChange.classList.add('note-change');
    noteChange.textContent = "\t" + new Date(note.change).toLocaleDateString("ru-RU", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });

    const noteTags = document.createElement('p');
    noteTags.classList.add('note-tags');
    noteTags.textContent = "\t" + note.tags.join(' | ');

    noteActions.append(noteDeleteBut, noteEditBut);
    noteHeader.append(noteName, noteActions);
    noteInfo.append(noteHeader, noteChange, noteType, noteTags, noteCreate);
    cardElement.append(noteInfo, noteData);
    
    const board = document.querySelector<HTMLDivElement>('#note-space');
    board?.append(cardElement);
}

const addAllNotesOnScreen = (activeNotes:INote[]) => {
    const sortedNotes = [...activeNotes].sort((a, b) => {

        return b.change - a.change; 
    });
    sortedNotes.forEach(note => addNoteOnScreen(note));
}

addAllNotesOnScreen(loadNotes());

const textarea = document.querySelector<HTMLTextAreaElement>('#text-input-item');
textarea?.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    if (addNoteDialog && addNoteDialog.scrollHeight > addNoteDialog.clientHeight) {
        addNoteDialog.classList.add('has-scroll');
    } else {
        addNoteDialog?.classList.remove('has-scroll');
    }
});


//////////////////////////////////////////////////tier перетаскивания
const defaultTierText = document.querySelector<HTMLDivElement>('#default-input-card');
const deleteSpace = document.querySelector<HTMLDivElement>('.remove-card-div');

deleteSpace?.addEventListener('drop', (event) => {
    deleteSpace.classList.remove('drag-hover')
    const draggedItemId = event.dataTransfer?.getData('tier-item');
    if (draggedItemId) document.getElementById(draggedItemId)?.remove();
});
deleteSpace?.addEventListener('dragover', (event) => {
        event.preventDefault();
        deleteSpace.classList.add('drag-hover')
    });

deleteSpace?.addEventListener('dragleave', (event) => {
        event.preventDefault();
        deleteSpace.classList.remove('drag-hover')
    })



defaultTierItem?.addEventListener('dragstart', (event) => {
    if (defaultTierText) event.dataTransfer?.setData("tier-item",defaultTierText.id);
});

const tierSpaces = document.querySelectorAll<HTMLDivElement>('.some-tier');
tierSpaces.forEach(i => {
    i.addEventListener('dragover', (event) => {
        event.preventDefault();
        i.classList.add('drag-hover')
    });

    i?.addEventListener('dragleave', (event) => {
        event.preventDefault();
        i.classList.remove('drag-hover')
    })

    i?.addEventListener('drop', (event) => {
    event.preventDefault();
    i.classList.remove('drag-hover')
    const draggedItemId = event.dataTransfer?.getData('tier-item');
    if (!draggedItemId) return;
    
    console.log("id "+draggedItemId);
    if(draggedItemId === "default-input-card")
        if (defaultTierText?.textContent?.includes('img:')){
            const img = document.createElement('img');
            img.classList.add('card-image');
            if (defaultTierText?.textContent?.includes('big:'))
            {
                defaultTierText.textContent = defaultTierText.textContent.replace('img:big:','');
                img.classList.add('big-image');
            }
                
            else
                {
                    defaultTierText.textContent = defaultTierText.textContent.replace('img:','');
                } 
            
            img.src=`${defaultTierText.textContent.toString()}`;
            
            defaultTierText.textContent="";
            defaultTierText.append(img);
            
            const newTierItem = defaultTierItem?.cloneNode(true) as HTMLDivElement;
            newTierItem.id = 'card-' + Date.now().toString();
            newTierItem.classList.add("image-card");
            i.append(newTierItem);
            console.log('image well')
            newTierItem?.addEventListener('dragstart', (event) => {
                if (newTierItem) event.dataTransfer?.setData("tier-item",newTierItem.id);
            });
        }
        else {


            const newTierItem = defaultTierItem?.cloneNode(true) as HTMLDivElement;
            newTierItem.id = 'card-' + Date.now().toString();
            newTierItem.classList.add("tier-card");
            i.append(newTierItem);
            newTierItem?.addEventListener('dragstart', (event) => {
                if (newTierItem) event.dataTransfer?.setData("tier-item",newTierItem.id);
            });
        }
        else {

    const oldCard = document.getElementById(draggedItemId);

    if (oldCard) {
        i.append(oldCard); 
    }
}
    

    if (defaultTierText) defaultTierText.textContent="";
});
})

