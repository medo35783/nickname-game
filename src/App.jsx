import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue, off, push } from "firebase/database";
/* ══════════════ FIREBASE ══════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyDwt9h7MaOo2Dh03qGm43FfWad1cOtgex4",
  authDomain: "nickname-game.firebaseapp.com",
  databaseURL: "https://nickname-game-default-rtdb.firebaseio.com",
  projectId: "nickname-game",
  storageBucket: "nickname-game.firebasestorage.app",
  messagingSenderId: "113593747204",
  appId: "1:113593747204:web:af9a4baecd75703874b251",
  measurementId: "G-4LCCK0YJ2E"
};
const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

/* ══════════════ STYLES ══════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'Tajawal',sans-serif;direction:rtl;background:#07071a;color:#e8e0ff;min-height:100vh;overflow-x:hidden}
:root{--gold:#f0c040;--red:#e63950;--green:#2ecc71;--blue:#4fa3e0;--purple:#9b59b6;--card:#0f0f22;--card2:#151530;--border:rgba(240,192,64,.18);--text:#e8e0ff;--muted:#7a74a0;--dim:#2a2850;}
.app{min-height:100vh;display:flex;flex-direction:column;padding-bottom:70px}
.stars{position:fixed;inset:0;pointer-events:none;z-index:0}
.star{position:absolute;border-radius:50%;background:#fff;animation:tw 3s infinite alternate}
@keyframes tw{from{opacity:.04}to{opacity:.5}}
.bnav{position:fixed;bottom:0;left:0;right:0;z-index:80;background:rgba(7,7,26,.97);backdrop-filter:blur(16px);border-top:1px solid var(--border);display:flex;align-items:stretch;height:62px;max-width:520px;margin:0 auto;}
.bnav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;transition:all .18s;border:none;background:transparent;padding:6px 2px;color:var(--muted);font-family:'Tajawal',sans-serif;}
.bnav-item.active{color:var(--gold)}
.bnav-icon{font-size:20px;line-height:1}
.bnav-label{font-size:10px;font-weight:600}
.bnav-dot{width:5px;height:5px;border-radius:50%;background:var(--red);margin-top:1px;animation:pls 2s infinite}
@keyframes pls{0%,100%{opacity:1}50%{opacity:.4}}
.hdr{position:sticky;top:0;z-index:60;background:rgba(7,7,26,.97);backdrop-filter:blur(14px);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.logo{font-family:'Cairo',sans-serif;font-size:18px;font-weight:900;background:linear-gradient(135deg,var(--gold),#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.main{position:relative;z-index:5;flex:1;padding:14px;max-width:520px;margin:0 auto;width:100%}
.scr{animation:fi .3s ease}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ptitle{font-family:'Cairo',sans-serif;font-size:23px;font-weight:900;text-align:center;margin-bottom:4px;background:linear-gradient(135deg,var(--gold),#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.psub{text-align:center;color:var(--muted);font-size:12px;margin-bottom:17px;line-height:1.7}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:11px}
.card2{background:var(--card2);border:1px solid rgba(255,255,255,.06);border-radius:11px;padding:12px;margin-bottom:9px}
.ctitle{font-size:13px;font-weight:700;margin-bottom:10px;color:var(--gold);display:flex;align-items:center;gap:5px}
.ig{margin-bottom:9px}
.lbl{font-size:11px;color:var(--muted);margin-bottom:3px;display:block}
.inp{width:100%;padding:10px 13px;background:#080820;border:1px solid rgba(240,192,64,.2);border-radius:8px;color:var(--text);font-family:'Tajawal',sans-serif;font-size:14px;transition:all .2s;outline:none;direction:rtl}
.inp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(240,192,64,.08)}
.inp::placeholder{color:#444}
.inp.big{font-size:26px;text-align:center;letter-spacing:8px;font-family:'Cairo',sans-serif;font-weight:700}
.inp.err-b{border-color:var(--red)!important}
textarea.inp{resize:vertical;min-height:80px}
.err-msg{font-size:11px;color:var(--red);margin-top:3px}
.btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:12px;border:none;border-radius:10px;font-family:'Tajawal',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .18s}
.btn:active{transform:scale(.97)}
.btn:disabled{opacity:.35;cursor:not-allowed}
.bg{background:linear-gradient(135deg,var(--gold),#d4920a);color:#07070f}
.bg:hover:not(:disabled){filter:brightness(1.08);box-shadow:0 4px 18px rgba(240,192,64,.25)}
.br{background:linear-gradient(135deg,var(--red),#a82020);color:#fff}
.bb{background:linear-gradient(135deg,var(--blue),#1e6fb0);color:#fff}
.bv{background:linear-gradient(135deg,var(--green),#1a8a50);color:#fff}
.bp{background:linear-gradient(135deg,var(--purple),#6c3480);color:#fff}
.bo{background:transparent;color:var(--gold);border:1.5px solid var(--gold)}
.bo:hover{background:rgba(240,192,64,.07)}
.bgh{background:transparent;color:var(--muted);border:1px solid rgba(255,255,255,.08)}
.bgh:hover{background:rgba(255,255,255,.04);color:var(--text)}
.bsm{padding:7px 12px;font-size:12px;width:auto;border-radius:7px}
.bxs{padding:4px 9px;font-size:11px;width:auto;border-radius:6px;font-weight:700}
.room-code-big{font-family:'Cairo',sans-serif;font-size:40px;font-weight:900;letter-spacing:10px;color:var(--gold);text-align:center;padding:14px 10px;background:rgba(240,192,64,.06);border:2px dashed rgba(240,192,64,.3);border-radius:12px;margin-bottom:10px}
.bwrap{background:var(--card2);border:1.5px solid var(--border);border-radius:13px;padding:12px;margin-bottom:10px}
.blbl{font-size:11px;color:var(--muted);text-align:center;margin-bottom:8px}
.bgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.nt{padding:9px 5px;border:1.5px solid rgba(240,192,64,.15);border-radius:9px;text-align:center;cursor:pointer;transition:all .2s;font-size:13px;font-weight:700;color:var(--text);background:#09091e;min-height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.nt:hover:not(.nd){border-color:var(--gold);background:rgba(240,192,64,.07);transform:translateY(-1px)}
.nt.nsel{border-color:var(--gold);background:rgba(240,192,64,.14);color:var(--gold)}
.nt.nd{opacity:.28;cursor:not-allowed;background:#080818;border-color:rgba(255,255,255,.04)}
.nt-sub{font-size:9px;color:var(--red);margin-top:3px;font-weight:400;line-height:1.3}
.ngrid{display:flex;flex-direction:column;gap:5px}
.nr{display:flex;align-items:center;gap:8px;padding:9px 11px;background:#09091e;border:1.5px solid rgba(255,255,255,.06);border-radius:9px;cursor:pointer;transition:all .2s}
.nr:hover:not(.nrd){border-color:var(--gold);background:rgba(240,192,64,.05)}
.nr.nrsel{border-color:var(--gold);background:rgba(240,192,64,.1)}
.nr.nrd{opacity:.35;cursor:not-allowed;border-color:rgba(230,57,80,.18)}
.nr-av{width:31px;height:31px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0}
.nr-info{flex:1;min-width:0}
.nr-name{font-size:13px;font-weight:700}
.nr-sub{font-size:10px;color:var(--red);margin-top:1px;line-height:1.4}
.pi{display:flex;align-items:center;gap:8px;padding:9px 10px;background:#09091e;border:1px solid rgba(255,255,255,.05);border-radius:9px;margin-bottom:5px;transition:all .2s}
.pi:hover{border-color:rgba(240,192,64,.18)}
.pi.dim{opacity:.32}
.pi-av{width:35px;height:35px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#07070f;flex-shrink:0}
.pi-info{flex:1;min-width:0}
.pi-name{font-size:13px;font-weight:700}
.pi-nick{font-size:11px;color:var(--gold);margin-top:1px}
.pi-sub{font-size:10px;color:var(--muted);margin-top:1px}
.tbar{border:1px solid rgba(240,192,64,.22);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px;margin-bottom:11px;background:rgba(240,192,64,.06)}
.tbar.urg{border-color:rgba(230,57,80,.4)!important;background:rgba(230,57,80,.07)!important}
.tval{font-family:'Cairo',sans-serif;font-size:18px;font-weight:900;color:var(--gold)}
.tval.urg{color:var(--red)}
.tlbl{font-size:11px;color:var(--muted)}
.tpick{display:flex;gap:6px;align-items:center}
.tunit{text-align:center}
.tunit label{display:block;font-size:11px;color:var(--muted);margin-bottom:3px}
.tunit input{width:60px;padding:8px;background:#09091e;border:1px solid rgba(240,192,64,.2);border-radius:7px;color:var(--text);font-family:'Cairo',sans-serif;font-size:18px;font-weight:700;text-align:center;outline:none}
.tunit input:focus{border-color:var(--gold)}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.sg3{grid-template-columns:1fr 1fr 1fr}
.sg4{grid-template-columns:1fr 1fr 1fr 1fr}
.sbox{background:#09091e;border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:10px;text-align:center}
.snum{font-family:'Cairo',sans-serif;font-size:21px;font-weight:900;color:var(--gold)}
.slbl{font-size:10px;color:var(--muted);margin-top:2px}
.ann{border-radius:11px;padding:12px;margin-bottom:9px}
.ag{background:rgba(240,192,64,.08);border:1px solid rgba(240,192,64,.25);text-align:center}
.ar{background:rgba(230,57,80,.08);border:1px solid rgba(230,57,80,.25)}
.av{background:rgba(46,204,113,.08);border:1px solid rgba(46,204,113,.25);text-align:center}
.tag{display:inline-flex;align-items:center;gap:2px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:700}
.tg{background:rgba(240,192,64,.1);color:var(--gold)}
.tr{background:rgba(230,57,80,.1);color:var(--red)}
.tv{background:rgba(46,204,113,.1);color:var(--green)}
.tb{background:rgba(79,163,224,.1);color:var(--blue)}
.tm{background:rgba(255,255,255,.06);color:var(--muted)}
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700}
.ba{background:rgba(240,192,64,.12);color:var(--gold);border:1px solid rgba(240,192,64,.25)}
.brd{background:rgba(230,57,80,.12);color:var(--red);border:1px solid rgba(230,57,80,.25)}
.bvd{background:rgba(46,204,113,.12);color:var(--green);border:1px solid rgba(46,204,113,.25)}
.div{display:flex;align-items:center;gap:8px;margin:11px 0;color:var(--muted);font-size:11px}
.div::before,.div::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.06)}
.tabs{display:flex;gap:5px;margin-bottom:11px}
.tab{flex:1;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,.07);color:var(--muted);font-family:'Tajawal',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s}
.tab.on{background:rgba(240,192,64,.1);border-color:var(--gold);color:var(--gold)}
.notif{position:fixed;top:68px;left:50%;transform:translateX(-50%);z-index:999;padding:10px 18px;border-radius:10px;font-weight:700;font-size:13px;text-align:center;animation:sdn .3s ease,fdo .3s ease 2.7s forwards;min-width:210px;max-width:88vw;box-shadow:0 8px 28px rgba(0,0,0,.6)}
.ns{background:#0c2d1c;border:1px solid var(--green);color:var(--green)}
.ne{background:#2d0c0c;border:1px solid var(--red);color:var(--red)}
.ni{background:#0c1c2d;border:1px solid var(--blue);color:var(--blue)}
.ng{background:#2d200c;border:1px solid var(--gold);color:var(--gold)}
@keyframes sdn{from{opacity:0;transform:translateX(-50%) translateY(-14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes fdo{from{opacity:1}to{opacity:0}}
.mbg{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:18px}
.modal{background:var(--card);border:1.5px solid var(--border);border-radius:16px;padding:22px;max-width:360px;width:100%;animation:fi .3s ease;text-align:center}
.micn{font-size:46px;margin-bottom:6px}
.mtitle{font-family:'Cairo',sans-serif;font-size:19px;font-weight:900;margin-bottom:5px}
.msub{color:var(--muted);font-size:12px;margin-bottom:16px;line-height:1.7}
.counter-bar{background:rgba(46,204,113,.07);border:1px solid rgba(46,204,113,.22);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:9px;margin-bottom:11px}
.counter-track{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;flex:1}
.counter-fill{height:100%;background:linear-gradient(90deg,var(--green),#27ae60);border-radius:3px;transition:width .4s}
.waiting-box{text-align:center;padding:22px 14px}
.waiting-icon{font-size:52px;animation:wbnc 2s infinite}
@keyframes wbnc{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
.waiting-title{font-family:'Cairo',sans-serif;font-size:18px;font-weight:900;color:var(--gold);margin-top:8px;margin-bottom:5px}
.waiting-sub{color:var(--muted);font-size:12px;line-height:1.8}
.grave{background:rgba(230,57,80,.07);border:1px solid rgba(230,57,80,.18);border-radius:10px;padding:10px;margin-bottom:5px}
.grave-name{font-size:13px;font-weight:700}
.grave-nick{font-size:11px;color:var(--gold);margin-top:2px}
.grave-info{font-size:10px;color:var(--muted);margin-top:3px;line-height:1.5}
.wcard{background:linear-gradient(135deg,rgba(240,192,64,.18),rgba(255,140,0,.08));border:2px solid var(--gold);border-radius:16px;padding:22px;text-align:center;margin-bottom:12px}
.wcrown{font-size:44px;margin-bottom:5px;animation:bnc 1s infinite}
@keyframes bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.hunted{background:rgba(230,57,80,.07);border:1px solid rgba(230,57,80,.2);border-radius:10px;padding:11px;margin-bottom:9px}
.hunted.least{background:rgba(79,163,224,.07);border-color:rgba(79,163,224,.2)}
.feed-item{padding:7px 10px;background:#09091e;border-right:3px solid;border-radius:7px;margin-bottom:4px;font-size:11px}
.fc-success{border-color:var(--green)}.fc-fail{border-color:var(--red)}.fc-sys{border-color:var(--gold)}
.sc{overflow-y:auto;max-height:260px}
.sc::-webkit-scrollbar{width:3px}
.sc::-webkit-scrollbar-thumb{background:rgba(240,192,64,.18);border-radius:2px}
.plan-card{border-radius:14px;padding:16px;margin-bottom:10px;position:relative;overflow:hidden}
.plan-gold{background:linear-gradient(135deg,rgba(240,192,64,.15),rgba(255,140,0,.08));border:2px solid var(--gold)}
.plan-silver{background:linear-gradient(135deg,rgba(200,200,220,.1),rgba(150,150,180,.05));border:1.5px solid rgba(200,200,220,.3)}
.plan-super{background:linear-gradient(135deg,rgba(155,89,182,.18),rgba(100,50,150,.08));border:2px solid var(--purple)}
.plan-badge{position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700}
.plan-name{font-family:'Cairo',sans-serif;font-size:20px;font-weight:900;margin-bottom:4px}
.plan-feat{font-size:12px;color:var(--muted);margin-top:3px;line-height:1.8}
.news-item{background:var(--card2);border:1px solid rgba(255,255,255,.06);border-radius:11px;padding:13px;margin-bottom:9px}
.news-date{font-size:10px;color:var(--muted);margin-bottom:5px}
.news-title{font-size:14px;font-weight:700;margin-bottom:4px}
.news-body{font-size:12px;color:var(--muted);line-height:1.7}
.news-new{display:inline-block;background:var(--red);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;margin-right:6px}
.sugg-item{background:var(--card2);border:1px solid rgba(255,255,255,.06);border-radius:11px;padding:12px;margin-bottom:8px}
.sugg-cat{font-size:10px;color:var(--blue);font-weight:700;margin-bottom:4px}
.sugg-text{font-size:13px;line-height:1.6}
.sugg-date{font-size:10px;color:var(--muted);margin-top:5px}
.online-dot{width:8px;height:8px;border-radius:50%;background:var(--green);display:inline-block;margin-left:5px;animation:pls 2s infinite}
.flex{display:flex}.ic{align-items:center}.jb{justify-content:space-between}
.mt2{margin-top:8px}.mt3{margin-top:12px}.mb2{margin-bottom:8px}
.muted{color:var(--muted)}.bold{font-weight:700}
`;

/* ══ HELPERS ══ */
const AV_COLORS=['linear-gradient(135deg,#f0c040,#e69000)','linear-gradient(135deg,#4fa3e0,#1a6db0)','linear-gradient(135deg,#2ecc71,#1a8a45)','linear-gradient(135deg,#9b59b6,#6c3480)','linear-gradient(135deg,#e74c3c,#a82020)','linear-gradient(135deg,#1abc9c,#0f7560)','linear-gradient(135deg,#f39c12,#b5720c)','linear-gradient(135deg,#e91e63,#a0105a)','linear-gradient(135deg,#00bcd4,#007a8a)','linear-gradient(135deg,#ff5722,#b22000)'];
const mkI=n=>n.trim().split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const genCode=()=>Math.floor(100000+Math.random()*900000).toString();
const fmtMs=ms=>{if(!ms||ms<=0)return'00:00';const s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),sec=s%60;if(d>0)return`${d} يوم ${h}س ${m}د`;if(h>0)return`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;return`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;};
const shuffle=arr=>[...arr].sort(()=>Math.random()-.5);

