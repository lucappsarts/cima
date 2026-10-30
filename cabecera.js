/* Cabecera: al bajar por la página se compacta y su cielo se aclara poco a poco, como si bajáramos de la cima. */
(function(){
  var h=document.querySelector('.top');if(!h)return;var raf=0;
  function f(){raf=0;var y=window.scrollY||0,max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    h.classList.toggle('scrolled',y>8);h.style.setProperty('--p',Math.min(1,y/max).toFixed(3));}
  window.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(f);},{passive:true});
  window.addEventListener('resize',f);f();
})();
/* El logo de la cabecera lleva siempre al inicio: en la portada sube arriba del todo con suavidad; en las demás páginas abre la portada. */
(function(){
  var b=document.querySelector('.top .brand');if(!b)return;
  b.addEventListener('click',function(e){
    var p=location.pathname,home=/(^|\/)(index\.html)?$/.test(p);
    if(home){e.preventDefault();var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:0,behavior:rm?'auto':'smooth'});}
  });
})();
/* Desde otra página, el logo abre la portada con un enlace normal (arriba del todo). La web no guarda nada en el dispositivo: ni cookies, ni localStorage, ni sessionStorage. */

/* Menú desplegable del móvil: el botón ☰ lo abre y lo cierra; se cierra al elegir una página, al tocar fuera o con Escape. */
(function(){
  var h=document.querySelector('.top'),b=h&&h.querySelector('.menu-btn'),m=h&&h.querySelector('nav.menu');if(!b||!m)return;
  h.classList.add('hasmenu');
  function set(o){h.classList.toggle('abierto',o);b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');}
  b.addEventListener('click',function(e){e.stopPropagation();set(!h.classList.contains('abierto'));});
  m.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
  document.addEventListener('click',function(e){if(h.classList.contains('abierto')&&!h.contains(e.target))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&h.classList.contains('abierto')){set(false);b.focus();}});
  window.addEventListener('resize',function(){if(window.innerWidth>760)set(false);});
})();
