import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = ({ tags }) => {

    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState("")

    const jsonToNote = n => {
        return {
            ...n,
            date: new Date(n.date)
        }
    }

    const comp = (a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    const addNote = e => {
        e.preventDefault()
        if (newNote !== "") {
            const noteObject = {
                content: newNote,
                date: new Date(),
                tags: tags.filter(t => t.selected)
            }

            axios
                .post('http://localhost:3001/notes', noteObject)
                .then(response => {
                    setNotes(
                        notes
                            .concat(jsonToNote(response.data)))
                    setNewNote("")
                })

        }

    }

    useEffect(() => {
        axios
            .get('http://localhost:3001/notes')
            .then(response => {
                console.log('promise fulfilled')
                const fetchedNotes = response.data
                setNotes(fetchedNotes
                    .map(n => jsonToNote(n)))
            })
    }, [])

    const selectedTagIds = tags.filter(t => t.selected).map(t => t.id)
    return (
        <div>
            <h1>Dev Notes</h1>
            <form>
                <textarea
                    value={newNote} onChange={e => setNewNote(e.target.value)}
                    rows="10" cols="30"></textarea>
                <button
                    onClick={addNote}
                    type="submit">Add note</button>
            </form>

            <ul>
                {[...notes]
                    .filter(n =>selectedTagIds.length === 0 ? true : n.tags.map(t=>selectedTagIds.includes(t.id)).some(e => e === true))
                    .sort(comp)
                    .map(n => <li key={n.id}>DATE: {n.date.toUTCString()}, TAGS: [{n.tags.map(t => t.value).join(', ')}]:
        <p style={{ "whiteSpace": "pre-wrap" }}>{n.content}</p>
                    </li>)}
            </ul>
        </div>
    )
}

export default Notes