import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Guitar, Lightning, Fire, Star, MapPin, Clock,
  Phone, WhatsappLogo, InstagramLogo, FacebookLogo,
  NavigationArrow, HandFist, List, X, Leaf,
  BeerBottle, ForkKnife, Trophy, ArrowRight,
  CaretDown, Quotes, Timer, Motorcycle
} from '@phosphor-icons/react'

/* ───────── THEME ───────── */
const T = {
  bg: '#0d0d0d',
  card: '#141414',
  surface: '#1a1a1a',
  red: '#e63946',
  orange: '#f4a261',
  cream: '#f5f0e8',
  muted: '#888',
  border: '#2a2a2a',
}

/* ───────── DATA ───────── */
const PHONE = '(48) 3030-0525'
const WA = 'https://wa.me/554830300525'
const INSTA = 'https://www.instagram.com/rockburgerbar/'
const FB = 'https://www.facebook.com/536239983194954'
const IFOOD = ['https://www.ifood.com.br/delivery/florian', 'opolis-sc/rock-burger-artesanal-rio-tavares/e14054c7-a81d-4d87-a456-9de5f032309e'].join('')
const TRIPADVISOR = ['https://www.tripadvisor.com/Restaurant_Review-g303576-d9562752-Reviews-Rock_Burger-Florian', 'opolis_State_of_Santa_Catarina.html'].join('')
const ADDRESS = 'Rua da Lagoinha Pequena, 46 - Sala 01 - Rio Tavares, Florianópolis - SC'
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.5!2d-48.4847!3d-27.6444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRock+Burger+Artesanal!5e0!3m2!1sen!2sbr'

const MENU = [
  { name: 'Rock Classic', desc: 'Blend bovino 180g, queijo cheddar, alface, tomate, cebola roxa caramelizada e maionese do chef', icon: Fire },
  { name: 'Melt Australiano', desc: 'Pão australiano, blend 180g, cheddar derretido duplo, bacon crocante e molho especial', icon: Fire },
  { name: 'Veggie Rock', desc: 'Hambúrguer de grão-de-bico e cogumelos, rúcula, tomate seco e maionese vegana da casa', icon: Leaf },
  { name: 'Lula & Camarão', desc: 'Porção generosa de lula empanada e patinhas de camarão com molho tártaro artesanal', icon: ForkKnife },
  { name: 'Cervejas Artesanais', desc: 'Seleção rotativa de rótulos craft e chopps gelados para harmonizar com seu burger', icon: BeerBottle },
  { name: 'Fritas Premium', desc: 'Batatas rústicas com casca, temperadas com alecrim e flor de sal, servidas com trio de molhos', icon: ForkKnife },
]

const MOLHOS = [
  { name: 'Ketchup de Goiaba', desc: 'Doce natural da fruta com toque defumado' },
  { name: 'Mostarda Rústica', desc: 'Grãos inteiros, acidez equilibrada' },
  { name: 'Maionese do Chef', desc: 'Receita secreta da casa, cremosa e marcante' },
]

const REVIEWS = [
  { text: 'Provei 2 opções de burgers e estavam deliciosos, ponto da carne conforme solicitado, ingredientes de excelente qualidade', author: 'Z.F.', stars: 5 },
  { text: 'Perfeito, sem dúvidas o melhor hambúrguer de Florianópolis. Atendimento excelente, comida e bebida de qualidade', author: 'B.L.', stars: 5 },
  { text: 'Tudo fresquinho e nada industrializado. O pão, hambúrguer, maionese, tudo é feito lá mesmo. Sou vegetariana e a opção estava excelente!', author: 'D.L.', stars: 5 },
  { text: 'O melhor hambúrguer artesanal que já comi. Hambúrguer muito saboroso grelhado na hora, pão fofinho e acompanhado dos melhores molhos feitos por eles', author: 'W.M.M.', stars: 5 },
  { text: 'Maravilhosos hamburgers! Sério, fui 2x em 3 dias. Alta qualidade, preço justo e maravilhosa seleção de cerveja', author: 'L.F.', stars: 5 },
]

