import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const TagSelector = ({ tags, setTags, isTagSelected, setTagSelected }) => {

  const selectTag = tag => {
    setTags(
      tags.map(t => t.id === tag.id ?
        setTagSelected(t) : t))
  }
  return (
    <div>
      <ul>
        {tags.map(t =>
          <li
            key={t.id}
            style={isTagSelected(t) ? { background: "yellow" } : {}}
            onClick={e => selectTag(t)}
          >{t.value}</li>)}
      </ul>
    </div>
  )
}

const App = () => {

  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")


  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")


  useEffect(() => {
    console.log("load tags")
    axios.get("http://localhost:3001/tags")
      .then(response => {
        console.log("promise fulfilled")
        setTags(response.data)
      })
  }, [])

  useEffect(() => {
    console.log("load notes")
    axios.get("http://localhost:3001/notes")
      .then(response => {
        console.log("note promise fulfilled")
        setNotes(response.data.map(n => {
          return {
            ...n,
            date: new Date(n.date)
          }
        }))
      })
  }, [])

  const addNote = e => {
    e.preventDefault()
    if (newNote !== "") {

      const newNoteObject = {
        value: newNote,
        tagIds: tags.filter(t => t.selected).map(t => t.id),
        date: new Date()
      }
      axios.post("http://localhost:3001/notes", newNoteObject)
        .then(response => {
          const noteResult = response.data
          setNotes(notes.concat({
            ...noteResult,
            date: new Date(noteResult.date)
          }))
          setNewNote("")
        })
    }
  }
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const showTags = (n, tags) => {
    return n.tagIds
      .map(id => tags.find(t => t.id === id).value).join()
  }
  const getNotes = (notes, tags) => {
    const sortNotesReversed = n => {
      return [...n].sort((a, b) => {
        if (a.date === b.date) {
          return 0
        }
        if (a.date > b.date) {
          return -1
        }
        return 1
      })
    }
    const sortedNotes = sortNotesReversed(notes)
    return tags.filter(t => t.visible).length === 0 ?
      sortedNotes :
      sortedNotes
        .filter(n => n.tagIds.some(t => tags.find(e => e.id === t).visible))
  }

  const addTag = e => {
    e.preventDefault()
    const newTagObject = {
      value: newTag,
      visible: false,
      selected: false
    }
    axios.post("http://localhost:3001/tags", newTagObject)
      .then(response => {
        setTags(tags.concat(response.data))
        setNewTag("")
      })
  }
  const formatDate = d => {

    return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
  }


  return (
    <div>
      <h1>Test</h1>
      <h2>Add Tag</h2>
      <form>
        <input value={newTag} onChange={e => setNewTag(e.target.value)} />
        <button onClick={addTag}>Add Tag</button>
      </form>

      <h2>Select Tags</h2>
      <TagSelector
        tags={tags}
        setTags={setTags}
        isTagSelected={t => t.selected}
        setTagSelected={t => { return { ...t, selected: !t.selected } }}
      />
      <h2>Show Tags</h2>
      <TagSelector
        tags={tags}
        setTags={setTags}
        isTagSelected={t => t.visible}
        setTagSelected={t => { return { ...t, visible: !t.visible } }}
      />
      <button onClick={e => setTags(tags.map(t => { return { ...t, visible: false } }))}>Clear Selection</button>

      <h2>Notes</h2>
      <form>
        <textarea value={newNote} onChange={handleNoteChange} rows="4" cols="50" />
        <button onClick={addNote}>Add Note</button>
      </form>
      <ul>
        {getNotes(notes, tags)
          .map(n => <li key={n.id}>{formatDate(n.date)} [{showTags(n, tags)}] ID: {n.id} {n.value}</li>)}
      </ul>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