function Stars(){const s=Array.from({length:50},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*2+.4,d:Math.random()*3,dur:Math.random()*2+2}));return <div className="stars">{s.map(st=><div key={st.id} className="star" style={{left:`${st.x}%`,top:`${st.y}%`,width:st.sz,height:st.sz,animationDelay:`${st.d}s`,animationDuration:`${st.dur}s`}}/>)}</div>;}
function Notif({msg}){if(!msg)return null;const c={success:'ns',error:'ne',info:'ni',gold:'ng'};return <div className={`notif ${c[msg.type]||'ni'}`}>{msg.text}</div>;}
function Av({p,sz=35,fs=13}){const idx=(p?.colorIdx||0)%AV_COLORS.length;const bg=!p?'#333':p.status==='active'?AV_COLORS[idx]:p.status==='cheater'?'linear-gradient(135deg,#e63950,#a0102a)':'linear-gradient(135deg,#333,#1a1a1a)';return <div className="pi-av" style={{width:sz,height:sz,fontSize:fs,background:bg,color:'#07070f'}}>{p?.initials}</div>;}

/* ══════════════════════════════════════════════════
   FIREBASE HELPERS
══════════════════════════════════════════════════ */
const roomRef  = code => ref(db, `rooms/${code}`);
const playersRef = code => ref(db, `rooms/${code}/players`);
const attacksRef = code => ref(db, `rooms/${code}/currentRound/attacks`);
const gameRef  = code => ref(db, `rooms/${code}/game`);