const HOURS = [
  { day: 'Segunda', time: 'Fechado', closed: true },
  { day: 'Terça a Quinta', time: '18h — 23h', closed: false },
  { day: 'Sexta', time: '18h — 00h30', closed: false },
  { day: 'Sábado', time: '19h — 00h30', closed: false },
  { day: 'Domingo', time: '19h — 23h', closed: false },
]

const AWARDS = [
  { title: "Travelers' Choice", sub: 'TripAdvisor — Top 10%', icon: Trophy },
  { title: '4.5 ★ Google', sub: '354 avaliações reais', icon: Star },
  { title: '4.7 ★ Restaurant Guru', sub: '683 reviews', icon: Star },
]

const NAV_ITEMS = [
  { label: 'Cardápio', href: '#menu' },
  { label: 'Molhos', href: '#molhos-da-casa' },
  { label: 'Prêmios', href: '#premios' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Contato', href: '#contato' },
]

/* ───────── REVEAL ───────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───────── NAVBAR ───────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    background: scrolled ? 'rgba(13,13,13,0.92)' : 'rgba(13,13,13,0.6)',
    borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
    transition: 'all 0.3s ease',
  }

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="./images/logo.svg" alt="Rock Burger Artesanal" style={{ height: 40 }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: T.cream, letterSpacing: 2 }}>ROCK BURGER</span>
        </a>

        {/* Desktop */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="nav-desktop">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href} style={{ color: T.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500, letterSpacing: 0.5, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = T.red}
              onMouseLeave={e => e.target.style.color = T.muted}
            >{item.label}</a>
          ))}
          <a href={WA} target="_blank" rel="noopener noreferrer" style={{
            background: T.red, color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = `0 0 20px ${T.red}44` }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none' }}
          >
            <WhatsappLogo size={16} weight="fill" /> Pedir Agora
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: T.cream, cursor: 'pointer' }} className="nav-mobile-toggle">
          {open ? <X size={28} /> : <List size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', background: 'rgba(13,13,13,0.98)', borderTop: `1px solid ${T.border}` }}
            className="nav-mobile-menu"
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {NAV_ITEMS.map(item => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ color: T.cream, textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>{item.label}</a>
              ))}
              <a href={WA} target="_blank" rel="noopener noreferrer" style={{ background: T.red, color: '#fff', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                Pedir pelo WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

/* ───────── HERO ───────── */
function Hero() {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 200])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Animated bg elements */}
      <motion.div style={{ position: 'absolute', inset: 0, y: bgY }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${T.red}15 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${T.orange}10 0%, transparent 50%)` }} />
        <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.04 }}>
          <img src="./images/guitar-icon.svg" alt="" style={{ width: 300, filter: 'blur(1px)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', opacity: 0.05 }}>
          <img src="./images/rock-hand.svg" alt="" style={{ width: 200 }} />
        </div>
      </motion.div>

      {/* Pattern overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(./images/pattern-rock.svg)', backgroundSize: 80, opacity: 0.03 }} />

      <motion.div style={{ opacity, position: 'relative', zIndex: 2, textAlign: 'center', padding: '120px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${T.red}18`, border: `1px solid ${T.red}33`, borderRadius: 40, padding: '8px 20px', marginBottom: 32 }}
        >
          <Lightning size={16} weight="fill" style={{ color: T.orange }} />
          <span style={{ color: T.orange, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Desde 2016 no Rio Tavares</span>
          <Lightning size={16} weight="fill" style={{ color: T.orange }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 10vw, 110px)', lineHeight: 0.95, color: T.cream, margin: '0 0 24px', letterSpacing: 3 }}
        >
          HAMBÚRGUER<br />
          <span style={{ color: T.red }}>ARTESANAL</span><br />
          <span style={{ fontSize: '0.6em', color: T.orange }}>& CERVEJA CRAFT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ color: T.muted, fontSize: 18, maxWidth: 550, margin: '0 auto 40px', lineHeight: 1.7 }}
        >
          Tudo feito na casa: pão, hambúrguer, maionese, ketchup de goiaba, mostarda rústica. Carne certificada grelhada na hora. Zero industrializado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a href={WA} target="_blank" rel="noopener noreferrer" style={{
            background: T.red, color: '#fff', padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: `0 4px 30px ${T.red}44`,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 40px ${T.red}66` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 30px ${T.red}44` }}
          >
            <WhatsappLogo size={20} weight="fill" /> Fazer Pedido
          </a>
          <a href="#menu" style={{
            border: `2px solid ${T.border}`, color: T.cream, padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.background = `${T.red}11` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'transparent' }}
          >
            Ver Cardápio <ArrowRight size={18} />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ marginTop: 60 }}
        >
          <CaretDown size={28} style={{ color: T.muted }} />
        </motion.div>
      </motion.div>

      {/* Bottom gradient */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(transparent, ${T.bg})`, zIndex: 3 }} />
    </section>
  )
}

/* ───────── MANIFESTO ───────── */
function Manifesto() {
  return (
    <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${T.red}06 0%, transparent 40%, ${T.orange}04 100%)` }} />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <img src="./images/fire-icon.svg" alt="" style={{ width: 48, margin: '0 auto 24px', opacity: 0.7 }} />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', color: T.cream, letterSpacing: 2, margin: '0 0 32px' }}>
            ROCK NA COZINHA,<br /><span style={{ color: T.red }}>ARTE NO PRATO</span>
          </h2>
          <p style={{ color: T.muted, fontSize: 17, lineHeight: 1.9, maxWidth: 640, margin: '0 auto' }}>
            Desde 2016, o Rock Burger é referência gastronômica no sul da ilha. Cada ingrediente é preparado na casa com obsessão artesanal: do pão que sai quentinho do forno ao blend de carne certificada grelhado na hora, passando pelos molhos autorais que já são lenda na região. Aqui, hambúrguer é coisa séria — e a cerveja também.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, marginTop: 60 }}>
            {[
              { value: '354+', label: 'No Google' },
              { value: '4.7', label: 'Restaurant Guru' },
              { value: 'Top 10%', label: 'TripAdvisor' },
              { value: '100%', label: 'Artesanal' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, borderColor: T.red }}
                style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 16px', transition: 'border-color 0.3s' }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: T.red, letterSpacing: 1 }}>{s.value}</div>
                <div style={{ color: T.muted, fontSize: 12, marginTop: 4, letterSpacing: 0.5 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── MENU / CARDÁPIO ───────── */
function CardapioSection() {
  return (
    <section id="menu" style={{ padding: '100px 24px', background: T.card }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: T.orange, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>O que rola aqui</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', color: T.cream, letterSpacing: 2, margin: '12px 0 0' }}>
              CARDÁPIO <span style={{ color: T.red }}>ROCK</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {MENU.map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, borderColor: T.red }}
                style={{
                  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28,
                  transition: 'border-color 0.3s', cursor: 'default', height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.red}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={22} weight="duotone" style={{ color: T.red }} />
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: T.cream, letterSpacing: 1, margin: 0 }}>{item.name}</h3>
                </div>
                <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, background: T.red, color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none',
              boxShadow: `0 4px 30px ${T.red}44`, transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <WhatsappLogo size={18} weight="fill" /> Peça pelo WhatsApp
            </a>
            <a href={IFOOD} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, color: T.orange, padding: '14px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none', marginLeft: 12,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = T.cream}
              onMouseLeave={e => e.currentTarget.style.color = T.orange}
            >
              <Motorcycle size={18} weight="duotone" /> Pedir no iFood <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── MOLHOS DA CASA ───────── */
function MolhosSection() {
  return (
    <section id="molhos-da-casa" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${T.orange}08 0%, transparent 70%)` }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: T.red, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>Receitas secretas</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 52px)', color: T.cream, letterSpacing: 2, margin: '12px 0 0' }}>
              MOLHOS <span style={{ color: T.orange }}>AUTORAIS</span>
            </h2>
            <p style={{ color: T.muted, fontSize: 15, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
              Cada molho é uma criação original da casa. Nada de sachê, nada de prateleira. Puro sabor artesanal.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {MOLHOS.map((m, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ scale: 1.03, borderColor: T.orange }}
                style={{
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: '36px 28px', textAlign: 'center',
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${T.orange}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Fire size={26} weight="duotone" style={{ color: T.orange }} />
                </div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: T.cream, letterSpacing: 1, margin: '0 0 10px' }}>{m.name}</h3>
                <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── PROCESS / COMO FAZEMOS ───────── */
function ProcessSection() {
  const steps = [
    { num: '01', title: 'Blend Fresco', desc: 'Carne certificada moída e temperada diariamente. Nunca congelada, sempre fresca.', icon: HandFist },
    { num: '02', title: 'Pão da Casa', desc: 'Massa artesanal preparada e assada no dia. Fofinho por dentro, dourado por fora.', icon: Timer },
    { num: '03', title: 'Grelhado na Hora', desc: 'Seu burger sai da grelha direto pro prato. Ponto perfeito, suculento e aromático.', icon: Fire },
  ]

  return (
    <section style={{ padding: '100px 24px', background: T.card }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: T.orange, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>Do zero ao prato</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 52px)', color: T.cream, letterSpacing: 2, margin: '12px 0 0' }}>
              COMO <span style={{ color: T.red }}>FAZEMOS</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, color: `${T.red}12`, position: 'absolute', top: -20, left: 0, letterSpacing: -2 }}>{step.num}</div>
                <div style={{ position: 'relative', paddingTop: 40 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${T.red}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <step.icon size={24} weight="duotone" style={{ color: T.red }} />
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: T.cream, letterSpacing: 1, margin: '0 0 12px' }}>{step.title}</h3>
                  <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── AWARDS / PRÊMIOS ───────── */
function AwardsSection() {
  return (
    <section id="premios" style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent, ${T.red}06, transparent)` }} />
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Trophy size={36} weight="duotone" style={{ color: T.orange, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 52px)', color: T.cream, letterSpacing: 2, margin: '0 0 12px' }}>
              RECONHECIMENTO <span style={{ color: T.orange }}>REAL</span>
            </h2>
            <p style={{ color: T.muted, fontSize: 15 }}>Premiado pelos maiores guias gastronômicos do mundo</p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {AWARDS.map((a, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -6, borderColor: T.orange }}
                style={{
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: '40px 28px', textAlign: 'center',
                  transition: 'border-color 0.3s',
                }}
              >
                <a.icon size={40} weight="duotone" style={{ color: T.orange, marginBottom: 16 }} />
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: T.cream, letterSpacing: 1, margin: '0 0 8px' }}>{a.title}</h3>
                <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>{a.sub}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── REVIEWS / DEPOIMENTOS ───────── */
function ReviewsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setActive(p => (p + 1) % REVIEWS.length), 6000)
    return () => clearInterval(iv)
  }, [])

  return (
    <section id="depoimentos" style={{ padding: '100px 24px', background: T.card }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: T.red, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>Quem provou, aprovou</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 52px)', color: T.cream, letterSpacing: 2, margin: '12px 0 0' }}>
              DEPOIMENTOS <span style={{ color: T.red }}>REAIS</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ position: 'relative', minHeight: 260 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center' }}
              >
                <Quotes size={40} weight="fill" style={{ color: `${T.red}33`, marginBottom: 24 }} />
                <p style={{ color: T.cream, fontSize: 20, lineHeight: 1.8, fontStyle: 'italic', margin: '0 0 28px', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
                  &ldquo;{REVIEWS[active].text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: REVIEWS[active].stars }).map((_, j) => (
                      <Star key={j} size={16} weight="fill" style={{ color: T.orange }} />
                    ))}
                  </div>
                  <span style={{ color: T.muted, fontSize: 14 }}>— {REVIEWS[active].author}, Google</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 28 : 8, height: 8, borderRadius: 4,
                    background: i === active ? T.red : T.border,
                    border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── EXPERIÊNCIA / AMBIENTE ───────── */
function AmbienceSection() {
  const features = [
    { icon: Guitar, title: 'Rock ao Vivo', desc: 'Shows e setlists clássicos que fazem o chão tremer' },
    { icon: BeerBottle, title: 'Cerveja Craft', desc: 'Rótulos artesanais rotativos e chopps gelados' },
    { icon: HandFist, title: 'Vibe Underground', desc: 'Decoração rock, luz baixa, a energia certa' },
    { icon: Leaf, title: 'Menu Inclusivo', desc: '4 opções vegetarianas e veganas no cardápio' },
    { icon: Motorcycle, title: 'Delivery', desc: 'Seu burger artesanal entregue quentinho via iFood ou WhatsApp' },
    { icon: ForkKnife, title: 'Tudo Artesanal', desc: 'Pão, molhos, blend — tudo feito aqui, na nossa cozinha' },
  ]

  return (
    <section style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: T.orange, fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>Mais que hambúrguer</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 52px)', color: T.cream, letterSpacing: 2, margin: '12px 0 0' }}>
              A <span style={{ color: T.red }}>EXPERIÊNCIA</span> ROCK
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ x: 6, borderColor: T.red }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '24px 22px',
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${T.red}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={20} weight="duotone" style={{ color: T.red }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: T.cream, letterSpacing: 1, margin: '0 0 6px' }}>{f.title}</h3>
                  <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── HORÁRIO / AGENDA ───────── */
