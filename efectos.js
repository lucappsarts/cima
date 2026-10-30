/* Detalles de la web: aparición suave al bajar, índice que marca la sección en la que estás
   y botón flotante para volver arriba. Sin JS todo se ve igual, solo sin estos efectos. */
(function(){
  var d=document,w=window;
  var rm=w.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Aparición suave: solo lo que aún está por debajo de la pantalla, para que nada parpadee al cargar */
  if(!rm&&'IntersectionObserver' in w){
    var sel='.fam,.info .kicker,.info h2,.info .links li,.cta-in,.doc .sec,.checks li,.prose details';
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px'});
    var vh=w.innerHeight;
    [].forEach.call(d.querySelectorAll(sel),function(el){
      if(el.getBoundingClientRect().top<vh*0.92)return;
      var p=el.parentElement,i=[].indexOf.call(p.children,el);
      if(el.matches('.info .links li,.checks li'))el.style.setProperty('--d',(i%6)*0.07+'s');
      el.classList.add('reveal');io.observe(el);
    });
  }

  /* 2. Índice: marca el apartado que se está leyendo */
  var toc=d.querySelector('.toc');
  if(toc){
    var links=[].slice.call(toc.querySelectorAll('a[href^="#"]')),heads=[];
    links.forEach(function(a){var h=d.getElementById(a.getAttribute('href').slice(1));if(h)heads.push({a:a,h:h});});
    var raf=0;
    function spy(){raf=0;var cur=null,lim=140;
      heads.forEach(function(o){if(o.h.getBoundingClientRect().top<lim)cur=o;});
      if((w.innerHeight+w.scrollY)>=d.documentElement.scrollHeight-4&&heads.length)cur=heads[heads.length-1];
      links.forEach(function(a){a.removeAttribute('aria-current');});
      if(cur)cur.a.setAttribute('aria-current','location');}
    w.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(spy);},{passive:true});
    spy();
  }

  /* 3. Volver arriba flotante en las páginas largas (el enlace normal sigue al final del texto) */
  var t=d.querySelector('.totop');
  if(t){
    var f=t.cloneNode(true);f.className='totop totop-float';f.setAttribute('aria-hidden','true');f.tabIndex=-1;
    d.body.appendChild(f);
    var r2=0;
    function chk(){r2=0;var y=w.scrollY,end=d.documentElement.scrollHeight-w.innerHeight;
      f.classList.toggle('show',y>w.innerHeight*1.2&&y<end-260);}
    w.addEventListener('scroll',function(){if(!r2)r2=requestAnimationFrame(chk);},{passive:true});chk();
  }
})();
