/**
 * Buenacopa Theme - Cart Drawer
 * Handles: open/close drawer, AJAX cart operations, DOM updates
 */

var CartDrawer = {
  t: function (key) {
    return (window.theme && window.theme.strings && window.theme.strings[key]) || key;
  },

  open: function () {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    this.refresh();
  },

  close: function () {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
    document.body.style.overflow = '';
  },

  refresh: function () {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) { CartDrawer.render(cart); })
      .catch(function () {
        CartDrawer.showError(CartDrawer.t('cartLoad'));
      });
  },

  render: function (cart) {
    var itemsContainer = document.getElementById('cart-items');
    var emptyState = document.getElementById('cart-empty');
    var footer = document.getElementById('cart-footer');
    var totalEl = document.getElementById('cart-total');

    if (cart.item_count === 0) {
      itemsContainer.innerHTML = '';
      itemsContainer.style.display = 'none';
      emptyState.style.display = 'flex';
      footer.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      itemsContainer.style.display = 'block';
      footer.style.display = 'block';

      var t = CartDrawer.t;
      var html = '';
      cart.items.forEach(function (item) {
        var escapedTitle = item.product_title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        var escapedKey = item.key.replace(/'/g, "\\'");
        var variantTitle = item.variant_title ? item.variant_title.replace(/</g, '&lt;') : '';
        var sellingPlan = (item.selling_plan_allocation && item.selling_plan_allocation.selling_plan) ? item.selling_plan_allocation.selling_plan.name.replace(/</g, '&lt;') : '';

        html += '<div class="flex gap-3 py-3 px-2 border-b border-border" data-key="' + item.key + '">';
        if (item.image) {
          var imgSrc = item.image.replace(/(\.\w+)(\?|$)/, '_120x120$1$2');
          html += '<div style="width:48px;height:48px;min-width:48px;max-width:48px;border-radius:6px;overflow:hidden;flex-shrink:0;background:hsl(215 60% 22%)">';
          html += '<img src="' + imgSrc + '" alt="' + escapedTitle + '" style="width:48px;height:48px;object-fit:cover;display:block" width="48" height="48" loading="eager">';
          html += '</div>';
        }
        html += '<div class="flex-1 min-w-0">';
        // Lead with variant (e.g. "10 Sobres") since it's a single-product store
        var displayTitle = variantTitle || escapedTitle;
        html += '<h4 class="font-bold text-sm text-foreground" style="line-height:1.3">' + displayTitle + '</h4>';
        // Decision label: every line item gets a qualifier so a customer
        // who has both a sub and a one-time in the cart can immediately
        // see which is which. Sub uses the Recharge plan name (green);
        // one-time uses a muted "Compra única" label.
        if (sellingPlan) {
          html += '<p class="text-xs font-semibold" style="margin-top:1px;color:hsl(149 100% 34%)">' + sellingPlan + '</p>';
        } else {
          html += '<p class="text-xs font-semibold" style="margin-top:1px;color:rgba(255,255,255,0.55)">Compra única</p>';
        }
        html += '<p class="font-semibold text-sm text-foreground" style="margin-top:4px">' + Shopify.formatMoney(item.price) + '</p>';
        html += '</div>';
        html += '<div class="flex flex-col items-end gap-2 flex-shrink-0">';
        html += '<button onclick="CartDrawer.removeItem(\'' + escapedKey + '\')" class="text-muted-foreground hover:text-foreground p-1" aria-label="' + t('removeAria') + ' ' + escapedTitle + '">';
        html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';
        html += '</button>';
        html += '<div class="flex items-center gap-1">';
        html += '<button onclick="CartDrawer.updateQty(\'' + escapedKey + '\',' + (item.quantity - 1) + ')" class="w-6 h-6 border border-border rounded flex items-center justify-center text-foreground hover:bg-white/5" aria-label="' + t('decreaseQty') + '">';
        html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
        html += '</button>';
        html += '<span class="w-8 text-center text-sm text-foreground" aria-label="' + t('quantityAria') + '">' + item.quantity + '</span>';
        html += '<button onclick="CartDrawer.updateQty(\'' + escapedKey + '\',' + (item.quantity + 1) + ')" class="w-6 h-6 border border-border rounded flex items-center justify-center text-foreground hover:bg-white/5" aria-label="' + t('increaseQty') + '">';
        html += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
        html += '</button>';
        html += '</div></div></div>';
      });

      itemsContainer.innerHTML = html;
      totalEl.textContent = Shopify.formatMoney(cart.total_price);
    }

    updateCartCount();
  },

  addItem: function (variantId, quantity) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity || 1 })
    })
    .then(function (r) {
      if (!r.ok) {
        return r.json().then(function (data) {
          throw new Error(data.description || CartDrawer.t('cartAdd'));
        });
      }
      return r.json();
    })
    .then(function (item) {
      CartDrawer.open();
      return item;
    })
    .catch(function (err) {
      CartDrawer.showError(err.message || CartDrawer.t('cartAdd'));
    });
  },

  updateQty: function (key, quantity) {
    if (quantity < 1) {
      return this.removeItem(key);
    }
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
    .then(function (r) {
      if (!r.ok) throw new Error(CartDrawer.t('cartUpdate'));
      return r.json();
    })
    .then(function (cart) { CartDrawer.render(cart); })
    .catch(function () {
      CartDrawer.showError(CartDrawer.t('cartUpdate'));
      CartDrawer.refresh();
    });
  },

  removeItem: function (key) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: 0 })
    })
    .then(function (r) {
      if (!r.ok) throw new Error(CartDrawer.t('cartRemove'));
      return r.json();
    })
    .then(function (cart) { CartDrawer.render(cart); })
    .catch(function () {
      CartDrawer.showError(CartDrawer.t('cartRemove'));
      CartDrawer.refresh();
    });
  },

  checkout: function () {
    window.location.href = '/checkout';
  },

  showError: function (message) {
    var footer = document.getElementById('cart-footer');
    if (!footer) return;
    var existing = footer.querySelector('.cart-error');
    if (existing) existing.remove();
    var errorEl = document.createElement('p');
    errorEl.className = 'cart-error text-sm text-center py-2';
    errorEl.style.color = 'hsl(0 84% 60%)';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
    footer.prepend(errorEl);
    setTimeout(function () { errorEl.remove(); }, 4000);
  }
};

/**
 * Shopify money formatting helper
 */
if (typeof Shopify === 'undefined') { var Shopify = {}; }
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function (cents) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    var value = (parseInt(cents, 10) / 100);
    var hasDecimals = value % 1 !== 0;
    var lang = document.documentElement.lang || 'es';
    return '$' + value.toLocaleString(lang, { minimumFractionDigits: hasDecimals ? 2 : 0, maximumFractionDigits: 2 }) + ' MXN';
  };
}
