export const addNote = (oldNotes, note) => {
    let newNote = {
        name: note.name,
        type: note.type,
        tags: note.tags,
        create: note.create,
        change: Date.now(),
        data: note.data,
        id: note.create
    };
    let a = [...oldNotes];
    a.push(newNote);
    const jsonString = JSON.stringify(a);
    localStorage.setItem('USER_NOTES', jsonString);
    return newNote;
};
//# sourceMappingURL=setData.js.map