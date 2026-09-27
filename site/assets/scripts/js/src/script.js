import { tagButtonAction, addTags } from './dialogFunctions.js';
import { loadNotes } from './getData.js';
import { addNote } from './setData.js';
let Note = { name: "Анна", tags: [], type: "", data: "" };
// Используем let, так как в JS-коде ты переназначаешь этот буфер ниже
let fragment = document.createDocumentFragment();
//=========================================//debug
//addNoteDialog?.showModal();
//=========================================//обработка нажатия на кнопку выбора тегов
addTags();
const tagsButton = document.querySelector("#tag-button");
tagsButton?.addEventListener('click', () => {
    tagButtonAction(tagsButton);
});
//=========================================//определение нажатых тегов
const tagListDiv = document.querySelector("#tag-list");
tagListDiv?.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('some-tag')) {
        const selectedTagName = target.dataset.name;
        console.log(`клик по тегу: ${selectedTagName}`);
        target.classList.toggle('selected-tag-active');
        Note.tags.push(selectedTagName ?? "!ERROR!"); //возможна проблема : теги только добавляются, но не удаляются при отмене пользователем
    }
});
//=========================================//открытие модального окна добавления заметки
const addNoteDialog = document.querySelector("#note-dialog");
const addNoteButton = document.querySelector(".add-new-note");
addNoteButton?.addEventListener('click', () => {
    console.log("show modal");
    addNoteDialog?.showModal();
});
//=========================================//закрытие модального окна добавления заметки
const closeDialog = document.querySelector("#close-dialog");
closeDialog?.addEventListener('click', () => {
    console.log("close dialog");
    addNoteDialog?.close();
});
//=========================================//обработка кликов по кнопкам типов
const textButton = document.querySelector("#type-text-button");
const textInput = document.querySelector("#text-input-div");
const topButton = document.querySelector("#type-top-button");
const topInput = document.querySelector("#top-input-div");
const tableButton = document.querySelector("#type-table-button");
const tableInput = document.querySelector("#table-input-div");
const submitButton = document.querySelector("#submit-button");
textButton?.addEventListener('click', () => {
    console.log("text Button click");
    Note.type = "text";
    submitButton?.classList.remove('hidden');
    topButton?.classList.remove("current-type-button");
    tableButton?.classList.remove("current-type-button");
    textButton?.classList.add("current-type-button");
    topInput?.classList.add("hidden");
    tableInput?.classList.add("hidden");
    textInput?.classList.remove("hidden");
});
topButton?.addEventListener('click', () => {
    console.log("top Button click");
    Note.type = "top";
    submitButton?.classList.remove('hidden');
    topButton?.classList.add("current-type-button");
    tableButton?.classList.remove("current-type-button");
    textButton?.classList.remove("current-type-button");
    topInput?.classList.remove("hidden");
    tableInput?.classList.add("hidden");
    textInput?.classList.add("hidden");
});
tableButton?.addEventListener('click', () => {
    console.log("table Button click");
    Note.type = "table";
    submitButton?.classList.remove('hidden');
    topButton?.classList.remove("current-type-button");
    tableButton?.classList.add("current-type-button");
    textButton?.classList.remove("current-type-button");
    topInput?.classList.add("hidden");
    tableInput?.classList.remove("hidden");
    textInput?.classList.add("hidden");
});
submitButton?.addEventListener('click', () => {
    switch (Note.type) {
        case "text":
            Note.data = document.querySelector('#text-input-item')?.value ?? 'DATA_ERROR';
            Note.name = document.querySelector('#input-name')?.value ?? 'NAME_ERROR';
            break;
        default:
            break;
    }
    let newNote = {
        name: Note.name,
        type: Note.type,
        tags: Note.tags,
        book: 0,
        create: Date.now(),
        change: Date.now(),
        id: 0,
        data: Note.data
    };
    addNoteOnScreen(addNote(loadNotes(), newNote));
    addNoteDialog?.close();
});
//=========================================//изменение высоты textarea
const textarea = document.querySelector('#text-input-item');
textarea?.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    if (addNoteDialog) {
        if (addNoteDialog.scrollHeight > addNoteDialog.clientHeight) {
            addNoteDialog.classList.add('has-scroll');
        }
        else {
            addNoteDialog.classList.remove('has-scroll');
        }
    }
});
//=========================================//функция вывода одной заметки на экран
const addNoteOnScreen = (note) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('note');
    const noteInfo = document.createElement('div');
    noteInfo.classList.add('note-info');
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
    noteCreate.textContent = "\t" + new Date(note.create).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
    const noteChange = document.createElement('p');
    noteChange.classList.add('note-change');
    noteChange.textContent = "\t" + new Date(note.change).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
    const noteTags = document.createElement('p');
    noteTags.classList.add('note-tags');
    noteTags.textContent = "\t" + note.tags.join(' | ');
    noteInfo.append(noteName, noteType, noteCreate, noteChange, noteTags);
    cardElement.append(noteInfo, noteData);
    fragment.append(cardElement);
    const board = document.querySelector('#note-space');
    board?.append(fragment);
};
//=========================================//функция вывода всех заметок на экран
const addAllNotesOnScreen = (activeNotes) => {
    activeNotes.forEach(note => {
        addNoteOnScreen(note);
    });
    const board = document.querySelector('#note-space');
    board?.append(fragment);
};
addAllNotesOnScreen(loadNotes());
