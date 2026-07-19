import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../services/api.js"
import EventBg from "../assets/EventBg.webp";

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const res = await api.get(`/api/tickets/user/${user._id}`);
            setTickets(Array.isArray(res.data?.tickets) ? res.data.tickets : []);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <main className="min-h-screen bg-cover bg-center px-5 py-32 text-white md:px-10" style={{ backgroundImage: `url(${EventBg})` }}>
            <div className="fixed inset-0 -z-10 bg-black/78" />
            <div className="mx-auto max-w-6xl">
                <p className="text-xs uppercase tracking-[0.55em] text-cyan-200/80">
                    Confirmed Passes
                </p>
                <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.14em] md:text-6xl">
                    My Tickets
                </h1>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    {tickets.map((ticket) => (
                        <article key={ticket._id} className="rounded-lg border border-cyan-200/35 bg-black/58 p-6 shadow-[0_0_42px_rgba(34,211,238,0.16)] backdrop-blur-2xl">
                            <h2 className="text-2xl font-black uppercase tracking-[0.12em]">
                                {ticket.eventId.title}
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-white/64">
                                {ticket.eventId.description}
                            </p>

                            <p className="mt-4 text-sm text-white/76">
                                Venue: {ticket.eventId.venue}
                            </p>

                            <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
                                Ticket ID: {ticket.ticketId}
                            </p>

                            <div className="mt-6 flex justify-center rounded-lg bg-white p-5">
                                <QRCodeCanvas value={ticket.ticketId} size={220} />
                            </div>
                        </article>
                    ))}

                    {!tickets.length && (
                        <div className="rounded-lg border border-white/12 bg-black/48 p-8 text-white/68 backdrop-blur-xl">
                            No tickets booked yet.
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