/* ══════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════ */
export default function App() {
  /* ── NAV ── */
  const [tab, setTab]           = useState('game');
  const [gameScreen, setGameScreen] = useState('home');

  /* ── SESSION ── */
  const [role, setRole]         = useState(null);     // 'admin' | 'player'
  const [myId, setMyId]         = useState(null);     // firebase player key
  const [myNickLocal, setMyNickLocal] = useState(''); // player's own nick

  /* ── ROOM (live from Firebase) ── */
  const [roomCode, setRoomCode] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [joinErr, setJoinErr]   = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinNick, setJoinNick] = useState('');
  const [joinNick2, setJoinNick2] = useState('');

  /* ── LIVE GAME STATE (synced from Firebase) ── */
  const [gameState, setGameState] = useState(null);   // rooms/{code}/game
  const [players, setPlayers]    = useState({});      // rooms/{code}/players
  const [attacks, setAttacks]    = useState({});      // rooms/{code}/currentRound/attacks
  const [allRoundsData, setAllRoundsData] = useState({}); // rooms/{code}/rounds

  /* ── ADMIN LOCAL ── */
  const [nickMode, setNickMode]  = useState(1);
  const [form, setForm]          = useState({name:'',nick:'',nick2:''});
  const [attackDur, setAttackDur] = useState({h:0, m:30, s:0});

  /* ── ATTACK SELECTION ── */
  const [myNick, setMyNick]      = useState(null);
  const [myGuess, setMyGuess]    = useState(null);
  const [mySubmitted, setMySubmitted] = useState(false);
  const [proxyFor, setProxyFor]  = useState(null);    // player id admin attacks for

  /* ── UI ── */
  const [notifs, setNotifs]      = useState([]);
  const [modal, setModal]        = useState(null);
  const [statsTab, setStatsTab]  = useState('round');
  const [suggForm, setSuggForm]  = useState({cat:'لعبة', text:''});
  const [suggestions]            = useState([{id:1,cat:'تصميم',text:'وضع داكن أكثر',date:'2025-03-10'},{id:2,cat:'لعبة',text:'مؤقت صوتي عند النهاية',date:'2025-03-12'}]);
  const [countdown, setCountdown] = useState(null);

  /* ── REFS ── */
  const listenersRef = useRef([]);

  /* ── DERIVED ── */
  const playersList  = Object.entries(players).map(([id,p])=>({...p, id}));
  const activePlayers= playersList.filter(p=>p.status==='active');
  const elimPlayers  = playersList.filter(p=>p.status!=='active');
  const attacksList  = Object.values(attacks||{});
  const submittedCount = attacksList.length;
  const allSubmitted = activePlayers.length > 0 && submittedCount >= activePlayers.length;
  const phase        = gameState?.phase || 'lobby';
  const roundNum     = gameState?.roundNum || 0;
  const roundOrder   = gameState?.roundOrder || {nicks:[], names:[]};
  const deadline     = gameState?.deadline || null;
  const allRoundsList= Object.values(allRoundsData||{}).sort((a,b)=>a.round-b.round);
  const allAttacksFlat = allRoundsList.flatMap(r=>Object.values(r.attacks||{}));
  const hasNews      = true;
  const SUPPORT_EMAIL= 'support@nickname-game.app';

  /* ══ FIREBASE LISTENERS ══ */
  useEffect(()=>{
    if(!roomCode) return;
    // game state
    const gRef = gameRef(roomCode);
    const unsub1 = onValue(gRef, snap=>{ setGameState(snap.val()); });
    // players
    const pRef = playersRef(roomCode);
    const unsub2 = onValue(pRef, snap=>{ setPlayers(snap.val()||{}); });
    // attacks
    const aRef = attacksRef(roomCode);
    const unsub3 = onValue(aRef, snap=>{ setAttacks(snap.val()||{}); });
    // all rounds
    const rRef = ref(db, `rooms/${roomCode}/rounds`);
    const unsub4 = onValue(rRef, snap=>{ setAllRoundsData(snap.val()||{}); });

    return ()=>{ off(gRef); off(pRef); off(aRef); off(rRef); };
  }, [roomCode]);

  /* ══ COUNTDOWN ══ */
  useEffect(()=>{
    if(!deadline){ setCountdown(null); return; }
    const tick=()=>{
      const rem = deadline - Date.now();
      if(rem<=0){
        setCountdown(0);
        if(phase==='attacking' && role==='admin') doReveal();
      } else setCountdown(rem);
    };
    tick();
    const t = setInterval(tick, 500);
    return()=>clearInterval(t);
  },[deadline, phase]);

  /* ══ AUTO-NAVIGATE based on phase ══ */
  useEffect(()=>{
    if(!gameState) return;
    if(phase==='attacking')   { setGameScreen('attack'); setMyNick(null); setMyGuess(null); setMySubmitted(false); setProxyFor(null); }
    if(phase==='revealing')   setGameScreen('results');
    if(phase==='ended')       setGameScreen('winner');
  },[phase]);

  /* ══ HELPERS ══ */
  const notify=(text,type='info')=>{const id=Date.now()+Math.random();setNotifs(p=>[...p,{id,text,type}]);setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),3200);};
  const totalMs=()=>Math.max((Number(attackDur.h)*3600+Number(attackDur.m)*60+Number(attackDur.s))*1000,5*60*1000);
  const cdInfo=()=>{if(countdown===null)return{label:'—',urgent:false};if(countdown<=0)return{label:'انتهى الوقت!',urgent:true};return{label:fmtMs(countdown),urgent:countdown<5*60*1000};};

  /* ══ ADMIN: CREATE ROOM ══ */
  const createRoom = async () => {
    const code = genCode();
    setRoomCode(code);
    await set(roomRef(code), {
      game: { phase:'lobby', roundNum:0, createdAt: Date.now() },
      players: {},
    });
    setRole('admin');
    setGameScreen('admin');
    notify(`✅ الغرفة جاهزة: ${code}`, 'gold');
  };

  /* ══ ADMIN: ADD PLAYER ══ */
  const addPlayer = async () => {
    const {name, nick, nick2} = form;
    if(!name.trim()||!nick.trim()){notify('أدخل الاسم واللقب','error');return;}
    if(nickMode===2&&!nick2.trim()){notify('أدخل اللقب الثاني','error');return;}
    const allNicks = playersList.flatMap(p=>[p.nick,p.nick2].filter(Boolean));
    if(allNicks.includes(nick.trim())){notify('اللقب الأول مأخوذ!','error');return;}
    if(nickMode===2&&allNicks.includes(nick2.trim())){notify('اللقب الثاني مأخوذ!','error');return;}
    const newRef = push(playersRef(roomCode));
    await set(newRef, {
      name:name.trim(), nick:nick.trim(),
      nick2: nickMode===2 ? nick2.trim() : null,
      initials: mkI(name.trim()),
      colorIdx: playersList.length % AV_COLORS.length,
      status:'active', missedRounds:0,
    });
    setForm({name:'',nick:'',nick2:''});
    notify(`✅ أضيف ${name.trim()}`, 'success');
  };

  /* ══ PLAYER: JOIN ROOM ══ */
  const joinRoom = async () => {
    setJoinErr('');
    if(joinInput.length!==6){setJoinErr('الرمز 6 أرقام');return;}
    if(!joinName.trim()||!joinNick.trim()){setJoinErr('أدخل اسمك ولقبك');return;}
    try {
      const snap = await get(roomRef(joinInput));
      if(!snap.exists()){setJoinErr('الغرفة غير موجودة');return;}
      const data = snap.val();
      if(data.game?.phase!=='lobby'){setJoinErr('اللعبة بدأت — لا يمكن الانضمام');return;}
      // check nick not taken
      const existingNicks = Object.values(data.players||{}).flatMap(p=>[p.nick,p.nick2].filter(Boolean));
      if(existingNicks.includes(joinNick.trim())){setJoinErr('اللقب مأخوذ — اختر لقباً آخر');return;}
      const newRef = push(playersRef(joinInput));
      await set(newRef, {
        name:joinName.trim(), nick:joinNick.trim(), nick2:null,
        initials:mkI(joinName.trim()),
        colorIdx: Object.keys(data.players||{}).length % AV_COLORS.length,
        status:'active', missedRounds:0,
      });
      setMyId(newRef.key);
      setMyNickLocal(joinNick.trim());
      setRoomCode(joinInput);
      setRole('player');
      setGameScreen('attack');
      notify('✅ انضممت للعبة!', 'success');
    } catch(e) {
      setJoinErr('خطأ في الاتصال — تحقق من الإنترنت');
    }
  };

  /* ══ ADMIN: START GAME / LAUNCH ROUND ══ */
  const launchRound = async (rn) => {
    const dl = Date.now() + totalMs();
    const allNicks = shuffle(playersList.flatMap(p=>[p.nick,p.nick2].filter(Boolean)));
    const allNames = shuffle(playersList.map(p=>p.id));
    // clear previous attacks
    await set(ref(db, `rooms/${roomCode}/currentRound`), { attacks:{} });
    await update(gameRef(roomCode), {
      phase:'attacking',
      roundNum: rn,
      deadline: dl,
      roundOrder: { nicks:allNicks, names:allNames },
    });
    notify(`🔔 الجولة ${rn} بدأت!`, 'gold');
  };

  const startGame = async () => {
    if(activePlayers.length<6){notify('يلزم 6 لاعبين على الأقل','error');return;}
    await launchRound(1);
  };

  /* ══ PLAYER: SUBMIT ATTACK ══ */
  const submitAttack = async (attackerNickOverride=null) => {
    if(!myNick||!myGuess){notify('اختر لقباً وحدد صاحبه','error');return;}
    const guessedPlayer = playersList.find(p=>p.id===myGuess);
    const realOwner = playersList.find(p=>p.nick===myNick||p.nick2===myNick);
    if(!realOwner){notify('لقب غير موجود!','error');return;}
    const correct = guessedPlayer?.id === realOwner.id;
    const attackerNick = attackerNickOverride || myNickLocal || '(لاعب)';
    const newAttackRef = push(attacksRef(roomCode));
    await set(newAttackRef, {
      attackerNick,
      attackerId: myId || attackerNickOverride,
      targetNick: myNick,
      guessedId: myGuess,
      guessedName: guessedPlayer?.name,
      realOwnerId: realOwner.id,
      realOwnerName: realOwner.name,
      correct,
      time: Date.now(),
    });
    setMySubmitted(true);
    setProxyFor(null);
    notify('✅ تم إرسال الهجوم!', 'gold');
  };

  /* ══ ADMIN: REVEAL ══ */
  const doReveal = async () => {
    if(phase!=='attacking') return;
    const currentAttacks = Object.values(attacks||{});
    const notSent = activePlayers.filter(p=>!currentAttacks.some(a=>a.attackerNick===p.nick));
    if(notSent.length>0 && !modal){
      setModal({type:'confirm_reveal', notSent});
      return;
    }
    setModal(null);
    await processReveal(currentAttacks);
  };

  const processReveal = async (currentAttacks) => {
    const elimIds = new Set(currentAttacks.filter(a=>a.correct).map(a=>a.realOwnerId));
    const updates = {};
    for(const p of playersList){
      if(elimIds.has(p.id)){
        const who = currentAttacks.find(a=>a.realOwnerId===p.id&&a.correct);
        updates[`rooms/${roomCode}/players/${p.id}/status`]='eliminated';
        updates[`rooms/${roomCode}/players/${p.id}/eliminatedBy`]=who?.attackerNick||'لاعب';
        updates[`rooms/${roomCode}/players/${p.id}/eliminatedRound`]=roundNum;
      } else if(p.status==='active'){
        const submitted = currentAttacks.some(a=>a.attackerNick===p.nick);
        const nm = submitted ? 0 : (p.missedRounds||0)+1;
        updates[`rooms/${roomCode}/players/${p.id}/missedRounds`]=nm;
        if(nm>=2){
          updates[`rooms/${roomCode}/players/${p.id}/status`]='inactive';
          updates[`rooms/${roomCode}/players/${p.id}/eliminatedRound`]=roundNum;
        }
      }
    }
    // save round to history
    const roundKey = `round_${roundNum}`;
    updates[`rooms/${roomCode}/rounds/${roundKey}`]={
      round: roundNum,
      attacks: attacks||{},
      endedAt: Date.now(),
    };
    // change phase
    updates[`rooms/${roomCode}/game/phase`]='revealing';
    await update(ref(db), updates);
  };

  /* ══ ADMIN: NEXT ROUND ══ */
  const nextRound = async () => {
    const still = playersList.filter(p=>p.status==='active');
    if(still.length<=1){ await update(gameRef(roomCode),{phase:'ended'}); return; }
    await launchRound(roundNum+1);
  };

  /* ══ ADMIN CONTROLS ══ */
  const extendTime = async (ms) => {
    await update(gameRef(roomCode),{deadline:(deadline||Date.now())+ms});
    notify(`⏱️ تمديد ${fmtMs(ms)}`,'gold');
  };
  const endGame = async () => { await update(gameRef(roomCode),{phase:'ended'}); };
  const elimCheat = async (pid) => {
    const p = playersList.find(pl=>pl.id===pid);
    await update(ref(db,`rooms/${roomCode}/players/${pid}`),{status:'cheater',eliminatedRound:roundNum,eliminatedBy:'المشرف'});
    notify(`🚫 أُخرج ${p?.name}`, 'error');
  };

  /* ══ STATS ══ */
  const nickHeatmap=()=>{const c={};allAttacksFlat.forEach(a=>{if(a.targetNick)c[a.targetNick]=(c[a.targetNick]||0)+1;});return Object.entries(c).sort((a,b)=>b[1]-a[1]);};
  const nameHeatmap=()=>{const c={};allAttacksFlat.forEach(a=>{if(a.guessedName)c[a.guessedName]=(c[a.guessedName]||0)+1;});return Object.entries(c).sort((a,b)=>b[1]-a[1]);};
  const mostHuntedNick=()=>{const h=nickHeatmap();return h[0]?{nick:h[0][0],count:h[0][1]}:null;};
  const leastHuntedNick=()=>{const h=nickHeatmap();const l=h[h.length-1];return l&&h.length>1?{nick:l[0],count:l[1]}:null;};
  const mostTargeted=()=>{const h=nameHeatmap();return h[0]?{name:h[0][0],count:h[0][1]}:null;};
  const leastTargeted=()=>{const h=nameHeatmap();const l=h[h.length-1];return l&&h.length>1?{name:l[0],count:l[1]}:null;};

  const cdi = cdInfo();

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */

  const renderGame = () => {

    /* ── HOME ── */
    if(gameScreen==='home') return(
      <div className="scr">
        <div style={{textAlign:'center',padding:'20px 0 10px'}}>
          <div style={{fontSize:56,marginBottom:6}}>🎭</div>
          <div className="ptitle" style={{fontSize:26}}>لعبة الألقاب</div>
          <div className="psub">أخفِ هويتك • الكل يهاجم معاً • اكشف الهويات</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <button className="btn bg" onClick={createRoom}>👑 إنشاء غرفة كمسؤول</button>
          <button className="btn bo" onClick={()=>setGameScreen('join')}>🎮 انضمام كلاعب برمز الغرفة</button>
        </div>
        <div className="div">قوانين اللعبة</div>
        {['🎭 اختر لقباً لا يمت بصلة لاهتماماتك','⚔️ الكل يهاجم في نفس الوقت — سرية تامة','🔓 النتائج تنكشف للجميع في لحظة واحدة','⏰ الوقت يحدده المشرف ويمكن تمديده','❌ جولتان بلا هجوم = خروج صامت بلا كشف لقبك','🚫 التعاون ممنوع — عقوبته الإخراج الفوري','👁️ الألقاب لا تُكشف كاملةً إلا في نهاية المسابقة'].map((r,i)=>(
          <div key={i} style={{padding:'7px 11px',marginBottom:4,background:'#0f0f22',borderRadius:8,fontSize:12,color:'var(--muted)',border:'1px solid rgba(255,255,255,.04)'}}>{r}</div>
        ))}
      </div>
    );

    /* ── JOIN ── */
    if(gameScreen==='join') return(
      <div className="scr">
        <button className="btn bgh bsm" style={{width:'auto',marginBottom:12}} onClick={()=>setGameScreen('home')}>← رجوع</button>
        <div className="ptitle">انضمام للعبة</div>
        <div className="psub">أدخل رمز الغرفة المرسل من المشرف</div>
        <div className="card">
          <div className="ig"><label className="lbl">🔢 رمز الغرفة (6 أرقام)</label>
            <input className={`inp big${joinErr?'err-b':''}`} placeholder="× × × × × ×" maxLength={6} value={joinInput} onChange={e=>{setJoinInput(e.target.value.replace(/\D/g,''));setJoinErr('');}}/>
          </div>
        </div>
        <div className="card">
          <div className="ctitle">👤 بياناتك</div>
          <div className="ig"><label className="lbl">اسمك الكامل</label><input className="inp" placeholder="محمد عبدالله" value={joinName} onChange={e=>setJoinName(e.target.value)}/></div>
          <div className="ig"><label className="lbl">لقبك الذي اخترته</label><input className="inp" placeholder="القناص" value={joinNick} onChange={e=>setJoinNick(e.target.value)}/></div>
          <div style={{background:'rgba(240,192,64,.06)',border:'1px solid rgba(240,192,64,.2)',borderRadius:8,padding:'8px 12px',fontSize:11,color:'var(--muted)'}}>💡 اختر لقباً لا يمت بصلة لاهتماماتك الحقيقية!</div>
          {joinErr&&<div className="err-msg">⚠️ {joinErr}</div>}
        </div>
        <button className="btn bg" onClick={joinRoom}>🚀 انضمام</button>
      </div>
    );

    /* ── ADMIN SETUP ── */
    if(gameScreen==='admin') return(
      <div className="scr">
        <div className="card">
          <div className="ctitle">📡 رمز الغرفة <span className="online-dot"/></div>
          <div className="room-code-big">{roomCode}</div>
          <div style={{textAlign:'center',fontSize:11,color:'var(--muted)',marginBottom:10}}>
            أرسل هذا الرمز للمتسابقين — {activePlayers.length} منضم الآن
          </div>
          <button className="btn bo bsm" style={{width:'auto',margin:'0 auto'}} onClick={()=>{navigator.clipboard?.writeText(roomCode);notify('تم النسخ ✓','success');}}>📋 نسخ الرمز</button>
        </div>

        <div className="card">
          <div className="ctitle">⚙️ إعدادات اللعبة</div>
          <div className="lbl mb2">عدد الألقاب لكل لاعب</div>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            {[1,2].map(n=><button key={n} className={`btn ${nickMode===n?'bg':'bgh'}`} style={{flex:1}} onClick={()=>setNickMode(n)}>{n===1?'لقب واحد':'لقبان'}</button>)}
          </div>
          <div className="lbl mb2">⏱️ مدة كل جولة</div>
          <div className="tpick">
            {[['h','ساعات'],['m','دقائق'],['s','ثواني']].map(([k,l])=>(
              <div key={k} className="tunit"><label>{l}</label>
                <input type="number" min="0" max={k==='h'?999:59} value={attackDur[k]} onChange={e=>setAttackDur(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:'var(--muted)',marginTop:7}}>مدة الجولة: <strong style={{color:'var(--gold)'}}>{fmtMs(totalMs())}</strong></div>
        </div>

        <div className="card">
          <div className="ctitle">➕ إضافة لاعب</div>
          <div className="ig"><label className="lbl">الاسم الكامل</label><input className="inp" placeholder="محمد عبدالله" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
          <div className="ig"><label className="lbl">اللقب {nickMode===2?'الأول':''}</label><input className="inp" placeholder="القناص" value={form.nick} onChange={e=>setForm(f=>({...f,nick:e.target.value}))}/></div>
          {nickMode===2&&<div className="ig"><label className="lbl">اللقب الثاني</label><input className="inp" placeholder="الصقر" value={form.nick2} onChange={e=>setForm(f=>({...f,nick2:e.target.value}))}/></div>}
          <button className="btn bg" onClick={addPlayer}>➕ إضافة</button>
        </div>

        {playersList.length>0&&<div className="card">
          <div className="ctitle">👥 المسجلون ({playersList.length})</div>
          <div className="sc">{playersList.map(p=>(
            <div key={p.id} className="pi"><Av p={p}/>
              <div className="pi-info"><div className="pi-name">{p.name}</div><div className="pi-nick">{p.nick}{p.nick2?` · ${p.nick2}`:''}</div></div>
              <button className="btn bgh bxs" onClick={async()=>{await set(ref(db,`rooms/${roomCode}/players/${p.id}`),null);}}>✕</button>
            </div>
          ))}</div>
        </div>}

        <div className="sg">
          <div className="sbox"><div className="snum">{playersList.length}</div><div className="slbl">مسجلون</div></div>
          <div className="sbox"><div className="snum" style={{color:'var(--green)'}}>{activePlayers.length}</div><div className="slbl">نشطون</div></div>
        </div>
        {activePlayers.length<6&&playersList.length>0&&<div style={{fontSize:12,color:'var(--red)',textAlign:'center',marginBottom:9}}>يلزم {6-activePlayers.length} لاعب إضافي</div>}
        <button className="btn bg" disabled={activePlayers.length<6} onClick={startGame} style={{marginBottom:8}}>🚀 بدء اللعبة ({activePlayers.length}/6+)</button>
        {phase!=='lobby'&&<button className="btn bb" onClick={()=>setGameScreen('attack')} style={{marginBottom:8}}>🎮 العودة للعبة</button>}
      </div>
    );

    /* ── ATTACK ── */
    if(gameScreen==='attack'){
      const displayNicks = roundOrder.nicks?.length>0 ? roundOrder.nicks : playersList.flatMap(p=>[p.nick,p.nick2].filter(Boolean));
      const displayNames = roundOrder.names?.length>0 ? roundOrder.names.map(id=>playersList.find(p=>p.id===id)).filter(Boolean) : playersList;
      const proxyPlayer  = proxyFor ? playersList.find(p=>p.id===proxyFor) : null;

      return(
        <div className="scr">
          {/* Timer */}
          <div className={`tbar${cdi.urgent?' urg':''}`}>
            <div style={{fontSize:20}}>{cdi.urgent?'🔴':'⏱️'}</div>
            <div style={{flex:1}}><div className={`tval${cdi.urgent?' urg':''}`}>{cdi.label}</div><div className="tlbl">متبقي للجولة {roundNum}</div></div>
            {role==='admin'&&<div style={{display:'flex',gap:4}}>
              <button className="btn bgh bxs" onClick={()=>extendTime(30*60*1000)}>+30د</button>
              <button className="btn br bxs" onClick={doReveal}>كشف</button>
              <button className="btn bgh bxs" onClick={()=>setGameScreen('admin_live')}>👑</button>
            </div>}
          </div>

          {/* Counter */}
          <div className="counter-bar">
            <div style={{fontSize:16}}>📨</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>
                {submittedCount}/{activePlayers.length} أرسلوا هجماتهم
                {allSubmitted&&<span style={{color:'var(--green)',fontSize:12,marginRight:6}}>✓ اكتمل!</span>}
              </div>
              <div className="counter-track mt2"><div className="counter-fill" style={{width:`${(submittedCount/Math.max(activePlayers.length,1))*100}%`}}/></div>
            </div>
            {allSubmitted&&role==='admin'&&<button className="btn bv bxs" onClick={doReveal}>كشف ▶</button>}
          </div>

          {/* Proxy banner */}
          {proxyPlayer&&<div className="ann ag" style={{marginBottom:10}}>
            <div style={{fontSize:12,color:'var(--muted)'}}>🎮 المشرف يهاجم نيابةً عن</div>
            <div style={{fontSize:16,fontWeight:700,color:'var(--gold)'}}>{proxyPlayer.name} — {proxyPlayer.nick}</div>
            <button className="btn bgh bsm" style={{width:'auto',margin:'8px auto 0'}} onClick={()=>{setProxyFor(null);setMyNick(null);setMyGuess(null);}}>إلغاء</button>
          </div>}

          {/* SUBMITTED */}
          {mySubmitted&&!proxyFor?(
            <div className="card">
              <div className="waiting-box">
                <div className="waiting-icon">⏳</div>
                <div className="waiting-title">تم إرسال الهجوم!</div>
                <div className="waiting-sub">
                  لقب مستهدف: <strong style={{color:'var(--gold)'}}>"{myNick}"</strong><br/>
                  تخمين: <strong>{playersList.find(p=>p.id===myGuess)?.name||'—'}</strong><br/><br/>
                  <span style={{fontSize:11}}>انتظر كشف النتائج من المشرف أو انتهاء الوقت 🔓</span>
                </div>
              </div>
            </div>
          ):(
            <>
              {/* NICK BOARD */}
              <div className="bwrap">
                <div className="blbl">🎭 لوحة الألقاب — اضغط لقباً للهجوم عليه</div>
                <div className="bgrid">
                  {displayNicks.map((nick,i)=>{
                    const owner=playersList.find(p=>p.nick===nick||p.nick2===nick);
                    const isElim=owner&&owner.status!=='active';
                    return(
                      <div key={i} className={`nt${isElim?' nd':myNick===nick?' nsel':''}`}
                        onClick={()=>{if(!isElim){setMyNick(nick);setMyGuess(null);}}}>
                        <div>{nick}</div>
                        {isElim&&<div className="nt-sub">✕ ج{owner.eliminatedRound}<br/>{owner.eliminatedBy?`👤 ${owner.eliminatedBy}`:''}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NAMES */}
              <div className="card">
                <div className="ctitle">
                  👥 قائمة الأسماء
                  {myNick?<span style={{color:'var(--text)',fontWeight:400,fontSize:11}}> — صاحب "<span style={{color:'var(--gold)'}}>{myNick}</span>" هو؟</span>
                    :<span style={{color:'var(--muted)',fontWeight:400,fontSize:11}}> — اختر لقباً أولاً</span>}
                </div>
                <div className="ngrid">
                  {displayNames.map(p=>{
                    const isElim=p.status!=='active';
                    return(
                      <div key={p.id} className={`nr${isElim?' nrd':myGuess===p.id?' nrsel':''}`}
                        onClick={()=>{if(!isElim&&myNick)setMyGuess(p.id);}}>
                        <Av p={p} sz={30} fs={11}/>
                        <div className="nr-info">
                          <div className="nr-name" style={isElim?{color:'var(--dim)'}:{}}>{p.name}</div>
                          {isElim&&<div className="nr-sub">"{p.nick}"{p.nick2?` / "${p.nick2}"`:''} — خرج ج{p.eliminatedRound}{p.eliminatedBy?` · ${p.eliminatedBy}`:''}</div>}
                        </div>
                        {myGuess===p.id&&<div style={{color:'var(--gold)',fontSize:16}}>✓</div>}
                      </div>
                    );
                  })}
                </div>
                {myNick&&myGuess?(
                  <button className="btn bg mt3" onClick={()=>submitAttack(proxyPlayer?.nick||null)}>
                    🎯 تأكيد الهجوم على "{myNick}"
                    {proxyPlayer&&<span style={{fontSize:11,fontWeight:400}}> (نيابةً عن {proxyPlayer.name})</span>}
                  </button>
                ):(
                  <div style={{textAlign:'center',color:'var(--muted)',fontSize:11,padding:'10px 0'}}>
                    {!myNick?'① اختر لقباً من اللوحة':'② اختر الشخص الذي تخمّن أنه صاحب اللقب'}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Graveyard */}
          {elimPlayers.length>0&&<div className="card">
            <div className="ctitle">⚰️ مقبرة الألقاب ({elimPlayers.length})</div>
            <div className="sc">
              {[...elimPlayers].sort((a,b)=>(b.eliminatedRound||0)-(a.eliminatedRound||0)).map(p=>(
                <div key={p.id} className="grave">
                  <div className="grave-name">{p.name}</div>
                  <div className="grave-nick">"{p.nick}"{p.nick2?` / "${p.nick2}"`:''}</div>
                  <div className="grave-info">{p.status==='cheater'?'🚫 غش':p.status==='inactive'?`😴 خمول — ج${p.eliminatedRound}`:`💥 خرج ج${p.eliminatedRound}${p.eliminatedBy?` — ${p.eliminatedBy}`:''}`}</div>
                </div>
              ))}
            </div>
          </div>}
        </div>
      );
    }

    /* ── ADMIN LIVE ── */
    if(gameScreen==='admin_live') return(
      <div className="scr">
        <button className="btn bgh bsm" style={{width:'auto',marginBottom:12}} onClick={()=>setGameScreen('attack')}>← رجوع للعبة</button>
        <div className="sg sg4">
          <div className="sbox"><div className="snum">{roundNum}</div><div className="slbl">الجولة</div></div>
          <div className="sbox"><div className="snum" style={{color:'var(--green)'}}>{activePlayers.length}</div><div className="slbl">نشطون</div></div>
          <div className="sbox"><div className="snum" style={{color:'var(--gold)'}}>{submittedCount}</div><div className="slbl">أرسلوا</div></div>
          <div className="sbox"><div className="snum" style={{color:'var(--red)'}}>{elimPlayers.length}</div><div className="slbl">خارجون</div></div>
        </div>
        <div className={`tbar${cdi.urgent?' urg':''}`}>
          <div style={{fontSize:18}}>{cdi.urgent?'🔴':'⏱️'}</div>
          <div style={{flex:1}}><div className={`tval${cdi.urgent?' urg':''}`}>{cdi.label}</div><div className="tlbl">متبقي</div></div>
        </div>
        <div className="counter-bar">
          <div style={{fontSize:16}}>📨</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700}}>{submittedCount}/{activePlayers.length} أرسلوا</div>
            <div className="counter-track mt2"><div className="counter-fill" style={{width:`${(submittedCount/Math.max(activePlayers.length,1))*100}%`}}/></div>
          </div>
        </div>
        <div style={{display:'flex',gap:7,marginBottom:10}}>
          <button className="btn bg" style={{flex:1}} onClick={()=>extendTime(30*60*1000)}>+30د</button>
          <button className="btn bg" style={{flex:1}} onClick={()=>extendTime(60*60*1000)}>+ساعة</button>
        </div>
        <button className="btn bv" style={{marginBottom:8}} onClick={doReveal}>🔓 كشف النتائج الآن</button>
        <button className="btn br" style={{marginBottom:8}} onClick={()=>setModal({type:'confirm_end'})}>🛑 إنهاء المسابقة</button>

        {/* حالة الإرسال + هجوم بالنيابة */}
        <div className="card">
          <div className="ctitle">📋 حالة اللاعبين</div>
          {activePlayers.map(p=>{
            const sent=attacksList.some(a=>a.attackerNick===p.nick);
            return(
              <div key={p.id} className="pi"><Av p={p}/>
                <div className="pi-info">
                  <div className="pi-name">{p.name} — <span style={{color:'var(--gold)'}}>{p.nick}</span></div>
                  <div style={{fontSize:11,color:sent?'var(--green)':'var(--muted)',marginTop:1}}>
                    {sent?'✅ أرسل':'⏳ لم يرسل'}{p.missedRounds>0?` · ⚠️ غاب ${p.missedRounds}`:''}
                  </div>
                </div>
                <div style={{display:'flex',gap:4}}>
                  {!sent&&<button className="btn bb bxs" onClick={()=>{setProxyFor(p.id);setMyNick(null);setMyGuess(null);setMySubmitted(false);setGameScreen('attack');}}>🎮</button>}
                  <button className="btn br bxs" onClick={()=>elimCheat(p.id)}>غش</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* سجل سري */}
        <div className="card">
          <div className="ctitle">🕵️ سجل الهجمات السري</div>
          {attacksList.length===0?<div style={{textAlign:'center',color:'var(--muted)',padding:14,fontSize:12}}>لا هجمات بعد</div>:
            <div className="sc">{attacksList.map((a,i)=>(
              <div key={i} style={{padding:'7px 10px',marginBottom:4,background:'#09091e',borderRadius:8,borderRight:`3px solid ${a.correct?'var(--green)':'var(--red)'}`,fontSize:12}}>
                <div style={{fontWeight:700}}>"{a.attackerNick}" ← "{a.targetNick}"</div>
                <div style={{color:'var(--muted)',marginTop:1}}>خمّن: {a.guessedName} / الحقيقي: {a.realOwnerName} <span style={{color:a.correct?'var(--green)':'var(--red)'}}>{a.correct?'✅':'❌'}</span></div>
              </div>
            ))}</div>}
        </div>
      </div>
    );

    /* ── RESULTS ── */
    if(gameScreen==='results'){
      const lastRound = allRoundsList[allRoundsList.length-1];
      const atks = Object.values(lastRound?.attacks||attacks||{});
      const correct=atks.filter(a=>a.correct);
      const wrong=atks.filter(a=>!a.correct);
      const mh=mostHuntedNick(),lh=leastHuntedNick(),mt=mostTargeted(),lt=leastTargeted();
      const nickStats=atks.reduce((acc,a)=>{if(a.targetNick){acc[a.targetNick]=acc[a.targetNick]||{total:0,suc:0};acc[a.targetNick].total++;if(a.correct)acc[a.targetNick].suc++;}return acc;},{});
      return(
        <div className="scr">
          <div className="ptitle">🔓 كُشفت النتائج!</div>
          <div className="psub">الجولة {roundNum} — للجميع في نفس اللحظة</div>
          <div className="sg sg3">
            <div className="sbox"><div className="snum">{atks.length}</div><div className="slbl">هجمات</div></div>
            <div className="sbox"><div className="snum" style={{color:'var(--green)'}}>{correct.length}</div><div className="slbl">إصابات ✅</div></div>
            <div className="sbox"><div className="snum" style={{color:'var(--red)'}}>{wrong.length}</div><div className="slbl">فشل ❌</div></div>
          </div>

          {/* إحصائيات إثارة — عامة */}
          <div className="sg">
            {mh&&<div className="hunted"><div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>🔥 أكثر لقب مطاردة</div><div style={{fontFamily:'Cairo',fontSize:18,fontWeight:900,color:'var(--gold)'}}>{mh.nick}</div><div style={{fontSize:10,color:'var(--muted)'}}>{mh.count} هجمة</div></div>}
            {lh&&<div className="hunted least"><div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>🛡️ أقل لقب استهدافاً</div><div style={{fontFamily:'Cairo',fontSize:18,fontWeight:900,color:'var(--blue)'}}>{lh.nick}</div><div style={{fontSize:10,color:'var(--muted)'}}>{lh.count} هجمة</div></div>}
          </div>
          <div className="sg">
            {mt&&<div className="card2" style={{marginBottom:0,textAlign:'center'}}><div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>🎯 أكثر مستهدفاً</div><div style={{fontWeight:700,fontSize:14}}>{mt.name}</div><div style={{fontSize:10,color:'var(--muted)'}}>{mt.count} محاولة</div></div>}
            {lt&&<div className="card2" style={{marginBottom:0,textAlign:'center'}}><div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>👻 أقل استهدافاً</div><div style={{fontWeight:700,fontSize:14}}>{lt.name}</div><div style={{fontSize:10,color:'var(--muted)'}}>{lt.count} محاولة</div></div>}
          </div>

          {correct.length>0&&<div className="card" style={{marginTop:10}}>
            <div className="ctitle">💥 كُشفت الهويات</div>
            {correct.map((a,i)=>{const elim=playersList.find(p=>p.id===a.realOwnerId);return(
              <div key={i} className="ann ar" style={{marginBottom:8,padding:'11px 13px',textAlign:'right'}}>
                <div style={{display:'flex',alignItems:'center',gap:9}}>
                  <Av p={{...elim,status:'eliminated'}} sz={32} fs={11}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>تم كشف "<span style={{color:'var(--gold)'}}>{elim?.nick}</span>"!</div>
                    <div style={{fontSize:12,color:'var(--text)',marginTop:2}}>الشخص خلف اللقب: <strong>{elim?.name}</strong></div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:1}}>أخرجه: <span style={{color:'var(--gold)'}}>{a.attackerNick}</span> — ج{roundNum}</div>
                  </div>
                  <span className="badge brd">خرج</span>
                </div>
              </div>
            );})}
          </div>}

          {Object.keys(nickStats).length>0&&<div className="card">
            <div className="ctitle">📋 تقرير الألقاب</div>
            {Object.entries(nickStats).sort((a,b)=>b[1].total-a[1].total).map(([nick,st])=>(
              <div key={nick} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 10px',background:'#09091e',borderRadius:8,marginBottom:4,fontSize:12}}>
                <div style={{fontWeight:700,flex:1}}>{nick}</div>
                <div className="tag tb">{st.total} هجمة</div>
                {st.suc>0?<div className="tag tv">✅ كُشف</div>:<div className="tag tm">صامد</div>}
              </div>
            ))}
          </div>}

          <div className="card">
            <div className="ctitle">👥 المتبقون ({activePlayers.length})</div>
            {activePlayers.map(p=>(
              <div key={p.id} className="pi"><Av p={p}/>
                <div className="pi-info"><div className="pi-name">{p.name}</div><div className="pi-sub" style={{color:'var(--muted)'}}>لقبه مخفي 🔒</div></div>
                {role==='admin'&&<button className="btn br bxs" onClick={()=>elimCheat(p.id)}>غش</button>}
              </div>
            ))}
          </div>

          {role==='admin'&&(activePlayers.length<=1?<button className="btn bg" onClick={endGame}>🏆 إعلان الفائز</button>:<button className="btn bg" onClick={nextRound}>▶️ الجولة {roundNum+1}</button>)}
          <button className="btn bgh mt2" onClick={()=>setGameScreen('stats')}>📊 الإحصائيات</button>
        </div>
      );
    }

    /* ── STATS ── */
    if(gameScreen==='stats') return(
      <div className="scr">
        <button className="btn bgh bsm" style={{width:'auto',marginBottom:12}} onClick={()=>setGameScreen('attack')}>← رجوع</button>
        <div className="tabs">{[['round','الجولة'],['all','الكل'],['players','اللاعبون']].map(([k,l])=>(
          <button key={k} className={`tab${statsTab===k?' on':''}`} onClick={()=>setStatsTab(k)}>{l}</button>
        ))}</div>

        {statsTab==='round'&&<>
          <div className="sg">
            <div className="sbox"><div className="snum">{attacksList.length}</div><div className="slbl">هجمات الجولة</div></div>
            <div className="sbox"><div className="snum" style={{color:'var(--green)'}}>{attacksList.filter(a=>a.correct).length}</div><div className="slbl">إصابات</div></div>
          </div>
          {role==='admin'&&attacksList.length>0&&<>
            <div style={{fontSize:11,color:'var(--gold)',marginBottom:8,fontWeight:700}}>🕵️ التفاصيل — للمشرف فقط</div>
            {attacksList.map((a,i)=>(
              <div key={i} style={{padding:'7px 10px',marginBottom:4,background:'#09091e',borderRadius:8,borderRight:`3px solid ${a.correct?'var(--green)':'var(--red)'}`,fontSize:12}}>
                <div style={{fontWeight:700}}>"{a.attackerNick}" هاجم "{a.targetNick}"</div>
                <div style={{color:'var(--muted)',marginTop:1}}>خمّن: {a.guessedName} / الحقيقي: {a.realOwnerName} <span style={{color:a.correct?'var(--green)':'var(--red)'}}>{a.correct?'✅':'❌'}</span></div>
              </div>
            ))}
          </>}
          {role!=='admin'&&<div style={{textAlign:'center',color:'var(--muted)',padding:18,fontSize:12}}>التفاصيل الكاملة للمشرف فقط — ستُكشف في نهاية المسابقة 🔒</div>}
        </>}

        {statsTab==='all'&&<>
          <div className="sg">
            <div className="sbox"><div className="snum">{allRoundsList.length}</div><div className="slbl">جولات</div></div>
            <div className="sbox"><div className="snum">{allAttacksFlat.length}</div><div className="slbl">هجمات</div></div>
            <div className="sbox"><div className="snum" style={{color:'var(--green)'}}>{allAttacksFlat.filter(a=>a.correct).length}</div><div className="slbl">إصابات</div></div>
            <div className="sbox"><div className="snum" style={{color:'var(--red)'}}>{elimPlayers.length}</div><div className="slbl">خارجون</div></div>
          </div>
          <div className="sg">
            {mostHuntedNick()&&<div className="hunted"><div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>🔥 أكثر لقب مطاردة</div><div style={{fontFamily:'Cairo',fontSize:18,fontWeight:900,color:'var(--gold)'}}>{mostHuntedNick()?.nick}</div><div style={{fontSize:10,color:'var(--muted)'}}>{mostHuntedNick()?.count} هجمة</div></div>}
            {leastHuntedNick()&&<div className="hunted least"><div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>🛡️ أقل لقب استهداف</div><div style={{fontFamily:'Cairo',fontSize:18,fontWeight:900,color:'var(--blue)'}}>{leastHuntedNick()?.nick}</div><div style={{fontSize:10,color:'var(--muted)'}}>{leastHuntedNick()?.count} هجمة</div></div>}
          </div>
          {allRoundsList.map((r,i)=>{
            const ratks=Object.values(r.attacks||{});
            return(
              <div key={i} className="card">
                <div className="ctitle">الجولة {r.round}</div>
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:7}}>
                  <div className="tag tb">{ratks.length} هجمة</div>
                  <div className="tag tv">{ratks.filter(a=>a.correct).length} إصابة</div>
                  <div className="tag tr">{ratks.filter(a=>!a.correct).length} فشل</div>
                </div>
                {role==='admin'&&ratks.map((a,j)=>(
                  <div key={j} style={{padding:'5px 9px',marginBottom:3,background:'#09091e',borderRadius:7,borderRight:`2px solid ${a.correct?'var(--green)':'var(--red)'}`,fontSize:11}}>
                    "{a.attackerNick}" → "{a.targetNick}" | خمّن: {a.guessedName} <span style={{color:a.correct?'var(--green)':'var(--red)'}}>{a.correct?'✅':'❌'}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </>}

        {statsTab==='players'&&playersList.map(p=>{
          const myAtks=allAttacksFlat.filter(a=>a.attackerNick===p.nick);
          const myHits=myAtks.filter(a=>a.correct);
          const tgtd=allAttacksFlat.filter(a=>a.realOwnerId===p.id);
          return(
            <div key={p.id} className="card">
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
                <Av p={p} sz={33} fs={12}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{p.name}</div>
                  <div style={{fontSize:11,color:role==='admin'?'var(--gold)':'var(--muted)'}}>{role==='admin'?`${p.nick}${p.nick2?` · ${p.nick2}`:''}`:p.status!=='active'?`${p.nick}${p.nick2?` · ${p.nick2}`:''}`:'لقبه مخفي 🔒'}</div>
                </div>
                <div>{p.status==='active'?<span className="badge bvd">نشط</span>:p.status==='cheater'?<span className="badge brd">غش</span>:p.status==='inactive'?<span className="badge brd">خمول</span>:<span className="badge brd">خرج ج{p.eliminatedRound}</span>}</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}>
                {[[role==='admin'?myAtks.length:'—','هجماته','var(--gold)'],[role==='admin'?myHits.length:'—','إصاباته','var(--green)'],[tgtd.length,'استُهدف','var(--red)']].map(([n,l,c],i)=>(
                  <div key={i} style={{background:'#09091e',borderRadius:6,padding:'7px 4px',textAlign:'center'}}>
                    <div style={{fontWeight:900,fontSize:16,color:c,fontFamily:'Cairo'}}>{n}</div>
                    <div style={{color:'var(--muted)',fontSize:10}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );

    /* ── WINNER ── */
    if(gameScreen==='winner'){
      const sortedP=[...playersList].sort((a,b)=>{if(a.status==='active'&&b.status!=='active')return -1;if(a.status!=='active'&&b.status==='active')return 1;return(b.eliminatedRound||0)-(a.eliminatedRound||0);});
      const totalCorrect=allAttacksFlat.filter(a=>a.correct).length;
      const accuracy=allAttacksFlat.length>0?Math.round((totalCorrect/allAttacksFlat.length)*100):0;
      const attackerMap={};allAttacksFlat.forEach(a=>{if(a.attackerNick&&a.correct)attackerMap[a.attackerNick]=(attackerMap[a.attackerNick]||0)+1;});
      const topAttacker=Object.entries(attackerMap).sort((a,b)=>b[1]-a[1])[0];
      const targetedMap={};allAttacksFlat.forEach(a=>{if(a.realOwnerId)targetedMap[a.realOwnerId]=(targetedMap[a.realOwnerId]||0)+1;});
      const bestRound=allRoundsList.map(r=>({round:r.round,elim:Object.values(r.attacks||{}).filter(a=>a.correct).length})).sort((a,b)=>b.elim-a.elim)[0];
      const winners=activePlayers;

      return(
        <div className="scr">
          <div className="ptitle" style={{fontSize:25}}>🎉 انتهت المسابقة!</div>
          <div className="psub">بعد {roundNum} جولة — تقرير مفصل بمسار اللعبة</div>

          {winners.map((w,i)=>(
            <div key={w.id} className="wcard"><div className="wcrown">{i===0?'👑':'🥈'}</div>
              <div style={{fontFamily:'Cairo',fontSize:20,fontWeight:900,color:'var(--gold)'}}>{w.name}</div>
              <div style={{fontSize:13,color:'var(--text)',marginTop:3}}>"{w.nick}"</div>
              {w.nick2&&<div style={{fontSize:11,color:'var(--muted)'}}>/ "{w.nick2}"</div>}
            </div>
          ))}

          <div className="card">
            <div className="ctitle">📊 ملخص المسابقة</div>
            <div className="sg sg4">
              <div className="sbox"><div className="snum">{roundNum}</div><div className="slbl">جولات</div></div>
              <div className="sbox"><div className="snum">{allAttacksFlat.length}</div><div className="slbl">هجمات</div></div>
              <div className="sbox"><div className="snum" style={{color:'var(--green)'}}>{totalCorrect}</div><div className="slbl">إصابات</div></div>
              <div className="sbox"><div className="snum" style={{color:'var(--gold)'}}>{accuracy}%</div><div className="slbl">دقة</div></div>
            </div>
          </div>

          <div className="card">
            <div className="ctitle">🌟 أبرز اللحظات</div>
            {topAttacker&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:'#09091e',borderRadius:9,marginBottom:6}}>
              <div style={{fontSize:20}}>⚔️</div>
              <div><div style={{fontSize:12,color:'var(--muted)'}}>المهاجم الأشرس</div>
              <div style={{fontWeight:700,fontSize:14}}>{topAttacker[0]} <span style={{color:'var(--green)',fontSize:12}}>({topAttacker[1]} إصابة)</span></div></div>
            </div>}
            {bestRound&&bestRound.elim>0&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:'#09091e',borderRadius:9,marginBottom:6}}>
              <div style={{fontSize:20}}>💥</div>
              <div><div style={{fontSize:12,color:'var(--muted)'}}>الجولة الأكثر إثارةً</div>
              <div style={{fontWeight:700,fontSize:14}}>الجولة {bestRound.round} <span style={{color:'var(--red)',fontSize:12}}>({bestRound.elim} كشف)</span></div></div>
            </div>}
          </div>

          <div className="card">
            <div className="ctitle">🗓️ مسار اللعبة جولة بجولة</div>
            {allRoundsList.map((r,i)=>{
              const ratks=Object.values(r.attacks||{});
              const elims=ratks.filter(a=>a.correct);
              const inactive=playersList.filter(p=>p.status==='inactive'&&p.eliminatedRound===r.round);
              const cheaters=playersList.filter(p=>p.status==='cheater'&&p.eliminatedRound===r.round);
              return(
                <div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                    <div style={{fontWeight:700,fontSize:13,color:'var(--gold)'}}>الجولة {r.round}</div>
                    <div style={{display:'flex',gap:5}}><span className="tag tb">{ratks.length} هجمة</span><span className="tag tv">{elims.length} كشف</span></div>
                  </div>
                  {elims.length===0&&inactive.length===0&&cheaters.length===0&&<div style={{fontSize:11,color:'var(--muted)'}}>لم يخرج أحد هذه الجولة</div>}
                  {elims.map((a,j)=>{const victim=playersList.find(p=>p.id===a.realOwnerId);return(
                    <div key={j} style={{fontSize:12,padding:'5px 9px',background:'rgba(230,57,80,.07)',borderRadius:7,marginBottom:3,borderRight:'2px solid var(--red)'}}>
                      💥 كُشف <strong>"{victim?.nick}"</strong> ({victim?.name}) — أخرجه <span style={{color:'var(--gold)'}}>{a.attackerNick}</span>
                    </div>
                  );})}
                  {inactive.map((p,j)=><div key={j} style={{fontSize:12,padding:'5px 9px',background:'rgba(122,116,160,.07)',borderRadius:7,marginBottom:3,borderRight:'2px solid var(--muted)'}}>😴 خرج <strong>{p.name}</strong> لعدم الهجوم جولتين</div>)}
                  {cheaters.map((p,j)=><div key={j} style={{fontSize:12,padding:'5px 9px',background:'rgba(230,57,80,.07)',borderRadius:7,marginBottom:3,borderRight:'2px solid var(--red)'}}>🚫 أُخرج <strong>{p.name}</strong> بسبب الغش</div>)}
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="ctitle">🎭 الكشف الكامل — جميع الألقاب</div>
            {sortedP.map(p=>(
              <div key={p.id} className={`pi${p.status!=='active'?' dim':''}`}><Av p={p}/>
                <div className="pi-info"><div className="pi-name">{p.name}</div><div className="pi-nick">{p.nick}{p.nick2?` · ${p.nick2}`:''}</div>
                  {p.status!=='active'&&<div className="pi-sub">{p.status==='cheater'?'🚫 غش':p.status==='inactive'?`😴 خمول — ج${p.eliminatedRound}`:`💥 خرج ج${p.eliminatedRound}${p.eliminatedBy?` — أخرجه ${p.eliminatedBy}`:''}`}</div>}
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                  {p.status==='active'?<span className="tag tg">🏆</span>:p.status==='cheater'?<span className="tag tr">🚫</span>:<span className="tag tm">ج{p.eliminatedRound}</span>}
                  <span style={{fontSize:10,color:'var(--muted)'}}>{allAttacksFlat.filter(a=>a.realOwnerId===p.id).length} هجمة عليه</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="ctitle">📋 تقرير كل لاعب</div>
            {sortedP.map(p=>{
              const myAtks=allAttacksFlat.filter(a=>a.attackerNick===p.nick);
              const myHits=myAtks.filter(a=>a.correct);
              const timesTargeted=allAttacksFlat.filter(a=>a.realOwnerId===p.id).length;
              const timesGuessed=allAttacksFlat.filter(a=>a.guessedId===p.id).length;
              return(
                <div key={p.id} style={{marginBottom:10,paddingBottom:10,borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                    <Av p={p} sz={30} fs={11}/>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{p.name}</div><div style={{fontSize:11,color:'var(--gold)'}}>{p.nick}{p.nick2?` · ${p.nick2}`:''}</div></div>
                    {p.status==='active'?<span className="badge bvd">فائز 🏆</span>:p.status==='cheater'?<span className="badge brd">غش</span>:p.status==='inactive'?<span className="badge brd">خمول</span>:<span className="badge brd">خرج ج{p.eliminatedRound}</span>}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                    {[[myAtks.length,'هجماته','var(--gold)'],[myHits.length,'إصاباته','var(--green)'],[timesTargeted,'كُشف عنه','var(--red)'],[timesGuessed,'خُمّن هو','var(--blue)']].map(([n,l,col],i)=>(
                      <div key={i} style={{background:'#09091e',borderRadius:6,padding:'6px 4px',textAlign:'center'}}>
                        <div style={{fontWeight:900,fontSize:15,color:col,fontFamily:'Cairo'}}>{n}</div>
                        <div style={{color:'var(--muted)',fontSize:9}}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn bgh mt2" onClick={()=>setGameScreen('stats')}>📊 الإحصائيات التفصيلية</button>
        </div>
      );
    }

    return null;
  };

  /* ══ OTHER TABS ══ */
  const renderNews=()=>(
    <div className="scr">
      <div className="ptitle">🔔 آخر الأخبار</div>
      <div className="psub">تحديثات التطبيق والميزات الجديدة</div>
      {[{id:1,date:'2025-03-29',title:'🎉 إطلاق النسخة التجريبية',body:'تم إطلاق لعبة الألقاب رسمياً مع دعم الغرف الحقيقية عبر Firebase!',isNew:true},{id:2,date:'2025-03-25',title:'⚡ نظام الهجوم المتزامن',body:'الكل يهاجم في نفس الوقت — سرية تامة ثم كشف مفاجئ.',isNew:true},{id:3,date:'2025-03-20',title:'📊 إحصائيات الإثارة',body:'أكثر لقب مطاردة وأقل اسم استهدافاً.',isNew:false}].map(n=>(
      <div key={n.id} className="news-item"><div className="news-date">{n.isNew&&<span className="news-new">جديد</span>}{n.date}</div><div className="news-title">{n.title}</div><div className="news-body">{n.body}</div></div>
    ))}</div>
  );

  const renderSuggest=()=>(
    <div className="scr">
      <div className="ptitle">💡 الاقتراحات</div>
      <div className="psub">شاركنا أفكارك — يُفتح تطبيق البريد تلقائياً</div>
      <div className="card">
        <div className="ctitle">📩 إرسال اقتراح</div>
        <div className="ig"><label className="lbl">التصنيف</label>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {['لعبة','تصميم','إحصائيات','أسعار','أخرى'].map(c=>(
              <button key={c} className={`btn bsm ${suggForm.cat===c?'bg':'bgh'}`} style={{width:'auto'}} onClick={()=>setSuggForm(f=>({...f,cat:c}))}>{c}</button>
            ))}
          </div>
        </div>
        <div className="ig"><label className="lbl">اكتب اقتراحك</label>
          <textarea className="inp" placeholder="اقتراحك هنا..." value={suggForm.text} onChange={e=>setSuggForm(f=>({...f,text:e.target.value}))}/>
        </div>
        <button className="btn bg" onClick={()=>{
          if(!suggForm.text.trim()){notify('اكتب اقتراحك أولاً','error');return;}
          const sub=encodeURIComponent(`اقتراح [${suggForm.cat}] — لعبة الألقاب`);
          const bod=encodeURIComponent(`التصنيف: ${suggForm.cat}\n\nالاقتراح:\n${suggForm.text}`);
          window.open(`mailto:${SUPPORT_EMAIL}?subject=${sub}&body=${bod}`);
          setSuggForm(f=>({...f,text:''}));notify('✅ سيُفتح تطبيق البريد','success');
        }}>📤 فتح البريد للإرسال</button>
        <div style={{marginTop:10,padding:'9px 12px',background:'rgba(79,163,224,.07)',border:'1px solid rgba(79,163,224,.2)',borderRadius:8,fontSize:11,color:'var(--muted)',textAlign:'center'}}>
          إلى: <strong style={{color:'var(--blue)'}}>{SUPPORT_EMAIL}</strong>
        </div>
      </div>
      <div className="div">اقتراحات من المجتمع</div>
      {suggestions.map(s=><div key={s.id} className="sugg-item"><div className="sugg-cat">{s.cat}</div><div className="sugg-text">{s.text}</div><div className="sugg-date">{s.date}</div></div>)}
    </div>
  );

  const renderPricing=()=>(
    <div className="scr">
      <div className="ptitle">💎 باقات الاشتراك</div>
      <div className="psub">اشتراك شهري أو سنوي — الأسعار تُعلن قريباً</div>
      <div style={{display:'flex',gap:8,marginBottom:16}}>{['شهري','سنوي (وفّر 20%)'].map((t,i)=><button key={t} className={`btn ${i===1?'bo':'bgh'}`} style={{flex:1}}>{t}</button>)}</div>
      {[
        {cls:'plan-super',badge:{bg:'var(--purple)',c:'#fff',label:'⭐ الأشهر'},name:'سوبر 🚀',nameColor:'var(--purple)',feats:'✦ لاعبون غير محدودون\n✦ جلسات متزامنة متعددة\n✦ تقارير تفصيلية كاملة\n✦ دعم أولوية 24/7\n✦ جميع مميزات الذهبي والفضي'},
        {cls:'plan-gold',badge:{bg:'var(--gold)',c:'#07070f',label:'🏆 ذهبي'},name:'ذهبي ✨',nameColor:'var(--gold)',feats:'✦ حتى 50 لاعب\n✦ إحصائيات متقدمة\n✦ سجل تاريخ الجلسات\n✦ ألقاب وأيقونات مخصصة'},
        {cls:'plan-silver',badge:{bg:'rgba(200,200,220,.4)',c:'var(--text)',label:'🥈 فضي'},name:'فضي',nameColor:'rgba(210,210,230,.9)',feats:'✦ حتى 20 لاعب\n✦ إحصائيات أساسية\n✦ غرفة واحدة نشطة'},
      ].map((p,i)=>(
        <div key={i} className={`plan-card ${p.cls}`}>
          <div className="plan-badge" style={{background:p.badge.bg,color:p.badge.c}}>{p.badge.label}</div>
          <div className="plan-name" style={{color:p.nameColor}}>{p.name}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,margin:'8px 0 6px'}}>
            <span style={{fontSize:13,color:'var(--muted)'}}>السعر:</span>
            <span style={{background:'rgba(255,255,255,.08)',color:'var(--muted)',padding:'3px 12px',borderRadius:20,fontSize:12,fontWeight:700}}>يُعلن قريباً</span>
          </div>
          <div className="plan-feat">{p.feats.split('\n').map((f,j)=><div key={j}>{f}</div>)}</div>
        </div>
      ))}
      <div className="card" style={{textAlign:'center',padding:'14px'}}>
        <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:4}}>🎉 سجّل اهتمامك الآن</div>
        <div style={{fontSize:11,color:'var(--muted)',marginBottom:10}}>كن أول من يعرف عند إطلاق الأسعار</div>
        <button className="btn bg bsm" style={{width:'auto',margin:'0 auto'}} onClick={()=>window.open(`mailto:${SUPPORT_EMAIL}?subject=أريد الاشتراك — لعبة الألقاب&body=أرجو إشعاري عند إطلاق الباقات`)}>📧 أبلغني عند الإطلاق</button>
      </div>
    </div>
  );

  /* ══ MAIN ══ */
  const navItems=[{id:'news',icon:'🔔',label:'أخبار',dot:hasNews},{id:'game',icon:'🎭',label:'اللعبة'},{id:'suggest',icon:'💡',label:'اقتراح'},{id:'pricing',icon:'💎',label:'الباقات'}];

  return(
    <div className="app">
      <style>{CSS}</style>
      <Stars/>
      {notifs.map(n=><Notif key={n.id} msg={n}/>)}

      {modal?.type==='confirm_reveal'&&<div className="mbg"><div className="modal">
        <div className="micn">⚠️</div><div className="mtitle" style={{color:'var(--gold)'}}>كشف مبكر؟</div>
        <div className="msub">{modal.notSent.length} لاعب لم يرسل:<br/><span style={{color:'var(--red)'}}>{modal.notSent.map(p=>p.name).join('، ')}</span></div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn br" style={{flex:1}} onClick={()=>{setModal(null);processReveal(attacksList);}}>كشف الآن</button>
          <button className="btn bgh" style={{flex:1}} onClick={()=>setModal(null)}>انتظر</button>
        </div>
      </div></div>}
      {modal?.type==='confirm_end'&&<div className="mbg"><div className="modal">
        <div className="micn">🛑</div><div className="mtitle" style={{color:'var(--red)'}}>إنهاء المسابقة؟</div>
        <div className="msub">سيُعلن الفائزون الحاليون.</div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn br" style={{flex:1}} onClick={()=>{setModal(null);endGame();}}>إنهاء</button>
          <button className="btn bgh" style={{flex:1}} onClick={()=>setModal(null)}>إلغاء</button>
        </div>
      </div></div>}

      <div className="hdr">
        <div className="logo">{tab==='news'?'🔔 أخبار':tab==='game'?'🎭 لعبة الألقاب':tab==='suggest'?'💡 اقتراح':'💎 الباقات'}</div>
        {tab==='game'&&roomCode&&role==='admin'&&phase!=='lobby'&&<button className="btn bg bsm" style={{width:'auto'}} onClick={()=>setGameScreen('admin_live')}>👑 تحكم</button>}
      </div>

      <div className="main">
        {tab==='news'&&renderNews()}
        {tab==='game'&&renderGame()}
        {tab==='suggest'&&renderSuggest()}
        {tab==='pricing'&&renderPricing()}
      </div>

      <nav className="bnav">
        {navItems.map(item=>(
          <button key={item.id} className={`bnav-item${tab===item.id?' active':''}`} onClick={()=>setTab(item.id)}>
            <div className="bnav-icon">{item.icon}</div>
            <div className="bnav-label">{item.label}</div>
            {item.dot&&<div className="bnav-dot"/>}
          </button>
        ))}
      </nav>
    </div>
  );
}
