<template>
  <div class="flex min-h-screen flex-col">
    <a
      class="sr-only rounded-2xl outline-offset-2 outline-primary focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground/90 focus:px-4 focus:py-2 focus:text-background focus:shadow-xl focus:outline-2"
      href="#main"
      >Skip to content</a
    >
    <FadeContent blur :duration="540">
      <main id="main" class="mx-auto max-w-xl flex-grow px-4 pt-6 sm:px-6 lg:px-8" role="main">
        <slot />
      </main>
    </FadeContent>
    <MetaFooter />
  </div>
</template>
