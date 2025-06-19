<!-- https://reactbits.dev/animations/fade-content -->

<template>
  <div
    ref="root"
    :class="className"
    :style="{
      opacity: inView ? 1 : initialOpacity,
      transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`,
      filter: blur ? (inView ? 'blur(0px)' : 'blur(10px)') : 'none',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  blur?: boolean
  duration?: number
  easing?: string
  delay?: number
  threshold?: number
  initialOpacity?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  blur: false,
  duration: 1000,
  easing: 'ease-out',
  delay: 0,
  threshold: 0.1,
  initialOpacity: 0,
  className: '',
})

const inView = ref(false)
const root = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!root.value) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer?.unobserve(root.value as HTMLElement)
        setTimeout(() => {
          inView.value = true
        }, props.delay)
      }
    },
    { threshold: props.threshold },
  )

  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
