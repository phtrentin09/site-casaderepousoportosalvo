/* Casa de Repouso de Porto Salvo · site.js */
(function(){
  var d=document, html=d.documentElement;
  var semMov=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA='351934962626';
  function guarda(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function le(k){try{return localStorage.getItem(k)}catch(e){return null}}

  /* tema claro / escuro */
  var bTema=d.querySelector('.tema');
  if(bTema){bTema.addEventListener('click',function(){
    var escuro=html.dataset.tema?html.dataset.tema==='escuro':matchMedia('(prefers-color-scheme: dark)').matches;
    html.dataset.tema=escuro?'claro':'escuro'; guarda('crps-tema',html.dataset.tema);
  })}

  /* cabeçalho e menu */
  var topo=d.querySelector('.topo');
  function rolou(){if(topo)topo.classList.toggle('rolou',scrollY>8)}
  addEventListener('scroll',rolou,{passive:true});rolou();
  var burger=d.querySelector('.burger');
  if(burger){burger.addEventListener('click',function(){
    var ab=d.body.classList.toggle('menu-aberto');burger.setAttribute('aria-expanded',ab);
  })}
  d.addEventListener('click',function(e){if(e.target.closest('.gaveta a')){d.body.classList.remove('menu-aberto');if(burger)burger.setAttribute('aria-expanded','false')}});

  /* aparecer ao rolar */
  var obs='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('ver');obs.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px'}):null;
  d.querySelectorAll('.rv,.escala,.rota').forEach(function(el){obs?obs.observe(el):el.classList.add('ver')});

  /* abertura: azulejos que viram fotografia */
  var painel=d.querySelector('.painel');
  if(painel){
    var lad=painel.querySelector('.ladrilhos'),C=6,R=4,max=0;
    if(lad&&!semMov){
      for(var r=0;r<R;r++)for(var c=0;c<C;c++){
        var t=d.createElement('div');t.className='lad';
        var dl=(c+(R-1-r))*90;max=Math.max(max,dl);
        t.style.setProperty('--d',dl+'ms');
        t.style.setProperty('--bx',(c*100/(C-1))+'%');t.style.setProperty('--by',(r*100/(R-1))+'%');
        t.innerHTML='<i></i><i></i>';lad.appendChild(t);
      }
      var vira=function(){setTimeout(function(){painel.classList.add('virar');setTimeout(function(){painel.classList.add('pronto')},max+1250)},450)};
      var foto=painel.querySelector('img');
      if(foto&&!foto.complete){foto.addEventListener('load',vira);foto.addEventListener('error',vira)}else vira();
    }else painel.classList.add('pronto');
  }

  /* percurso horizontal */
  var alto=d.querySelector('.percurso-alto');
  if(alto){
    var trilho=alto.querySelector('.trilho'),quadros=alto.querySelectorAll('.quadro'),cont=alto.querySelector('.contador b'),barra=alto.querySelector('.barra-prog');
    alto.style.setProperty('--n',quadros.length);
    var mq=matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
    var tick=false;
    function mexe(){tick=false;
      if(!mq.matches){trilho.style.transform='';return}
      var rc=alto.getBoundingClientRect(),total=alto.offsetHeight-innerHeight+84;
      var p=Math.min(1,Math.max(0,-rc.top/total));
      var dist=trilho.scrollWidth-innerWidth+Math.max(20,(innerWidth-1220)/2);
      trilho.style.transform='translate3d('+(-p*dist)+'px,0,0)';
      if(barra)barra.style.setProperty('--p',p);
      if(cont){var i=Math.min(quadros.length,Math.floor(p*quadros.length)+1);cont.textContent=String(i).padStart(2,'0')}
      quadros.forEach(function(q){var b=q.getBoundingClientRect();var k=(b.left+b.width/2-innerWidth/2)/innerWidth;var im=q.querySelector('img');if(im)im.style.transform='scale(1.12) translateX('+(k*-6)+'%)'});
    }
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(mexe)}},{passive:true});
    addEventListener('resize',mexe);mexe();
  }

  /* índice de cuidados */
  d.querySelectorAll('[data-indice]').forEach(function(box){
    var bts=box.querySelectorAll('.lista-ind button'),imgs=box.querySelectorAll('.palco-foto img'),txts=box.querySelectorAll('.palco-txt>div');
    function mostra(i){bts.forEach(function(b,j){b.setAttribute('aria-selected',i===j)});imgs.forEach(function(m,j){m.classList.toggle('on',i===j)});txts.forEach(function(t,j){t.classList.toggle('on',i===j)})}
    var palco=box.querySelector('.palco');
    bts.forEach(function(b,i){b.addEventListener('click',function(){mostra(i);if(innerWidth<900&&palco){var r=palco.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)scrollTo({top:scrollY+r.top-96,behavior:semMov?'auto':'smooth'})}});if(matchMedia('(hover:hover)').matches)b.addEventListener('mouseenter',function(){mostra(i)})});
  });

  /* fotos com pontos */
  d.querySelectorAll('[data-cenas]').forEach(function(box){
    var abas=box.querySelectorAll('.abas button'),cenas=box.querySelectorAll('.cena>div'),listas=box.querySelectorAll('[data-lista]');
    abas.forEach(function(a,i){a.addEventListener('click',function(){
      abas.forEach(function(b,j){b.setAttribute('aria-selected',i===j)});
      cenas.forEach(function(c,j){c.classList.toggle('on',i===j)});
      listas.forEach(function(l,j){l.hidden=i!==j});
    })});
    box.querySelectorAll('.ponto').forEach(function(p){p.addEventListener('click',function(){
      var ab=p.getAttribute('aria-expanded')==='true';
      box.querySelectorAll('.ponto').forEach(function(o){o.setAttribute('aria-expanded','false')});
      p.setAttribute('aria-expanded',!ab);
    })});
  });

  /* galeria em ecrã inteiro */
  var caixa=null,lista=[],pos=0;
  function abre(grupo,i){
    lista=[].slice.call(grupo.querySelectorAll('[data-grande]'));pos=i;
    if(!caixa){
      caixa=d.createElement('div');caixa.className='caixa';caixa.setAttribute('role','dialog');caixa.setAttribute('aria-modal','true');caixa.setAttribute('aria-label','Fotografias da casa');
      var x='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">';
      caixa.innerHTML='<img alt=""><p></p><button class="fechar" aria-label="Fechar">'+x+'<path d="M6 6l12 12M18 6L6 18"/></svg></button><button class="ant" aria-label="Anterior">'+x+'<path d="M15 5l-7 7 7 7"/></svg></button><button class="seg" aria-label="Seguinte">'+x+'<path d="M9 5l7 7-7 7"/></svg></button>';
      d.body.appendChild(caixa);
      caixa.querySelector('.fechar').onclick=fecha;
      caixa.querySelector('.ant').onclick=function(){vai(-1)};
      caixa.querySelector('.seg').onclick=function(){vai(1)};
      caixa.addEventListener('click',function(e){if(e.target===caixa)fecha()});
      var x0=null;caixa.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
      caixa.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)vai(dx<0?1:-1);x0=null});
    }
    desenha();caixa.classList.add('on');d.body.style.overflow='hidden';caixa.querySelector('.fechar').focus();
  }
  function desenha(){var el=lista[pos],im=caixa.querySelector('img');im.src=el.dataset.grande;im.alt=el.dataset.titulo||'';caixa.querySelector('p').textContent=el.dataset.titulo||'';im.style.animation='none';im.offsetHeight;im.style.animation=''}
  function vai(k){pos=(pos+k+lista.length)%lista.length;desenha()}
  function fecha(){caixa.classList.remove('on');d.body.style.overflow=''}
  d.addEventListener('keydown',function(e){if(!caixa||!caixa.classList.contains('on'))return;if(e.key==='Escape')fecha();if(e.key==='ArrowRight')vai(1);if(e.key==='ArrowLeft')vai(-1)});
  d.querySelectorAll('[data-galeria]').forEach(function(g){
    g.querySelectorAll('[data-grande]').forEach(function(el,i){el.addEventListener('click',function(){abre(g,i)})});
  });

  /* formulários que abrem o WhatsApp */
  d.querySelectorAll('form[data-wa]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var nome=(f.querySelector('[name=nome]')||{}).value||'';nome=nome.trim();
      if(!nome){f.querySelector('[name=nome]').focus();return}
      var t;
      if(f.dataset.wa==='candidatura'){
        var fn=(f.querySelector('[name=funcao]:checked')||{}).value||'a definir';
        var tu=[].map.call(f.querySelectorAll('[name=turno]:checked'),function(i){return i.value}).join(', ')||'a combinar';
        t='Olá! O meu nome é '+nome+' e gostaria de me candidatar na Casa de Repouso de Porto Salvo. Função: '+fn+'. Disponibilidade: '+tu+'.';
      }else{
        var o=(f.querySelector('[name=procura]:checked')||{}).value;
        t='Olá! O meu nome é '+nome+'. Gostaria de marcar uma visita à Casa de Repouso de Porto Salvo.'+(o?' Procuro: '+o+'.':'');
      }
      window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(t),'_blank','noopener');
    });
  });

  /* cookies e mapa */
  var aviso=d.querySelector('.cookies');
  function mapas(){d.querySelectorAll('.mapa[data-src]').forEach(function(m){if(m.querySelector('iframe'))return;var f=d.createElement('iframe');f.src=m.dataset.src;f.loading='lazy';f.title='Mapa da Casa de Repouso de Porto Salvo';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f);var a=m.querySelector('.mapa-aviso');if(a)a.remove()})}
  function escolhe(v){guarda('crps-cookies',v);if(aviso){aviso.hidden=true;aviso.remove&&aviso.remove();aviso=null}if(v==='todos')mapas()}
  var esc=le('crps-cookies');
  if(esc){if(aviso){aviso.remove();aviso=null}if(esc==='todos')mapas()}
  else if(aviso){aviso.hidden=false}
  d.addEventListener('click',function(e){
    var b=e.target.closest('[data-cookies]');if(b){escolhe(b.dataset.cookies);return}
    if(e.target.closest('[data-mapa]')){mapas();return}
    if(e.target.closest('[data-cookies-abrir]')){e.preventDefault();try{localStorage.removeItem('crps-cookies')}catch(x){}location.reload()}
  });
})();
