import { INote} from './getData.js';
export const addNote = (oldNotes:INote[],note:INote ) => {
    let newNote = 
    {
        name: note.name,
        type: note.type,
        tags: note.tags,
        create: note.create,
        change: Date.now(),
        data: note.data,
        id: note.create
    }
    let a: INote[] = [...oldNotes];
    a.push(newNote)
    const jsonString = JSON.stringify(a);

    localStorage.setItem('USER_NOTES', jsonString);
    return newNote
}