function ScheduleSection() {
  return (
    <section id="agenda" style={{ padding: '100px 24px', background: T.card }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Clock size={32} weight="duotone" style={{ color: T.orange, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 48px)', color: T.cream, letterSpacing: 2, margin: '0 0 8px' }}>
              QUANDO <span style={{ color: T.orange }}>ROLA</span>
            </h2>
            <p style={{ color: T.muted, fontSize: 14 }}>Confira nossos dias e horários de atendimento</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden' }}>
            {HOURS.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px',
                  borderBottom: i < HOURS.length - 1 ? `1px solid ${T.border}` : 'none',
                  opacity: h.closed ? 0.4 : 1,
                }}
              >
                <span style={{ color: T.cream, fontSize: 15, fontWeight: 500 }}>{h.day}</span>
                <span style={{ color: h.closed ? T.muted : T.orange, fontSize: 15, fontWeight: 600, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── LOCATION / CONTATO ───────── */
function LocationSection() {
  return (
    <section id="contato" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <MapPin size={32} weight="duotone" style={{ color: T.red, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 48px)', color: T.cream, letterSpacing: 2, margin: '0 0 8px' }}>
              ONDE <span style={{ color: T.red }}>ESTAMOS</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {/* Map */}
          <Reveal>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}`, height: 320 }}>
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Rock Burger Artesanal no mapa"
              />
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <MapPin size={20} weight="duotone" style={{ color: T.red, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: T.cream, fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>Endereço</h4>
                    <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{ADDRESS}</p>
                  </div>
                </div>
              </div>

              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '24px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <Phone size={20} weight="duotone" style={{ color: T.red, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: T.cream, fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>Telefone</h4>
                    <a href={`tel:${PHONE.replace(/\D/g, '')}`} style={{ color: T.orange, fontSize: 15, textDecoration: 'none', fontWeight: 600 }}>{PHONE}</a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <a href={WA} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25d366', color: '#fff', padding: '14px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <WhatsappLogo size={18} weight="fill" /> WhatsApp
                </a>
                <a href={INSTA} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `${T.surface}`, border: `1px solid ${T.border}`, color: T.cream, padding: '14px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#E4405F' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = T.border }}
                >
                  <InstagramLogo size={18} weight="fill" /> Instagram
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────── CTA FINAL ───────── */
function CTASection() {
  return (
    <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${T.red}12 0%, transparent 70%)` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(./images/pattern-rock.svg)', backgroundSize: 60, opacity: 0.04 }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <img src="./images/lightning.svg" alt="" style={{ width: 40, margin: '0 auto 24px', opacity: 0.8 }} />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 60px)', color: T.cream, letterSpacing: 2, margin: '0 0 20px', lineHeight: 1.1 }}>
            BORA <span style={{ color: T.red }}>ROCKAR</span><br />COM A GENTE?
          </h2>
          <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Peça agora pelo WhatsApp ou passe no Rock Burger — o melhor hambúrguer artesanal de Florianópolis te espera.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, background: T.red, color: '#fff', padding: '18px 40px', borderRadius: 14, fontSize: 17, fontWeight: 700, textDecoration: 'none',
              boxShadow: `0 4px 40px ${T.red}55`, transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 50px ${T.red}77` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 40px ${T.red}55` }}
            >
              <WhatsappLogo size={22} weight="fill" /> Pedir Agora
            </a>
            <a href={`tel:${PHONE.replace(/\D/g, '')}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, border: `2px solid ${T.border}`, color: T.cream, padding: '18px 36px', borderRadius: 14, fontSize: 17, fontWeight: 600, textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.background = `${T.red}11` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'transparent' }}
            >
              <Phone size={20} weight="duotone" /> Ligar Agora
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <footer style={{ background: T.card, borderTop: `1px solid ${T.border}`, padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="./images/logo.svg" alt="Rock Burger" style={{ height: 36 }} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: T.cream, letterSpacing: 2 }}>ROCK BURGER</span>
            </div>
            <p style={{ color: T.muted, fontSize: 13, maxWidth: 300, lineHeight: 1.6 }}>
              Hambúrguer artesanal e cerveja craft no Rio Tavares, Florianópolis. Tudo feito na casa com paixão e rock.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: T.cream, fontSize: 13, fontWeight: 600, margin: '0 0 12px', letterSpacing: 1 }}>NAVEGAÇÃO</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NAV_ITEMS.map(item => (
                  <a key={item.href} href={item.href} style={{ color: T.muted, fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = T.red}
                    onMouseLeave={e => e.target.style.color = T.muted}
                  >{item.label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ color: T.cream, fontSize: 13, fontWeight: 600, margin: '0 0 12px', letterSpacing: 1 }}>SIGA-NOS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href={INSTA} target="_blank" rel="noopener noreferrer" style={{ color: T.muted, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E4405F'}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  <InstagramLogo size={16} weight="fill" /> @rockburgerbar
                </a>
                <a href={FB} target="_blank" rel="noopener noreferrer" style={{ color: T.muted, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#1877F2'}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  <FacebookLogo size={16} weight="fill" /> Facebook
                </a>
                <a href={TRIPADVISOR} target="_blank" rel="noopener noreferrer" style={{ color: T.muted, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#34E0A1'}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  <NavigationArrow size={16} weight="fill" /> TripAdvisor
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ color: T.muted, fontSize: 12, margin: 0 }}>
            &copy; {new Date().getFullYear()} Rock Burger Artesanal. Todos os direitos reservados.
          </p>
          <a href={WA} target="_blank" rel="noopener noreferrer" style={{ color: T.red, fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <WhatsappLogo size={14} weight="fill" /> Fale conosco
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ───────── FLOATING WHATSAPP ───────── */
function FloatingWA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={WA}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 90,
            width: 56, height: 56, borderRadius: '50%', background: '#25d366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
            textDecoration: 'none',
          }}
          aria-label="Abrir WhatsApp"
        >
          <WhatsappLogo size={28} weight="fill" style={{ color: '#fff' }} />
        </motion.a>
      )}
    </AnimatePresence>
  )
}

/* ───────── GLOBAL STYLES ───────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html {
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: ${T.bg};
        color: ${T.cream};
        overflow-x: hidden;
      }

      ::selection {
        background: ${T.red};
        color: #fff;
      }

      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: ${T.bg}; }
      ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: ${T.red}; }

      img { max-width: 100%; height: auto; }
      a { color: inherit; }
    `}</style>
  )
}

/* ───────── APP ───────── */
function App() {
  return (
    <>
      <Helmet>
        <title>Rock Burger Artesanal — Hambúrguer & Cerveja Craft | Florianópolis</title>
        <meta name="description" content="O melhor hambúrguer artesanal de Florianópolis. Tudo feito na casa: pão, blend, molhos autorais. Cerveja craft, ambiente rock e delivery. Rio Tavares, Floripa." />
        <meta name="theme-color" content={T.bg} />
        <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
      </Helmet>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <CardapioSection />
        <MolhosSection />
        <ProcessSection />
        <AwardsSection />
        <ReviewsSection />
        <AmbienceSection />
        <ScheduleSection />
        <LocationSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWA />
    </>
  )
}

export default App
