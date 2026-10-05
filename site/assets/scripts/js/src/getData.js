//проверка наличия в браузере данных о записках
const checkNotes = () => {
    let notesData = [];
    if (localStorage.getItem('USER_NOTES') == null) {
        console.log("notes not found");
        console.log("Adding first note...");
        notesData = [
            {
                name: "Hello World!",
                type: "text",
                tags: ["default"],
                create: Date.now(),
                change: Date.now(),
                data: "default text",
            }
        ];
        const jsonString = JSON.stringify(notesData);
        localStorage.setItem('USER_NOTES', jsonString);
        console.log("Ok");
        return false;
    }
    else {
        console.log("notes found");
        return true;
    }
};
export const loadNotes = () => {
    checkNotes();
    const savedString = localStorage.getItem('USER_NOTES');
    if (savedString === null) {
        console.log("error notes data read");
        return [];
    }
    return JSON.parse(savedString);
};
//проверка наличия в браузере сохраненных тегов
const checkTags = () => {
    let tagList = [];
    if (localStorage.getItem('USER_TAGS') == null) {
        console.log("tags not found");
        console.log("Adding some tags...");
        tagList = ["default", "important", "top"];
        const jsonString = JSON.stringify(tagList);
        localStorage.setItem('USER_TAGS', jsonString);
        console.log("Ok");
        return false;
    }
    else {
        console.log("tags found");
        return true;
    }
};
export const loadTags = () => {
    checkTags();
    const savedString = localStorage.getItem('USER_TAGS');
    if (savedString === null) {
        return [];
    }
    return JSON.parse(savedString);
};
//# sourceMappingURL=getData.js.map