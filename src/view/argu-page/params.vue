<template>
  <div>
    <Card>
      <h2>ID: {{ $route.params.id }}</h2>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'argu_page',
  mounted () {
    
    console.log('params: ', this.$route.params)
  }
}
</script>

<style>

</style>
