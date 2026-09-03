(function(){
  var FLAVOURS = [
    {id:'malt', name:'Malt', color:'var(--malt)', hex:'#C9922F', desc:"The one that started it all: the classic, full-bodied malt character of beer, brewed for flavour, not alcohol.", notes:['Roasted malt','Caramel','Smooth finish']},
    {id:'ginger', name:'Ginger', color:'var(--ginger)', hex:'#FF6B2C', desc:"Sharp, spiced and wide awake. Ginger brings the heat for whoever wants their Coolberg with an edge.", notes:['Spiced warmth','Zesty bite','Bold finish']},
    {id:'mint', name:'Mint', color:'var(--mint)', hex:'#2FBF8F', desc:"Cool, crisp and clean, built for hot afternoons and light lunches when you want something that refreshes.", notes:['Cool herbal','Crisp finish','Light body']},
    {id:'peach', name:'Peach', color:'var(--peach)', hex:'#FF9A6B', desc:"Soft, round and sunny. Peach is the easy-drinking one, mellow enough for long conversations.", notes:['Ripe peach','Soft sweetness','Rounded body']},
    {id:'cranberry', name:'Cranberry', color:'var(--cranberry)', hex:'#D6295E', desc:"Bold, tart and just a little rebellious, cranberry is for the ones who like their flavour with an edge.", notes:['Tart berry','Bold colour','Dry finish']},
    {id:'strawberry', name:'Strawberry', color:'var(--strawberry)', hex:'#FF4368', desc:"Bright, sweet and instantly likeable. The flavour that turns any table into a celebration.", notes:['Bright berry','Sweet lift','Fruity finish']},
    {id:'apple', name:'Apple', color:'var(--apple)', hex:'#7CC142', desc:"Crisp and green, with a clean snap, the one to reach for when you want something fresh and a little different.", notes:['Crisp apple','Clean snap','Fresh finish']}
  ];

  // ---- HERO BOTTLE CAROUSEL ----
  var heroStage = document.getElementById('heroBottleStage');
  var heroStageImgs = [];
  var heroIndex = 0;
  var heroTimer = null;

  function buildHeroStage(){
    if(!heroStage) return;
    FLAVOURS.forEach(function(f, i){
      var img = document.createElement('img');
      img.src = 'assets/flavours/cutout/'+f.id+'.png';
      img.alt = 'Coolberg '+f.name+', 0.0% ABV bottle';
      img.className = 'hero-stage-img'+(i===0 ? ' is-active' : '');
      heroStage.appendChild(img);
      heroStageImgs.push(img);
    });
  }

  function updateHeroTag(f){
    var nameEl = document.getElementById('heroFlavourName');
    var dotEl = document.getElementById('heroFlavourDot');
    if(nameEl) nameEl.textContent = f.name;
    if(dotEl) dotEl.style.background = f.color;
  }

  function advanceHero(){
    var prevIdx = heroIndex;
    heroIndex = (heroIndex + 1) % FLAVOURS.length;
    var prevImg = heroStageImgs[prevIdx];
    var nextImg = heroStageImgs[heroIndex];
    if(!prevImg || !nextImg) return;
    prevImg.classList.remove('is-active');
    prevImg.classList.add('is-leaving');
    nextImg.classList.add('is-active');
    updateHeroTag(FLAVOURS[heroIndex]);
    setTimeout(function(){
      prevImg.classList.add('no-anim');
      prevImg.classList.remove('is-leaving');
      void prevImg.offsetWidth;
      prevImg.classList.remove('no-anim');
    }, 560);
  }

  buildHeroStage();
  if(heroStage){
    updateHeroTag(FLAVOURS[0]);
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!prefersReducedMotion){
      heroTimer = setInterval(advanceHero, 2400);
    }
  }

  // ---- FLAVOUR LIST BUILD ----
  var flList = document.getElementById('flList');
  FLAVOURS.forEach(function(f, i){
    var btn = document.createElement('button');
    btn.className = 'fl-item';
    btn.setAttribute('role','tab');
    btn.setAttribute('data-id', f.id);
    btn.setAttribute('aria-selected', i===0 ? 'true':'false');
    btn.innerHTML = '<span class="idx">0'+(i+1)+'</span><span class="dot" style="background:'+f.color+';"></span><span class="name">'+f.name+'</span>';
    btn.addEventListener('click', function(){ setFlavour(f.id); });
    flList.appendChild(btn);
  });

  function setFlavour(id, scroll){
    var f = FLAVOURS.find(function(x){return x.id===id;}) || FLAVOURS[0];
    document.querySelectorAll('.fl-item').forEach(function(el){
      var sel = el.getAttribute('data-id')===f.id;
      el.setAttribute('aria-selected', sel ? 'true':'false');
      el.style.setProperty('--fl-ring', sel ? f.color : 'transparent');
    });
    document.getElementById('flName').textContent = f.name;
    document.getElementById('flDesc').textContent = f.desc;
    var flImg = document.getElementById('flBottleImg');
    flImg.src = 'assets/flavours/cutout/'+f.id+'.png';
    flImg.alt = 'Coolberg '+f.name+', 0.0% ABV bottle';
    var notesWrap = document.getElementById('flNotes');
    notesWrap.innerHTML = '';
    f.notes.forEach(function(n){ var s=document.createElement('span'); s.textContent=n; notesWrap.appendChild(s); });
    document.getElementById('flDisplay').style.setProperty('--fl-color', f.color);
    document.getElementById('flavours').style.setProperty('--fl-color', 'color-mix(in srgb, '+f.color+' 16%, var(--bg))');
    if(scroll){ document.getElementById('flavours').scrollIntoView({behavior:'smooth'}); }
  }
  setFlavour('malt');
  document.getElementById('flQuizLink').addEventListener('click', function(){ document.getElementById('quiz').scrollIntoView({behavior:'smooth'}); });

  // ---- QUIZ ----
  var answers = {};
  var scores = {malt:'classic', ginger:'spicy', mint:'fresh', peach:'sweet', cranberry:'bold', strawberry:'sweetfruity', apple:'crisp'};
  var scoreMap = {
    1: {fresh:['mint','apple'], fruity:['peach','cranberry','strawberry','apple'], bold:['malt','ginger','cranberry'], sweet:['strawberry','peach'], spicy:['ginger']},
    2: {chill:['mint','malt'], connect:['peach','malt'], celebrate:['strawberry','cranberry'], explore:['ginger','apple']},
    3: {classic:['malt'], adventurous:['ginger','cranberry'], sweetfruity:['strawberry','peach'], crisp:['mint','apple']}
  };
  var steps = Array.prototype.slice.call(document.querySelectorAll('.quiz-step'));
  var progressEls = document.querySelectorAll('#quizProgress i');

  function showStep(key){
    steps.forEach(function(s){ s.classList.toggle('active', s.getAttribute('data-step')===key); });
  }
  function updateProgress(n){
    progressEls.forEach(function(el,i){ el.classList.toggle('done', i < n); });
  }

  document.querySelectorAll('.quiz-opt').forEach(function(btn){
    btn.addEventListener('click', function(){
      var q = btn.getAttribute('data-q'), v = btn.getAttribute('data-v');
      answers[q] = v;
      document.querySelectorAll('.quiz-opt[data-q="'+q+'"]').forEach(function(b){ b.classList.toggle('picked', b===btn); });
      setTimeout(function(){
        if(q==='1'){ showStep('2'); updateProgress(1); }
        else if(q==='2'){ showStep('3'); updateProgress(2); }
        else if(q==='3'){
          updateProgress(3);
          var tally = {};
          [1,2,3].forEach(function(qn){
            var val = answers[qn];
            var list = (scoreMap[qn] && scoreMap[qn][val]) || [];
            list.forEach(function(fl){ tally[fl] = (tally[fl]||0) + 1; });
          });
          var best = 'cranberry', bestScore = -1;
          FLAVOURS.forEach(function(f){ var sc = tally[f.id]||0; if(sc>bestScore){ bestScore=sc; best=f.id; } });
          var f = FLAVOURS.find(function(x){return x.id===best;});
          document.getElementById('qrFlavour').textContent = f.name;
          document.getElementById('qrFlavour').parentElement.style.setProperty('--fl-color', f.color);
          document.getElementById('qrDesc').textContent = f.desc;
          window.__quizResult = f.id;
          showStep('result');
        }
      }, 220);
    });
  });
  document.getElementById('qrDiscoverBtn').addEventListener('click', function(){
    setFlavour(window.__quizResult || 'cranberry', true);
  });
  document.getElementById('quizRestart').addEventListener('click', function(){
    answers = {};
    document.querySelectorAll('.quiz-opt.picked').forEach(function(b){ b.classList.remove('picked'); });
    updateProgress(0);
    showStep('1');
  });

  var FLBY = {}; FLAVOURS.forEach(function(f){FLBY[f.id]=f;});

  // ---- FOOD PAIRING ----
  var FOOD = [
    {name:'Dholl Puri', kreol:'Roadside classic', pair:'ginger', note:'Split-pea flatbread, butter bean curry, rougaille and chutney. Ginger meets it head-on.'},
    {name:'Gâteaux Piments', kreol:'4pm snack, always', pair:'apple', note:'Deep-fried chilli-and-split-pea fritters from the corner stall, balanced by crisp Apple.'},
    {name:'Rougaille Poisson', kreol:'Sunday table d’hôte', pair:'malt', note:'Creole tomato-and-fish stew with rice. Malt’s roasted body holds its own against it.'},
    {name:'Mine Frite', kreol:'Wok-fired noodles', pair:'mint', note:'Chinese-Mauritian fried noodles with soy and chilli, cooled down by crisp Mint.'},
    {name:'Boulettes', kreol:'Steam-basket soup', pair:'peach', note:'Dumpling soup from the Chinatown steam baskets, alongside easy-drinking Peach.'},
    {name:'Ourite Vindaye', kreol:'Octopus, pickled hot', pair:'cranberry', note:'Turmeric-and-chilli pickled octopus, cut clean by tart, bold Cranberry.'}
  ];
  var foodGrid = document.getElementById('foodGrid');
  FOOD.forEach(function(f){
    var fl = FLBY[f.pair];
    var card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = '<div class="fc-pair" style="background:'+fl.color+';"></div>'+
      '<div><span class="fc-kreol">'+f.kreol+'</span><h4>'+f.name+'</h4></div>'+
      '<p style="color:var(--fg-soft);font-size:14px;">'+f.note+'</p>'+
      '<div class="fc-arrow"><span class="fc-dot" style="background:'+fl.color+';"></span>Pairs with <b>'+fl.name+'</b></div>';
    foodGrid.appendChild(card);
  });

  // ---- MOMENTS ----
  var MOMENTS = [
    {tag:'Launch', title:'Coolberg lands in Grand Baie', meta:'Grand Baie · This month', size:'big', grad:'linear-gradient(160deg, var(--ginger), var(--cranberry))'},
    {tag:'Event', title:'Sunset Sessions, Flic-en-Flac', meta:'Flic-en-Flac · Weekly', size:'small', grad:'linear-gradient(160deg, var(--peach), var(--strawberry))'},
    {tag:'Pairing', title:'Dholl puri &amp; Ginger: the roadside pairing', meta:'Food × Coolberg', size:'small', grad:'linear-gradient(160deg, var(--gold), var(--ginger))'},
    {tag:'Product', title:'Meet the flavour: Cranberry', meta:'Flavour story', size:'', grad:'linear-gradient(160deg, var(--cranberry), #6f0f2c)'},
    {tag:'Happening', title:'Coolberg at Porlwi by Light', meta:'Port Louis · Champ de Mars', size:'', grad:'linear-gradient(160deg, var(--mint), #0f6b4c)'},
    {tag:'Happening', title:'Chinese Spring Festival pop-up, Chinatown', meta:'Port Louis · Seasonal', size:'', grad:'linear-gradient(160deg, var(--malt), #4a3009)'}
  ];
  var momentsGrid = document.getElementById('momentsGrid');
  MOMENTS.forEach(function(m, i){
    var card = document.createElement('article');
    card.className = 'moment-card'+(m.size?' '+m.size:'');
    card.style.background = m.grad;
    card.style.transform = 'rotate('+((i%2===0?-1:1)*(0.6+ (i%3)*0.3))+'deg)';
    card.innerHTML = '<span class="mc-tag">'+m.tag+'</span><div><h4>'+m.title+'</h4><div class="mc-meta">'+m.meta+'</div></div>';
    momentsGrid.appendChild(card);
  });

  // ---- FAQ ----
  var FAQS = [
    {q:'What is Coolberg?', a:'Coolberg is a 0.0% ABV malt-based beverage, a non-alcoholic take on the taste and ritual of beer, made in seven distinct flavours.'},
    {q:'Is Coolberg really 0.0% alcohol?', a:'Yes. Coolberg is brewed and formulated at 0.0% ABV, not "low alcohol," zero. It can be enjoyed by anyone, anywhere, anytime.'},
    {q:'What flavours are available?', a:'Seven: Malt, Ginger, Mint, Peach, Cranberry, Strawberry and Apple, each with its own character, from classic malt to bold ginger.'},
    {q:'Where can I buy Coolberg in Mauritius?', a:'Coolberg is available at a growing list of supermarkets, restaurants, cafés and bars across the island, and the list keeps growing. Get in touch via the Contact section and we\'ll point you to your nearest stockist.'},
    {q:'How should Coolberg be served?', a:'Cold, ideally straight from the fridge or over ice, the same way you\'d enjoy any refreshing beer-style drink.'},
    {q:'What foods pair well with Coolberg?', a:'It depends on the flavour: Malt suits burgers and grilled food, Ginger loves spice and street food, Mint pairs beautifully with Asian dishes. See the Food × Coolberg section for more.'},
    {q:'What is Coolberg made from?', a:'Coolberg is a malt-based beverage brewed with natural flavour extracts, crafted to deliver full flavour without any alcohol.'}
  ];
  var faqList = document.getElementById('faqList');
  FAQS.forEach(function(f, i){
    var item = document.createElement('div');
    item.className = 'faq-item';
    item.setAttribute('aria-expanded', 'false');
    item.innerHTML = '<button class="faq-q"><span>'+f.q+'</span><span class="plus" aria-hidden="true"></span></button>'+
      '<div class="faq-a"><p>'+f.a+'</p></div>';
    var qbtn = item.querySelector('.faq-q');
    var abody = item.querySelector('.faq-a');
    qbtn.addEventListener('click', function(){
      var open = item.getAttribute('aria-expanded')==='true';
      item.setAttribute('aria-expanded', open ? 'false':'true');
      abody.style.maxHeight = open ? '0px' : (abody.scrollHeight+'px');
    });
    faqList.appendChild(item);
  });

  // ---- CONTACT TABS ----
  document.querySelectorAll('.ctab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.ctab').forEach(function(t){ t.setAttribute('aria-selected', t===tab?'true':'false'); });
      var key = tab.getAttribute('data-tab');
      document.getElementById('panel-consumer').classList.toggle('active', key==='consumer');
      document.getElementById('panel-business').classList.toggle('active', key==='business');
    });
  });
  // ---- MOBILE MENU ----
  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', function(){
    var open = burger.getAttribute('aria-expanded')==='true';
    burger.setAttribute('aria-expanded', open?'false':'true');
    menu.classList.toggle('open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ burger.setAttribute('aria-expanded','false'); menu.classList.remove('open'); document.body.style.overflow=''; });
  });

  // ---- SCROLL REVEAL ----
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }
})();
