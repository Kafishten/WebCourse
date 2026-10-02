//кнопка открытия тегов
import {loadTags } from './getData.js';

export let addTags = () => {
    const activeTags = loadTags();
    const tagListDiv = document.querySelector<HTMLDivElement>("#tag-list");
    let i = 0;
    let fragment = document.createDocumentFragment();
    activeTags.forEach(tag => {
        const someTag = document.createElement('button');
        someTag.classList.add('some-tag');
        someTag.textContent = tag;
        someTag.id = tag;
        fragment.append(someTag);
        //i++;
    });
    tagListDiv?.append(fragment);
}

let isTagsButtonOn = false;

export const tagButtonAction = (tagsButton : HTMLButtonElement, clear: boolean = false) => {
    const tagListDiv = document.querySelector<HTMLDivElement>("#tag-list");
    console.log("tag button click");
    if (!clear){
        if (isTagsButtonOn === true) {
        tagsButton.textContent = "Open tags";
        isTagsButtonOn = false;
        tagsButton.classList.remove("current-type-button");
        tagListDiv?.classList.add("hidden");
    } else {
        tagsButton.textContent = "Choose tags:";
        isTagsButtonOn = true;
        tagsButton.classList.add("current-type-button");
        console.log('adding tags');
        tagListDiv?.classList.remove("hidden");
    }
    }
        else {
            if (isTagsButtonOn === true) {
            tagsButton.textContent = "Open tags";
            isTagsButtonOn = false;
            tagsButton.classList.remove("current-type-button");
            tagListDiv?.classList.add("hidden");
        }
    }
};