import React, { useState } from 'react';
import ReactDOM from 'react-dom';

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
  const [tags, setTags] = useState([
    { id: 1, value: "Ticket 1", visible: false, selected: false },
    { id: 2, value: "Ticket 2", visible: false, selected: false }])

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")

  const addNote = e => {
    e.preventDefault()
    const newId = notes.length === 0 ? 0 : Math.max(...notes.map(n => n.id)) + 1
    setNotes(notes.concat({ value: newNote, id: newId, tagIds: tags.filter(t => t.selected).map(t => t.id) }))
    setNewNote("")
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  return (
    <div>
      <h1>Test</h1>
      <h2>Select</h2>
      <TagSelector
        tags={tags}
        setTags={setTags}
        isTagSelected={t => t.selected}
        setTagSelected={t => { return { ...t, selected: !t.selected } }}
      />
      <h2>Visible</h2>
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
        {(tags.filter(t => t.visible).length === 0 ? notes :
          notes
            .filter(n => n.tagIds.some(t => tags.find(e => e.id === t).visible)))
          .map(n => <li key={n.id}>[{n.tagIds.map(id=>tags.find(t=>t.id === id).value).join()}] ID: {n.id} {n.value}</li>)}
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
