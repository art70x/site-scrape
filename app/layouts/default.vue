<template>
  <a
    class="sr-only rounded-2xl outline-offset-2 outline-primary focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground/70 focus:px-4 focus:py-2 focus:text-background focus:shadow-xl focus:outline-2"
    href="#main"
    >Skip to content</a
  >
  <div class="flex min-h-screen flex-col">
    <main class="mx-auto max-w-2xl flex-grow px-4 pt-6 sm:px-6 lg:px-8" id="main" role="main">
      <slot />
    </main>
  </div>
</template>
