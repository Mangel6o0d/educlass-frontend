import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Landing.module.css'

const FEATURES = [
  {
    icon: '✦',
    title: 'Clases organizadas',
    desc: 'Crea y gestiona tus materias con código de acceso único para tus alumnos.',
  },
  {
    icon: '✦',
    title: 'Asignaciones claras',
    desc: 'Publica tareas con archivos adjuntos, fechas límite y seguimiento en tiempo real.',
  },
  {
    icon: '✦',
    title: 'Entregas digitales',
    desc: 'Los alumnos suben sus trabajos directamente desde la plataforma, sin correos.',
  },
  {
    icon: '✦',
    title: 'Calificaciones al instante',
    desc: 'Revisa entregas y asigna calificaciones con un solo clic. El alumno lo ve de inmediato.',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.visible)
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll(`.${styles.fadeUp}`).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.root}>

      {/* NAV */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>EDUCLASS</span>
        <button className={styles.navBtn} onClick={() => navigate('/login')}>
          Iniciar sesión
        </button>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />
        </div>

        <div className={styles.heroContent}>
          <p className={styles.heroBadge}>Plataforma educativa gratuita</p>
          <h1 className={styles.heroTitle}>
            El aula que siempre
            <br />
            <span className={styles.heroAccent}>quisiste tener</span>
          </h1>
          <p className={styles.heroSub}>
            EduClass conecta profesores y alumnos en un espacio digital limpio,
            rápido y sin distracciones. Clases, tareas y calificaciones en un solo lugar.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/login')}>
              Únete a nuestra comunidad
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Ver cómo funciona
            </button>
          </div>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.mockupHeader}>
            <span className={styles.mockupDot} style={{ background: '#ff5f56' }} />
            <span className={styles.mockupDot} style={{ background: '#ffbd2e' }} />
            <span className={styles.mockupDot} style={{ background: '#27c93f' }} />
            <span className={styles.mockupTitle}>EDUCLASS</span>
          </div>
          <div className={styles.mockupCard}>
            <div className={styles.mockupChip}>Programación Web · 09:00-10:00</div>
            <p className={styles.mockupTask}>Proyecto Final — React</p>
            <p className={styles.mockupDate}>Límite: 30 jun 2026</p>
            <div className={styles.mockupBadge}>Pendiente</div>
          </div>
          <div className={styles.mockupCard} style={{ opacity: 0.6 }}>
            <div className={styles.mockupChip}>Base de Datos · 10:00-11:00</div>
            <p className={styles.mockupTask}>Normalización 3FN</p>
            <p className={styles.mockupDate}>Límite: 15 jun 2026</p>
            <div className={styles.mockupBadgeOk}>Entregado — 92%</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        {[
          { n: '100%', label: 'Gratis para siempre' },
          { n: '2 roles', label: 'Profesor y Alumno' },
          { n: '5 MB', label: 'Por archivo adjunto' },
          { n: '1 código', label: 'Para unirse a clase' },
        ].map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statN}>{s.n}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.features}>
        <div className={`${styles.fadeUp} ${styles.sectionLabel}`}>Que puedes hacer</div>
        <h2 className={`${styles.fadeUp} ${styles.sectionTitle}`}>
          Todo lo que necesitas,<br />nada que no necesitas
        </h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`${styles.featureCard} ${styles.fadeUp}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how}>
        <div className={`${styles.fadeUp} ${styles.sectionLabel}`}>Proceso</div>
        <h2 className={`${styles.fadeUp} ${styles.sectionTitle}`}>Tres pasos y listo</h2>
        <div className={styles.steps}>
          {[
            { n: '01', title: 'Crea tu cuenta', desc: 'Regístrate como profesor o alumno en segundos, sin tarjeta de crédito.' },
            { n: '02', title: 'Conéctate a tu clase', desc: 'El profesor comparte un código de 6 caracteres. El alumno lo ingresa y ya está dentro.' },
            { n: '03', title: 'Trabaja y aprende', desc: 'Publica asignaciones, sube entregas y revisa calificaciones desde cualquier lugar.' },
          ].map((s, i) => (
            <div key={s.n} className={`${styles.step} ${styles.fadeUp}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <span className={styles.stepN}>{s.n}</span>
              <div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg}>
          <div className={styles.ctaBlob1} />
          <div className={styles.ctaBlob2} />
        </div>
        <h2 className={`${styles.fadeUp} ${styles.ctaTitle}`}>
          Listo para transformar<br />tu salon de clases?
        </h2>
        <p className={`${styles.fadeUp} ${styles.ctaSub}`}>
          Unete hoy. Es gratis, es rapido y puedes ser parte de nuestra comunidad desde ya.
        </p>
        <button className={`${styles.fadeUp} ${styles.ctaBigBtn}`} onClick={() => navigate('/login')}>
          Quiero unirme ahora
        </button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>EDUCLASS</span>
        <span className={styles.footerTag}>Hecho para el aula</span>
      </footer>

    </div>
  )
}