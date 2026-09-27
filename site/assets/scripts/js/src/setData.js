export const addNote = (oldNotes, note) => {
    let newNote = {
        name: note.name,
        type: note.type,
        tags: note.tags,
        book: note.book,
        create: note.create,
        change: note.change,
        id: note.id,
        data: note.data
    };
    let a = [...oldNotes];
    a.push(newNote);
    const jsonString = JSON.stringify(a);
    console.log("new: ", a);
    localStorage.setItem('USER_NOTES', jsonString);
    return newNote;
};
