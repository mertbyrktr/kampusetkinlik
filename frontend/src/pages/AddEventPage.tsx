import { useNavigate } from 'react-router-dom'
import EventForm from '../components/forms/EventForm'
import { useEvents } from '../context/EventsContext'
import type { EventFormData } from '../types/campus-event'

const emptyForm: EventFormData = {
  title: '', category: '', date: '', time: '', location: '', capacity: '', description: '',
}

export default function AddEventPage() {
  const { addEvent } = useEvents()
  const navigate = useNavigate()
  return (
    <>
      <h2>Etkinlik Ekle</h2>
      <EventForm initialData={emptyForm} submitText="Kaydet" onSubmit={(data) => {
        addEvent(data)
        navigate('/admin')
      }} />
    </>
  )
}
