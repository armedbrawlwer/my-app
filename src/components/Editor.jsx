import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import 'quill/dist/quill.snow.css'
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

Quill.register('modules/cursors', QuillCursors)

export default function Editor() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const creatorId = searchParams.get("creatorId");
  const roomName = searchParams.get("roomName");

  const editorRef = useRef(null)
  const awarenessRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current) return

    const quill = new Quill(editorRef.current, {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ],
        history: { userOnly: true }
      },
      placeholder: 'Start collaborating...',
      theme: 'snow'
    })

    const ydoc = new Y.Doc()
    console.log(ydoc)
    const provider = new WebrtcProvider(roomName, ydoc)
    const ytext = ydoc.getText('quill')
    const awareness = provider.awareness
    awarenessRef.current = awareness
    const binding = new QuillBinding(ytext, quill, awareness)

    const cursors = quill.getModule('cursors')

    awareness.on('change', () => {
      cursors.clearCursors()
      awareness.getStates().forEach((state, clientId) => {
        if (clientId === awareness.clientID) return
        if (state.user && state.selection) {
          cursors.createCursor(clientId.toString(), state.user.name, state.user.color)
          cursors.moveCursor(clientId.toString(), state.selection.range)
        }
      })
    })

    quill.on('selection-change', (range) => {
      if (range) {
        awareness.setLocalStateField('selection', { range })
      } else {
        awareness.setLocalStateField('selection', null)
      }
    })

    window.addEventListener('blur', () => quill.blur())

    return () => {
      provider.destroy()
      ydoc.destroy()
    }
  }, [roomName])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-6">📝 Collaborative Editor</h1>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Room ID: <code>{roomName}</code></span>
        </div>
        <div
          ref={editorRef}
          className="bg-white rounded-lg border border-gray-300 h-[500px] overflow-hidden"
        ></div>
      </div>
    </div>
  )
}
