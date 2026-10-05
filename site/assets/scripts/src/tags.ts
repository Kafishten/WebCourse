import {loadTags} from './getData.js';
const currentTags = loadTags();
const tagsTextArea = document.querySelector<HTMLTextAreaElement>("#tags-input-area");
if (tagsTextArea) currentTags.forEach(i => { tagsTextArea.textContent+=i+" "; })

tagsTextArea?.addEventListener('input', ()=> {
    const jsonString = JSON.stringify(tagsTextArea.value.split(" "));
    console.log(jsonString)
    localStorage.setItem('USER_TAGS', jsonString);
})