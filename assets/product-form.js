/**
 * Buenacopa Theme - Product Form
 * Handles: variant selection, subscription/one-time toggle, quantity, add-to-cart, image gallery, dropdowns
 */

var ProductForm = {
  selectedVariantId: null,
  selectedSellingPlan: null,
  selectedPrice: 0,
  isSubscription: true,
  quantity: 1,
  isSubmitting: false,

  init: function () {
    // Default selection = the tile marked [data-default] (subscription if
    // present, else one-time). All buy-box tiles share class .bc-buybox-tile.
    var def = document.querySelector('.bc-buybox-tile[data-default="true"]')
           || document.querySelector('.bc-buybox-tile');
    if (def) this.selectOption(def);
    this.updateUI();
  },

  // Cheers-style radio selection: clicking a tile picks it. The tile element
  // carries data-variant-id, data-price, and (optionally) data-selling-plan-id.
  selectOption: function (tile) {
    if (!tile) return;
    document.querySelectorAll('.bc-buybox-tile').forEach(function (t) {
      t.classList.remove('selected', 'border-accent');
      t.classList.add('border-background/15');
    });
    tile.classList.add('selected', 'border-accent');
    tile.classList.remove('border-background/15');

    this.selectedVariantId = parseInt(tile.dataset.variantId);
    this.selectedPrice = parseInt(tile.dataset.price);
    var planId = tile.dataset.sellingPlanId;
    if (planId) {
      this.selectedSellingPlan = parseInt(planId);
      this.isSubscription = true;
    } else {
      this.selectedSellingPlan = null;
      this.isSubscription = false;
    }

    this.updateUI();
  },

  updateUI: function () {
    this.updateMobileCTA();
  },

  selectImage: function (src, button) {
    var mainImg = document.getElementById('main-product-image');
    if (mainImg) {
      mainImg.removeAttribute('srcset');
      mainImg.src = src;
    }

    document.querySelectorAll('.product-thumbnail').forEach(function (thumb) {
      thumb.classList.remove('border-accent');
      thumb.classList.add('border-background/10');
    });
    button.classList.add('border-accent');
    button.classList.remove('border-background/10');
  },

  incrementQty: function () {
    this.quantity++;
    this.updateQuantityDisplay();
  },

  decrementQty: function () {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateQuantityDisplay();
    }
  },

  updateQuantityDisplay: function () {
    var qtyEl = document.getElementById('product-quantity');
    if (qtyEl) qtyEl.textContent = this.quantity;
    this.updateMobileCTA();
  },

  updateMobileCTA: function () {
    var ctaText = document.getElementById('mobile-cta-text');
    if (!ctaText || !this.selectedPrice) return;

    var total = (this.selectedPrice / 100) * this.quantity;
    var hasDecimals = total % 1 !== 0;
    var lang = document.documentElement.lang || 'es';
    var formatted = '$' + total.toLocaleString(lang, { minimumFractionDigits: hasDecimals ? 2 : 0, maximumFractionDigits: 2 });

    if (this.isSubscription) {
      ctaText.textContent = 'Suscribirme \u2013 ' + formatted + '/mes';
    } else {
      var label = (window.theme && window.theme.strings && window.theme.strings.addToCart) || 'Agregar al carrito';
      ctaText.textContent = label + ' \u2013 ' + formatted;
    }
  },

  setButtonLoading: function (loading) {
    var buttons = [
      document.getElementById('add-to-cart-btn'),
      document.querySelector('#mobile-sticky-cta button')
    ];
    buttons.forEach(function (btn) {
      if (!btn) return;
      if (loading) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
      } else {
        btn.disabled = false;
        btn.style.opacity = '';
      }
    });
  },

  addToCart: function () {
    if (!this.selectedVariantId || this.isSubmitting) return;
    this.isSubmitting = true;
    this.setButtonLoading(true);

    var payload = {
      id: this.selectedVariantId,
      quantity: this.quantity
    };

    if (this.isSubscription && this.selectedSellingPlan) {
      payload.selling_plan = this.selectedSellingPlan;
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (r) {
      if (!r.ok) {
        return r.json().then(function (data) {
          throw new Error(data.description || 'Error');
        });
      }
      return r.json();
    })
    .then(function () {
      CartDrawer.open();
    })
    .catch(function (err) {
      CartDrawer.showError(err.message || 'Error al agregar al carrito');
    })
    .finally(function () {
      ProductForm.isSubmitting = false;
      ProductForm.setButtonLoading(false);
    });
  },

  toggleDropdown: function (button) {
    var section = button.closest('.dropdown-section');
    var content = section.querySelector('.dropdown-content');
    var chevron = section.querySelector('.dropdown-chevron');
    var isOpen = content.classList.contains('open');

    if (isOpen) {
      content.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = '';
    } else {
      content.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  ProductForm.init();
});
