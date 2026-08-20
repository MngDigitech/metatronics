document.addEventListener("DOMContentLoaded", function () {
  console.log("Methertech System Initialized.");

  var cart = JSON.parse(localStorage.getItem("methertechCart")) || [];
  var productData = [];

  var cartSidebar = document.getElementById("cart-sidebar");
  var cartToggleBtn = document.getElementById("cart-toggle-btn");
  var closeCartBtn = document.getElementById("close-cart-btn");
  var cartContainer = document.getElementById("cart-items");
  var cartTotalElement = document.getElementById("cart-total");
  var cartCountElement = document.getElementById("cart-count");

  var checkoutBtn = document.getElementById("checkout-btn");
  var checkoutModal = document.getElementById("checkout-modal");
  var closeModalBtn = document.getElementById("close-modal");

  // Toggle Sidebar
  if (cartToggleBtn && cartSidebar) {
    cartToggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      cartSidebar.classList.add("open");
    });
  }

  if (closeCartBtn && cartSidebar) {
    closeCartBtn.addEventListener("click", function () {
      cartSidebar.classList.remove("open");
    });
  }

  fetch("./data.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      productData = data;
      renderGrid(data);
      cartRender();
    });

  // --- Search Functionality ---
  var searchInputs = document.querySelectorAll(".search-input");

  searchInputs.forEach(function (searchInput) {
    searchInput.addEventListener("input", function (e) {
      // Get the user's search query and convert to lowercase
      var searchTerm = e.target.value.toLowerCase();

      // Filter the global productData array based on the search term
      var filteredData = productData.filter(function (item) {
        // Check if the product name or category includes the search letters
        return (
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        );
      });

      // Pass the filtered list back into our existing render function!
      renderGrid(filteredData);
    });
  });

  function renderGrid(data) {
    var teaserContainer = document.getElementById("teaser-grid");
    var appleContainer = document.getElementById("apple-grid");
    var samsungContainer = document.getElementById("samsung-grid");

    // Reusable function to generate card HTML
    function buildCard(item) {
      var starsHtml = "★★★★½";
      var reviewCount = Math.floor(Math.random() * 2000) + 100;
      return `
        <div class="item_card">
          <img src="${item.image.desktop}" alt="${item.name}" />
          <h1 class="card-title">${item.name}</h1>
          <p class="card-sub">${item.category}</p>
          <div class="card-rating">
            ${starsHtml} <span class="rating-count">(${reviewCount})</span>
          </div>
          <div class="card-footer">
            <span class="card-price">${item.price}</span>
            <button data-product-name="${item.name}" class="add-btn">Add to cart</button>
          </div>
        </div>
      `;
    }

    if (teaserContainer) {
      // Home Page: Render 4 random/first items
      teaserContainer.innerHTML = "";
      var teaserData = data.slice(0, 4);
      teaserData.forEach(function (item) {
        teaserContainer.innerHTML += buildCard(item);
      });
    }

    if (appleContainer && samsungContainer) {
      // Products Page: Split by category
      appleContainer.innerHTML = "";
      samsungContainer.innerHTML = "";

      var appleData = data.filter(function (item) {
        return item.category === "Apple";
      });
      var samsungData = data.filter(function (item) {
        return item.category === "Samsung";
      });

      appleData.forEach(function (item) {
        appleContainer.innerHTML += buildCard(item);
      });
      samsungData.forEach(function (item) {
        samsungContainer.innerHTML += buildCard(item);
      });
    }

    attachAddListeners();
  }

  function attachAddListeners() {
    var cartButtons = document.querySelectorAll(".add-btn");
    cartButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var clickedName = button.dataset.productName;
        var existingItem = cart.find(function (item) {
          return item.name === clickedName;
        });

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          var matchedItem = productData.find(function (product) {
            return product.name === clickedName;
          });
          var itemToAdd = Object.assign({}, matchedItem);
          itemToAdd.quantity = 1;
          cart.push(itemToAdd);
        }

        saveAndRenderCart();
        cartSidebar.classList.add("open");
      });
    });
  }

  function saveAndRenderCart() {
    localStorage.setItem("methertechCart", JSON.stringify(cart));
    cartRender();
  }

  function cartRender() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    var totalAmount = 0;
    var totalItems = 0;

    cart.forEach(function (cartItem) {
      var priceNum = parseInt(cartItem.price.replace(/[^0-9]/g, ""), 10);
      totalAmount += priceNum * cartItem.quantity;
      totalItems += cartItem.quantity;

      cartContainer.innerHTML += `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <h4>${cartItem.name}</h4>
            <p>${cartItem.price} x ${cartItem.quantity}</p>
          </div>
          <button class="remove-btn" data-item-name="${cartItem.name}">Remove</button>
        </div>
      `;
    });

    if (cartTotalElement) {
      // Adding formatting so it looks like R 25,000
      cartTotalElement.innerText = "R " + totalAmount.toLocaleString();
    }

    if (cartCountElement) {
      cartCountElement.innerText = totalItems;
      // Show/hide badge based on count
      cartCountElement.style.display = totalItems > 0 ? "block" : "none";
    }

    attachRemoveListeners();
  }

  function attachRemoveListeners() {
    var removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var clickedName = btn.dataset.itemName;
        var itemIndex = cart.findIndex(function (item) {
          return item.name === clickedName;
        });

        if (itemIndex > -1) {
          cart.splice(itemIndex, 1);
        }
        saveAndRenderCart();
      });
    });
  }

  // Checkout Modal
  if (checkoutBtn && checkoutModal && closeModalBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cart.length > 0) {
        checkoutModal.style.display = "flex";
        cartSidebar.classList.remove("open"); // Close sidebar when modal opens
      } else {
        alert("Your cart is currently empty.");
      }
    });

    closeModalBtn.addEventListener("click", function () {
      checkoutModal.style.display = "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var track = document.getElementById("brandTrack");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  // Calculate scroll amount based on card width + gap
  var scrollAmount = 340;

  function scrollNext() {
    track.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }

  function scrollPrev() {
    track.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  }

  // Attach event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", scrollNext);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", scrollPrev);
  }
});
