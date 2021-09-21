<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top">
    <div class="container">
      <a class="navbar-brand" href="https://xinfin.network/#stats">
        <img src="@/assets/images/xdc-logo.png" class="logo" alt="XDC" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active menu-font" aria-current="page" href="/"
              >Home</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link menu-font" href="/contracts">Contracts</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script>
/**
 * Common header component for all screens
 */
export default {
  name: "Header",
};
</script>
