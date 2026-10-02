export interface INote {
    name: string;
    type: string;
    tags: string[];
    create: number;
    change: number;
    data: string;

}

//проверка наличия в браузере данных о записках
const checkNotes = (): boolean => {
    let notesData: INote[] = [];
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
                data: "123",

            }
        ];
        const jsonString = JSON.stringify(notesData);
        localStorage.setItem('USER_NOTES', jsonString);
        console.log("Ok");
        return false;
    } else {
        console.log("notes found");
        return true;
    }
};

export const loadNotes = (): INote[] => {
    checkNotes();
    const savedString = localStorage.getItem('USER_NOTES');
    if (savedString === null) {
        console.log("error notes data read");
        return [];
    }
    return JSON.parse(savedString) as INote[];
};


//проверка наличия в браузере сохраненных тегов
const checkTags = (): boolean => {
    let tagList: string[] = [];
    if (localStorage.getItem('USER_TAGS') == null) {
        console.log("tags not found");
        console.log("Adding some tags...");
        tagList = ["default", "important", "top"];
        const jsonString = JSON.stringify(tagList);
        localStorage.setItem('USER_TAGS', jsonString);
        console.log("Ok");
        return false;
    } else {
        console.log("tags found");
        return true;
    }
};


export const loadTags = (): string[] => {
    checkTags();
    const savedString = localStorage.getItem('USER_TAGS');
    if (savedString === null) {
        return [];
    }
    return JSON.parse(savedString) as string[];
};


