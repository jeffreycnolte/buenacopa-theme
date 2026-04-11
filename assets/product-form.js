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
    var subCard = document.getElementById('subscription-card');
    if (subCard) {
      this.selectedVariantId = parseInt(subCard.dataset.variantId);
      this.selectedSellingPlan = parseInt(subCard.dataset.sellingPlanId);
      this.selectedPrice = parseInt(subCard.dataset.price);
      this.isSubscription = true;
      // Ensure visual selection on load
      subCard.classList.add('border-accent', 'selected');
      subCard.classList.remove('border-background/15', 'bg-background/5');
    } else {
      var firstBtn = document.querySelector('.variant-btn');
      if (firstBtn) {
        this.selectedVariantId = parseInt(firstBtn.dataset.variantId);
        this.selectedPrice = parseInt(firstBtn.dataset.variantPrice);
        this.isSubscription = false;
        firstBtn.classList.add('selected', 'border-accent', 'bg-accent/10');
      }
    }
    this.updateUI();
  },

  selectSubscription: function (variantId, sellingPlanId) {
    this.selectedVariantId = variantId;
    this.selectedSellingPlan = sellingPlanId;
    this.isSubscription = true;

    var subCard = document.getElementById('subscription-card');
    if (subCard) {
      this.selectedPrice = parseInt(subCard.dataset.price);
    }

    // Visual: highlight subscription card
    if (subCard) {
      subCard.classList.add('border-accent', 'bg-accent/5', 'selected');
      subCard.classList.remove('border-background/15', 'bg-background/5');
    }

    // Deselect one-time variants
    document.querySelectorAll('#variant-selector .variant-btn').forEach(function (btn) {
      btn.classList.remove('selected', 'border-accent', 'bg-accent/10');
      btn.classList.add('border-background/15', 'bg-background/5');
    });

    this.updateUI();
  },

  selectOneTime: function (variantId, button) {
    this.selectedVariantId = variantId;
    this.selectedSellingPlan = null;
    this.isSubscription = false;
    this.selectedPrice = parseInt(button.dataset.variantPrice);

    // Deselect subscription card
    var subCard = document.getElementById('subscription-card');
    if (subCard) {
      subCard.classList.remove('border-accent', 'bg-accent/5', 'selected');
      subCard.classList.add('border-background/15', 'bg-background/5');
    }

    // Deselect all one-time, select clicked
    document.querySelectorAll('#variant-selector .variant-btn').forEach(function (btn) {
      btn.classList.remove('selected', 'border-accent', 'bg-accent/10');
      btn.classList.add('border-background/15', 'bg-background/5');
    });
    button.classList.add('selected', 'border-accent', 'bg-accent/10');
    button.classList.remove('border-background/15', 'bg-background/5');

    this.updateUI();
  },

  // Called from hero CTAs
  preselectSubscription: function () {
    var subCard = document.getElementById('subscription-card');
    if (subCard) {
      this.selectSubscription(
        parseInt(subCard.dataset.variantId),
        parseInt(subCard.dataset.sellingPlanId)
      );
    }
  },

  preselectOneTime: function () {
    var firstBtn = document.querySelector('#variant-selector .variant-btn');
    if (firstBtn) {
      this.selectOneTime(parseInt(firstBtn.dataset.variantId), firstBtn);
    }
  },

  updateUI: function () {
    // Show/hide one-time CTA row (quantity + button)
    var ctaRow = document.getElementById('onetime-cta-row');
    if (ctaRow) {
      ctaRow.style.display = this.isSubscription ? 'none' : 'block';
    }

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
