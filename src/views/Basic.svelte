<script>
  import { onMount } from 'svelte'
  import Basic from '@/components/Basic.js'
  import Sun from '@/components/Sun.js'
  import Iceberg from '@/components/Iceberg.js'

  let basic
  let sun
  let threeElement
  let divElement

  onMount(() => {
    // basic = new Basic(divElement, 300, 150)
    sun = new Iceberg(divElement, 600,600)
  })
</script>

<main>
  <!-- <canvas id="c"></canvas> -->
  <div bind:this={divElement}></div>

</main>

<style>

</style>