import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import './login.css'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('loading')

    // Backend isn't connected yet — someone else owns that piece.
    // For now, clicking Login just gets you straight into the frontend.
    setTimeout(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({ _id: 'demo-user', username: formData.username || 'Guest' })
      )
      setStatus('success')
  setTimeout(() => {
  navigate("/home", {
    state: {
      showIntro: true,
    },
  });
}, 700);
    }, 500)
  }

  return (
    <div className="login-screen">
      <div className="video-layer">
        <video
          autoPlay muted loop playsInline
          src="/media/stellar-scroll-60fps.mp4"
          style={{ transform: 'translateZ(0) scale(1.015)' }}
        />
      </div>
      <div className="cosmic-wash login-wash" />
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => ({
          id: i,
          left: `${(i * 41.3) % 100}%`,
          top: `${(i * 67.7) % 100}%`,
          size: 1 + (i % 3),
          delay: `${(i % 9) * -0.55}s`,
        })).map((s) => (
          <i key={s.id} style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }} />
        ))}
      </div>

      <div className="login-wrap">
        <div className="login-card">
          <img src="/media/frosh-logo.png" alt="FROSH" className="login-logo" />

          <form onSubmit={handleSubmit}>
            <label>
              <span>Username</span>
              <input
                type="text" name="username" placeholder="Enter username"
                value={formData.username} onChange={handleChange}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password" name="password" placeholder="Enter password"
                value={formData.password} onChange={handleChange}
              />
            </label>

            <button type="submit" className="login-submit" disabled={status !== 'idle'}>
              {status === 'idle' && 'Log in'}
              {status === 'loading' && 'Logging in…'}
              {status === 'success' && "You're in ✓"}
            </button>
            <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </form>
        </div>
      </div>
    </div>
  )
}
