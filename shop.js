(function(){
  // Fallback for any browser without WebP support: swap to the PNG copy.
  document.addEventListener('error', function(e){
    var t = e.target;
    if(t && t.tagName === 'IMG' && /\.webp($|\?)/.test(t.src)){
      t.src = t.src.replace(/\.webp($|\?)/, '.png$1');
    }
  }, true);

  var CURRENCY = 'Rs';

  var PRODUCTS = [
    {id:'malt', name:'Malt', color:'var(--malt)', hex:'#C9922F', price:1820,
      img:'assets/flavours/buy_flavours/malt.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. Classic taste, zero alcohol. The familiar taste of beer, just without the alcohol. Smoother and lighter in character, with a hint of malty and hoppy flavour.",
      taste:'Light malt notes, gentle bitterness, crisp finish',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'ginger', name:'Ginger', color:'var(--ginger)', hex:'#FF6B2C', price:1820,
      img:'assets/flavours/buy_flavours/ginger.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. A lively kick and a warm ginger twist. Brewed with barley malt and ginger, it is a bold and refreshing drink that leaves a lasting impression.",
      taste:'Warm ginger, light malt, bold finish',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'mint', name:'Mint', color:'var(--mint)', hex:'#2FBF8F', price:1820,
      img:'assets/flavours/buy_flavours/mint.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. Cool. Crisp. Refreshing. Experience a burst of freshness with Coolberg Mint. Brewed with natural mint leaves and barley malt, it is a crisp and cooling drink made for warm days.",
      taste:'Cooling mint layered over smooth barley malt',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'peach', name:'Peach', color:'var(--peach)', hex:'#FF9A6B', price:1820,
      img:'assets/flavours/buy_flavours/peach.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. Light and crisp with a smooth blend that makes it easy to drink. The mix stays balanced and refreshing without being heavy.",
      taste:'Soft sweetness with smooth barley malt',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'cranberry', name:'Cranberry', color:'var(--cranberry)', hex:'#D6295E', price:1820,
      img:'assets/flavours/buy_flavours/cranberry.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. A mix of sweet and tart that stands out. The lively taste blends smoothly with barley malt for a bright and refreshing drink.",
      taste:'Light sweetness with a gentle tart finish',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'strawberry', name:'Strawberry', color:'var(--strawberry)', hex:'#FF4368', price:1820,
      img:'assets/flavours/buy_flavours/strawberry.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. Soft and fruity. Soft in character with a gentle sweetness layered over light barley malt. Smooth and simple to enjoy.",
      taste:'Soft sweetness with a smooth finish',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'apple', name:'Apple', color:'var(--apple)', hex:'#7CC142', price:1820,
      img:'assets/flavours/buy_flavours/apple.webp',
      pack:'Box of 24 · 330ml',
      desc:"0.0% ABV. Fresh and mellow with a smooth sweetness coming through gentle barley malt. Clean, balanced, and pleasant from start to finish.",
      taste:'Light sweetness over soft barley malt',
      use:'With friends, with family, or whenever you want something easy and refreshing'},
    {id:'assorted', name:'Assorted Box', color:'var(--gold-deep)', hex:'#E8A400', price:1820,
      img:'assets/packshot2.webp',
      pack:'Box of 24 · 330ml (6 flavours of your choice)',
      desc:"0.0% ABV. Six flavours, your choice. The Coolberg Assorted Box lets you create your own mix from the Coolberg range. Choose six flavours and enjoy a variety of refreshing options in one box. It's a great way to explore the different tastes or share something different with everyone.",
      taste:'A mix of the whole Coolberg range, picked by you',
      use:'With friends, with family, or whenever you want something easy and refreshing',
      variant:true, variantMax:6,
      variantOptions:['malt','ginger','mint','peach','cranberry','strawberry','apple']}
  ];

  var SPECS = {
    'Bottle Size':'330ml', 'Pack Size':'24 bottles', 'Pack Type':'Glass bottle',
    'Alcohol Content':'0.0% ABV', 'Beverage Base':'Barley malt', 'Country of Origin':'India'
  };

  function findProduct(id){
    for(var i=0;i<PRODUCTS.length;i++){ if(PRODUCTS[i].id===id) return PRODUCTS[i]; }
    return null;
  }

  function fmtPrice(n){
    return CURRENCY + ' ' + n.toLocaleString('en-US');
  }

  // ---------------- CART (localStorage) ----------------
  var CART_KEY = 'coolberg_cart_v1';

  function readCart(){
    try{
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function writeCart(cart){
    try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
    renderCartBadge();
  }
  function lineKey(id, flavours){
    return flavours && flavours.length ? id + '|' + flavours.slice().sort().join(',') : id;
  }
  function addToCart(id, qty, flavours){
    qty = qty || 1;
    var cart = readCart();
    var key = lineKey(id, flavours);
    var existing = null;
    for(var i=0;i<cart.length;i++){ if(lineKey(cart[i].id, cart[i].flavours) === key){ existing = cart[i]; break; } }
    if(existing){ existing.qty += qty; }
    else { cart.push({id:id, qty:qty, flavours: flavours || null}); }
    writeCart(cart);
  }
  function removeFromCart(key){
    var cart = readCart().filter(function(item){ return lineKey(item.id, item.flavours) !== key; });
    writeCart(cart);
  }
  function updateQty(key, qty){
    var cart = readCart();
    for(var i=0;i<cart.length;i++){
      if(lineKey(cart[i].id, cart[i].flavours) === key){
        cart[i].qty = Math.max(1, qty);
      }
    }
    writeCart(cart);
  }
  function cartCount(){
    return readCart().reduce(function(sum,item){ return sum + item.qty; }, 0);
  }
  function cartTotal(){
    return readCart().reduce(function(sum,item){
      var p = findProduct(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function renderCartBadge(){
    var badges = document.querySelectorAll('.cart-badge');
    var n = cartCount();
    badges.forEach(function(b){
      b.textContent = n;
      b.style.display = n > 0 ? 'flex' : 'none';
    });
  }

  // ---------------- CART DRAWER ----------------
  function buildDrawer(){
    if(document.getElementById('cartDrawer')) return;
    var overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cartOverlay';
    var drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.id = 'cartDrawer';
    drawer.innerHTML =
      '<div class="cd-head"><h3>Your Cart</h3><button class="cd-close" id="cdClose" aria-label="Close cart">&times;</button></div>' +
      '<div class="cd-items" id="cdItems"></div>' +
      '<div class="cd-foot">' +
        '<div class="cd-subtotal"><span>Subtotal</span><b id="cdSubtotal">Rs 0</b></div>' +
        '<a href="cart.html" class="btn btn-primary" style="width:100%;justify-content:center;">View Cart &amp; Checkout</a>' +
      '</div>';
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    overlay.addEventListener('click', closeDrawer);
    document.getElementById('cdClose').addEventListener('click', closeDrawer);
  }
  function openDrawer(){
    buildDrawer();
    renderDrawerItems();
    document.getElementById('cartOverlay').classList.add('open');
    document.getElementById('cartDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){
    var o = document.getElementById('cartOverlay'), d = document.getElementById('cartDrawer');
    if(o) o.classList.remove('open');
    if(d) d.classList.remove('open');
    document.body.style.overflow = '';
  }
  function renderDrawerItems(){
    var wrap = document.getElementById('cdItems');
    if(!wrap) return;
    var cart = readCart();
    if(!cart.length){
      wrap.innerHTML = '<p class="cd-empty">Your cart is empty. Explore the range and add a few flavours.</p>';
    } else {
      wrap.innerHTML = cart.map(function(item){
        var p = findProduct(item.id);
        if(!p) return '';
        var key = lineKey(item.id, item.flavours);
        var flavourLine = item.flavours ? '<span class="cd-flavours">' + item.flavours.map(cap).join(', ') + '</span>' : '';
        return '<div class="cd-item">' +
          '<img src="' + p.img + '" alt="' + p.name + '" width="60" height="60" loading="lazy">' +
          '<div class="cd-item-info">' +
            '<b>' + p.name + '</b>' + flavourLine +
            '<div class="cd-item-row">' +
              '<span class="qty-stepper" data-key="' + key + '">' +
                '<button class="qs-btn qs-minus" aria-label="Decrease quantity">−</button>' +
                '<span class="qs-val">' + item.qty + '</span>' +
                '<button class="qs-btn qs-plus" aria-label="Increase quantity">+</button>' +
              '</span>' +
              '<b class="cd-item-price">' + fmtPrice(p.price * item.qty) + '</b>' +
            '</div>' +
          '</div>' +
          '<button class="cd-remove" data-key="' + key + '" aria-label="Remove item">&times;</button>' +
        '</div>';
      }).join('');
    }
    var subtotalEl = document.getElementById('cdSubtotal');
    if(subtotalEl) subtotalEl.textContent = fmtPrice(cartTotal());

    wrap.querySelectorAll('.qs-minus').forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.closest('.qty-stepper').dataset.key;
        var cart = readCart();
        var item = cart.filter(function(i){ return lineKey(i.id,i.flavours) === key; })[0];
        if(item){ if(item.qty<=1){ removeFromCart(key); } else { updateQty(key, item.qty-1); } renderDrawerItems(); }
      });
    });
    wrap.querySelectorAll('.qs-plus').forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.closest('.qty-stepper').dataset.key;
        var cart = readCart();
        var item = cart.filter(function(i){ return lineKey(i.id,i.flavours) === key; })[0];
        if(item){ updateQty(key, item.qty+1); renderDrawerItems(); }
      });
    });
    wrap.querySelectorAll('.cd-remove').forEach(function(btn){
      btn.addEventListener('click', function(){
        removeFromCart(btn.dataset.key);
        renderDrawerItems();
      });
    });
  }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function initCartUI(){
    renderCartBadge();
    document.querySelectorAll('.cart-toggle').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        openDrawer();
      });
    });
  }

  // ---------------- SHARED NAV / REVEAL (mirrors script.js on the home page) ----------------
  function initNav(){
    var burger = document.getElementById('burgerBtn');
    var menu = document.getElementById('mobileMenu');
    if(burger && menu){
      burger.addEventListener('click', function(){
        var open = burger.getAttribute('aria-expanded')==='true';
        burger.setAttribute('aria-expanded', open?'false':'true');
        menu.classList.toggle('open', !open);
        document.body.style.overflow = open ? '' : 'hidden';
      });
      menu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){ burger.setAttribute('aria-expanded','false'); menu.classList.remove('open'); document.body.style.overflow=''; });
      });
    }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
      }, {threshold:0.12});
      document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    }
  }

  window.CoolbergShop = {
    PRODUCTS: PRODUCTS, SPECS: SPECS, findProduct: findProduct, fmtPrice: fmtPrice,
    readCart: readCart, addToCart: addToCart, removeFromCart: removeFromCart,
    updateQty: updateQty, cartCount: cartCount, cartTotal: cartTotal, lineKey: lineKey,
    openDrawer: openDrawer, closeDrawer: closeDrawer, renderDrawerItems: renderDrawerItems,
    cap: cap
  };

  document.addEventListener('DOMContentLoaded', function(){ initCartUI(); initNav(); });
})();
