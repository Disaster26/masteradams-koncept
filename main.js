(function(){
  var d=document,b=d.body;
  // menu mobilne
  var bur=d.querySelector('.burger');
  if(bur){bur.addEventListener('click',function(){var o=b.classList.toggle('menu-otw');bur.setAttribute('aria-expanded',o);});}
  d.querySelectorAll('.nav li>button').forEach(function(bt){
    bt.addEventListener('click',function(){
      var li=bt.parentNode,o=!li.classList.contains('otw');
      d.querySelectorAll('.nav li.otw').forEach(function(x){if(x!==li){x.classList.remove('otw');x.firstElementChild.setAttribute('aria-expanded','false');}});
      li.classList.toggle('otw',o);bt.setAttribute('aria-expanded',o);
    });
  });
  d.addEventListener('click',function(e){if(window.innerWidth>1080&&!e.target.closest('.nav')){d.querySelectorAll('.nav li.otw').forEach(function(x){x.classList.remove('otw');});}});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){b.classList.remove('menu-otw');d.querySelectorAll('.nav li.otw').forEach(function(x){x.classList.remove('otw');});zamknijLb();}});

  // karuzele: palec, mysz, strzałki, licznik
  d.querySelectorAll('.sw').forEach(function(sw){
    var tor=sw.querySelector('.sw-tor'),prev=sw.querySelector('.sw-prev'),next=sw.querySelector('.sw-next'),licz=sw.querySelector('.sw-licz');
    if(!tor)return;
    var items=tor.children;
    function krok(){var it=items[0];if(!it)return 300;var g=parseFloat(getComputedStyle(tor).columnGap||getComputedStyle(tor).gap)||16;return it.getBoundingClientRect().width+g;}
    function stan(){
      var max=tor.scrollWidth-tor.clientWidth-2;
      if(prev)prev.disabled=tor.scrollLeft<=2;
      if(next)next.disabled=tor.scrollLeft>=max;
      if(licz){var k=krok(),i=Math.round(tor.scrollLeft/k)+1,widoczne=Math.max(1,Math.round(tor.clientWidth/k));var n=items.length;var ost=Math.min(n,i+widoczne-1);licz.textContent=(tor.scrollLeft>=max?n:ost)+' / '+n;}
      if(sw.querySelector('.sw-nav'))sw.querySelector('.sw-nav').style.display=(tor.scrollWidth<=tor.clientWidth+4)?'none':'';
    }
    if(prev)prev.addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'});});
    if(next)next.addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'});});
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(stan);},{passive:true});
    window.addEventListener('resize',stan);stan();
    // przeciąganie myszą
    var down=false,sx=0,sl=0,ruch=0;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;ruch=0;sx=e.clientX;sl=tor.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;ruch=Math.max(ruch,Math.abs(dx));if(ruch>4){tor.classList.add('ciag');tor.scrollLeft=sl-dx;}});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;if(tor.classList.contains('ciag')){tor.classList.remove('ciag');var k=krok();tor.scrollTo({left:Math.round(tor.scrollLeft/k)*k,behavior:'smooth'});}});
    tor.addEventListener('click',function(e){if(ruch>4){e.preventDefault();e.stopPropagation();ruch=0;}},true);
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){tor.scrollBy({left:krok(),behavior:'smooth'});}if(e.key==='ArrowLeft'){tor.scrollBy({left:-krok(),behavior:'smooth'});}});
  });

  // powiększanie zdjęć
  var lb=d.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Powiększone zdjęcie');
  lb.innerHTML='<img alt=""><button type="button" aria-label="Zamknij">&times;</button>';b.appendChild(lb);
  var lbi=lb.querySelector('img');
  function zamknijLb(){lb.classList.remove('otw');lbi.removeAttribute('src');}
  lb.addEventListener('click',zamknijLb);
  d.addEventListener('click',function(e){
    var t=e.target.closest('[data-duze]');
    if(!t){var im=e.target.closest('.tresc img,.wpis-foto img,.galeria-tr img');if(im&&!im.closest('.ikonka')&&!im.closest('a')){t=im;}}
    if(!t)return;
    e.preventDefault();
    var src=t.getAttribute('data-duze')||t.currentSrc||t.src;var alt=t.getAttribute('alt')||(t.querySelector('img')||{}).alt||'';
    lbi.src=src;lbi.alt=alt;lb.classList.add('otw');lb.querySelector('button').focus();
  });

  // dolny pasek po przewinięciu za przyciski
  var mob=d.querySelector('.mob'),cel=d.querySelector('[data-pasek]');
  if(mob){
    if(cel&&'IntersectionObserver' in window){
      new IntersectionObserver(function(en){en.forEach(function(x){mob.classList.toggle('widac',!x.isIntersecting&&x.boundingClientRect.top<0);});}).observe(cel);
    }else{window.addEventListener('scroll',function(){mob.classList.toggle('widac',window.scrollY>500);},{passive:true});}
  }

  // formularz pokazowy
  d.querySelectorAll('form.form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();f.classList.add('wyslany');var ok=f.querySelector('.ok');if(ok)ok.focus();});});

  // zgody cookies
  var c=d.querySelector('.ciastka'),zapis=null;
  try{zapis=localStorage.getItem('ma-zgoda');}catch(e){}
  if(c&&!zapis){c.classList.add('otw');}
  if(c){c.querySelectorAll('[data-zgoda]').forEach(function(bt){bt.addEventListener('click',function(){try{localStorage.setItem('ma-zgoda',bt.getAttribute('data-zgoda'));}catch(e){}c.classList.remove('otw');});});}
  d.querySelectorAll('[data-ustawienia-cookies]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(c)c.classList.add('otw');});});
})();
