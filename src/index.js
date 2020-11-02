import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Notes from './components/notes';
import axios from 'axios'

const App = () => {

  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:3001/tags")
      .then(response => {
        setTags(response.data.map(t => {
          return {
            ...t,
            selected: false
          }
        }
        ))
      })
  }, [])

  const addTag = (e) => {
    e.preventDefault()
    console.log("addTag", e)

    if (newTag !== "") {
      axios
        .post("http://localhost:3001/tags", {
          value: newTag
        })
        .then(response => {
          console.log("promise fulfilled")
          setTags(tags.concat(response.data))
          setNewTag("")
        })

    }
  }

  const deselectTags = (e) => {
    e.preventDefault()
    console.log("deselectTags")
    setTags(tags.map(t =>{
      return {
        ...t,
        selected: false
      }
    }))

  }

  const selectTag = tag => {
    console.log("selectTag", tag)
    setTags(tags.map(t => t.id !== tag.id ? t : { ...tag, selected: !tag.selected }))

  }

  return (
    <div>
      <div>
        <h1>Tags</h1>
        <ul>
          {tags.map(t => <li onClick={() => selectTag(t)} key={t.id} style={t.selected ? { "background": "yellow" } : { "background": "none" }}>{t.value}</li>)}
        </ul>
        <form>
          <input value={newTag} onChange={e => setNewTag(e.target.value)} />
          <button onClick={addTag}>Add</button>
          <button onClick={deselectTags}>Clear</button>
        </form>
      </div>
      <Notes tags={tags} />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

