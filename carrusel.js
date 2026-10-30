/* Carrusel "Así se juega": la diapositiva del centro grande y las de los lados más pequeñas, todas enteras.
   La primera es un vídeo corto del juego (mudo); el resto, capturas. Avanza solo, se para al tocarlo o pasar el ratón,
   y se puede deslizar con el dedo. El vídeo tiene botón de pausa y, con "reducir movimiento", no arranca solo. */
(function(){
  var root=document.querySelector('[data-carrusel]');if(!root)return;
  var slides=[].slice.call(root.querySelectorAll('.slide')),n=slides.length,act=0,timer=0,paused=false;
  var cap=document.querySelector('.shots .leyenda'),dots=document.querySelector('.shots .puntos');
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vid=root.querySelector('.slide-video video'),vbtn=root.querySelector('.vid-btn'),vSlide=vid?vid.closest('.slide'):null;
  var vUserPaused=rm,vSeen=false,vLoaded=false;
  function capOf(s){var im=s.querySelector('img');return s.getAttribute('data-cap')||(im?im.alt:'');}
  slides.forEach(function(s,i){var b=document.createElement('button');b.type='button';
    b.setAttribute('aria-label',(s===vSlide?'Vídeo':'Imagen '+i)+' · '+capOf(s));b.addEventListener('click',function(){go(i);});dots.appendChild(b);
    s.addEventListener('click',function(e){if(i!==act){go(i);}else if(s===vSlide&&e.target===vid){toggleVideo();}});});
  var dotEls=[].slice.call(dots.children);
  /* alto disponible: la ventana menos la cabecera fija, menos el título y los puntos de esta sección */
  var sec=root.closest('.shots'),hdr=document.querySelector('.top');
  function fitH(){var head=hdr?Math.min(hdr.offsetHeight,60):0,over=sec?(sec.offsetHeight-root.offsetHeight):150;
    return Math.max(150,(window.innerHeight-head-over-28-24)/2.17);}
  function lay(){
    var w=root.clientWidth,mob=w<560,hmax=fitH(),sw=Math.min(mob?w*0.5:Math.min(300,w*0.26),hmax),gap=mob?w*0.35:sw*0.74,vis=mob?1:2,s1=mob?0.55:0.78;
    root.style.setProperty('--sw',sw+'px');root.style.setProperty('--spread',Math.round(mob?w/2:Math.min(w/2-60,2*gap*0.86+sw*0.3+24))+'px');
    slides.forEach(function(s,i){var o=i-act;if(o>n/2)o-=n;if(o<-n/2)o+=n;var a=Math.abs(o);
      var sc=a===0?1:(a===1?s1:0.6),x=o*gap*(a>1?0.86:1);
      s.style.transform='translate(-50%,0) translateX('+x+'px) scale('+sc+')';
      s.style.opacity=a>vis?0:(a===0?1:(a===1?0.85:0.55));
      s.style.zIndex=10-a;s.style.pointerEvents=a>vis?'none':'auto';s.classList.toggle('act',a===0);
      s.setAttribute('aria-hidden',a===0?'false':'true');});
    dotEls.forEach(function(d,i){if(i===act)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});
    if(cap)cap.textContent=capOf(slides[act]);
    if(vbtn){vbtn.tabIndex=slides[act]===vSlide?0:-1;}
    syncVideo();
  }
  /* vídeo (mudo): solo se reproduce si está en el centro, se ve en pantalla y nadie lo ha pausado */
  function loadVideo(){if(vid&&!vLoaded){vLoaded=true;vid.preload='auto';try{vid.load();}catch(_){}}}
  function syncVideo(){if(!vid)return;var want=slides[act]===vSlide&&vSeen&&!vUserPaused&&!document.hidden;
    if(want){loadVideo();var p=vid.play();if(p&&p.catch)p.catch(function(){vUserPaused=true;btnState();});}else if(!vid.paused)vid.pause();btnState();}
  function btnState(){if(!vbtn)return;var on=vid&&!vUserPaused;vbtn.setAttribute('aria-label',on?'Pausar el vídeo':'Reproducir el vídeo');
    var u=vbtn.querySelector('use');if(u)u.setAttribute('href',on?'#i-pause':'#i-play');vbtn.classList.toggle('play',!on);}
  function toggleVideo(){vUserPaused=!vUserPaused;syncVideo();restart();}
  if(vbtn){vbtn.hidden=false;vbtn.addEventListener('click',function(e){e.stopPropagation();if(slides[act]!==vSlide){go(slides.indexOf(vSlide));return;}toggleVideo();});}
  if(vid){vid.removeAttribute('controls');
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){vSeen=e.isIntersecting;if(vSeen)loadVideo();syncVideo();});},{threshold:0.25}).observe(root);}
    else{vSeen=true;}}
  function go(i){var was=act;act=(i+n)%n;if(vid&&slides[act]===vSlide&&was!==act){try{vid.currentTime=0;}catch(_){}}lay();restart();}
  /* el vídeo se queda en el centro lo que dura (unos 14 s); las capturas, 3,8 s */
  function delay(){if(vid&&slides[act]===vSlide&&!vUserPaused){var d=vid.duration;return (isFinite(d)&&d>0?Math.max(2,d-(vid.currentTime||0)):14)*1000;}return 3800;}
  function restart(){clearTimeout(timer);if(!rm&&!paused)timer=setTimeout(function(){go(act+1);},delay());}
  root.querySelector('.prev').addEventListener('click',function(){go(act-1);});
  root.querySelector('.next').addEventListener('click',function(){go(act+1);});
  root.addEventListener('mouseenter',function(){paused=true;restart();});
  root.addEventListener('mouseleave',function(){paused=false;restart();});
  root.addEventListener('focusin',function(){paused=true;restart();});
  root.addEventListener('focusout',function(){paused=false;restart();});
  var x0=null;root.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;paused=true;restart();},{passive:true});
  root.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(act+(dx<0?1:-1));x0=null;paused=false;restart();});
  root.setAttribute('tabindex','0');root.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){e.preventDefault();go(act-1);}if(e.key==='ArrowRight'){e.preventDefault();go(act+1);}});
  document.addEventListener('visibilitychange',function(){if(document.hidden)clearTimeout(timer);else restart();syncVideo();});
  window.addEventListener('resize',lay);lay();restart();
})();
