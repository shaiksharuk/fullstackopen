import Note from './components/Note'
import { useState, useEffect } from 'react'
import noteService from './services/notes'
import axios from 'axios'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)

  const inputHandle = (event) => {
    setNewNote(event.target.value)
  }

  useEffect(() => {
    console.log('effect')
    noteService.getAll()
      .then(initialNotes => {
        console.log('promise fulfilled')
        setNotes(initialNotes)
      })
  }, [])

  console.log('render', notes.length, 'notes')

  const addNote = event => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} needs to be changed`)

    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id == id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(url, changedNote).then(returnedNote => {
      setNotes(notes.map(n => n.id !== id ? n : returnedNote))
    })
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important == true)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note}></Note>)}
      </ul>
      <ul>
        {notes.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input placeholder='new notes...' value={newNote} onChange={inputHandle} />
        <button type='submit'>Save</button>
      </form>
      <button onClick={() => setNotes([])}>Erase All</button>
    </div>
  )
}

export default App
