import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Ticket } from "lucide-react";
import api from "../services/api.js"
import EventBg from "../assets/EventBg.webp"
import QRCode from "react-qr-code"

const formatDateKey = (date) => new Date(date).toISOString().slice(0, 10)

const formatDate = (date, options) =>
  new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    ...options,
  })

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents();
    fetchBookedTickets()
  }, [])

  const bookTicket = async (eventId) => {
    try {
      const res = await api.post("/api/tickets/book", {
        userId: user._id,
        eventId,
      })

      const ticket = res.data.ticket;

      setBookedTickets((prev) => {
        const updated = new Set(prev)
        updated.add(eventId.toString())
        return updated
      })

      setTickets((prev) => ({
        ...prev,
        [eventId.toString()]: ticket,
      }))

      setFlipped(eventId.toString())

    } catch (error) {
      alert(error?.response?.data?.message || "Ticket booking failed")
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events")
      setEvents(Array.isArray(res.data) ? res.data : [])
    } 
    catch (error) {
      console.log(error)
    } 
    finally {
      setLoading(false)
    }
  }

  const displayEvents = events

  const dateOptions = useMemo(() => {
    const uniqueDates = [...new Set(displayEvents.map((event) => formatDateKey(event.date)))]
    return uniqueDates.sort((a, b) => new Date(a) - new Date(b))
  }, [displayEvents])

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return displayEvents
    return displayEvents.filter((event) => formatDateKey(event.date) === selectedDate);
  }, [displayEvents, selectedDate])

  useEffect(() => {
    setActiveIndex(0)
  }, [selectedDate, events.length])

  const move = (direction) => {
    if (!filteredEvents.length) return
    setActiveIndex((current) => (current + direction + filteredEvents.length) % filteredEvents.length);
  }

  const visibleEvents = useMemo(() => {
    if (!filteredEvents.length)
      return [];
    if (filteredEvents.length === 1) 
      return [filteredEvents[0]];

    const previous = (activeIndex - 1 + filteredEvents.length) % filteredEvents.length
    const next = (activeIndex + 1) % filteredEvents.length;
    return [filteredEvents[previous], filteredEvents[activeIndex], filteredEvents[next]]
  }, [activeIndex, filteredEvents])

  const [bookedTickets, setBookedTickets] = useState(new Set())
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const fetchBookedTickets = async () => {
    try {
      const res = await api.get(`/api/tickets/user/${user._id}`)

      const booked = new Set()
      const ticketMap = {}
      const ticketsList = Array.isArray(res.data?.tickets) ? res.data.tickets : []

      ticketsList.forEach((ticket) => {
        const eventId =
          typeof ticket.eventId === "object"
            ? ticket.eventId._id.toString()
            : ticket.eventId.toString()

        booked.add(eventId)
        ticketMap[eventId] = ticket
      })

      setBookedTickets(booked)
      setTickets(ticketMap)
    } 
    catch (error) {
      console.log(error)
    }
  }

  const [flipped, setFlipped] = useState(null)

  const [tickets, setTickets] = useState({})

  return (
    <section id="events" className="relative flex min-h-screen items-center overflow-hidden bg-cover bg-center px-4 py-28 text-white md:px-10" style={{ backgroundImage: `url(${EventBg})` }} >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.64),rgba(0,0,0,0.29))]" />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[40vh]"
        style={{ background: 'linear-gradient(to bottom, #000 0%, #000 15%, transparent 100%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>

            <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.12em] md:text-5xl xl:text-6xl">
              Book Your Tickets
            </h2>

          </div>

          <div className="w-full rounded-lg border border-cyan-200/35 bg-black/44 p-4 shadow-[0_0_34px_rgba(34,211,238,0.14)] backdrop-blur-2xl">
            <label className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-100/80">
              <CalendarDays size={16} />
              Choose Date
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={selectedDate}
                min={dateOptions[0] || undefined}
                max={dateOptions[dateOptions.length - 1] || undefined}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-white/14 bg-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white outline-none [color-scheme:dark] focus:border-cyan-200"
              />
              <button type="button" onClick={() => setSelectedDate("")} className="rounded-lg border border-white/14 bg-white/8 px-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition hover:border-cyan-200 hover:text-cyan-100">
                All
              </button>
            </div>
            {selectedDate && (
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/45">
                Showing {formatDate(selectedDate, { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <button onClick={() => move(-1)} className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-xl transition hover:border-cyan-200 hover:text-cyan-200 md:flex" aria-label="Previous event">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => move(1)} className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-xl transition hover:border-cyan-200 hover:text-cyan-200 md:flex" aria-label="Next event">
            <ArrowRight size={20} />
          </button>

          <div className="grid min-h-130 items-center gap-5 md:grid-cols-3 md:px-16">
            {loading ? (
              <div className="col-span-full text-center uppercase tracking-[0.35em] text-white/50">
                Loading events
              </div>
            ) : filteredEvents.length ? (
              visibleEvents.map((event, index) => {
                const isCenter = index === 1 || visibleEvents.length === 1;
                return (
                  <article
                    key={`${event._id}-${index}`}
                    className={`relative overflow-hidden rounded-lg border p-6 backdrop-blur-2xl transition-all duration-500 ${isCenter
                      ? "min-h-125 scale-100 border-cyan-200/70 bg-black/58 shadow-[0_0_58px_rgba(34,211,238,0.28)] md:scale-105"
                      : "min-h-102.5 scale-95 border-white/12 bg-black/36 opacity-72 shadow-[0_22px_60px_rgba(0,0,0,0.35)]"
                      }`}>
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-200 to-transparent" />



                    {flipped !== event._id && (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-100">
                            {event.tag || "Live"}
                          </span>
                          <span className="text-xs tracking-[0.32em] text-white/38">
                            {String((filteredEvents.indexOf(event) + 1) || 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h3 className="mt-10 text-3xl font-black uppercase leading-tight tracking-[0.08em] text-white">
                          {event.title}
                        </h3>
                        <p className="mt-5 min-h-21 text-sm leading-7 text-white/66">
                          {event.description}
                        </p>

                        <div className="mt-8 grid gap-3">
                          <div className="flex items-center gap-3 text-sm text-white/76">
                            <CalendarDays size={17} className="text-amber-200" />
                            {formatDate(event.date, {
                              weekday: "short",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-white/76">
                            <MapPin size={17} className="text-cyan-200" />
                            {event.venue}
                          </div>
                        </div>
                        {bookedTickets.has(event._id.toString()) ? (
                          <button onClick={() => setFlipped(flipped === event._id ? null : event._id)} className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full border border-cyan-200/60 bg-cyan-200 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(34,211,238,0.38)] transition hover:-translate-y-1 hover:shadow-[0_0_48px_rgba(34,211,238,0.58)]">
                            <Ticket size={18} />
                            View Ticket
                          </button>
                        ) : (
                          <button onClick={() => bookTicket(event._id)} className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full border border-cyan-200/60 bg-cyan-200 px-5 py-4 text-sm font-black uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(34,211,238,0.38)] transition hover:-translate-y-1 hover:shadow-[0_0_48px_rgba(34,211,238,0.58)]">
                            <Ticket size={18} />
                            Book Ticket
                          </button>
                        )}
                      </>
                    )}

                    {flipped === event._id && (
                      <div className="flex h-full flex-col items-center justify-center">

                        <h2 className="text-2xl font-bold tracking-[0.2em] text-cyan-300">
                          YOUR TICKET
                        </h2>

                        <div className="mt-8 rounded-2xl bg-white p-4 shadow-[0_0_40px_rgba(34,211,238,0.35)]">

                          <div className="rounded-xl bg-white p-4">
                            <QRCode
                              value={tickets[event._id.toString()]?.ticketId || ""}
                              size={220}
                            />
                          </div>

                        </div>

                        <p className="mt-6 text-lg font-semibold text-white">
                          {event.title}
                        </p>

                        <p className="mt-2 text-white/60">
                          {user?.username}
                        </p>

                        <p className="mt-5 text-white/70">
                          Ticket ID
                        </p>

                        <p className="font-mono text-cyan-300">
                          {tickets[event._id.toString()]?.ticketId}
                        </p>

                        <button onClick={() => setFlipped(null)} className="mt-8 rounded-full border border-cyan-300 px-6 py-3 text-cyan-300 transition hover:bg-cyan-300 hover:text-black">
                          Back
                        </button>

                      </div>
                    )}

                  </article>
                )
              })
            ) : (
              <div className="col-span-full rounded-lg border border-white/12 bg-black/44 p-10 text-center text-white/64 backdrop-blur-2xl">
                No events found for this date.
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4 md:hidden">
            <button onClick={() => move(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/8" aria-label="Previous event">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => move(1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/8" aria-label="Next event">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

    </section>
  )
}
